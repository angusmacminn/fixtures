import { useState, useEffect } from 'react';
import Head from "next/head";
import Link from 'next/link';
import styles from "@/styles/Home.module.scss";

export default function Fixtures(){
    const [fixtures, setFixtures ] = useState(null)
    const [loading, setLoading ] = useState(true) // Changed from null to true
    const [error, setError] = useState(null);
  
    // fetch fixture data when component mounts
    useEffect(() => {
      const fetchFixtures = async () => {
        try{
          setLoading(true);
          const response = await fetch('/api/hello');
          const result = await response.json();
  
          if(result.success){
            setFixtures(result.data)
          } else {
            setError('failed to fetch fixtures')
          }
        }
        catch (err){
          setError(err.message);
          console.error('Error fetching fixtures:', err);
        }
        finally {
          setLoading(false);
        }
      };
  
      fetchFixtures();
    }, [])

    if (loading) {
        return (
          <div className={styles.container}>
            <main className={styles.main}>
              <h1 className={styles.title}>Loading Fixtures...</h1>
            </main>
          </div>
        );
      }
    
      if (error) {
        return (
          <div className={styles.container}>
            <main className={styles.main}>
              <h1 className={styles.title}>Error</h1>
              <p className={styles.description}>
                Failed to load fixtures: {error}
              </p>
              <Link href="/">← Back to Home</Link>
            </main>
          </div>
        );
      }

      return (
        <>
          <Head>
            <title>Premier League Fixtures - My App</title>
            <meta name="description" content="Premier League fixture rounds and dates" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div className={styles.container}>
            <main className={styles.main}>
              <h1 className={styles.title}>Premier League Fixtures</h1>
              <p className={styles.description}>
                2023 Season Fixture Rounds
              </p>
              
              <Link href="/">← Back to Home</Link>
              
              {fixtures && fixtures.response && (
                <div style={{ marginTop: '2rem', width: '100%' }}>
                  <h2>Available Rounds:</h2>
                  <div style={{ 
                    display: 'grid', 
                    gap: '1rem', 
                    marginTop: '1rem',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                  }}>
                    {fixtures.response.map((roundData, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        backgroundColor: '#f9f9f9'
                      }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
                          {roundData.round}
                        </h3>
                        
                        {/* Display the dates */}
                        {roundData.dates && roundData.dates.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                              Match Dates:
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                              {roundData.dates.map((date, dateIndex) => (
                                <span key={dateIndex} style={{
                                  fontSize: '0.8rem',
                                  backgroundColor: '#e0e0e0',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '3px'
                                }}>
                                  {new Date(date).toLocaleDateString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <Link 
                          href={`/fixtures/${encodeURIComponent(roundData.round)}`}
                          style={{
                            color: '#0070f3',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          View Fixtures →
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Debug information (you can remove this later) */}
              {fixtures && (
                <details style={{ marginTop: '2rem', width: '100%' }}>
                  <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                    Debug: Raw API Response
                  </summary>
                  <pre style={{ 
                    background: '#f4f4f4', 
                    padding: '1rem', 
                    borderRadius: '5px',
                    overflow: 'auto',
                    maxHeight: '300px',
                    fontSize: '0.8rem'
                  }}>
                    {JSON.stringify(fixtures, null, 2)}
                  </pre>
                </details>
              )}
            </main>
          </div>
        </>
      );
}

