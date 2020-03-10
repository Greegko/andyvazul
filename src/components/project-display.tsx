import * as React from 'react';
import { Link } from 'gatsby';
import { urlFriendly } from '../utils';
import { ProjectType, Project } from '../queries';

type ProjectDisplayProperties = Project & {
  groupSlug: string;
  group: string;
  noCaption: boolean
};

import './project-display.css';
export const ProjectDisplay = ({ imageUrl, title, groupSlug, group, slug, type, noCaption }: ProjectDisplayProperties) => {
  const groupTypeSlug = type === ProjectType.Artistic ? 'artistic-works' : 'curated-works';

  return (
    <Link className="project" to={"/" + groupTypeSlug + "/" + urlFriendly(groupSlug) + '/' + slug}>
      <div>
        <img src={imageUrl} />
      </div>
      {!noCaption && <div>
        <span className="project-group">{group}</span>
        <span className="project-title">{title}</span>
      </div>}
    </Link>
  );
};