import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';

export default function ProjectTemplate({ location, pageContext: { content, title, description, isArtisticWork } }) {
  return (
    <Layout location={location} title={title} description={description}>
      {render(content)}
    </Layout>
  )
}
