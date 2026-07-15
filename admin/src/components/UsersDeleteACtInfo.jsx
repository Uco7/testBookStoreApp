import React from "react";

/**
 * Account Deletion — "Reading Room" edition (companion to the Privacy Policy page).
 *
 * Same book/ledger language as the Privacy Policy: a spine on the left,
 * a page on the right, serif reading type. Content here is genuinely a
 * procedure, so real numbered steps are used (not decorative numbering).
 * Fully responsive: the spine collapses into a top bar under 720px.
 */

const STEPS = [
  { n: 1, title: "Open BookStoreApp", body: "Launch the app on your device." },
  { n: 2, title: "Sign in", body: "Log in with the account you want to remove." },
  { n: 3, title: "Go to Settings", body: "From your profile or home screen, open the Settings menu." },
  { n: 4, title: "Tap Delete Account", body: "You'll find this option under Account settings." },
  { n: 5, title: "Confirm the deletion", body: "Review the warning and confirm to permanently delete your account." },
];

export default function UsersDeleteAccountInfo() {
  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Source+Serif+4:wght@400;600&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        @media (prefers-reduced-motion: reduce) {
          * { scroll-behavior: auto !important; transition: none !important; }
        }

        .ad-scroll { scroll-behavior: smooth; }
        .ad-scroll::-webkit-scrollbar { width: 8px; }
        .ad-scroll::-webkit-scrollbar-thumb { background: #C8B99C; border-radius: 4px; }
        .ad-scroll::-webkit-scrollbar-track { background: transparent; }

        .ad-link:focus-visible,
        .ad-step:focus-visible {
          outline: 2px solid #B08D57;
          outline-offset: 3px;
        }

        .ad-dropcap::first-letter {
          font-family: 'Fraunces', serif;
          font-size: 3.2rem;
          font-weight: 600;
          float: left;
          line-height: 0.8;
          padding-right: 0.35rem;
          padding-top: 0.1rem;
          color: #6B4226;
        }

        .ad-book {
          width: 100%;
          max-width: 980px;
          min-height: min(720px, 90vh);
          display: flex;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 30px 60px -20px rgba(43,38,32,0.35), 0 2px 0 rgba(255,255,255,0.4) inset;
          background: #FBF7EE;
        }

        .ad-spine {
          width: 240px;
          min-width: 240px;
          background: linear-gradient(160deg, #4A3221 0%, #5C3D26 55%, #4A3221 100%);
          color: #EDE3D0;
          padding: 32px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .ad-page-body {
          flex: 1;
          overflow-y: auto;
          background: #FBF7EE;
          background-image: radial-gradient(rgba(107,66,38,0.05) 1px, transparent 1px);
          background-size: 18px 18px;
        }

        .ad-page-inner {
          padding: 48px 56px 64px;
          max-width: 620px;
        }

        .ad-steps {
          counter-reset: step;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .ad-step {
          display: flex;
          gap: 18px;
          padding: 18px 0;
          border-top: 1px solid rgba(107,66,38,0.12);
        }
        .ad-step:first-child { border-top: none; }

        .ad-step-num {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 20px;
          color: #B08D57;
          width: 30px;
          flex-shrink: 0;
          line-height: 1.4;
        }

        .ad-warning {
          background: #F5EBE0;
          border: 1px solid #DCC9A8;
          border-left: 3px solid #A15C38;
          border-radius: 4px;
          padding: 18px 20px;
        }

        /* Responsive: collapse the spine into a top bar under 720px */
        @media (max-width: 720px) {
          .ad-page-wrap { padding: 0 !important; align-items: stretch !important; }
          .ad-book {
            flex-direction: column;
            max-width: 100%;
            min-height: 100vh;
            border-radius: 0;
            box-shadow: none;
          }
          .ad-spine {
            width: 100%;
            min-width: 0;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 20px 20px;
            gap: 12px;
          }
          .ad-spine-top { display: flex; align-items: center; gap: 10px; }
          .ad-spine-footer { display: none; }
          .ad-page-inner {
            padding: 32px 22px 48px;
            max-width: 100%;
          }
          .ad-page-title { font-size: 28px !important; }
        }

        @media (max-width: 420px) {
          .ad-page-inner { padding: 26px 16px 40px; }
          .ad-step { gap: 12px; }
        }
      `}</style>

      <div className="ad-page-wrap" style={styles.pageWrap}>
        <div className="ad-book">
          {/* SPINE */}
          <aside className="ad-spine">
            <div className="ad-spine-top">
              <span style={styles.spineMark}>📖</span>
              <div>
                <h1 style={styles.spineTitle}>Account Deletion</h1>
                <p style={styles.spineSubtitle}>BookStoreApp · Reader Agreement</p>
              </div>
            </div>
            <p className="ad-spine-footer" style={styles.spineFooter}>
              Questions? <br />
              bookstore.feedback.email@gmail.com
            </p>
          </aside>

          {/* PAGE */}
          <main className="ad-scroll ad-page-body">
            <div className="ad-page-inner">
              <header style={styles.pageHeader}>
                <p style={styles.eyebrow}>BookStoreApp · Account Deletion</p>
                <h2 className="ad-page-title" style={styles.pageTitle}>
                  How to Delete Your Account
                </h2>
                <p className="ad-dropcap" style={styles.pageIntro}>
                  Users can permanently delete their account directly within BookStoreApp by navigating to Settings → Account → Delete Account. 
                  Once confirmed, your account and associated personal data will be permanently deleted. This action cannot be undone.
                </p>
              </header>

              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>Steps</h3>
                <ol className="ad-steps">
                  {STEPS.map((s) => (
                    <li key={s.n} className="ad-step" tabIndex={0}>
                      <span className="ad-step-num">{s.n}</span>
                      <div>
                        <p style={styles.stepTitle}>{s.title}</p>
                        <p style={styles.stepBody}>{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section style={styles.section}>
                <div className="ad-warning">
                  <p style={styles.warningText}>
                    Deleting your account permanently removes your library,
                    timetable, and profile information. This cannot be reversed.
                  </p>
                </div>
              </section>

              <section style={styles.section}>
                <h3 style={styles.sectionTitle}>Need help?</h3>
                <p style={styles.sectionBody}>
                  If you run into any trouble deleting your account, write to
                  us at{" "}
                  <a
                    className="ad-link"
                    href="mailto:ucnodemailler@gmail.com"
                    style={styles.link}
                  >
                    ucnodemailler@gmail.com
                  </a>{" "}
                  and we'll help you complete the process.
                </p>
              </section>

              <footer style={styles.pageFooter}>
                <div style={styles.footerRule} />
                <p style={styles.footerText}>Thank you for reading to the last page.</p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#EDE3D0",
    display: "flex",
    fontFamily: "'Inter', sans-serif",
  },
  pageWrap: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 16px",
  },
  spineMark: { fontSize: "22px" },
  spineTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: 1.15,
    margin: 0,
    color: "#F6EEDD",
  },
  spineSubtitle: {
    fontSize: "12px",
    color: "#C8B99C",
    margin: "4px 0 0",
    letterSpacing: "0.02em",
  },
  spineFooter: {
    fontSize: "11px",
    color: "#B7A582",
    lineHeight: 1.5,
    marginTop: "20px",
    borderTop: "1px solid rgba(237,227,208,0.15)",
    paddingTop: "14px",
  },
  pageHeader: {
    marginBottom: "36px",
  },
  eyebrow: {
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#B08D57",
    fontWeight: 600,
    margin: "0 0 10px",
  },
  pageTitle: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontWeight: 600,
    fontSize: "34px",
    color: "#2B2620",
    margin: "0 0 14px",
    lineHeight: 1.15,
  },
  pageIntro: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "15px",
    color: "#6B6255",
    lineHeight: 1.7,
    margin: 0,
  },
  section: {
    marginBottom: "34px",
  },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 600,
    fontSize: "18px",
    color: "#2B2620",
    margin: "0 0 6px",
  },
  sectionBody: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "15px",
    lineHeight: 1.75,
    color: "#413A2E",
    margin: 0,
  },
  stepTitle: {
    fontFamily: "'Source Serif 4', serif",
    fontWeight: 600,
    fontSize: "15.5px",
    color: "#2B2620",
    margin: "0 0 4px",
  },
  stepBody: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "14.5px",
    lineHeight: 1.6,
    color: "#6B6255",
    margin: 0,
  },
  warningText: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: "14px",
    lineHeight: 1.65,
    color: "#5C3D26",
    margin: 0,
  },
  link: {
    color: "#A15C38",
    fontWeight: 600,
    textDecoration: "underline",
  },
  pageFooter: {
    marginTop: "48px",
  },
  footerRule: {
    height: "1px",
    background: "linear-gradient(to right, transparent, #C8B99C, transparent)",
    marginBottom: "16px",
  },
  footerText: {
    fontFamily: "'Fraunces', serif",
    fontStyle: "italic",
    fontSize: "13px",
    color: "#8C7A5C",
    textAlign: "center",
    margin: 0,
  },
};