import * as React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Layout } from '../components/layout';

const ProjectTemplate = ({ location, pageContext: { content, isArtisticWork } }) => (
  <Layout location={location}>
    {documentToReactComponents(content)}
  </Layout>
);

export default ProjectTemplate;
