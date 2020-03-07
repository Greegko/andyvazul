import React from "react";
import { Layout } from "../components/layout";
import { getNews } from "../queries";
import { Stern } from "../components/stern";

import './index.css';
const IndexPage = ({ location }) => {
  const news = getNews();
  return (
    <Layout location={location}>
      <div className="news">
        <div className="news-container">
          <div className="news-title">News</div>
          <div className="news-content">{news}</div>
        </div>
      </div>
      <Stern text={news} />
    </Layout>
  )
}

export default IndexPage
