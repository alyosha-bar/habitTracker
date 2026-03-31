import { useEffect, useState } from "react";
import HabitChart from "./HabitChart";
import { API_BASE } from "../api/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type Habit = {
  id: number;
  name: string;
  completed: boolean;
};

type SnapshotHabit = {
  id: number;
  completed: boolean;
};

type Snapshot = {
  Date: string; // YYYY-MM-DD
  Habits: SnapshotHabit[];
};


// type GraphRange = "week" | "month";

const DailyHabits = () => {
    const [habits, setHabits] = useState<Habit[]>([]);
    // const [graphRange, setGraphRange] = useState<GraphRange>("week");
    const [pastHabits, setPastHabits] = useState<Snapshot[]>([]);

    const [newDailyHabit, setNewDailyHabit] = useState<string>("");


    // fetch daily habits
    useEffect(() => {
        // Simulate an API call to fetch daily habits
        const fetchDailyHabits = async () => {
            // Replace this with your actual API call
            const response = await fetch(`${API_BASE}/habits/daily`);
            const data = await response.json();
            setHabits(data.dailyHabits);
        };

        const fetchPastHabits = async () => {
            const response = await fetch(`${API_BASE}/habits/daily/snapshots`);
            const data = await response.json();

            // format date in snapshots to be more readable
            const formattedSnapshots = data.snapshots.map((snapshot: Snapshot) => ({
                ...snapshot,
                Date: new Date(snapshot.Date).toLocaleDateString()
            }));

            setPastHabits(formattedSnapshots);
        };

        fetchDailyHabits();
        fetchPastHabits();
    }, []);

    const toggleHabit = async (id: number) => {
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
        );

        // API call
        const response = await fetch(`${API_BASE}/habits/daily/${id}?completed=${!habits.find((h) => h.id === id)?.completed}`, {
            method: "PUT",
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
        });

        if (!response.ok) {
            console.error("Failed to delete habit");
            return;
        }

        // Remove the habit from the list
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    return (
        <div className="daily-habits-container">
        <div className="daily-habits-header">
            <h2>Daily Habits</h2>
            {/* <button onClick={() => console.log(habits)}>Log Habits </button>
            <button onClick={() => console.log(pastHabits)}>Log Past Habits </button> */}
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
                {habits && habits.map((habit) => (
                <div key={habit.id} className="todo-item">
                    <div className="daily-habit-layout">
                        <div>
                            <input
                                type="checkbox"
                                checked={habit.completed}
                                onChange={() => toggleHabit(habit.id)}
                            />
                            <span>{habit.name}</span>
                        </div>
                        <div className='icon' onClick={() => deleteHabit(habit.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Graph section */}
            {habits && pastHabits && (
                <HabitChart todaysHabits={habits} pastHabits={pastHabits} />
            )}



        </div>
    );
};

export default DailyHabits;