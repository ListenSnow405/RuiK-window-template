import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * 和主站仓库 eslint.config.mjs 里"科协之窗每期的页面"那一组规则一样，主站改了这里跟着改。
 * 本地过了，合进主站时也会过。
 *
 * 你的页面和主站在同一个网站下运行，读者的登录信息存在浏览器存储里，所以不能碰；
 * 主站自己的代码（接口封装）会自动带上读者的登录信息，所以不能引用。
 */
const BLOCKED_APIS = ['localStorage', 'sessionStorage', 'eval'];
const BLOCKED_MESSAGE = '每期的页面不读写浏览器存储（里面有读者的登录信息），不用 eval';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  // 只管 src/issue/：这个文件夹会原样合进主站，外面的预览外壳不会
  {
    files: ['src/issue/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: String.raw`^(\.\./|/|src/)`,
              message:
                '只能引用 npm 包和 src/issue/ 里的文件。合进主站后，文件夹外面的东西都不存在',
            },
            {
              regex: String.raw`^\./.*(?<!\.module)\.css$`,
              message: '自己写的样式放在 .module.css 里，普通 .css 会作用到整个主站',
            },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        ...BLOCKED_APIS.map((name) => ({ name, message: BLOCKED_MESSAGE })),
      ],
      'no-restricted-properties': [
        'error',
        ...['window', 'globalThis', 'self'].flatMap((object) =>
          BLOCKED_APIS.map((property) => ({ object, property, message: BLOCKED_MESSAGE })),
        ),
        { object: 'document', property: 'cookie', message: '每期的页面不读写 cookie' },
      ],
      'no-new-func': 'error',
    },
  },
);
