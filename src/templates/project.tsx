import * as React from "react"
import { Layout } from "../components/layout"
import { render } from "../utils/render"
import { getProjects, MenuItem, Project, ProjectType } from "../queries"
import { Images } from "../components/content/images"
import { uniqBy } from "ramda"
import { urlFriendly } from "../utils"

interface ProjectTemplateProperties {
  location
  pageContext: {
    id: string
    title: string
    description: string
    content: any
    projectType: ProjectType
  }
}

export default function ProjectTemplate({
  location,
  pageContext: { content, title, id, description, projectType },
}: ProjectTemplateProperties) {
  const projects = getProjects()
  const projectGroups = uniqBy(
    (x: Project) =>
      x.type === ProjectType.Artistic ? x.group : x.projectGroup.title,
    projects.filter(x => x.type === projectType)
  )

  // Find project siblings
  const project = projects.find(x => x.id === id)
  const sameGroup = projects.filter(
    x =>
      (x.type === ProjectType.Artistic ? x.group : x.projectGroup.id) ===
      (project.type === ProjectType.Artistic
        ? project.group
        : project.projectGroup.id)
  )

  const subsubmenu: MenuItem[] = sameGroup.map((x, index) => ({
    title: x.title.toLowerCase(),
    order: x.order ?? index,
    path: x.slug,
  }))

  // Group submenus
  const submenu: MenuItem[] = projectGroups.map((project, index) => {
    const title =
      project.type === ProjectType.Artistic
        ? project.group
        : project.projectGroup.title
    const order =
      project.type === ProjectType.Artistic
        ? project.order
        : project.projectGroup.order
    return { title, path: urlFriendly(title), order: order ?? index }
  })

  // Find image contents
  let images = []
  let contentWithoutImage = content

  const imageIndex = content.children.findIndex(isImageP)
  if (imageIndex !== -1) {
    contentWithoutImage = {
      type: "root",
      children: content.children.slice(0, imageIndex),
    }
    images = content.children
      .slice(imageIndex)
      .filter(x => !isEmptyLine(x))
      .map(getImage)
  }

  return (
    <Layout
      location={location}
      title={title}
      description={description}
      submenu={submenu}
      subsubmenu={subsubmenu}
    >
      {render(contentWithoutImage)}
      {imageIndex !== -1 && <Images images={images} />}
    </Layout>
  )
}

const getImage = node => {
  return node.children[0].properties
}

const isImageP = node => {
  return (
    node.tagName === "p" &&
    node.children.length === 1 &&
    node.children[0].tagName === "img"
  )
}

const isEmptyLine = node => {
  return node.type === "text"
}
