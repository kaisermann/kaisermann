import eslintPluginAstro from 'eslint-plugin-astro'
import eslintPluginPrettier from 'eslint-plugin-prettier'

export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginPrettier.configs.recommended,
  {
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
]
