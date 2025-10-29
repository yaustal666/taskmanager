export const ProjectCard = ({ project, onClick }) => {
  const getRoleName = (role) => {
    const roles = { 1: 'Owner', 2: 'Admin', 3: 'Member', 4: 'Viewer' };
    return roles[role] || 'Unknown';
  };

  return (
    <div className="project-card" onClick={onClick}>
      <h4>{project.name}</h4>
      <p>{project.description || 'No description'}</p>
      <div className="project-meta">
        <span className={`role role-${project.user_role}`}>
          {getRoleName(project.user_role)}
        </span>
        {project.is_public && <span className="public-badge">Public</span>}
      </div>
    </div>
  );
};