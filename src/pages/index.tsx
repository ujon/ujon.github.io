import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import GradientBackground from "@site/src/components/GradientBackground";
import { translate } from "@docusaurus/Translate";

import styles from "./index.module.css";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <GradientBackground>
      <Layout
        title={`Hello from ${siteConfig.title}`}
        description="Description will go into a meta tag in <head />"
      >
        <main>
          <HomepageContent />
        </main>
      </Layout>
    </GradientBackground>
  );
}

function HomepageContent() {
  const { siteConfig } = useDocusaurusContext();

  const siteTitle = translate({
    id: "i18n.homepage.title",
    message: "Yoo Jongho",
    description: "The title of the Docusaurus site",
  });

  const siteTagline = translate({
    id: "i18n.homepage.tagline",
    message: "Make it simple",
    description: "subtitle",
  });
  return (
    <div className={styles.contentOverlay}>
      <div className={styles.textCenter}>
        <h1 className={styles.title}>{siteTitle}</h1>
        <p className={styles.subtitle}>{siteTagline}</p>
        {/*<div className="button-container">*/}
        {/*    <button className="button-primary">*/}
        {/*        Get Started*/}
        {/*    </button>*/}
        {/*    <button className="button-secondary">*/}
        {/*        Learn More*/}
        {/*    </button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
