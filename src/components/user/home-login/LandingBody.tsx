import { useState,forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
  Check,
  Sparkles
} from "lucide-react";
import { BackgroundBeams } from "../../ui/backgroundBeams";
import { SparklesCore } from "../../ui/sparkles";
import { TextGenerateEffect } from "../../ui/text-generate-effect";
import { HoverEffect } from "../../ui/card-hover-effect";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { TracingBeam } from "../../ui/tracing-beam";
import { useInView } from "react-intersection-observer";
import web_octaview from '../../../assets/web_octaview.png'
import VideoPlayerModal from '../home-login/Video-Plaayer'




const LandingPage = forwardRef<HTMLDivElement, {}>((_, ref)  => {
  
  const features = [
    {
      title: "AI-Powered Interviews",
      description: "Automate screening with generative AI that adapts to your company culture",
      icon: <Bot className="h-6 w-6" />,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
      link: "#ai-interviews"
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

  const pricingPlans = [
    {
      name: "Starter",
      description: "Perfect for small teams and startups",
      price:  "$50",
      tokens: "1,000 tokens",
      features: [
        "Custom branding",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom API integration"
      ],
      highlighted: false
    },
    {
      name: "Professional",
      description: "For growing companies with regular hiring needs",
      price:  "$125" ,
      tokens: "3,000 tokens",
      features: [
        "Custom branding",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom API integration"
      ],
      highlighted: true
    },
    {
      name: "Enterprise",
      description: "For large organizations with high-volume hiring",
      price:  "$200",
      tokens: "5,000 tokens",
      features: [
        "Custom branding",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom API integration"
      ],
      highlighted: false
    }
  ];

  // For the floating elements in the hero section
  const [inViewRef, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <BackgroundBeams className="opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.7,
                type: "spring",
                stiffness: 100
              }}
              className="relative h-24 w-full"
            >
              <SparklesCore
                id="tsparticles"
                background="transparent"
                minSize={0.6}
                maxSize={1.8}
                particleDensity={120}
                className="w-full h-full"
                particleColor="#4f46e5"
              />
              <h1 className="absolute inset-0 flex items-center justify-center text-6xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Octaview
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 max-w-3xl mx-auto"
            >
              <TextGenerateEffect
                words="Revolutionize your technical hiring with AI-powered interviews"
                className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-5 justify-center"
            >
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 px-8 py-6 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button  onClick={() => setIsVideoModalOpen(true)} variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-medium rounded-xl group">
                Watch Demo
                <Video className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </div>
          
          {/* Enhanced Hero Mockup with Floating Elements */}
          <div ref={inViewRef} className="mt-20 relative mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="relative"
            >
              {/* Decorative floating elements */}
              <AnimatePresence>
                {inView && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0, x: -30, y: -20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                      className="absolute -left-8 -top-16 z-10"
                    >
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                        <Bot className="h-6 w-6 text-blue-500" />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 30, y: -10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                      className="absolute -right-4 -top-10 z-10"
                    >
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                        <Code2 className="h-6 w-6 text-purple-500" />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20, y: 20 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ delay: 1.6, duration: 0.8 }}
                      className="absolute right-12 -bottom-8 z-10"
                    >
                      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                        <Video className="h-6 w-6 text-amber-500" />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Main mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-2xl opacity-20" />
                <div className="relative rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-sm shadow-2xl overflow-hidden">
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
                      src={web_octaview}
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
      
      {/* Features Section with Hover Effect Cards */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100 px-4 py-1 text-sm rounded-full">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              Everything you need for modern technical interviews
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Octaview is a powerful collaboration tools to 
              create the ultimate technical interview platform.
            </p>
          </div>
          <HoverEffect items={features.map(feature => ({
            title: feature.title,
            description: feature.description,
            link: feature.link || "#",
            icon: feature.icon
          }))} />
        </div>
      </section>
      
      {/* How It Works Section with Tracing Beam */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100 px-4 py-1 text-sm rounded-full">Workflow</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How Octaview Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A streamlined process from application to hire
            </p>
          </div>
          
          <TracingBeam className="px-6">
            {[
              {
                title: "Seamless Integration",
                description: "Connect Octaview to your company website and ATS system in minutes with our simple API. Import all your existing job listings and candidate data automatically.",
                icon: <Globe className="h-6 w-6" />,
              },
              {
                title: "Automated Screening",
                description: "Our AI analyzes resumes and applications based on your specific requirements, automatically identifying the most promising candidates and prioritizing them for interviews.",
                icon: <Bot className="h-6 w-6" />,
              },
              {
                title: "Interview Scheduling",
                description: "The system automatically schedules interviews with qualified candidates, handling time zone differences and calendar availability to find the perfect slot for both parties.",
                icon: <Calendar className="h-6 w-6" />,
              },
              {
                title: "Technical Assessment",
                description: "Conduct coding interviews with our collaborative editor that supports over 40 programming languages. Observe candidates' problem-solving process in real-time.",
                icon: <Code2 className="h-6 w-6" />,
              }
            ].map((step, index) => (
              <div key={index} className="mb-16">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-3 shadow-lg">
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </TracingBeam>
        </div>
      </section>
      
      {/* Pricing Section (Replacing Social Proof) */}
      <section ref={ref} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100 px-4 py-1 text-sm rounded-full">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Choose the perfect plan for your team
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Transparent pricing with all the features you need to streamline your technical hiring process.
            </p>
            
  
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={cn(
                  "relative h-full border-2 transition-all duration-200 hover:shadow-lg",
                  plan.highlighted ? "border-blue-500 shadow-lg" : "border-gray-200"
                )}>
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded-full">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">{plan.price}</span>
        
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span className="text-gray-700 font-medium">{plan.tokens}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className={cn(
                      "w-full py-6 rounded-xl",
                      plan.highlighted 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md" 
                        : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50"
                    )}>
                      Get Started
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - Enhanced */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100" />
        <BackgroundBeams className="opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-16 md:py-20 md:px-12 text-center text-white relative overflow-hidden">
              <SparklesCore
                id="tsparticles-cta"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={70}
                className="w-full h-full absolute inset-0"
                particleColor="rgba(255, 255, 255, 0.3)"
              />
              <h2 className="text-3xl md:text-5xl font-bold relative z-10">
                Ready to transform your technical hiring?
              </h2>
              <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto relative z-10">
                Join leading companies that use Octaview to find the best technical talent faster and more efficiently.
              </p>
              <div className="mt-10 relative z-10">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <VideoPlayerModal 
    videoSrc="https://octaview-data.s3.ap-south-1.amazonaws.com/images/invideo-ai-480+Revolutionize+Your+Hiring+with+Octaview!+2025-03-14.mp4"
    isOpen={isVideoModalOpen}
    onClose={() => setIsVideoModalOpen(false)}
  />
    </div>
  );
});

export default LandingPage;

