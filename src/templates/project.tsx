import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';

const ProjectTemplate = ({ location, pageContext: { content, isArtisticWork } }) => (
  <Layout location={location}>
    {render(content)}
  </Layout>
);

export default ProjectTemplate;
