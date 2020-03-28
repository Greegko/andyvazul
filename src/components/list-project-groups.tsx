import * as React from 'react';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { urlFriendly, render } from '../utils';
import { SubmenuItem } from './content';
import { Images, Image } from './content/images';
import { groupBy } from 'ramda';

import './list-project-groups.scss';
import { getProjectUrl } from '../utils/get-project-url';
export const ListProjectGroups = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];
  const projectGroups = groupBy(project => project.projectGroup.title, projects);

  const createImagesFromProjects = (project: CuratedProject): Image => {
    const link = getProjectUrl(project, true);

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
