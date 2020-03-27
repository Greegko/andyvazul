import * as React from 'react';
import { getProjects, ProjectType, ArtisticProject } from '../queries';
import { urlFriendly, groupBy } from '../utils';
import { SubmenuItem } from './content';
import { Image, Images } from './content/images';

export const ListProjectsByGroup = () => {
  const projects = getProjects().filter(project => project.type === ProjectType.Artistic) as ArtisticProject[];
  const groupedProjects: Record<string, ArtisticProject[]> = groupBy(projects, x => x.group.toString());

  const createImagesFromProjects = (project: ArtisticProject): Image => {
    const link = `/artistic-works/${urlFriendly(project.group)}/${project.slug}`;

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
          <Images images={groupedProjects[group].map(createImagesFromProjects)} />
        </div>
      ))}
    </div>
  )
}
