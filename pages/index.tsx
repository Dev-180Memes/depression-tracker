import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <>
      <div className="bg-neutral-900">
        <Head>
          <title>Student Mood Tracker</title>
          <meta name="description" content="Track student depression levels and mood trends" />
        </Head>
        {/* <h1>Welcome to the student mood tracker</h1>
        <p>Log in to track your mood and depression levels</p> */}
        <div className="bg-gradient-to-b from-violet-600/10 via-transparent">
          <Navbar />
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8">
            <div className="flex justify-center">
              <Link href="#login" className="group inline-block bg-white/10 hover:bg-white/10 border border-white/10 p-1 ps-4 rounded-full shadow-md focus:outline-none focus:ring-1 focus:ring-gray-600">
                <p className="me-2 inline-block text-white text-sm">
                  Log in
                </p>
                <span className="group-hover:bg-white/10 py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-white/10 font-semibold text-white text-sm">
                  <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
              </Link>
            </div>

            <div className="max-w-3xl text-center mx-auto">
              <h1 className="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome to the student mood tracker
              </h1>
            </div>

            <div className="max-w-3xl text-center mx-auto">
              <p className="text-lg text-gray-400">
                This is a platform where you can track your mood and depression levels. We make use of various open source tools and a superior algorithm to help you track your mood and depression levels.
              </p>
            </div>

            <div className="text-center">
              <Link href="#login" className="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-1 focus:ring-gray-600 py-3 px-6 focus:ring-offset-gray-800">
                Get Started
                <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-7 pb-7 rounded-xl shadow-sm bg-neutral-900 border-neutral-700" id="login">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-white">Login</h1>
              <p className="mt-2 text-sm text-neutral-400">
                Don&apos;t have an account? Don&apos;t worry, all you have to do is create a new account by inputing a username, email and password
              </p>
            </div>

            <div className="mt-5 flex justify-center items-center">
              <form onSubmit={handleLogin}>
                <div className="grid gap-y-4">
                  {error && <p className="bg-neutral-900 text-red-500">{error}</p>}

                  <div>
                    <label htmlFor="username" className="block text-lg mb-2 text-white">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-700 border-neutral-400 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-lg mb-2 text-white">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-700 border-neutral-400 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-lg mb-2 text-white">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-neutral-700 border-neutral-400 text-neutral-400 placeholder-neutral-500 focus:ring-neutral-600"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home;