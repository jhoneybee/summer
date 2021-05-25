module.exports = {
    title: 'Summer UI',
    tagline: '立志打造企业级产品组件库，创造高效愉悦的工作体验',
    url: 'https://github.com/jhoneybee/summer',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'Free Kits',
    projectName: 'summer-ui',
    themes: ['@summer/docusaurus-theme-live-codeblock'],
    themeConfig: {
        navbar: {
            title: 'Summer UI',
            logo: {
                alt: 'Summer UI',
                src: 'img/logo.svg',
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: '组件文档',
                    position: 'left',
                },
                { to: 'blog', label: '博客信息', position: 'left' },
                {
                    href: 'https://github.com/jhoneybee/summer',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [],
            copyright: `Copyright © ${new Date().getFullYear()} Project, Inc. Built with zhangj.`,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/facebook/docusaurus/edit/master/website/',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/facebook/docusaurus/edit/master/website/blog/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
