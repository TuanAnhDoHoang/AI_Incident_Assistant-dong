// ===== Footer Component =====
import styles from './Footer.module.css';

interface FooterProps {
  withSidebarOffset?: boolean;
}

export default function Footer({ withSidebarOffset = false }: FooterProps) {
  return (
    <footer className={styles.footer} style={withSidebarOffset ? { marginLeft: 256 } : undefined}>
      <div className={styles.footerInner}>
        <div className={styles.brand}>
          <span className={styles.brandName}>IncidentX</span>
          <span className={styles.copyright}>© 2024 IncidentX. Built for high-stakes reliability.</span>
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>Privacy</a>
          <a href="#" className={styles.link}>Terms</a>
          <a href="#" className={styles.link}>Security</a>
          <a href="#" className={`${styles.link} ${styles.linkActive}`}>Status</a>
        </div>
      </div>
    </footer>
  );
}
