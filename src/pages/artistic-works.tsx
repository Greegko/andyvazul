import * as React from 'react';
import { Link } from 'gatsby';
import { getProjects, Project } from '../queries';
import { urlFriendly, unique } from '../utils';
import { Layout } from '../components/layout';

import './artistic-works.css';
const ArtisticWorksPage = ({ location }) => {
  const projects = getProjects().filter(project => !project.projectGroupId).filter(project => project.group);

  const allLabels = projects
    .map(x => x.group)
    .filter(unique)
    .map(group => ({ order: 0, path: urlFriendly(group), title: group }));

  const groupedProjects = projects.reduce((prev, current) => ({
    ...prev,
    [current.group]: [...(prev[current.group] || []), current]
  }), {});

  return (
    <Layout location={location} submenu={allLabels}>
      <div className="projects">
        {allLabels.map(({ title }) => (
          <div className='projects-group'>
            {groupedProjects[title].map(ProjectDisplay)}
          </div>
        ))}
      </div>
    </Layout>
  );
}

const ProjectDisplay = ({ imageUrl, title, group, slug }: Project) => (
  <Link className="project" to={"/artistic-works/" + urlFriendly(group) + '/' + slug}>
    <div>
      <img src={imageUrl} />
    </div>
    <div>
      <span className="project-group">{group}</span>
      <span className="project-title">{title}</span>
    </div>
  </Link>
);

export default ArtisticWorksPage;
