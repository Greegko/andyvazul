import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';

import './custom-page.scss';
export default function CustomPage({ location, pageContext: { content, title, description } }) {
  return (
    <Layout location={location} title={title} description={description}>
      {render(content)}
    </Layout>
  );
};
