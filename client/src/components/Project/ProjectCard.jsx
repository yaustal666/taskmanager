import './ProjectCard.css'

export const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="project-card" onClick={onClick}>
      <h2>Project</h2>
      <h4>{project.name}</h4>
      <div className="project-meta">
      <p>Owner: {project.created_by}</p>
      {project.is_public && <span className="public-badge">Public</span>}
      </div>
    </div>
  );
};