import React, { useState } from "react";
import { cn } from "../../../lib/utils";
import {useNavigate,Link} from "react-router-dom"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const login=()=>{
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Navbar Background with Blur */}
      <div className="absolute inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-lg" />

      {/* Navbar Content */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a 
              href="/" 
              className="text-xl font-bold text-black dark:text-white"
            >
              Octaview
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to={'/docs'}>
            <a  className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Docs</a>
            </Link>
            <button  onClick={login}
              className="px-4 py-2 text-sm text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Login
            </button>
          
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 md:hidden transition-all duration-300 ease-in-out",
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}
        >
          <div className="flex flex-col space-y-4 px-4 py-6">
            <a
              href="/docs"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
            >
              Docs
            </a>
           
            <button  onClick={login}
              className="px-4 py-2 text-sm text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
