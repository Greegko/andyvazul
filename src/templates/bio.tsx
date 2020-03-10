import React from "react";
import { Layout } from "../components/layout";
import { Stern } from "../components/stern";
import { render } from "../utils/render";

import './bio.css';
const BioPage = ({ location, pageContext: { content } }) => {
  return (
    <Layout location={location}>
      <div className='bio'>
        {render(content)}
      </div>
      <Stern>Random Text</Stern>
    </Layout>
  )
}

export default BioPage
