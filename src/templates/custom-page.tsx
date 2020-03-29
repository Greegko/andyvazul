import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';

import './custom-page.scss';
export default function CustomPage({ location, pageContext: { content, title, description } }) {
  const displayAsBlock = location.pathname === "/";

  content.children = content.children.reduce((acc, value) => {
    if (acc[1] && isNewLine(value)) return acc;

    return [[...acc[0], value], isSubmenuItem(value)];
  }, [[], false])[0];

  return (
    <Layout location={location} title={title} description={description} displayAsBlock={displayAsBlock}>
      {render(content)}
    </Layout>
  );
};

const isSubmenuItem = node => node.type === 'element' && node.children.length === 1 && node.children[0].tagName === 'submenu-item';
const isNewLine = node => node.type === "text" && node.value.match(/^\s$/) !== null;
