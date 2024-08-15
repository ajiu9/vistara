import { defineConfig } from 'vitepress'
import consola from 'consola'
import type { UserConfig } from 'vitepress'

consola.debug(`DOC_ENV: ${process.env.DOC_ENV}`)

const config: UserConfig = {
  title: "Vistara",
  description: "A Components library",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ajiu9/vistara' }
    ]
  }
}

export default config
