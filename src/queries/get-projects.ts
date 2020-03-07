import { useStaticQuery, graphql } from "gatsby";

export enum ProjectType { Artistic, Curated };

export interface ProjectBase {
  title: string;
  slug: string;
  imageUrl: string;
  content: any;
}

export interface ArtisticProject extends ProjectBase {
  type: ProjectType.Artistic;
  group: string;
}

export interface CuratedProject extends ProjectBase {
  type: ProjectType.Curated;
  projectGroupTitle: string;
}

export type Project = ArtisticProject | CuratedProject;

export function getProjects(): Project[] {
  const ProjectQuery = useStaticQuery(graphql`
  query {
    allContentfulProject {
      nodes {
        title,
        group,
        slug,
        type,
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
          title
        }
      }
    }
  }
  `);

  return ProjectQuery.allContentfulProject.nodes.map(x => ({
    title: x.title,
    group: x.group,
    slug: x.slug,
    type: x.type === 'Artistic work' ? ProjectType.Artistic : ProjectType.Curated,
    imageUrl: x.image?.file.url,
    content: x.content?.sourceCode.json,
    projectGroupTitle: x.project_group ? x.project_group[0].title : undefined
  }));
}