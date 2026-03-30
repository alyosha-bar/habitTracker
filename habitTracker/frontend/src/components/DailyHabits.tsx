import { useMemo, useState } from "react";
import HabitChart from "./HabitChart";

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
  date: string; // YYYY-MM-DD
  habits: SnapshotHabit[];
};

// Mock: past daily snapshots for this month
const pastSnapshots: Snapshot[] = [
  {
    date: "2026-01-01",
    habits: [
      { id: 1, completed: true },
      { id: 2, completed: false },
    ],
  },
  {
    date: "2026-01-02",
    habits: [
      { id: 1, completed: true },
      { id: 2, completed: true },
    ],
  },
  {
    date: "2026-01-03",
    habits: [
      { id: 1, completed: false },
      { id: 2, completed: true },
    ],
  },
];

// Mock: today’s daily habits list
const initialHabits: Habit[] = [
  { id: 1, name: "Drink Water", completed: false },
  { id: 2, name: "Exercise", completed: false },
  { id: 3, name: "Read", completed: false },
  { id: 4, name: "LeetCode", completed: false },
];

type GraphRange = "week" | "month";

const DailyHabits = () => {
    const [habits, setHabits] = useState<Habit[]>(initialHabits);
    const [graphRange, setGraphRange] = useState<GraphRange>("week");

    const [pastHabits, setPastHabits] = useState<Snapshot[]>(pastSnapshots);

    const toggleHabit = (id: number) => {
        setHabits((prev) =>
            prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
        );
    };
    
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

    // Combine past snapshots + “today” synthesized from current state
    const allSnapshots: Snapshot[] = useMemo(() => {
    const todaySnapshot: Snapshot = {
        date: todayStr,
        habits: habits.map((h) => ({ id: h.id, completed: h.completed })),
    };

    // If there were a real backend we’d merge on keys; for now, just append
    return [...pastSnapshots, todaySnapshot];
    }, [habits, todayStr]);


    return (
        <div className="daily-habits-container">
        <div className="daily-habits-header">
            <h2>Daily Habits</h2>
        </div>

        {/* Simple list of habits with a completed toggle */}
            <div>
                {habits.map((habit) => (
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
            <HabitChart />



        </div>
    );
};

export default DailyHabits;