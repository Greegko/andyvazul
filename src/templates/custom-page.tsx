import * as React from 'react';
import { Layout } from '../components/layout';
import { render } from '../utils/render';
import { SubmenuContext } from '../components/context';

import './custom-page.css';
export default function CustomPage({ location, pageContext: { content } }) {
  const [submenuItems, setSubmenuItems] = React.useState([]);

  const addSubmenuItem = (item) => {
    setSubmenuItems((items) => [...items, item]);
  }

  return (
    <SubmenuContext.Provider value={{ addSubmenuItem }}>
      <Layout location={location} submenu={submenuItems}>
        {render(content)}
      </Layout>
    </SubmenuContext.Provider>
  );
};
