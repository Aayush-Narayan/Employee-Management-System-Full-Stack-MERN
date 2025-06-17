import { Link } from "react-router-dom";
import background_image from "../assets/21404.jpg";

function About() {
  return (
    <div
      className="bg-contain bg-no-repeat h-screen bg-center justify-center-safe flex items-center-safe bg-cyan-100/90 bg-blend-overlay dark:bg-background/90 dark:bg-blend-overlay dark:text-text"
      style={{ backgroundImage: `url(${background_image})` }}
    >
      <div className="dark:bg-card/60 dark:bg-blend-overlay bg-white/95 bg-blend-overlay p-8 rounded-lg shadow-lg max-w-3xl text-center dark:shadow-2xl dark:shadow-cyan">
        <h1 className="text-4xl font-serif md:text-5xl font-extrabold dark:text-cyan mb-8">
          Tata Steel Employee Management System
        </h1>
        <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4">
          <p className="mb-4 mr-4 text-lg leading-relaxed text-justify">
            Welcome to the Employee Management System (EMS) of Tata Steel Ltd.
            Our EMS is designed to streamline and enhance the management of our
            workforce, reflecting our commitment to employee welfare and
            organizational excellence.
          </p>
          <p className="mb-6 mr-4 text-lg leading-relaxed text-justify">
            Tata Steel has a rich history of pioneering worker welfare schemes,
            including the introduction of the 8-hour workday in 1912 and the
            Worker's Provident Fund Scheme in 1920. Our EMS continues this
            legacy by providing a robust platform for managing employee
            information, performance, and development initiatives.
          </p>
          <p className="mb-4 mr-4 text-lg leading-relaxed text-justify">
            The Tata Steel Employee Management System is a comprehensive digital
            platform designed to streamline and enhance human resource
            operations across the organization. Reflecting Tata Steel's
            commitment to employee welfare and innovation, this system
            integrates functionalities such as employee onboarding, personal
            information management, and performance tracking. By leveraging
            modern technologies, the platform ensures efficient HR processes,
            fostering a culture of transparency and continuous development
            within the company.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-70">
          <Link
            to="/Login"
            className="border-2 dark:border-cyan dark:text-cyan px-6 py-2 rounded-full font-semibold dark:hover:bg-cyan dark:hover:text-background hover:bg-card hover:text-cyan transition"
          >
            Existing Employee
          </Link>
          <Link
            to="/SignUp"
            className="border-2 dark:border-cyan dark:text-cyan px-6 py-2 rounded-full font-semibold dark:hover:bg-cyan dark:hover:text-background hover:bg-card hover:text-cyan transition"
          >
            Be An Employee
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
