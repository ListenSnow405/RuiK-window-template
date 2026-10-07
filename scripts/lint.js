/**
 * pnpm lint：先跑 ESLint（规则见 eslint.config.js），再查 ESLint 管不到的几条：
 * 样式会不会漏到主站、文件大不大、图片地址合进主站后还找不找得到。
 * 后面这几条和主站仓库 apps/web/scripts/window-issues.spec.ts 查的一样，主站改了这里跟着改。
 *
 * 两类检查都跑完再退出，一次列出全部问题，不用改一轮跑一轮。
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ESLint } from 'eslint';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ISSUE_DIR = join(ROOT, 'src/issue');

/** 单个文件的上限。主站服务器带宽小，大图、视频、字体放 COS，用 https 地址引用 */
const MAX_FILE_KB = 200;

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

/**
 * 不以类名开头的选择器。CSS Modules 只给类名加后缀，h1、body、* 这类选择器照样是全局的，
 * 而且这一期的 CSS 加载过就一直留在页面上：读者点回科协之窗，主站的标题也跟着变样。
 * 嵌套在类名规则里的选择器已经被限定在类名下面，@keyframes 里的 from/to 不是选择器，都不算。
 * `.page :global(.katex)` 这种以类名开头的可以，给第三方库的样式套上本期的作用域时要用。
 */
function unscopedSelectors(css) {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const found = [];
  const stack = [];
  let prelude = '';
  for (const char of code) {
    if (char === '{') {
      const text = prelude.trim();
      prelude = '';
      if (text.startsWith('@')) {
        if (/^@(-\w+-)?keyframes\b/.test(text)) stack.push('keyframes');
        else if (/^@(media|supports|container|layer)\b/.test(text)) stack.push('group');
        else stack.push('other');
        continue;
      }
      if (!stack.includes('rule') && !stack.includes('keyframes')) {
        for (const selector of text.split(',')) {
          if (!selector.trim().startsWith('.')) found.push(selector.trim());
        }
      }
      stack.push('rule');
    } else if (char === '}') {
      stack.pop();
      prelude = '';
    } else if (char === ';') {
      prelude = '';
    } else {
      prelude += char;
    }
  }
  return found;
}

const LOCAL_MEDIA =
  /['"`(]\s*(\/[^'"`)\s]*\.(?:png|jpe?g|gif|webp|avif|svg|mp4|webm|woff2?|ttf|otf))/g;

const eslint = new ESLint({ cwd: ROOT });
const results = await eslint.lintFiles(['.']);
const eslintOutput = await (await eslint.loadFormatter('stylish')).format(results);
const eslintFailed = results.some((r) => r.errorCount > 0);
if (eslintOutput) console.log(eslintOutput);

const problems = [];
const files = filesIn(ISSUE_DIR);

if (!files.some((f) => relative(ISSUE_DIR, f) === 'index.tsx')) {
  problems.push('src/issue/index.tsx 不见了：它默认导出的组件就是整个页面');
}

for (const file of files) {
  const name = relative(ROOT, file).replaceAll('\\', '/');
  const kb = statSync(file).size / 1024;

  if (kb > MAX_FILE_KB) {
    problems.push(
      `${name}：${Math.round(kb)} KB，超过 ${MAX_FILE_KB} KB。先压缩；还是太大的话传到 COS，用 https 地址引用`,
    );
  }

  if (file.endsWith('.css')) {
    if (!file.endsWith('.module.css')) {
      problems.push(`${name}：自己写的样式要放在 .module.css 里，普通 .css 会作用到整个主站`);
    } else {
      for (const selector of unscopedSelectors(readFileSync(file, 'utf8'))) {
        problems.push(
          `${name}：选择器「${selector}」没有以类名开头，会作用到整个主站。写成 .page ${selector.replace(/^:global\((.*)\)$/, '$1')} 这样`,
        );
      }
    }
  }

  if (/\.(tsx?|css)$/.test(file)) {
    for (const [, src] of readFileSync(file, 'utf8').matchAll(LOCAL_MEDIA)) {
      problems.push(
        `${name}：${src} 以 / 开头，指向模板的 public/ 文件夹，合进主站后就找不到了。放进 src/issue/ 用 import 引入，或者传到 COS 用 https 地址`,
      );
    }
  }
}

if (problems.length > 0) {
  console.error(`src/issue/ 还有 ${problems.length} 处要改：\n`);
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('');
}

if (eslintFailed || problems.length > 0) process.exit(1);
console.log('检查通过，可以交付');
