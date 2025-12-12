import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

type AddHabitModalProps = {
    isOpen: boolean;
    onClose: () => void;  
    onSubmit: (name: string, targetHours: number) => void;
};


const AddHabitModal = ({isOpen, onClose, onSubmit} : AddHabitModalProps) => {

    const [newHabitName, setNewHabitName] = useState<string>('');
    const [newHabitTarget, setNewHabitTarget] = useState<number>(0);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // collect form data and call onSubmit

        if (newHabitName.trim() === '' || newHabitTarget <= 0) {
            // change to toast someday
            alert("Please enter a valid habit name and target hours.");
            return;
        }


        onSubmit(newHabitName, newHabitTarget);


        // clear form
        setNewHabitName('');
        setNewHabitTarget(0);
        
        // close modal
        onClose();
    }

    return ( 
        <>
            <div className={`modal-overlay ${isOpen ? "open" : ""}`} />

            <div
                className={`modal ${isOpen ? "open" : ""}`}
            >
                <button onClick={onClose}>
                <FontAwesomeIcon icon={faClose} />
                </button>

                <form onSubmit={handleSubmit}>
                <h2>Add a New Habit</h2>

                <div>
                    <label htmlFor="name">Name:</label>
                    <input 
                    name="name"
                    type="text"
                    placeholder="New Habit Name"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="targetHours">Goal:</label>
                    <input 
                    name="targetHours"
                    type="number"
                    placeholder="Target Hours"
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(Number(e.target.value))}
                    />
                </div>

                <button type="submit">Create Habit</button>
                </form>
            </div>
        </>
    );
}
 
export default AddHabitModal;