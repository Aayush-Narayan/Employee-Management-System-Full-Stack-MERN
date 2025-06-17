import { Link } from 'react-router-dom';

function DashboardNavigation() {
  return (
    <nav className="w-full bg-white/95 dark:bg-card/60 p-4 shadow-lg border-b-2 border-teal-500 dark:border-cyan">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/About" className="text-2xl font-bold text-card dark:text-cyan">
          Tata Steel EMS
        </Link>
        <div className="flex space-x-4">
          <Link to="/Login" className="text-background dark:text-cyan border-2 rounded-full dark:border-cyan p-2 dark:shadow-cyan dark:hover:bg-white dark:hover:text-background hover:underline shadow-2xl shadow-background ">Logout</Link>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;
