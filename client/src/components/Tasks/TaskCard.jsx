import './TaskCard.css'

export const TaskCard = ({ task, onClick }) => {

  return (
    <div className="project-card" onClick={onClick}>
      <h2>Task</h2>
      <h4>{task.name}</h4>
      <div className="project-meta">
      </div>
    </div>
  );
};