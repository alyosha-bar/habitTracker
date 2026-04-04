type HabitProgressBarProps = {
    loggedHours: number;
    targetHours: number;
};

const HabitProgessBar = ({ loggedHours, targetHours }: HabitProgressBarProps) => {
    const safeTarget = targetHours > 0 ? targetHours : 1;
    const rawPct = (loggedHours / safeTarget) * 100;
    const percentage = targetHours <= 0 ? 0 : Math.min(rawPct, 100);

    const exceeded = targetHours > 0 && loggedHours > targetHours;
    const completed = targetHours > 0 && loggedHours === targetHours;
    const inProgress = targetHours > 0 && loggedHours < targetHours;

    let stateClass = "filled-bar--empty";
    if (targetHours > 0) {
        if (exceeded) stateClass = "filled-bar--exceeded";
        else if (completed) stateClass = "filled-bar--completed";
        else if (inProgress) stateClass = "filled-bar--in-progress";
    }

    return (
        <div className="bar">
            <div
                className={`filled-bar ${stateClass}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default HabitProgessBar;
