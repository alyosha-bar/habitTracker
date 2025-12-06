import { Routes } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'

type Habit = {
  id: number
  name: string
  targetHours: number
  loggedHours: number
}

function App() {
  const [habitsState, setHabitsState] = useState<Habit[]>([]);

  useEffect(() => {
    // fetch habits from the backend and set the state
    const fetchHabits = async () => {
      fetch('http://localhost:8080/habits/habits')
        .then(response => response.json())
        .then(data => setHabitsState(data.habits))
        .catch(error => console.error('Error fetching habits:', error));
    }

    fetchHabits();
  }, [])



  const logHours = async (id: number) => {
    

    // make fetch request to the backend to update the logged hours for the habit with the given id
    const response = await fetch(`http://localhost:8080/habits/log/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error logging hours:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Successfully logged hours:', data);
    
    // For now, we will just update the state directly
    setHabitsState(habitsState.map(habit => {
      if (habit.id === id) {
        return { ...habit, loggedHours: habit.loggedHours + 1 }
      }
      else {
        return habit
      }
    }))
  }


  return (

    <div className="app-layout">
      {/* LEFT COLUMN: Habit Tracker */}
      <div className="left-panel">
        <div className="habit-tracker">
          <h1>Habit Tracker</h1>
          {habitsState.map(habit => (
            <div key={habit.id} className="habit">
              <div className="habit-text-area">
                <h2>{habit.name}</h2>
                <p>Target Hours: {habit.targetHours}</p>
                <p>Logged Hours: {habit.loggedHours}</p>
              </div>
              <button onClick={() => logHours(habit.id)}>Add Hour</button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Placeholder */}
      <div className="right-panel">
        <h3>To Do List ? Notes ?</h3>
      </div>

      {/* BOTTOM PANEL: Placeholder */}
      <div className="bottom-panel">
        <h3>Dashboard for Past Weeks</h3>
      </div>
    </div>
  )
}

export default App
