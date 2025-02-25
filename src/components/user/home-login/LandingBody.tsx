import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { 
  Code2, 
  Video, 
  Key, 
  Mail, 
  ArrowRight, 
  Bot, 
  Globe, 
  Calendar 
} from "lucide-react";
import { BackgroundBeams } from "../../ui/backgroundBeams";
import { SparklesCore } from "../../ui/sparkles";
import { TextGenerateEffect } from "../../ui/text-generate-effect";
import { HeroParallax } from "../../ui/Hero";

const LandingPage = () => {
  // Product images for the Hero Parallax
  const parallaxProducts = [
    {
      title: "AI Interview",
      thumbnail: "https://blog.talview.com/hs-fs/hubfs/AI_V.png?width=842&name=AI_V.png",
    },
    {
      title: "Code Editor",
      thumbnail: "https://www.alphaacademy.org/wp-content/uploads/2024/02/Choosing-the-Right-Code-Editor-Features-to-Look-For.png",
    },
    {
      title: "Video Calls",
      thumbnail: "https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/iStock-1286802156_stj0fd.jpeg",
    },
    {
      title: "Candidate Analysis",
      thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyps9HEt-P-8RQqol80fsTDAihbz-bDVK9JAon_ALK_pIyvT7T0GaEkg5psuH5KXZzGtQ&usqp=CAU",
    },
    {
      title: "Scheduling",
      thumbnail: "https://trafft.com/wp-content/uploads/2023/07/effective-scheduling-scaled.jpg",
    },
    {
      title: "API Integration",
      thumbnail: "https://depalma.io/hubfs/api-integration.jpg",
    },
    {
      title: "Real-time Coding",
      thumbnail: "https://blog.talview.com/hs-fs/hubfs/AI_V.png?width=842&name=AI_V.png",
    },
    {
      title: "Automated Notifications",
      thumbnail: "https://blog.talview.com/hs-fs/hubfs/AI_V.png?width=842&name=AI_V.png",
    },
    {
      title: "Judge0 Code Execution",
      thumbnail: "https://trafft.com/wp-content/uploads/2023/07/effective-scheduling-scaled.jpg",
    },
    {
      title: "Technical Screening",
      thumbnail: "https://trafft.com/wp-content/uploads/2023/07/effective-scheduling-scaled.jpg",
    },
    {
      title: "Custom Workflows",
      thumbnail: "https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/iStock-1286802156_stj0fd.jpeg",
    },
    {
      title: "Data Analytics",
      thumbnail: "/api/placeholder/600/400",
    },
    {
      title: "Candidate Management",
      thumbnail: "/api/placeholder/600/400",
    },
    {
      title: "Interview Recording",
      thumbnail: "/api/placeholder/600/400",
    },
    {
      title: "Talent Acquisition",
      thumbnail: "https://www.shrm.org/content/dam/en/shrm/topics-tools/news/talent-acquisition/iStock-1286802156_stj0fd.jpeg",
    },
  ];

  const features = [
    {
      title: "AI-Powered Interviews",
      description: "Automate screening with generative AI that adapts to your company culture",
      icon: <Bot className="h-6 w-6" />,
      color: "bg-blue-500/10",
      textColor: "text-blue-500"
    },
    {
      title: "Collaborative Code Editor",
      description: "Real-time pair programming with Yjs integration",
      icon: <Code2 className="h-6 w-6" />,
      color: "bg-purple-500/10",
      textColor: "text-purple-500"
    },
    {
      title: "Online Code Execution",
      description: "Run and test code securely with Judge0 integration",
      icon: <Globe className="h-6 w-6" />,
      color: "bg-green-500/10",
      textColor: "text-green-500"
    },
    {
      title: "Video Calling",
      description: "Seamless interviews with shareable join links",
      icon: <Video className="h-6 w-6" />,
      color: "bg-amber-500/10",
      textColor: "text-amber-500"
    },
    {
      title: "API Integration",
      description: "Easy integration with your existing systems",
      icon: <Key className="h-6 w-6" />,
      color: "bg-pink-500/10",
      textColor: "text-pink-500"
    },
    {
      title: "Automated Updates",
      description: "Keep candidates informed at every stage",
      icon: <Mail className="h-6 w-6" />,
      color: "bg-teal-500/10",
      textColor: "text-teal-500"
    }
  ];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Parallax Section */}
      <HeroParallax
        products={parallaxProducts}
        title="Octaview"
        description="Revolutionize your technical hiring with AI-powered interviews that find the best talent faster and more efficiently."
      />
      
      {/* Content starts after the parallax section */}
      <div className="relative z-10 bg-white">
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">
                Everything you need for modern technical interviews
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Octaview combines AI intelligence with powerful collaboration tools to 
                create the ultimate technical interview platform.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className={cn("rounded-lg p-3 inline-block", feature.color)}>
                    <div className={feature.textColor}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Alternative Hero Section with Background Beams */}
        <section className="relative py-20 overflow-hidden">
          <BackgroundBeams className="opacity-20" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <SparklesCore
                    id="tsparticles"
                    background="transparent"
                    minSize={0.6}
                    maxSize={1.4}
                    particleDensity={70}
                    className="w-full h-20"
                    particleColor="#000000"
                  />
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Find your ideal tech talent faster
                  </h2>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mt-6"
                >
                  <TextGenerateEffect
                    words="Automate the interview process from start to finish with AI that understands your company's unique needs and culture."
                    className="text-lg text-gray-600 leading-relaxed"
                  />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-8 flex gap-4"
                >
                  <Button className="bg-black text-white hover:bg-gray-800 px-6 py-2 text-base rounded-xl">
                    Schedule Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="md:w-1/2"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-20" />
                  <div className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
                    <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="mx-auto pr-10 text-sm text-gray-500">Octaview Interview Session</div>
                    </div>
                    <div className="p-2">
                      <img 
                        src="/api/placeholder/600/400" 
                        alt="Octaview Interface" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight">How Octaview Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                A streamlined process from application to hire
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200" />
              
              {[
                {
                  title: "Seamless Integration",
                  description: "Connect Octaview to your company website and ATS system",
                  icon: <Globe className="h-6 w-6" />,
                },
                {
                  title: "Automated Screening",
                  description: "AI filters applications based on your specific requirements",
                  icon: <Bot className="h-6 w-6" />,
                },
                {
                  title: "Interview Scheduling",
                  description: "Automatically schedule interviews with qualified candidates",
                  icon: <Calendar className="h-6 w-6" />,
                },
                {
                  title: "Technical Assessment",
                  description: "Conduct coding interviews with our collaborative editor",
                  icon: <Code2 className="h-6 w-6" />,
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={cn(
                    "relative mb-12 md:w-5/12",
                    index % 2 === 0 ? "md:ml-auto md:mr-12" : "md:mr-auto md:ml-12"
                  )}
                >
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="absolute top-6 -left-12 rounded-full bg-white shadow border border-gray-100 p-3 hidden md:block">
                      {step.icon}
                    </div>
                    <div className="md:hidden mb-4 inline-block">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to transform your technical hiring?
                </h2>
                <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto">
                  Join leading companies that use Octaview to find the best technical talent faster and more efficiently.
                </p>
                <div className="mt-10">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-base rounded-xl">
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Social Proof Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Trusted by innovative teams</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
              {[1, 2, 3, 4].map((logo) => (
                <div key={logo} className="h-8">
                  <img 
                    src="/api/placeholder/160/40" 
                    alt={`Company logo ${logo}`}
                    className="h-full w-auto object-contain" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;