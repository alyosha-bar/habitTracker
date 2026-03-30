import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { DotProps } from "recharts";

interface HabitEntry {
  id: number;
  completed: boolean;
}

interface Snapshot {
  date: string;
  habits: HabitEntry[];
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

const pastSnapshots: Snapshot[] = [
  { date: "2026-01-01", habits: [{ id: 1, completed: true }, { id: 2, completed: false }] },
  { date: "2026-01-02", habits: [{ id: 1, completed: true }, { id: 2, completed: true }] },
  { date: "2026-01-03", habits: [{ id: 1, completed: false }, { id: 2, completed: true }] },
];

const initialHabits: Habit[] = [
  { id: 1, name: "Drink Water", completed: false },
  { id: 2, name: "Exercise", completed: false },
  { id: 3, name: "Read", completed: false },
  { id: 4, name: "LeetCode", completed: false },
];

const maxHabits: number = initialHabits.length;

const todayStr: string = new Date().toISOString().split("T")[0];
const todayCompleted: number = initialHabits.filter((h) => h.completed).length;

// Fetch from backend
// New Cron for Daily habits
// DB table for daily habit snapshots with columns: id, date, habit_id, completed

// Need to update this so that the it updates live with the toggling of habits, currently it only reflects the initial state of habits and doesn't update when habits are toggled

const data: ChartDataPoint[] = [
  ...pastSnapshots.map((s) => ({
    date: s.date.slice(5),
    completed: s.habits.filter((h) => h.completed).length,
    isToday: false,
  })),
  {
    date: todayStr.slice(5),
    completed: todayCompleted,
    isToday: true,
  },
];

const CustomDot = (props: DotProps & { payload?: ChartDataPoint }) => {
  const { cx, cy, payload } = props;
  if (!payload?.isToday) return null;
  return <circle cx={cx} cy={cy} r={5} fill="#7F77DD" stroke="#fff" strokeWidth={2} />;
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
    <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
      <p style={{ margin: "0 0 2px", color: "var(--color-text-secondary)" }}>{isToday ? `${label} (today)` : label}</p>
      <p style={{ margin: 0, fontWeight: 500, color: "var(--color-text-primary)" }}>{payload[0].value} / {maxHabits} habits</p>
    </div>
  );
};

export default function HabitChart() {
  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Habits completed per day</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#AFA9EC", display: "inline-block" }} />
          completed
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="habitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7F77DD" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7F77DD" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" vertical={false} />
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
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(128,128,128,0.2)", strokeWidth: 1 }} />
          <ReferenceLine
            x={todayStr.slice(5)}
            stroke="#7F77DD"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "today", position: "insideTopRight", fontSize: 11, fill: "#7F77DD", dy: -4 }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#7F77DD"
            strokeWidth={2}
            fill="url(#habitGrad)"
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: "#7F77DD", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}