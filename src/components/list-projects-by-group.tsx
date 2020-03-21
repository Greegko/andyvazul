import * as React from 'react';
import { getProjects, ProjectType, ArtisticProject } from '../queries';
import { urlFriendly, groupBy } from '../utils';
import { ProjectDisplay } from './project-display';
import { SubmenuItem } from './content';

import './list-projects-by-group.css';
export const ListProjectsByGroup = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Artistic) as ArtisticProject[];
  const groupedProjects: Record<string, ArtisticProject[]> = groupBy(projects, x => x.group.toString());

  return (
    <div className="projects">
      {Object.keys(groupedProjects).map(group => (
        <div key={group}>
          <SubmenuItem url={urlFriendly(group)} id={urlFriendly(group)}>{group}</SubmenuItem>
          <div className='project-group-content'>
            {groupedProjects[group].map(project => <ProjectDisplay
              key={project.title}
              groupSlug={project.group}
              group={project.group}
              {...project} />)}
          </div>
        </div>
      ))}
    </div>
  )
}
