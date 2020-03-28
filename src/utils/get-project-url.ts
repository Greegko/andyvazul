import { urlFriendly } from "./url-friendly";
import { ProjectType, Project } from "../queries";

export const getProjectUrl = (project: Project, withSlug?: boolean): string => {
  if (project.type === ProjectType.Artistic) {
    return `/artistic-works/${urlFriendly(project.group)}` + (withSlug ? "/" + project.slug : "");
  } else {
    return `/curated-works/${urlFriendly(project.projectGroup.title)}` + (withSlug ? "/" + project.slug : "");
  }
}
