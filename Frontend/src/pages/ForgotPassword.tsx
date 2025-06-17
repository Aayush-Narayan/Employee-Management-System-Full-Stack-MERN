import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background_image from "../assets/21404.jpg";
import axios, { AxiosError } from "axios";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [step, setStep] = useState<"login" | "otp">("login");
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const email = values.email.trim();
    const password = values.password.trim();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        password,
      });
      // Success – now ask for OTP
      setStep("otp");
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        email,
        password,
      });
      alert("Login successful!");
      navigate("/EmployeeDashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(
          axiosError.response?.data?.message ||
            "Login failed. Please check your credentials or server."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container flex h-screen bg-contain bg-no-repeat bg-center align-middle bg-text/90 dark:bg-background/90 bg-blend-overlay"
      style={{ backgroundImage: `url(${background_image})` }}
    >
      <div className="relative group login-card flex-wrap mt-5 ml-65 mb-85 shadow-2xl shadow-background dark:shadow-cyan dark:border-cyan dark:text-cyan dark:hover:text-background px-8 pt-5 rounded-bl-4xl rounded-tr-4xl">
        <h2 className="text-3xl mb-3 font-serif ml-1 font-extrabold dark:text-cyan">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block dark:border-cyan dark:text-cyan mb-2"
            >
              Mail-ID
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              autoComplete="off"
              placeholder="Enter Mail-ID"
              className="w-full px-3 py-2 border hover:border-2 dark:border-cyan dark:text-teal dark:hover:text-cyan rounded login-input"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 dark:border-cyan dark:text-cyan">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="w-full px-3 py-2 mb-3 border hover:border-2 dark:border-cyan dark:text-teal dark:hover:text-cyan rounded login-input"
              placeholder="Enter password"
              required
            />
            <Link
              to="/ForgetPassword"
              className="dark:border-cyan dark:text-teal dark:hover:text-cyan text-sm hover:underline ml-1"
            >
              -Forget Password
            </Link>
          </div>
          {error && (
            <div
              className="text-red-500 mb-3"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            className="login-button ml-2 font-bold border-2 px-30 py-2 rounded-full hover:scale-115 hover:text-cyan hover:bg-card dark:border-cyan dark:text-cyan dark:hover:text-background dark:hover:bg-cyan transition-transform disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      <div>
        <Link
          to="/signup"
          className="fixed bottom-2 left-65 border-2 flex hover:text-cyan hover:bg-card dark:border-cyan dark:text-cyan px-6 py-2 rounded-full font-semibold dark:hover:text-background dark:hover:bg-cyan transition-transform"
        >
          New Employee ?
        </Link>
        <Link
          to="/About"
          className="fixed bottom-2 right-65 border-2 flex px-6 py-2 rounded-full font-semibold hover:text-cyan hover:bg-card dark:border-cyan dark:text-cyan dark:hover:text-background dark:hover:bg-cyan transition-transform"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default Login;
