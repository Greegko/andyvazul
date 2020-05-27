import * as React from 'react';
import { getProjects, ProjectType, CuratedProject } from '../queries/get-projects';
import { urlFriendly, render } from '../utils';
import { SubmenuItem } from './content';
import { Images, Image } from './content/images';
import { groupWith, sortBy } from 'ramda';
import { getProjectUrl } from '../utils/get-project-url';

import './list-project-groups.scss';
export const ListProjectGroups = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Curated) as CuratedProject[];
  const orderedProjects = sortBy(x => x.projectGroup.id, projects);
  const projectGroups = groupWith(
    (projectA, projectB) => projectA.projectGroup.id === projectB.projectGroup.id,
    orderedProjects
  );

  const createImagesFromProjects = (project: CuratedProject): Image => {
    const link = getProjectUrl(project, true);

    return {
      alt: project.title,
      src: project.image.src,
      title: project.title,
      group: project.projectGroup.title,
      link
    }
  };

  return sortBy(x => x[0].projectGroup.order, projectGroups).map((projects) => {
    const key = projects[0].projectGroup.title;

    return (
      <div className="project-group" key={key}>
        <SubmenuItem url={urlFriendly(key)} id={urlFriendly(key)}>{key}</SubmenuItem>

        {render(projects[0].projectGroup.header)}

        <Images images={sortBy(x => x.order, projects).map(createImagesFromProjects)} />
      </div>
    );
  }
  );
}
