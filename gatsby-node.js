const path = require('path');
const fs = require('fs')

exports.createPages = async (args) => {
  return Promise.all([
    generateMenuPages(args),
    generateProjectPages(args),
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
          content {
            sourceCode {
              json
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


  result.data.allContentfulMenu.nodes.filter(node => node.content).forEach((node) => {
    const url = nameToPath(node.title);
    const component = fs.existsSync(`src/templates/${url}.tsx`) ? path.resolve(`src/templates/${url}.tsx`) : path.resolve(`src/templates/custom-page.tsx`);

    createPage({
      path: url,
      component,
      context: {
        content: node.content.sourceCode.json
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
        slug,
        type,
        project_group {
          title
        }
        content {
          sourceCode {
            json
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

  result.data.allContentfulProject.nodes.filter(node => node.content).filter(node => node.slug).forEach(node => {
    const isArtisticWork = node.type === 'Artistic work';
    const pathPrefix = isArtisticWork ? '/artistic-works/' : '/curated-works/';
    const group = isArtisticWork ? node.group : node.project_group[0].title;

    // Create Project Page
    createPage({
      path: pathPrefix + nameToPath(group) + '/' + node.slug,
      component: projectTemplate,
      context: {
        isArtisticWork,
        content: node.content.sourceCode.json
      }
    });

    // Create Group Page
    createPage({
      path: pathPrefix + nameToPath(group),
      component: isArtisticWork ? artisticPage : curatedPage,
    });
  });
}

function nameToPath(name) {
  return name.replace(/[^a-zA-Z0-9\-/]/g, '-');
}
