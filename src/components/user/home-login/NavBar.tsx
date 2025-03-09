import { useState, useEffect } from "react";
import { cn } from "../../../lib/utils";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  ExternalLink,
  LogIn,
  Sparkles
} from "lucide-react";
import { Button } from "../../ui/button";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const login = () => {
    navigate('/login');
  };

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative h-9 w-9 overflow-hidden rounded-full bg-black flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={cn(
              "text-2xl font-bold transition-colors duration-300",
              scrolled ? "text-gray-800" : "text-gray-900"
            )}>
              Octaview
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            
            <Button variant="ghost" size="sm" asChild>
              <Link to="/pricing">Pricing</Link>
            </Button>
            
            <Button variant="ghost" size="sm" asChild>
              <Link to="/docs" className="flex items-center space-x-1">
                <span>Docs</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
            
            <div className="mx-1 h-5 border-r border-gray-300" />
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900"
              onClick={login}
            >
              Login
            </Button>
            
            <Button 
              size="sm" 
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="py-2 px-4 space-y-1">
             
              <Link 
                to="/pricing" 
                className="block py-2 px-3 rounded-md hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                to="/docs" 
                className="block py-2 px-3 rounded-md hover:bg-gray-100 font-medium"
                onClick={() => setIsOpen(false)}
              >
                Docs
              </Link>
              <div className="py-2 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start py-2 px-3 rounded-md hover:bg-gray-100 font-medium"
                  onClick={() => {
                    login();
                    setIsOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button 
                  className="w-full mt-2 bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                    navigate('/signup');
                    setIsOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;