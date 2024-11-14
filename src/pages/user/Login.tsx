import  { useState } from "react";
import { LoginForm } from "../../components/user/home-login/Login";
import { SignupForm } from "../../components/user/home-login/Signup";

function Login() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center h-screen px-4 lg:px-20">
      
      {/* Left Side: Login/Signup Section */}
      <div className="flex flex-col w-full lg:w-1/2 max-w-lg lg:pr-8">
        {activeTab === "login" ? (
          <div className="flex flex-col items-center  lg:items-start">
           <div className="w-full mt-20">
           <LoginForm />
           </div>
           <p className="mt-4 mx-auto">
              Don't have an account?{" "}
              <button
                className="text-blue-500 underline ml-1"
                onClick={() => setActiveTab("signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        ) : (
          <div className="flex flex-col  items-center lg:items-start">
            <div className="mt-20 w-full">
            <SignupForm />
            </div>
            <p className="mt-4 mx-auto">
              Already have an account?{" "}
              <button
                className="text-blue-500 underline ml-1"
                onClick={() => setActiveTab("login")}
              >
                Log In
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Right Side: Ad Section (only visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        {/* Add ad content here */}
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Welcome to Our Platform
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Discover new opportunities and connect with industry experts. Join
            us to stay updated and grow your career.
          </p>
        
        </div>
      </div>
    </div>
  );
}

export default Login;
