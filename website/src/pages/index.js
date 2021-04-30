import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

const features = [
    {
        title: '开箱即用',
        imageUrl: 'img/undraw_docusaurus_mountain.svg',
        description: (
            <>
                用于快速建立和运行您的网站, 依赖明确无繁琐的的配置信息
            </>
        ),
    },
    {
        title: '高性能',
        imageUrl: 'img/undraw_docusaurus_tree.svg',
        description: (
            <>
                专注于组件的性能,在大数据的情况下也能处理的游刃有余.
            </>
        ),
    },
    {
        title: 'MIT开源协议',
        imageUrl: 'img/undraw_docusaurus_react.svg',
        description: (
            <>
                基于github 开发, 采用MIT 开源协议.
            </>
        ),
    },
];

function Feature({ imageUrl, title, description }) {
    const imgUrl = useBaseUrl(imageUrl);
    return (
        <div className={clsx('col col--4', styles.feature)}>
            {imgUrl && (
                <div className="text--center">
                    <img className={styles.featureImage} src={imgUrl} alt={title} />
                </div>
            )}
            <h3 style={{ textAlign: 'center' }}>{title}</h3>
            <p style={{ textAlign: 'center' }}>{description}</p>
        </div>
    );
}

function Home() {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <header className={clsx('hero hero--primary', styles.heroBanner)}>
                <div className="container">
                    <h1 className="hero__title">{siteConfig.title}</h1>
                    <p className="hero__subtitle">{siteConfig.tagline}</p>
                    <div className={styles.buttons}>
                        <Link
                            className={clsx(
                                'button button--outline button--secondary button--lg',
                                styles.getStarted,
                            )}
                            to={useBaseUrl('docs/')}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <Feature key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
}

export default Home;
