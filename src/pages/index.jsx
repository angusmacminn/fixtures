import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import {useState, useEffect} from 'react';

export default function Home() {

  


  return (
    <>
      <Head>
        <title>My App</title>
        <meta name="description" content="My Next.js application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Fixtures</h1>
          <p className={styles.description}>
          Football match visualizations. 
          </p>
        </main>
      </div>
    </>
  );
}
