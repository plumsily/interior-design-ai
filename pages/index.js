import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoaded(false);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: input }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result.split(" BREAK "));
      setIsLoaded(true);
      setInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Interior Design Styles</title>
        <link rel="icon" href="/house.png" />
      </Head>

      <main className={styles.main}>
        <img src="/house.png" className={styles.icon} />
        <h3>Find my interior design style</h3>
        <span className={styles.description}>
          Use AI to determine and explain various interior design styles for
          you. You can use these keywords to research and further tailor the
          style to your needs.
        </span>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="style"
            placeholder="Enter the most desirable quality you want out of your space."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="submit" value="Generate styles" />
        </form>
        <div className={styles.result}>
          {isLoaded ? (
            <ul>
              {result.map((data, index) => {
                return <li key={index}>{data}</li>;
              })}
            </ul>
          ) : (
            <img src="/loading-gif.gif" className={styles.loading}></img>
          )}
          {/* <ul>
            {result.map((data, index) => {
              return <li key={index}>{data}</li>;
            })}
          </ul> */}
        </div>
      </main>
    </div>
  );
}
