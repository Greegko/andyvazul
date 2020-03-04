import * as React from 'react';
import { Layout } from '../components/layout';
import { Menu } from '../components/menu';
import { getProjects } from '../queries/get-projects';
import { unique, urlFriendly } from '../utils';

import './curated-works.css';
const CuratedWorksPage = ({ location }) => {
  // const [base, projectLabel] = location.pathname.split("/").splice(1);
  // const projects = getProjects().filter(project => !project.projectGroupId).filter(project => project.group);

  // const allLabels = projects
  //   .map(x => x.group)
  //   .filter(unique)
  //   .map(group => ({ order: 0, path: urlFriendly(group), title: group }));

  // const groupedProjects = projects.reduce((prev, current) => ({
  //   ...prev,
  //   [current.group]: [...(prev[current.group] || []), current]
  // }), {});

  // return (
  //   <Layout location={location}>
  //     <Menu activeItem={projectLabel} items={allLabels} base={base} />
  //     <div className="projects">
  //       {allLabels.map(({ title }) => (
  //         <div className='projects-group'>
  //           {groupedProjects[title].map(Project)}
  //         </div>
  //       ))}
  //     </div>
  //   </Layout>
  // );
  return <div>Soon</div>
}

const Project = ({ image, title, label }) => (
  <div className="project">
    <div>
      <img src={image} />
    </div>
    <div>
      <span>{title}</span>
      <span>{label}</span>
    </div>
  </div>
);

export default CuratedWorksPage;
