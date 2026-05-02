// ===== Introduce (Landing) Page =====
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';
import { mockTeamMembers } from '../../data/mockData';
import styles from './IntroducePage.module.css';

export default function IntroducePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* ── NavBar ── */}
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>IncidentX</span>
          <div className={styles.navLinks}>
            <a href="#how" className={styles.navLink}>Developers</a>
            <a href="#features" className={styles.navLink}>Solutions</a>
            <a href="#hackathon" className={styles.navLink}>Pricing</a>
          </div>
        </div>
        <div className={styles.navRight}>
          <button id="nav-signin" className={styles.signInBtn} onClick={() => navigate('/signin')}>Sign In</button>
          <button id="nav-getstarted" className={styles.getStartedBtn} onClick={() => navigate('/signin')}>Get Started</button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroGradient} />
        <div className={styles.heroGrid}>
          <div className={`${styles.heroContent} animate-fade-in-up`}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              NOW IN PRIVATE BETA
            </div>
            <h1 className={styles.heroTitle}>
              Reliability for <span className={styles.heroAccent}>High-Stakes</span> Digital Infrastructure
            </h1>
            <p className={styles.heroDesc}>
              Automate incident response, visualize complex system dependencies, and resolve critical outages before they impact your customers. Built for modern DevOps at scale.
            </p>
            <div className={styles.heroBtns}>
              <button id="hero-getstarted" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`} onClick={() => navigate('/signin')}>
                Get Started
              </button>
              <button className={`${styles.heroBtn} ${styles.heroBtnOutline}`}>
                Watch Demo
              </button>
            </div>
          </div>

          <div className={`${styles.heroImage} animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            <div className={`${styles.heroImageCard} glass-card`}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOxhOfdPfE4PZS_NmYfzIgUNwkPjv7kh5_OCYDg4_HqVo_YaIlOO-psKXa_M-cJNrIeqYHXPWEYPST3bPxMup1TPctZK2NE3PssKile9kp_9HCtQS6LtAfHxE6bwSmUDMp9aMTiJQHwxYjmoQR4xQFmyA1-yvbR1X9P5e3lb_59mVEyeDHvj6bDkqC0gqzicY6DOpNOBXDyki0x1wUpTqfNHtnuJmkBkH67N5sm_WRGqP5yiv-abjnhjO6NGiFs7febVv1-LYlxwe3"
                alt="IncidentX Dashboard"
              />
            </div>
            <div className={`${styles.heroIncidentBadge} glass-card`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-error)' }}>emergency_share</span>
                <div>
                  <p>CRITICAL INCIDENT</p>
                  <p>Database Latency +240%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className={styles.howItWorks}>
        <div className={styles.sectionCenter}>
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionDesc}>
            IncidentX bridges the gap between monitoring and resolution with an autonomous orchestration engine.
          </p>
        </div>
        <div className={styles.stepsGrid}>
          {[
            { icon: 'hub', title: 'Ingest', desc: 'Connect your entire stack—AWS, Kubernetes, Datadog—in minutes. We unify disparate signals into a single source of truth.' },
            { icon: 'query_stats', title: 'Analyze', desc: 'Our AI engine correlates thousands of events to identify the root cause, filtering out the noise that slows teams down.' },
            { icon: 'auto_fix_high', title: 'Resolve', desc: 'Trigger automated runbooks or collaborate in real-time within our high-density command console.' },
          ].map((step, i) => (
            <div key={i} className={`${styles.stepCard} glass-card`} style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={styles.stepIcon}>
                <span className="material-symbols-outlined">{step.icon}</span>
              </div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={styles.features}>
        <div className={styles.featuresInner}>
          <div className={styles.featuresLeft}>
            <div>
              <h2 className={styles.sectionTitle}>Built for High-Stakes Reliability</h2>
              <p className={styles.sectionDesc}>Precision engineering for the world's most demanding environments.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {[
                { icon: 'security', title: 'Zero-Trust Compliance', desc: 'SOC2 Type II and HIPAA compliant from day one, with end-to-end encryption for all incident logs.' },
                { icon: 'speed', title: 'Sub-Second Latency', desc: 'Real-time updates delivered via global edge network. Your team stays in sync, even during global outages.' },
                { icon: 'terminal', title: 'Advanced CLI Tooling', desc: 'Manage incidents without leaving your terminal. Our Go-based CLI is designed for developer speed.' },
              ].map((feat, i) => (
                <div key={i} className={styles.featureItem}>
                  <span className={`material-symbols-outlined ${styles.featureIcon}`} style={{ fontVariationSettings: "'FILL' 1" }}>{feat.icon}</span>
                  <div>
                    <h4 className={styles.featureTitle}>{feat.title}</h4>
                    <p className={styles.featureDesc}>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.featuresRight}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 32 }}>
              {[{ icon: 'groups', label: 'Collaborate' }, { icon: 'history', label: 'Audit' }].map((b, i) => (
                <div key={i} className={`${styles.featureBox} glass-card`}>
                  <span className="material-symbols-outlined">{b.icon}</span>
                  <span className={styles.featureBoxLabel}>{b.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ icon: 'settings_suggest', label: 'Automate' }, { icon: 'monitoring', label: 'Monitor' }].map((b, i) => (
                <div key={i} className={`${styles.featureBox} glass-card`}>
                  <span className="material-symbols-outlined">{b.icon}</span>
                  <span className={styles.featureBoxLabel}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className={styles.team}>
        <div className={styles.sectionCenter}>
          <h2 className={styles.sectionTitle}>Engineered by Experts</h2>
          <p className={styles.sectionDesc}>Our team comes from the frontlines of SRE and Infrastructure engineering at top-tier tech firms.</p>
        </div>
        <div className={styles.teamGrid}>
          {mockTeamMembers.map((member) => (
            <div key={member.id} className={styles.teamCard}>
              <div className={`${styles.teamImageWrap} glass-card`}>
                <img src={member.avatar} alt={member.name} />
              </div>
              <h4 className={styles.teamName}>{member.name}</h4>
              <p className={styles.teamRole}>{member.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hackathon ── */}
      <section id="hackathon" className={styles.hackathon}>
        <div className={styles.hackathonGlow1} />
        <div className={styles.hackathonGlow2} />
        <div className={`${styles.hackathonCard} glass-card`}>
          <div className={styles.hackathonInner}>
            <div style={{ flex: 1 }}>
              <p className={styles.hackathonLabel}>DEMO ONLY</p>
              <h2 className={styles.hackathonTitle}>Hackathon Goal</h2>
              <p className={styles.hackathonDesc}>
                IncidentX is our entry for the 2024 Reliability Engineering Hackathon. Our goal is to demonstrate that complex system visualization doesn't have to be a mess of wires. By combining real-time topology with predictive analytics, we're aiming to reduce Mean Time to Recovery (MTTR) by 60%.
              </p>
              <div className={styles.hackathonStats}>
                <div className={styles.hackathonStat}>
                  <p className={styles.hackathonStatNum}>48</p>
                  <p className={styles.hackathonStatLabel}>HOURS OF CODE</p>
                </div>
                <div className={styles.hackathonDivider} />
                <div className={styles.hackathonStat}>
                  <p className={styles.hackathonStatNum}>12</p>
                  <p className={styles.hackathonStatLabel}>INTEGRATIONS</p>
                </div>
                <div className={styles.hackathonDivider} />
                <div className={styles.hackathonStat}>
                  <p className={styles.hackathonStatNum}>0</p>
                  <p className={styles.hackathonStatLabel}>DOWNTIME</p>
                </div>
              </div>
            </div>
            <div className={`${styles.hackathonTrophy} glass-card`}>
              <span className="material-symbols-outlined">trophy</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
