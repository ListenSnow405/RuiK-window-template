import { ArrowLeftOutlined } from '@ant-design/icons';

import styles from './BackButton.module.css';

/**
 * 主站会在每一期的左上角固定一个"科协之窗"返回按钮，这里画一个一样的，
 * 设计时给它留出位置，别把标题、按钮放在它底下。合进主站时不用带这个文件。
 */
export default function BackButton() {
  return (
    <a href="#" className={styles.back} onClick={(e) => e.preventDefault()}>
      <ArrowLeftOutlined aria-hidden />
      科协之窗
    </a>
  );
}
