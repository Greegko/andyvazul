import * as React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Layout } from '../components/layout';

export default function CustomPage({ location, pageContext: { content } }) {
  return (
    <Layout location={location}>
      {documentToReactComponents(content)}
    </Layout>
  );
};
