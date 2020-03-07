import { useStaticQuery, graphql } from "gatsby";

export function getNews(): string {
  const NewsQuery = useStaticQuery(graphql`
  query {
    allContentfulNews {
      nodes {
        content
      }
    }
  }
  `);

  return NewsQuery.allContentfulNews.nodes[0].content;
}
