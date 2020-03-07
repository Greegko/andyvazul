import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { Layout } from "../components/layout";
import { getNews } from "../queries";
import { Stern } from "../components/stern";

import './bio.css';
const BioPage = ({ location, pageContext: { content } }) => {
  return (
    <Layout location={location}>
      <div className='bio'>
        {documentToReactComponents(content)}
      </div>
      <Stern text={'Random Text'} />
    </Layout>
  )
}

export default BioPage
