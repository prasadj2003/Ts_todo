import React from "react";
import responsiveDesignGif from "../assets/responsive-design.gif";
import careerLadderGif from "../assets/career-ladder.gif";
import managementGif from "../assets/management.gif";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Header with Title */}
      <header className="w-full py-6 px-8 mt-10 flex justify-center">
        <h1 className="text-5xl font-bold">Todo App</h1>
      </header>

      {/* Main Section */}
      <main className="flex flex-col items-center text-center mt-10 flex-grow">
        <h2 className="text-3xl md:text-3xl font-bold mb-8">
          Organize Your Day, Effortlessly
        </h2>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          Manage your tasks seamlessly, track progress, and stay productive with
          our modern Todo App.
        </p>

        {/* Buttons for Sign In and Sign Up */}
        <div className="flex space-x-4 mb-10">
          <button className="bg-indigo-600 hover:bg-indigo-500 py-2 px-6 rounded-lg">
            <a href="/signin">Sign In</a>
          </button>
          <button className="bg-green-600 hover:bg-green-500 py-2 px-6 rounded-lg">
            <a href="/signup">Sign up</a>
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* Task Management Feature */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <img
              src={managementGif}
              alt="Task Management"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Task Management</h3>
            <p className="text-gray-400">
              Create and organize tasks with a simple, modern interface.
            </p>
          </div>

          {/* Progress Tracking Feature */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <img
              src={careerLadderGif}
              alt="Track Progress"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Track Progress</h3>
            <p className="text-gray-400">
              Monitor task completion and stay on top of your priorities.
            </p>
          </div>

          {/* Multi-Device Support Feature */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <img
              src={responsiveDesignGif}
              alt="Cross Platform"
              className="w-16 mx-auto mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">Cross-Platform</h3>
            <p className="text-gray-400">
              Access your tasks from any device, anywhere, at any time.
            </p>
          </div>
        </div>
      </main>

      {/* Footer at Bottom */}
      <footer className="w-full py-8 bg-gray-800 text-gray-400 text-center mt-auto">
        <p>&copy; {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
