import { useEffect, useState } from "react";
import { LoginForm } from "../../components/user/home-login/Login";
import { SignupForm } from "../../components/user/home-login/Signup";
import {  useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAccessToken } from "../../service/redux/store";

function Login() {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate()
  const token = useSelector(selectAccessToken)
  useEffect(()=>{
    if (token) {
      navigate('/dash',{replace:true})
    }
  },[navigate,token])
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center h-screen px-4 lg:px-20">
      
      {/* Left Side: Login/Signup Section */}
      <div className="flex flex-col w-full lg:w-1/2 max-w-lg lg:pr-8">
        {activeTab === "login" ? (
          <div className="flex flex-col items-center lg:items-start">
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
          <div className="flex flex-col items-center lg:items-start">
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

      <div className="hidden lg:flex lg:w-1/2 h-full items-center justify-center bg-gray-100 p-8 rounded-lg">
  <div className="text-center max-w-md">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">
      Welcome to Octaview
    </h2>
    <p className="text-gray-600 mb-6">
      Discover job opportunities and connect with industry experts. Experience our collaborative hiring platform with video calls and live coding features.
    </p>
    
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">
        Try Our Demo
      </h3>
      <p className="text-gray-600 mb-4">
        Use these credentials to test our platform:
      </p>
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-left mb-4">
        <p className="mb-2"><span className="font-medium">Email:</span> octaview.test@yopmail.com</p>
        <p><span className="font-medium">Password:</span> Demo@123</p>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-left mb-4">
        <p className="text-sm font-medium text-yellow-800">
          This demo showcases our npm package integration (octaview-client) for applying to jobs. Experience the streamlined application process built with our custom React component.
        </p>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        You can apply to existing jobs on demo website or create new job postings to experience the full functionality.
      </p>
    </div>
  
    
    <a 
      href="https://octaview-demo.netlify.app/" 
      target="_blank" 
      rel="noopener noreferrer"
      className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
    >
      Visit Demo Site
    </a>
  </div>
</div>
    </div>
  );
}

export default Login;
