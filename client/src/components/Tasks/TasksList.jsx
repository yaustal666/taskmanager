import { TaskCard } from "./TaskCard";

export const TaskList = ({ tasks, onTaskClick }) => {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <p>No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      <h3>Your Tasks</h3>
      <div className="projects-grid">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)}
          />
        ))}
      </div>
    </div>
  );
};