import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";

const Home: NextPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("/api/auth/login", {
        username,
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.token);
        router.push("/dashboard");
      } else {
        setError("Please check your credentials and try again.")
      }

    } catch (error: any) {
      // console.error("An error occurred: ", error);
      setError(error.response.data.error);
    }
  }

  return (
    <div>
      <Head>
        <title>Student Mood Tracker</title>
        <meta name="description" content="Track student depression levels and mood trends" />
      </Head>

      <main>
        <h1>Welcome to the student mood tracker</h1>
        <p>Log in to track your mood and depression levels</p>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </main>
    </div>
  )
}

export default Home;