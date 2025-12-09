
type HabitProgressBarProps = {
    loggedHours: number;
    targetHours: number;
};

const HabitProgessBar = ({loggedHours, targetHours}: HabitProgressBarProps) => {

    // bar of fixed length for each
    // colour in bar based on percentage of logged hours to target hours
    const percentage = Math.min((loggedHours / targetHours) * 100, 100);
    const exceeded = loggedHours > targetHours;
    const completed = loggedHours === targetHours;
    const inProgress = loggedHours < targetHours;

    if (loggedHours > targetHours) {
        console.log("Target exceeded!");
    }


    return (
        <div className="bar">
            <div className={`filled-bar `} style={
                { 
                    width: `${percentage}%`,
                    backgroundColor: inProgress ? 'blue' : completed ? 'green' : exceeded ? 'gold' : 'grey'
                }}></div>
        </div>
    );
}
 
export default HabitProgessBar;