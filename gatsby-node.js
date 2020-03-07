const path = require('path');
const fs = require('fs')

exports.createPages = async (args) => {
  return Promise.all([
    generateMenuPages(args),
    generateProjectPages(args),
    generateProjectGroupPages(args)
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


  const projectTemplate = path.resolve(`src/templates/project.tsx`);
  result.data.allContentfulProject.nodes.filter(node => node.content).filter(node => node.slug).forEach((node) => {
    const isArtisticWork = node.group !== null;
    const pathPrefix = isArtisticWork ? '/artistic-works/' : '/curated-works/';
    createPage({
      path: pathPrefix + nameToPath(node.group) + '/' + node.slug,
      component: projectTemplate,
      context: {
        isArtisticWork,
        content: node.content.sourceCode.json
      }
    })
  });
}

async function generateProjectGroupPages({ graphql, actions: { createPage }, reporter }) {
  const result = await graphql(`
  query {
    allContentfulProject {
      nodes {
        group
      }
    }
  }`
  );

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return
  }

  const artisticPage = path.resolve(`src/pages/artistic-works.tsx`);
  result.data.allContentfulProject.nodes.filter(node => node.group).forEach((node) => {
    createPage({
      path: "/artistic-works/" + nameToPath(node.group),
      component: artisticPage
    })
  });
}

function nameToPath(name) {
  return name.replace(/[^a-zA-Z0-9\-/]/g, '-');
}
