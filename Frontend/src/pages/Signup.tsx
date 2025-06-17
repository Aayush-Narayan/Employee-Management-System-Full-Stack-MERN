import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import background_image from "../assets/21404.jpg";
import axios from "axios";
// import bcrypt from 'bcrypt';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    dateOfJoining: "",
    phone: "",
    email: "",
    education: "",
    qualification: "",
    designation: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  //const [username, setUsername] = userState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
  // Check if the password and confirm password matches:
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
 try {
      // Axios implementation
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, formData);
      console.log("Response:", response);
      alert("Signup request sent successfully, wait for the approval!");
      navigate("/About");
    } catch (error) {
      // Handle error response
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", error);
    }
  };

  return (
    <div
      className="flex h-screen items-center-safe justify-center-safe bg-center align-middle bg-no-repeat bg-contain dark:bg-blend-overlay dark:bg-background/80"
      style={{ backgroundImage: `url(${background_image})` }}
    >
      <div className="signup-card dark:bg-card/60 dark:bg-blend-overlay bg-white/95 bg-blend-overlay p-5 rounded-bl-4xl rounded-tr-4xl shadow-2xl dark:shadow-cyan max-w-3xl h-auto sm:h-[300px] md:h-[400px] lg:h-[500px] will-change-auto w-auto sm:w-[400px] md:w-[500px] lg:w-[600px] overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card/60 dark:hover:scrollbar-thumb-background hover:scrollbar-track-cyan flex-wrap">
        <h2 className="text-4xl text-center dark:text-cyan dark:font-serif font-semibold mb-5">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="">
          <div className="space-y-4 mb-4 ml-0.5">
            <div className="grid grid-cols-2 p-2 gap-y-4 gap-x-10">
              <div>
                <label className="block  text-md ml-3 dark:text-cyan">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="mt-3 w-full border-2 rounded-full p-2 dark:border-teal dark:text-teal dark:hover:text-cyan dark:hover:border-cyan dark:bg-card dark:hover:bg-background "
                  placeholder="  Enter Your first name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block  text-md ml-3 dark:text-cyan">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="mt-3 w-full border-2 rounded-full p-2 dark:border-teal dark:text-teal dark:hover:text-cyan dark:hover:border-cyan dark:bg-card dark:hover:bg-background"
                  placeholder="  Enter your last name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-md dark:text-cyan ml-3">
                  Gender
                </label>
                <select
                  name="gender"
                  className="p-2 mt-3 w-full border-2 rounded-full dark:border-teal dark:text-teal dark:hover:border-cyan dark:hover:text-cyan dark:bg-card dark:hover:bg-background"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select your Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-md dark:text-cyan ml-3">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  className="p-2 mt-3 w-full border-2 rounded-full dark:border-teal dark:text-teal dark:hover:border-cyan dark:hover:text-cyan dark:bg-card dark:hover:bg-background"
                  required
                  value={formData.bloodGroup}
                  onChange={handleChange}
                >
                  <option value="">Select your blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block  text-md dark:text-cyan ml-3">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="w-full border-2 rounded-full p-2 mt-3 dark:text-teal dark:bg-card dark:hover:text-cyan dark:hover:bg-background"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-md dark:text-cyan ml-3">
                  Date of Joining
                </label>
                <input
                  type="date"
                  name="dateOfJoining"
                  className="w-full border-2 rounded-full p-2 mt-3 dark:text-teal dark:bg-card  dark:hover:text-cyan dark:hover:bg-background"
                  required
                  value={formData.dateOfJoining}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-md ml-3 dark:text-cyan">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="  Enter Phone Number"
                  pattern="^\+?\d{10,15}$"
                  className="w-full border-2 p-2 mt-3 rounded-full dark:text-teal dark:border-teal dark:hover:text-cyan dark:hover:border-cyan dark:bg-card dark:hover:bg-background"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block dark:text-cyan ml-3 text-md">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border-2 rounded-full p-2 mt-3 dark:text-teal dark:border-teal dark:hover:border-cyan dark:hover:text-cyan dark:bg-card dark:hover:bg-background"
                  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  placeholder="  Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-md ml-3 dark:text-cyan">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="  Enter Your Password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters and include: uppercase, lowercase, number, and special character."
                  className="w-full border-2 p-2 mt-3 rounded-full dark:text-teal dark:border-teal dark:hover:text-cyan dark:hover:border-cyan dark:bg-card dark:hover:bg-background"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block dark:text-cyan ml-3 text-md">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="  Re-enter Your Password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                  title="Password must be at least 8 characters and include: uppercase, lowercase, number, and special character."
                  className="w-full border-2 p-2 mt-3 rounded-full dark:text-teal dark:border-teal dark:hover:text-cyan dark:hover:border-cyan dark:bg-card dark:hover:bg-background"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 p-2 mt-6">
              <div>
                <label className="block text-md ml-3 mb-3 dark:text-cyan">
                  Education
                </label>
                <textarea
                  name="education"
                  placeholder="e.g. BSc in Computer Science"
                  required
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:border-teal dark:bg-card dark:hover:bg-background dark:text-cyan"
                />
              </div>
              <div>
                <label className="block text-md ml-3 mb-3 mt-2 font-medium dark:text-cyan">
                  Qualification
                </label>
                <textarea
                  name="qualification"
                  placeholder="e.g. Certified AWS Developer"
                  required
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:border-teal dark:bg-card dark:hover:bg-background dark:text-cyan"
                />
              </div>
              <div>
                <label className="block text-md ml-3 mb-3 mt-2 font-medium dark:text-cyan">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  placeholder="e.g. Software Engineer"
                  required
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded dark:border-teal dark:bg-card dark:hover:bg-background dark:text-cyan"
                />
              </div>
              <button
                type="submit"
                className="signup-button rounded-full w-full border-2 mt-5 px-1 py-2 dark:text-2xl dark:border-cyan dark:bg-transparent dark:text-cyan dark:hover:bg-cyan dark:hover:text-background"
              >
                Send Request! ᯓ ➤
              </button>
              {error && <p className="font-bold mt-5 text-2xl text-red-500 text-center">{error}</p>} {/* Display error message */}
            </div>
          </div>
        </form>
      </div>
      <div>
        <Link
          to="/login"
          className="fixed bottom-2 left-65 border-2 flex hover:text-cyan hover:bg-card  dark:border-cyan dark:text-cyan px-6 py-2 rounded-full font-semibold dark:hover:text-background dark:hover:bg-cyan transition-transform"
        >
          Existing Employee ?
        </Link>
        <Link
          to="/About"
          className="fixed bottom-2 right-65 border-2 flex px-6 py-2 rounded-full font-semibold hover:text-cyan hover:bg-card  dark:border-cyan dark:text-cyan  dark:hover:text-background dark:hover:bg-cyan transition-transform"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}

export default Signup;
