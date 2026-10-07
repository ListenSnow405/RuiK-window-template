import styles from './Issue.module.css';

/**
 * 示例页面，整页随你改：版式、配色、字体、动画都可以和主站不一样。
 * 这个文件夹会原样合进主站，规则见模板根目录的 README.md。
 */
export default function Issue() {
  return (
    // 最外层包一个类名，所有样式都写在类名下面，别直接写 h1、body 这类选择器
    <article className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>科协之窗 · 2025-2026学年第一期</p>
        <h1 className={styles.title}>这一期的标题</h1>
        <p className={styles.lead}>一两句话的导语，说清楚这一期讲什么、读完能学到什么。</p>
      </header>

      <div className={styles.body}>
        <section className={styles.section}>
          <h2>第一部分</h2>
          <p>
            正文写在这里。段落不要太宽，一行三四十个字读起来最舒服；手机上（390px
            宽）也要能看，不能出现横向滚动条。
          </p>
        </section>

        <figure className={styles.figure}>
          {/* 图片先传到 COS，再把下面换成 <img src="https://..." alt="图片内容" /> */}
          <div className={styles.imagePlaceholder}>图片位置</div>
          <figcaption>图注写在这里</figcaption>
        </figure>

        <section className={styles.section}>
          <h2>第二部分</h2>
          <p>可以用 antd 的组件，也可以装别的 npm 包，或者全部自己写。</p>
        </section>
      </div>

      <footer className={styles.footer}>
        <p>本期作者：学术部 某某</p>
      </footer>
    </article>
  );
}
