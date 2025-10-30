import './TaskCard.css'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router'

function getPriority(val) {
  if(val === 1)  return "Low"
  if(val === 2)  return "Medium"
  if(val === 3)  return "High"
}

export const TaskCard = ({ task, onClick }) => {
  const [status, setStatus] = useState(task.status)

  const updateStatus = async (newStatus) => {
    try {
      setStatus(newStatus)
      await axios.put(`http://localhost:5000/api/update-task-status/${task.id}`, { status: newStatus })
    } catch (e) {}
  }

  return (
    <div className="project-card" onClick={onClick}>
      <h2>Task</h2>
      <h4>{task.title}</h4>
      <h4>Due Date: {task.due_date}</h4>
      <h4>Priority: {getPriority(task.priority)}</h4>
      <div className="task-actions" onClick={(e) => e.stopPropagation()}>
        <Link to={`/task/${task.id}/edit`}><button className="btn">Edit</button></Link>
        <button 
          className="btn btn--danger"
          onClick={async () => {
            if (!confirm('Delete task?')) return;
            try { await axios.delete(`http://localhost:5000/api/task/${task.id}`); window.location.reload(); } catch (e) {}
          }}
        >Delete</button>
      </div>
    </div>
  );
};