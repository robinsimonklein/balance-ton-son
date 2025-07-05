// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default withNuxt(eslintPluginPrettierRecommended, {
  rules: {
    '@typescript-eslint/ban-ts-comment': ['off'],
    'vue/multi-word-component-names': ['off'],
    'vue/no-v-html': ['off'],
  },
});
