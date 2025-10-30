import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import axios from 'axios'
import Header from '../Header/Header'
import './TaskPage.css'

const TaskPage = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [subtasks, setSubtasks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setError('')
      try {
        const res = await axios.get(`http://localhost:5000/api/task/${taskId}`)
        setTask(res.data.task)
        setSubtasks(res.data.subtasks || [])
      } catch (e) {
        setError(e?.response?.data?.error || 'Failed to load task')
      }
    }
    load()
  }, [taskId])

  const deleteTask = async () => {
    if (!confirm('Delete this task?')) return
    try {
      await axios.delete(`http://localhost:5000/api/task/${taskId}`)
      navigate('/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Failed to delete task')
    }
  }

  return (
    <>
      <Header />
      <div className="main-page">
        <div className="column task-details">
          {!!error && <p style={{ color: 'red' }}>{error}</p>}
          {!task ? (
            <p>Loading…</p>
          ) : (
            <>
              <h2>{task.title}</h2>
              <p>Description: <br></br>  
                {task.description}</p>
              <div className="meta-row">
                <span>Due: {task.due_date || '-'}</span>
                <span>Priority: {task.priority}</span>
                <span>Status: {task.status}</span>
                {task.project_name && <span>Project: {task.project_name}</span>}
              </div>
              <div className="task-actions">
                <Link to={`/task/${taskId}/edit`}><button className="btn">Edit Task</button></Link>
                <button className="btn btn--danger" onClick={deleteTask}>Delete</button>
                <Link to={`/task/${taskId}/add-subtask`}><button className="btn">Add Subtask</button></Link>
              </div>
              <div style={{ marginTop: 16 }}>
                <h3>Subtasks</h3>
                {!subtasks.length ? <p>No subtasks</p> : (
                  <ul>
                    {subtasks.map(st => (
                      <li key={st.id} className="task-actions">
                        {st.title} — 
                        <Link to={`/task/${st.id}`}>
                        <button className="btn">Open</button>
                        </Link>
                        <Link to={`/task/${st.id}/edit`}>
                        <button className="btn">Edit</button>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default TaskPage


