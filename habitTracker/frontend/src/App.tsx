import { Routes } from 'react-router-dom'
import './App.css'
import { useEffect, useState } from 'react'

type Habit = {
  id: number
  name: string
  targetHours: number
  loggedHours: number
}

type ToDo = {
  id: number
  task: string
  completed: boolean
}

function App() {
  const [habitsState, setHabitsState] = useState<Habit[]>([]);
  const [toDosState, setToDosState] = useState<ToDo[]>([]);
  const [newTodo, setNewToDo] = useState<string>('');

  useEffect(() => {
    // fetch habits from the backend and set the state
    const fetchHabits = async () => {
      fetch('http://localhost:8080/habits/habits')
        .then(response => response.json())
        .then(data => setHabitsState(data.habits))
        .catch(error => console.error('Error fetching habits:', error));
    }

    const fetchTodos = async () => {
      fetch('http://localhost:8080/todos/all')
        .then(response => response.json())
        .then(data => setToDosState(data.todos))
        .catch(error => console.error('Error fetching habits:', error));
    }

    fetchTodos();
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

  const submitToDo = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = { id: toDosState.length + 1, task: newTodo, completed: false };

    // Add into ToDos state array --> to make super reactive
    setToDosState([...toDosState, newTask]);

    // Make fetch request to backend to add new To-Do item
    const resposne = await fetch('http://localhost:8080/todos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task: newTodo,
        completed: false,
      }),
    }); 

    if (!resposne.ok) {
      console.error('Error adding new To-Do:', resposne.statusText);
      return;
    }

    const data = await resposne.json();
    console.log('Successfully added new To-Do:', data);

    // reset input field
    setNewToDo('');
  }

  const markToDoComplete = async (id: number) => {
    
    setToDosState(
      toDosState.map(item =>
        item.id === id ? { ...item, completed: !item.completed }: item)
      );
    
    // Make fetch request to backend to mark To-Do item as complete
    const response = await fetch(`http://localhost:8080/todos/complete/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error marking To-Do as complete:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log('Successfully marked To-Do as complete:', data);
  }


  return (
    <div className='page-container'>
      <div className="app-layout">
        {/* LEFT COLUMN: Habit Tracker */}
        <div className="left-panel">
          <div className="habit-tracker">
            <h1 className='title'>Habit Tracker - Week X </h1>
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
          <h3 className='title'>To Do List</h3>
            <form onSubmit={submitToDo} className="todo-form">
              <input 
                type="text" 
                placeholder="New To-Do Item"
                value={newTodo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewToDo(e.target.value)}
              />
              <button type="submit">Add</button>
            </form>
          {toDosState.map(todo => (
            <div key={todo.id} className="todo-item">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => {
                  markToDoComplete(todo.id);
                }}
              />
              <span>{todo.task}</span>
            </div>
          ))}
        </div>

        {/* BOTTOM PANEL: Placeholder */}
        {/* <div className="bottom-panel">
          <h3>Dashboard for Past Weeks</h3>
        </div> */}
      </div>
    </div>
  )
}

export default App
