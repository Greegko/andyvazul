const path = require('path');
const fs = require('fs')

exports.createPages = async (args) => {
  return Promise.all([
    generateMenuPages(args),
    generateProjectPages(args),
    generateIndexPage(args)
  ]);
}

async function generateMenuPages({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(
    `
    {
      allContentfulPage {
        nodes {
          title
          description
          slug
          content {
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return
  }


  result.data.allContentfulPage.nodes.forEach(node => {
    const url = nameToPath(addSlash(node.slug));
    const component = fs.existsSync(`src/templates/${url}.tsx`) ? path.resolve(`src/templates/${url}.tsx`) : path.resolve(`src/templates/custom-page.tsx`);

    createPage({
      path: url,
      matchPath: url + '/*',
      component,
      context: {
        title: node.title,
        description: node.description,
        content: node.content.childMarkdownRemark.htmlAst
      }
    })
  });
}

async function generateProjectPages({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(`
  query {
    allContentfulProject {
      nodes {
        id
        group,
        type,
        project_group {
          title
        }
        page {
          title,
          description
          slug
          content {
            childMarkdownRemark {
              htmlAst
            }
          }
        }
      }
    }
  }`
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return
  }

  const projectTemplate = path.resolve(`src/templates/project.tsx`);
  result.data.allContentfulProject.nodes.filter(node => node.page).forEach(node => {
    const isArtisticWork = node.type === 'Artistic work';
    const pathPrefix = isArtisticWork ? '/artistic-works/' : '/curated-works/';
    const group = isArtisticWork ? node.group : node.project_group[0].title;

    // Create Project Page
    createPage({
      path: pathPrefix + nameToPath(group) + addSlash(node.page.slug),
      component: projectTemplate,
      context: {
        id: node.id,
        projectType: isArtisticWork ? 0 : 1,
        title: node.page.title,
        description: node.page.description,
        content: node.page.content.childMarkdownRemark.htmlAst
      }
    });
  });
}

async function generateIndexPage({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(
    `
    {
      contentfulPage(slug: {eq: "/"}) {
        title
        description
        slug
        content {
          childMarkdownRemark {
            htmlAst
          }
        }
      }
    }
    `
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return
  }

  const node = result.data.contentfulPage;

  const url = nameToPath(addSlash(node.slug));
  const component = path.resolve(`src/templates/custom-page.tsx`);

  createPage({
    path: url,
    component,
    context: {
      title: node.title,
      description: node.description,
      content: node.content.childMarkdownRemark.htmlAst
    }
  })
}

function nameToPath(path) {
  return path
    .toString()
    .toLowerCase()
    .replace(/[^\w]/g, '-')
    .replace(/(\w)\W+$/, "\$1")
    .replace(/^\W+(\w)/, "\$1");;
}

function addSlash(path) {
  return (path[0] !== '/') ? '/' + path : path;
}
