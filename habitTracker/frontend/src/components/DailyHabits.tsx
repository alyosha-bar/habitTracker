import { useEffect, useState } from "react";
import HabitChart from "./HabitChart";
import { API_BASE } from "../api/config";

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
            setPastHabits(data.snapshots);
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


    return (
        <div className="daily-habits-container">
        <div className="daily-habits-header">
            <h2>Daily Habits</h2>
            <button onClick={() => console.log(habits)}>Log Habits </button>
            <button onClick={() => console.log(pastHabits)}>Log Past Habits </button>
        </div>

        {/* Simple list of habits with a completed toggle */}
            <div>
                {habits && habits.map((habit) => (
                <div key={habit.id} className="todo-item">
                    <div>
                    <input
                        type="checkbox"
                        checked={habit.completed}
                        onChange={() => toggleHabit(habit.id)}
                    />
                    <span>{habit.name}</span>
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