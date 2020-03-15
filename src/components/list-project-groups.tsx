import * as React from 'react';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { urlFriendly, render, groupBy } from '../utils';
import { ProjectDisplay } from './project-display';
import { SubmenuItem } from './content';

import './list-project-groups.css';
export const ListProjectGroups = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];
  const projectGroups = groupBy(projects, project => project.projectGroup.title);

  return Object.keys(projectGroups).map(key =>
    <div className="project-group" key={key}>
      <SubmenuItem url={urlFriendly(key)}>{key}</SubmenuItem>
      <div className="project-group-header">
        {render(projectGroups[key][0].projectGroup.header)}
      </div>
      <div className='project-group-content'>
        {projectGroups[key].map((project, index: number) => <ProjectDisplay
          key={project.title}
          {...project}
          group={index + 1}
          noCaption
          groupSlug={project.projectGroup.title} />)}
      </div>
    </div>
  );
}
