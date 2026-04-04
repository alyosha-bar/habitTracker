import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { DotProps } from "recharts";


interface Snapshot {
  Date: string;
  Count: number;
}

interface Habit {
  id: number;
  name: string;
  completed: boolean;
}

interface ChartDataPoint {
  date: string;
  completed: number;
  isToday: boolean;
}


interface HabitChartProps {
  todaysHabits: Habit[];
  pastHabits: Snapshot[];
  toggleGraphRange: (graphRange: "week" | "month") => void;
}

export default function HabitChart({ todaysHabits, pastHabits, toggleGraphRange }: HabitChartProps) {
  
  const [graphRange, setGraphRange] = React.useState<"week" | "month">("month");

  const maxHabits: number = todaysHabits.length;

  // improve in the future by getting the system timezone (both frontend and cron job)

  const todayStr: string = new Date().toLocaleDateString('en-US', {
    timeZone: 'UTC'
  });

  // const todayStr: string = new Date().toLocaleDateString();
  const todayCompleted: number = todaysHabits.filter((h) => h.completed).length;

  // Fetch from backend
  // New Cron for Daily habits
  // DB table for daily habit snapshots with columns: id, date, habit_id, completed

  // Need to update this so that the it updates live with the toggling of habits, currently it only reflects the initial state of habits and doesn't update when habits are toggled

  // Future: Toggle between week/month view, show past 7 days or past 30 days in the graph, and update the x-axis ticks accordingly

  // When fetching snapshots from the backend, paginate based on the seleceted view (week/month) 


  const data: ChartDataPoint[] = [
    ...pastHabits.map((s) => ({
      date: s.Date,
      completed: s.Count,
      isToday: false,
    })),
    {
      date: todayStr,
      completed: todayCompleted,
      isToday: true,
    },
  ];

  // Double Check - sort data by date ascending
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const CustomDot = (props: DotProps & { payload?: ChartDataPoint }) => {
    const { cx, cy, payload } = props;
    if (!payload?.isToday) return null;
    return <circle cx={cx} cy={cy} r={5} fill="#6366F1" stroke="#0f172a" strokeWidth={2} />;
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number; payload: ChartDataPoint }[];
    label?: string;
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload?.length) return null;
    const isToday = payload[0]?.payload?.isToday;
    return (
      <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border)", borderRadius: 6, padding: "8px 12px", fontSize: 13 }}>
        <p style={{ margin: "0 0 2px", color: "var(--color-text-secondary)" }}>{isToday ? `${label} (today)` : label}</p>
        <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text-primary)" }}>{payload[0].value} / {maxHabits} habits</p>
      </div>
    );
  };


  const handleGraphChange = () => {
    toggleGraphRange(graphRange);
    setGraphRange((prev) => (prev === "week" ? "month" : "week"));
  }

  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Habits completed per day</p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--color-text-secondary)" }}>
            <button 
              onClick={handleGraphChange} 
              style={{
                // Layout & Sizing
                padding: "2px 8px",
                fontSize: "11px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                
                // Visuals
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                color: "#a5b4fc",
                border: "1px solid rgba(99, 102, 241, 0.35)",
                borderRadius: "2px",
                
                // Interaction
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
                display: "flex",
                alignItems: "center"
              }}
              // Adding a hover effect via inline event listeners
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.25)";
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.15)";
                e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
              }}
            > 
              {graphRange} 
            </button>
            
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 4, borderRadius: 1, background: "#6366F1", display: "inline-block" }} />
              <span>completed</span>
            </div>
          </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.04} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            domain={[0, maxHabits]}
            ticks={Array.from({ length: maxHabits + 1 }, (_, i) => i)}
            tick={{ fontSize: 12, fill: "var(--color-text-secondary)" }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(148,163,184,0.25)", strokeWidth: 1 }} />
          <ReferenceLine
            x={todayStr.slice(5)}
            stroke="#06B6D4"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "today", position: "insideTopRight", fontSize: 11, fill: "#06B6D4", dy: -4 }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#6366F1"
            strokeWidth={2}
            fill="url(#habitGrad)"
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: "#6366F1", stroke: "#0f172a", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}