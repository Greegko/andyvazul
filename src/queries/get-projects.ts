import { useStaticQuery, graphql } from "gatsby"

export enum ProjectType {
  Artistic,
  Curated,
}

export interface ProjectBase {
  id: string
  title: string
  slug: string
  order?: number
  image: {
    sizes: string
    srcSet: string
  }
  content: any
}

export interface ArtisticProject extends ProjectBase {
  type: ProjectType.Artistic
  group: string
}

export interface CuratedProject extends ProjectBase {
  type: ProjectType.Curated
  projectGroup: {
    id: string
    title: string
    header: Document
    order?: number
  }
}

export type Project = ArtisticProject | CuratedProject

export function getProjects(): Project[] {
  const ProjectQuery = useStaticQuery(graphql`
    query {
      allContentfulProject {
        nodes {
          id
          title
          group
          type
          order
          image {
            gatsbyImageData(width: 500)
          }
          page {
            slug
            content {
              childMarkdownRemark {
                htmlAst
              }
            }
          }
          project_group {
            id
            title
            order
            header {
              childMarkdownRemark {
                htmlAst
              }
            }
          }
        }
      }
    }
  `)

  return ProjectQuery.allContentfulProject.nodes
    .filter(removeUnassignedProject)
    .map(x => ({
      id: x.id,
      title: x.title,
      group: x.group,
      slug: x.page.slug,
      type:
        x.type === "Artistic work" ? ProjectType.Artistic : ProjectType.Curated,
      image: {
        sizes: x.image.gatsbyImageData.images.sources[0].sizes,
        srcSet: x.image.gatsbyImageData.images.sources[0].srcSet,
      },
      order: x.order || Infinity,
      content: x.page.content.childMarkdownRemark?.htmlAst,
      projectGroup: x.project_group
        ? {
            id: x.project_group[0].id,
            title: x.project_group[0].title,
            header: x.project_group[0].header.childMarkdownRemark.htmlAst,
            order: x.project_group[0].order || Infinity,
          }
        : undefined,
    }))
}

const removeUnassignedProject = node => {
  return node.type === "Artistic work" ? node.group : node.project_group
}
