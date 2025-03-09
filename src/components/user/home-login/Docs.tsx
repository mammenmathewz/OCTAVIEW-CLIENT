import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Copy, Check, BookOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";

const DocumentationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = '80px';
    
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5, rootMargin: "-100px 0px -300px 0px" });
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      document.documentElement.style.scrollPaddingTop = '0';
      observer.disconnect();
    };
  }, []);

  const sidebarLinks = [
    { title: 'Introduction', href: '#introduction', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { title: 'Features', href: '#features', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Installation', href: '#installation', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Props', href: '#props', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Examples', href: '#examples', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const element = document.querySelector(href as string);
    if (element) {
      const topOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsOpen(false);
  };

  const copyToClipboard = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(blockId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const installCode = `npm install octaview-client`;
  const importCode = `import OctaviewClient from 'octaview-client';`;
  
  const exampleCode = `import React from "react";
import OctaviewClient from "./octaview-client";

function App() {
  const obj = {
    background: "#F5F5F5", 
    textColor: "#2F4F4F",  
    buttonColor: "#00796B", 
    api: "esdjg;lkioletn;regtrhth", 
    userId: "675d58a04ecf93555922208f", 
  };

  return (
    <>
      <OctaviewClient {...obj} />
    </>
  );
}

export default App;`;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold">octaview-client</h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-zinc-950 border-r border-white/10 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <ScrollArea className="h-full py-6 px-4">
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                  activeSection === link.href.substring(1)
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
                onClick={handleNavClick}
              >
                {link.icon}
                {link.title}
              </a>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-16 md:ml-64">
        <div className="container max-w-3xl mx-auto px-4 md:px-8">
          {/* Introduction */}
          <section id="introduction" className="mb-16">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                octaview-client
              </h1>
              <p className="text-xl text-zinc-400">
                A powerful React component for seamlessly integrating job listings into your application.
              </p>
              <Separator className="my-6 bg-zinc-800" />
              <p className="text-zinc-300 leading-relaxed">
                The octaview-client is a React component designed to integrate job listing functionalities into your application. 
                It fetches job data from a specified URL and renders it with customizable styles to match your application's design.
              </p>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Dynamic Job Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Fetches job data in real-time from your backend application.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <CardTitle>Customizable Appearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Easy customization options for background and text color.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-zinc-900 border-zinc-800 md:col-span-2">
                <CardHeader>
                  <CardTitle>Seamless Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Built as a React component for easy integration with any React application.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Installation</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <Tabs defaultValue="npm" className="w-full">
                  <TabsList className="mb-4 bg-zinc-800">
                    <TabsTrigger value="npm">npm</TabsTrigger>
                    <TabsTrigger value="yarn">yarn</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="npm" className="space-y-4">
                    <div className="relative">
                      <div className="bg-zinc-950 rounded-md p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-zinc-300">{installCode}</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:text-white"
                        onClick={() => copyToClipboard(installCode, 'install-npm')}
                      >
                        {copiedCode === 'install-npm' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="yarn" className="space-y-4">
                    <div className="relative">
                      <div className="bg-zinc-950 rounded-md p-4 overflow-x-auto">
                        <code className="text-sm font-mono text-zinc-300">yarn add octaview-client</code>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:text-white"
                        onClick={() => copyToClipboard('yarn add octaview-client', 'install-yarn')}
                      >
                        {copiedCode === 'install-yarn' ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Import the Component</h3>
              <div className="relative">
                <div className="bg-zinc-950 rounded-md p-4 overflow-x-auto">
                  <code className="text-sm font-mono text-zinc-300">{importCode}</code>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:text-white"
                  onClick={() => copyToClipboard(importCode, 'import')}
                >
                  {copiedCode === 'import' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </section>

          {/* Props */}
          <section id="props" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Props</h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-800">
                    <TableRow>
                      <TableHead className="text-zinc-300">Prop</TableHead>
                      <TableHead className="text-zinc-300">Type</TableHead>
                      <TableHead className="text-zinc-300">Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">background</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">The background color for the component</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">textColor</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">The text color for the component</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">buttonColor</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">The button color for the component</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">api</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">The API key used for authentication</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">userId</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">The unique identifier for the user</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Example */}
          <section id="examples" className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Example Usage</h2>
            <div className="relative">
              <div className="bg-zinc-950 rounded-lg p-6 overflow-auto">
                <pre className="text-sm font-mono text-zinc-300">
                  <code>{exampleCode}</code>
                </pre>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 text-zinc-400 hover:text-white"
                onClick={() => copyToClipboard(exampleCode, 'example')}
              >
                {copiedCode === 'example' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;