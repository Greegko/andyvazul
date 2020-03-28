import * as React from 'react';
import { getProjects, ProjectType, ArtisticProject } from '../queries';
import { urlFriendly } from '../utils';
import { SubmenuItem } from './content';
import { Image, Images } from './content/images';
import { groupBy } from 'ramda';
import { getProjectUrl } from '../utils/get-project-url';

import './list-projects-by-group.scss';
export const ListProjectsByGroup = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Artistic) as ArtisticProject[];
  const groupedProjects: Record<string, ArtisticProject[]> = groupBy(x => x.group.toString(), projects);

  const createImagesFromProjects = (project: ArtisticProject): Image => {
    const link = getProjectUrl(project, true);

    return {
      alt: project.title,
      src: project.image.src,
      title: project.title,
      group: project.group as string,
      link
    }
  };

  return (
    <div className="projects">
      {Object.keys(groupedProjects).map(group => (
        <div key={group}>
          <SubmenuItem url={urlFriendly(group)} id={urlFriendly(group)}>{group}</SubmenuItem>
          <div className="group-title">{group}</div>
          <Images images={groupedProjects[group].map(createImagesFromProjects)} />
        </div>
      ))}
    </div>
  )
}
