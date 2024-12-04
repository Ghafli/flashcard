/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ghafli.github.io/flashcard',
  generateRobotsTxt: true,
  outDir: 'out',
  generateIndexSitemap: false,
  exclude: ['/api/*', '/auth/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/auth']
      }
    ]
  }
}
