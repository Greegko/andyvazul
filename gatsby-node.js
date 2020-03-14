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
      allContentfulMenu {
        nodes {
          title,
          order,
          page {
            slug
            content {
              childMarkdownRemark {
                htmlAst
              }
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


  result.data.allContentfulMenu.nodes.filter(node => node.page).forEach((node) => {
    const url = nameToPath(node.page.slug);
    const component = fs.existsSync(`src/templates/${url}.tsx`) ? path.resolve(`src/templates/${url}.tsx`) : path.resolve(`src/templates/custom-page.tsx`);

    createPage({
      path: url,
      component,
      context: {
        content: node.page.content.childMarkdownRemark.htmlAst
      }
    })
  });
}

async function generateProjectPages({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(`
  query {
    allContentfulProject {
      nodes {
        group,
        type,
        project_group {
          title
        }
        page {
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


  const artisticPage = path.resolve(`src/pages/artistic-works.tsx`);
  const curatedPage = path.resolve(`src/pages/curated-works.tsx`);
  const projectTemplate = path.resolve(`src/templates/project.tsx`);

  result.data.allContentfulProject.nodes.filter(node => node.page).forEach(node => {
    const isArtisticWork = node.type === 'Artistic work';
    const pathPrefix = isArtisticWork ? '/artistic-works/' : '/curated-works/';
    const group = isArtisticWork ? node.group : node.project_group[0].title;

    // Create Project Page
    createPage({
      path: pathPrefix + nameToPath(group) + node.page.slug,
      component: projectTemplate,
      context: {
        isArtisticWork,
        content: node.page.content.childMarkdownRemark.htmlAst
      }
    });

    // Create Group Page
    createPage({
      path: pathPrefix + nameToPath(group),
      component: isArtisticWork ? artisticPage : curatedPage,
    });
  });
}

async function generateIndexPage({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(
    `
    {
      contentfulPage(slug: {eq: "/"}) {
        title
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

  const url = nameToPath(node.slug);
  const component = fs.existsSync(`src/templates/${url}.tsx`) ? path.resolve(`src/templates/${url}.tsx`) : path.resolve(`src/templates/custom-page.tsx`);

  createPage({
    path: url,
    component,
    context: {
      content: node.content.childMarkdownRemark.htmlAst
    }
  })
}

function nameToPath(name) {
  return name.replace(/[^a-zA-Z0-9\-/]/g, '-');
}
