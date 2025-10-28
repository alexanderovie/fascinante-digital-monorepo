"use client";
import { supabase } from "@/app/supabase/supabaseClient";
import Loader from "@/components/CommonComponents/Loader";
import Logo from "@/components/Layout/Header/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialSignIn from "../SocialSignIn";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // removed unused error message state to satisfy ESLint

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // reset errors
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data:
          { full_name: username },
      },
    });

    if (!error) {
      router.push("/sign-in");
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="relative w-full pt-32 sm:pt-60 pb-16 sm:pb-28 flex items-center justify-center dark:bg-dark-gray">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative mx-auto max-w-lg overflow-hidden rounded-md bg-offwhite-warm dark:bg-secondary px-6 py-12 text-center sm:px-12 md:px-16">
                <div className="mb-10 flex justify-center">
                  <Logo />
                </div>

                <SocialSignIn actionText="Sign Up" />

                <span className="z-1 relative my-8 block text-center">
                  <span className="-z-1 absolute left-0 top-1/2 block h-px w-full bg-sand-light dark:bg-natural-gray/30"></span>
                  <span className="text-sm text-secondary/50 dark:text-white/40 relative z-10 inline-block bg-offwhite-warm dark:bg-secondary px-3">
                    OR
                  </span>
                </span>

                <form onSubmit={handleSignup}>
                  <div className="mb-4 text-left">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`input-field`}
                    />
                  </div>
                  <div className="mb-4 text-left">
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`input-field`}
                    />
                  </div>
                  <div className="mb-4 text-left">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`input-field`}
                    />
                  </div>
                  <div className="mb-8">
                    <button
                      type="submit"
                      className="flex w-full px-5 py-3 font-medium cursor-pointer items-center justify-center transition duration-300 ease-in-out rounded-md bg-secondary dark:bg-white/25 text-white hover:text-primary"
                    >
                      {loading ? <Loader /> : "Sign Up"}
                    </button>
                  </div>
                </form>

                <div className="flex flex-col max-w-xs mx-auto gap-2">
                  <p className="text-secondary/70 dark:text-white/40">
                    By creating an account, you agree with our{" "}
                    <Link href="/privacy-policy" className="text-secondary/70 dark:text-white/40 hover:text-secondary dark:hover:text-white">
                      Privacy
                    </Link>{" "}
                    &{" "}
                    <Link href="/privacy-policy" className="text-secondary/70 dark:text-white/40 hover:text-secondary dark:hover:text-white">
                      Policy
                    </Link>.
                  </p>

                  <p className="text-secondary/70 dark:text-white/40">
                    Already have an account?
                    <Link href="/sign-in" className="text-secondary/70 dark:text-white/40 hover:text-secondary dark:hover:text-white">
                      {" "}Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
