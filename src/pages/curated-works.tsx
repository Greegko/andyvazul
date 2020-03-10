import * as React from 'react';
import { Layout } from '../components/layout';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { unique, urlFriendly, render } from '../utils';
import { ProjectDisplay } from '../components/project-display';

import './curated-works.css';
const CuratedWorksPage = ({ location }) => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];
  const projectGroups = groupBy(projects, project => project.projectGroup.title);

  const allLabels = Object.values(projectGroups)
    .map(x => x[0].projectGroup.title)
    .filter(unique)
    .sort()
    .map((title: string, index: number) => ({ order: index, path: urlFriendly(title), title }));

  return (
    <Layout location={location} submenu={allLabels}>
      {Object.keys(projectGroups).map(key =>
        <div className="project-group">
          <div className="project-group-header">
            {render(projectGroups[key][0].projectGroup.header)}
          </div>
          <div className='project-group-content'>
            {projectGroups[key].map((project, index: number) => <ProjectDisplay
              {...project}
              group={index + 1}
              noCaption
              groupSlug={project.projectGroup.title} />)}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default CuratedWorksPage;

function groupBy<K extends string, T>(list: T[], keyMap: (obj: T) => K): Record<K, T[]> {
  return list.reduce((prev: any, current) => {
    const key = keyMap(current);

    return {
      ...prev,
      [key]: [...(prev[key] || []), current]
    }
  }, {});
}
