import * as React from 'react';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { urlFriendly, render, groupBy } from '../utils';
import { SubmenuItem } from './content';
import { Images, Image } from './content/images';

import './list-project-groups.scss';
export const ListProjectGroups = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];
  const projectGroups = groupBy(projects, project => project.projectGroup.title);

  const createImagesFromProjects = (project: CuratedProject): Image => {
    const link = `/curated-works/${urlFriendly(project.projectGroup.title)}/${project.slug}`;

    return {
      alt: project.title,
      src: project.image.src,
      link
    }
  };

  return Object.keys(projectGroups).map(key =>
    <div className="project-group" key={key}>
      <SubmenuItem url={urlFriendly(key)} id={urlFriendly(key)}>{key}</SubmenuItem>

      {render(projectGroups[key][0].projectGroup.header)}

      <Images images={projectGroups[key].map(createImagesFromProjects)} />
    </div>
  );
}
