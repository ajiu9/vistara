import consola from 'consola'
import type { UserConfig } from 'vitepress'
import { languages } from '../utils/lang'
import { head } from './head'


consola.debug(`DOC_ENV: ${process.env.DOC_ENV}`)

const nav = [
  { text: 'Guide', link: '/guide/introduction' },
]


const locales = {}
languages.forEach((lang) => {
  locales[`/${lang}`] = {
    label: lang,
    lang,
  }
})

const config: UserConfig = {
  title: "Vistara",
  description: "A Components library",
  lastUpdated: true,
  head,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    sidebar: [
      // {
      //   text: 'Examples',
      //   items: [
      //     { text: 'Markdown Examples', link: '/markdown-examples' },
      //     { text: 'Runtime API Examples', link: '/api-examples' }
      //   ]
      // }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/ajiu9/vistara' }
    ]
  },
  vue: {}
}

console.log(config)

export default config
