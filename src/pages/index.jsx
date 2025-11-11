import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import {useState, useEffect} from 'react';
import Link from "next/link";

export default function Home() {

  return (
    <>
      <Head>
        <title>Fixtures</title>
        <meta name="description" content="My Next.js application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
        <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Fixtures</h1>
          <p className={styles.description}>
          Football match visualizations. 
          </p>

          <Link href="/game">
          Arsenal vs Manchester United
          </Link>
        </div>
        </main>
    </>
  );
}
