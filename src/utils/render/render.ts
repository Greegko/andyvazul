import rehypeReact from "rehype-react"
import * as prod from "react/jsx-runtime"

import { SubmenuItem, ProjectGroup } from "../../components/content"
import { Stern } from "../../components/stern"
import { ListProjectsByGroup } from "../../components/list-projects-by-group"
import { ListProjectGroups } from "../../components/list-project-groups"
import { divRender } from "./div-render"
import { unified } from "unified"

const components = {
  "submenu-item": SubmenuItem,
  stern: Stern,
  "list-projects-by-group": ListProjectsByGroup,
  "list-project-groups": ListProjectGroups,
  projectgroup: ProjectGroup,
  div: divRender,
}

const unifiedParser = unified().use(rehypeReact, {
  createElement: prod.jsx,
  Fragment: prod.Fragment,
  jsx: prod.jsx,
  jsxs: prod.jsxs,
  components,
})

export const render = (content: any) => {
  const node = unifiedParser.runSync(content)
  return unifiedParser.stringify(node)
}
