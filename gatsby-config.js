module.exports = {
  siteMetadata: {
    title: `Gatsby Default Starter`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sass`,
    "gatsby-plugin-image",
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`roboto:400,700`],
        display: "swap",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: ["gatsby-remark-component"],
      },
    },
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: `0twrrzkpeklw`,
        accessToken: `BR7WT-9gBL6YY3sWG14XCYMytK46qVxXkP6kiKhtxrA`,
        host: `cdn.contentful.com`,
      },
    },
  ],
}
