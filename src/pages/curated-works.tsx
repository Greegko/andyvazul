import * as React from 'react';
import { Layout } from '../components/layout';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { unique, urlFriendly } from '../utils';
import { ProjectDisplay } from '../components/project-display';

import './curated-works.css';
const CuratedWorksPage = ({ location }) => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];

  const allLabels = projects
    .map(x => x.projectGroupTitle)
    .filter(unique)
    .sort()
    .map((projectGroupTitle: string, index: number) => ({ order: index, path: urlFriendly(projectGroupTitle), title: projectGroupTitle }));

  const groupedProjects: Record<string, CuratedProject[]> = projects.reduce((prev, current) => ({
    ...prev,
    [current.projectGroupTitle]: [...(prev[current.projectGroupTitle] || []), current]
  }), {});

  return (
    <Layout location={location} submenu={allLabels}>
      <div className="projects">
        {allLabels.map(({ title }) => (
          <div className='projects-group'>
            {groupedProjects[title].map((project, index: number) => <ProjectDisplay
              {...project}
              group={index + 1}
              groupSlug={project.projectGroupTitle} />)}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default CuratedWorksPage;
