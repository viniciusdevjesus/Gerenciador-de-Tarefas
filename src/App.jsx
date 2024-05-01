import { json } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import { useState, useEffect } from 'react'
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const API = "http://localhost:5000"
function App() {
  const [Title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  //Load Todos on page load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const res = await fetch(API + "/todos")
      .then((res) => res.json())
      .then((data => data)).catch((error) => console.log(error));

      setLoading(false);
      setTodos(res); 
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault();
    const todo = {
      id: Math.random(),
      Title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: "Post",
      body: JSON.stringify(todo),
      headers: {
        "Content-type": "application.json"
      },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle("")
    setTime("")
  };
  const handleDelete = async (id) => {
      await fetch(API + "/todos/delete/", {
      method: "DELETE",
    });
    setTodos((prevState) => prevState.filter((todos) => todos.id !== id))
  }
  const handleEdit = async(todos) => {
    todos.done = !todos.done;
    const data = await fetch(API + "/todos/edit/", {
      method: "PUT",
      body: JSON.stringify(todos),
      headers: {
        "Content-type": "application.json"
      },
      
    });
    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data): t)))
  }

  if(loading){
    return <p>Carregando...</p>
  }

  return (
    <>
      <div className='App'>
        <div className='Header'>
          <h1>React Todos</h1>
        </div>
        <div className="form-todo">
          <h2>Insira sua Próxima Tarefa</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label htmlFor="title">O que você vai fazer hoje?</label>
              <input type="text" name='title' placeholder='Título da Tarefa' onChange={(e) => setTitle(e.target.value)} value={Title || ""} required />

            </div>

            <div className="form-control">
              <label htmlFor="time">Duração: </label>
              <input type="text" name='time' placeholder='Tempo da tarefa(em horas)' onChange={(e) => setTime(e.target.value)} value={time || ""} required />


            </div>
            <button type="submit">Enviar</button>
          </form>
        </div>
        <div className="list-todos">
          <p>Lista de Tarefas</p>
          {todos.length === 0 && <p>Não Há Tarefas</p>}
          {todos.map((todos) => (
            <div className="todo" key={todos.id}>
              <h3 className={todos.done ? "todo-done" : ""}>{todos.Title}</h3>
              <p>Duração: {todos.time}</p>
              <div className="actions">
                <span onClick={() => handleEdit(todos)}>
                  {!todos.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
                </span>
                <BsTrash onClick={() => handleDelete(todos.id)}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
