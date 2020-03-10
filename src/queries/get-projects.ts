import { useStaticQuery, graphql } from "gatsby";
import { Document } from '@contentful/rich-text-types';

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
  projectGroup: {
    id: string;
    title: string;
    header: Document
  }
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
            childMarkdownRemark {
              htmlAst
            }
          }
        },
        project_group {
          id
          title
          header {
            childMarkdownRemark {
              htmlAst
            }
          }
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
    content: x.content?.childMarkdownRemark.htmlAst,
    projectGroup: x.project_group ? {
      id: x.project_group[0].id,
      title: x.project_group[0].title,
      header: x.project_group[0].header.childMarkdownRemark.htmlAst
    } : undefined
  }));
}