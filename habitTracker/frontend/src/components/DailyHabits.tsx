import { useEffect, useState } from "react";
import HabitChart from "./HabitChart";
import { API_BASE } from "../api/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getISOWeek, getMonth } from 'date-fns';

type Habit = {
  id: number;
  name: string;
  completed: boolean;
};

// type SnapshotHabit = {
//   id: number;
//   completed: boolean;
// };

type Snapshot = {
  Date: string; // YYYY-MM-DD
  Count: number; // Number of habits completed that day
};

const DailyHabits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [pastHabits, setPastHabits] = useState<Snapshot[]>([]);

    const [newDailyHabit, setNewDailyHabit] = useState<string>("");


    // fetch daily habits
    useEffect(() => {
        // Simulate an API call to fetch daily habits
        const fetchDailyHabits = async () => {
            // Replace this with your actual API call
            const response = await fetch(`${API_BASE}/habits/daily`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setHabits(data.dailyHabits);
        };

        fetchDailyHabits();
        fetchPastHabits("week");
    }, []);

    const fetchPastHabits = async (graphRange: "week" | "month") => {

        // Get Date Range for past habits based on graph range (week/month)
        // current date
        const currentDate = new Date();

        let week: number = 0, year: number = 0, month: number = 0;

        // Calculate start date based on graph range
        week = getISOWeek(currentDate);
        console.log(week)
        month = getMonth(currentDate) + 1; // getMonth is 0-indexed
        year = currentDate.getFullYear();
        
        const response = await fetch(`${API_BASE}/habits/daily/snapshots?graphRange=${graphRange}&week=${week}&month=${month}&year=${year}`, 
            { 
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzU3NjQ3NzMsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoiQWx5b3NoYSJ9.5LRoiFNDRudZLGGfN5OdJ2D9F_782rktzwONut1vX-8"
                },
            }
        );
        const data = await response.json();

        // format date in snapshots to be more readable
        const formattedSnapshots = data.snapshots.map((snapshot: Snapshot) => ({
            ...snapshot,
            Date: new Date(snapshot.Date).toLocaleDateString()
        }));

        setPastHabits(formattedSnapshots);
    };

    const toggleHabit = async (id: number) => {
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
        );

        // API call
        const response = await fetch(`${API_BASE}/habits/daily/${id}?completed=${!habits.find((h) => h.id === id)?.completed}`, {
            method: "PUT",
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzU3NjQ3NzMsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoiQWx5b3NoYSJ9.5LRoiFNDRudZLGGfN5OdJ2D9F_782rktzwONut1vX-8"
                },
        });

        if (!response.ok) {
            console.error("Failed to update habit");
            // Revert state change on failure
            setHabits((prev) =>
                prev.map((h) => (h.id === id ? { ...h, completed: habits.find((h) => h.id === id)?.completed || false } : h))
            );
        }

        // handle data
        const data = await response.json();
        // Do something with the updated habit data if needed
        
        console.log("Updated habit:", data);
        return

    };

    const addDailyHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newDailyHabit.trim() === "") return;

        console.log("Adding new habit:", newDailyHabit);

        // API call
        const response = await fetch(`${API_BASE}/habits/daily/add?name=${encodeURIComponent(newDailyHabit)}`, {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzU3NjQ3NzMsInVzZXJfaWQiOjEsInVzZXJuYW1lIjoiQWx5b3NoYSJ9.5LRoiFNDRudZLGGfN5OdJ2D9F_782rktzwONut1vX-8"
            },
        });

        if (!response.ok) {
            console.error("Failed to add new habit");
            return;
        }

        const data = await response.json();
        console.log("Added habit:", data.habit);

        // Append the new habit to the list
        setHabits((prev) => [...prev, data.habit]);

        setNewDailyHabit("");

    }

    const deleteHabit = async (id: number) => {
        // API call
        const response = await fetch(`${API_BASE}/habits/daily/${id}`, {
            method: "DELETE",
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
        });

        if (!response.ok) {
            console.error("Failed to delete habit");
            return;
        }

        // Remove the habit from the list
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const toggleGraphRange = (graphRange: "week" | "month") => {
        fetchPastHabits(graphRange);
    };

    return (
        <div className="daily-habits-container">
            <div className="daily-habits-header">
                <h2>Daily Habits</h2>
                <form onSubmit={addDailyHabit} className="todo-form"> 
                    <input 
                        type="text" 
                        placeholder="New Daily Habit"
                        value={newDailyHabit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDailyHabit(e.target.value)}
                    />
                    <button type="submit"> Add </button>
                </form>
            </div>

            {/* Simple list of habits with a completed toggle */}
            <div className="daily-habits">
            {habits && habits.length > 0 ? (
                habits.map((habit) => (
                <div key={habit.id} className="daily-habit-item">
                    <div className="daily-habit-layout">
                    <div>
                        <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => toggleHabit(habit.id)}
                        />
                        <span>{habit.name}</span>
                    </div>
                    <div className="icon" onClick={() => deleteHabit(habit.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                    </div>
                </div>
                ))
            ) : (
                <div className="empty-message">
                    <p>No habits added yet. Start by creating one!</p>
                </div>
            )}
            </div>

            {/* Graph section */}
            {habits && pastHabits && (
                <div>
                    <HabitChart todaysHabits={habits} pastHabits={pastHabits} toggleGraphRange={toggleGraphRange} />
                </div>
            )}
        </div>
    );
};

export default DailyHabits;