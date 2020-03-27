import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';
import { getProjects, ArtisticProject, CuratedProject } from '../queries';
import { urlFriendly, unique } from '../utils';
import { SubmenuItem } from '../components/content';
import { Images } from '../components/content/images';

export default function ProjectTemplate({ location, pageContext: { content, title, description, projectType } }) {
  const projects = getProjects()
    .filter(x => x.type === projectType)
    .map((x: ArtisticProject & CuratedProject) => x.projectGroup?.title || x.group)
    .filter(unique);

  const imageIndex = content.children.findIndex(isImageP);
  const contentWithoutImage = { type: "root", children: content.children.slice(0, imageIndex) };
  const images = content.children.slice(imageIndex).filter(x => !isEmptyLine(x)).map(getImage);

  return (
    <Layout location={location} title={title} description={description}>
      <SubmenuLinks projects={projects}></SubmenuLinks>
      {render(contentWithoutImage)}
      {imageIndex !== -1 && <Images images={images} />}
    </Layout>
  )
}

const getImage = node => {
  return node.children[0].properties;
}

const isImageP = node => {
  return node.tagName === "p" && node.children.length === 1 && node.children[0].tagName === 'img';
}

const isEmptyLine = node => {
  return node.type === "text";
}

const SubmenuLinks = ({ projects }) => projects.map(key => <SubmenuItem key={key} url={urlFriendly(key)} hidden={true}>{key}</SubmenuItem>) as any;
