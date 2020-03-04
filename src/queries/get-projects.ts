import { useStaticQuery, graphql } from "gatsby";

export interface Project {
  title: string;
  slug: string;
  group?: string;
  content?: any;
  imageUrl?: string;
  projectGroupId?: string;
}

export function getProjects(): Project[] {
  const ProjectQuery = useStaticQuery(graphql`
  query {
    allContentfulProject {
      nodes {
        title,
        group,
        slug,
        image {
          file {
            url
          }
        },
        content {
          sourceCode{
            json
          }
        },
        project_group {
          id
        }
      }
    }
  }
  `);

  return ProjectQuery.allContentfulProject.nodes.map(x => ({
    title: x.title,
    group: x.group,
    slug: x.slug,
    imageUrl: x.image?.file.url,
    content: x.content?.sourceCode.json,
    projectGroupId: x.project_group?.id
  }));
}