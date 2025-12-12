import { API_BASE } from './api/config'
import './App.css'
import { useEffect, useState } from 'react'
import HabitProgressBar from './components/HabitProgressBar'
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddHabitModal from './components/AddHabitModal'



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
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);


  useEffect(() => {
    // fetch habits from the backend and set the state
    const fetchHabits = async () => {
      fetch(`${API_BASE}/habits/habits`)
        .then(response => response.json())
        .then((data) => setHabitsState(data.habits.sort((a: Habit, b: Habit) => a.id - b.id)))
        .catch(error => console.error('Error fetching habits:', error));
    }

    const fetchTodos = async () => {
      fetch(`${API_BASE}/todos/all`)
        .then(response => response.json())
        .then(data => setToDosState(data.todos.sort((a: ToDo, b: ToDo) => a.id - b.id)))
        .catch(error => console.error('Error fetching habits:', error));
    }

    fetchTodos();
    fetchHabits();
  }, [])

  useEffect(() => {
    const count = toDosState.filter(todo => todo.completed).length;
    setCompletedCount(count);
  }, [toDosState]);


  const logHours = async (id: number) => {
    

    // make fetch request to the backend to update the logged hours for the habit with the given id
    const response = await fetch(`${API_BASE}/habits/log/${id}`, {
      method: 'PUT',
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
    const resposne = await fetch(`${API_BASE}/todos/add`, {
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
    const response = await fetch(`${API_BASE}/todos/complete/${id}`, {
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

  const minusLogHours = async (id: number) => {

    if (habitsState.find(habit => habit.id === id)?.loggedHours === 0) {
      alert("Logged hours already at 0, cannot decrement further.");
      return;
    }

    const response = await fetch(`${API_BASE}/habits/minuslog/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error logging hours:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log(data.message);

    // For now, we will just update the state directly
    setHabitsState(habitsState.map(habit => {
      if (habit.id === id) {
        return { ...habit, loggedHours: habit.loggedHours - 1 }
      }
      else {
        return habit
      }
    }))

  }

  const deleteToDo = async (id: number) => {
    console.log("deleting todo with id: " + id);
  }

  // const deleteHabit = async (id: number) => {
  //   console.log("deleting habit with id: " + id);
  // }

  // pass into modal
  const createHabit = async (name: string, targetHours: number) => {

    console.log("creating new habit");

    const response = await fetch(`${API_BASE}/habits/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        targetHours: targetHours,
        loggedHours: 0,
      }),
    });

    if (!response.ok) {
      console.error('Error creating habit:', response.statusText);
      return;
    }

    const data = await response.json();
    console.log(data.message);

    setHabitsState([...habitsState, data.newHabit]);
  }


  return (
    <div className='page-container'>
      <div className="app-layout">
        {/* LEFT COLUMN: Habit Tracker */}
        <div className="left-panel">
          <div className="habit-tracker">
            <div className='title-group'>
              <h1 className='title'>Habit Tracker </h1>
              <button onClick={() => setModalOpen(true)}> Add Habit </button>
            </div>
            {habitsState.map(habit => (
              <div key={habit.id} className="habit">
                <div className="habit-text-area">
                  <div>
                    <h2>{habit.name}</h2>
                    <p>Target Hours: {habit.targetHours}</p>
                    <p>Logged Hours: {habit.loggedHours}</p>
                  </div>
                  <div className="habit-buttons">
                    <button onClick={() => minusLogHours(habit.id)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </button>

                    <button onClick={() => logHours(habit.id)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    {/* <button onClick={() => deleteHabit(habit.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button> */}
                  </div>
                </div>
                
                <div className=''>
                  <HabitProgressBar loggedHours={habit.loggedHours} targetHours={habit.targetHours} />
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Placeholder */}
        <div className="right-panel">
          <h2 className='title'>To Do List - {completedCount}/{toDosState.length}</h2>
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
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    markToDoComplete(todo.id);
                  }}
                />
                <span>{todo.task}</span>
              </div>
              <div className='icon' onClick={() => deleteToDo(todo.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </div> 
            </div>
          ))}
        </div>

        {/* BOTTOM PANEL: Placeholder */}
        {/* <div className="bottom-panel">
        </div> */}
        <AddHabitModal isOpen={modalOpen} onClose={() => {setModalOpen(false)}} onSubmit={createHabit} />
      </div>
    </div>
  )
}

export default App
