import { ProjectCard } from './ProjectCard';

export const ProjectList = ({ projects, onProjectClick }) => {
  if (!projects.length) {
    return (
      <div className="empty-state">
        <p>No projects yet. Create your first project!</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      <h3>Your Projects</h3>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            onClick={() => onProjectClick(project.id)}
          />
        ))}
      </div>
    </div>
  );
};