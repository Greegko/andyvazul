import * as React from 'react';
import { getProjects, Project, ProjectType, ArtisticProject } from '../queries';
import { urlFriendly, unique } from '../utils';
import { Layout } from '../components/layout';
import { ProjectDisplay } from '../components/project-display';

import './artistic-works.css';
const ArtisticWorksPage = ({ location }) => {
  const projects = getProjects().filter(project => project.type === ProjectType.Artistic) as ArtisticProject[];

  const allLabels = projects
    .map(x => x.group)
    .filter(unique)
    .map(group => ({ order: 0, path: urlFriendly(group), title: group }));

  const groupedProjects: Record<string, ArtisticProject[]> = projects.reduce((prev, current) => ({
    ...prev,
    [current.group]: [...(prev[current.group] || []), current]
  }), {});

  return (
    <Layout location={location} submenu={allLabels}>
      <div className="projects">
        {allLabels.map(({ title }) => (
          <div className='projects-group'>
            {groupedProjects[title].map(project => <ProjectDisplay
              groupSlug={project.group}
              group={project.group}
              {...project} />)}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default ArtisticWorksPage;
