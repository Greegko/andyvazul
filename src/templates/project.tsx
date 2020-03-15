import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';
import { getProjects, ArtisticProject, CuratedProject } from '../queries';
import { urlFriendly, unique } from '../utils';
import { SubmenuItem } from '../components/content';

export default function ProjectTemplate({ location, pageContext: { content, title, description, projectType } }) {
  const projects = getProjects()
    .filter(x => x.type === projectType)
    .map((x: ArtisticProject & CuratedProject) => x.projectGroup?.title || x.group)
    .filter(unique);

  return (
    <Layout location={location} title={title} description={description}>
      <SubmenuLinks projects={projects}></SubmenuLinks>
      {render(content)}
    </Layout>
  )
}

const SubmenuLinks = ({ projects }) => projects.map(key => <SubmenuItem key={key} url={urlFriendly(key)} hidden={true}>{key}</SubmenuItem>) as any;
