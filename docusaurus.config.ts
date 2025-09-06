import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'ujon',
    tagline: '',
    favicon: 'img/favicon.ico',

    future: {
        v4: true, // Improve compatibility with the upcoming Docusaurus v4
    },

    url: 'https://ujon.github.io',
    baseUrl: '/',
    organizationName: 'ujon',
    projectName: 'ujon.github.io',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'ko'],
        localeConfigs: {
            en: {label: 'English'},
            ko: {label: '한국어'}
        }
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true,
                    },
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],
    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            logo: {
                alt: 'ujon',
                src: 'img/logo.svg',
                srcDark: 'img/logo-dark.svg',
            },
            items: [
                {to: '/blog', label: 'Blog', position: 'left'},
                {
                    type: 'docSidebar',
                    sidebarId: 'memo',
                    position: 'left',
                    label: 'Memo',
                },
                {type: "localeDropdown", position: "right",},
                {
                    href: 'https://github.com/ujon',
                    position: 'right',
                    className: 'header-github-link',
                    'aria-label': 'GitHub repository',
                },
            ],
        },
        footer: {
            copyright: `Copyright © ${new Date().getFullYear()} UJON, All Rights Reserved.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
