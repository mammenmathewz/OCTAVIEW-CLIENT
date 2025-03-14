import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Copy, Check, BookOpen, ExternalLink } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { ScrollArea } from "../../ui/scroll-area";
import { Separator } from "../../ui/separator";
import { Badge } from "../../ui/badge";

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
  },);

  const sidebarLinks = [
    { title: 'Introduction', href: '#introduction', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { title: 'Features', href: '#features', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Installation', href: '#installation', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Configuration', href: '#configuration', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Usage', href: '#usage', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'API Reference', href: '#api-reference', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Examples', href: '#examples', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
    { title: 'Support', href: '#support', icon: <ChevronRight className="h-4 w-4 mr-2" /> },
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
import OctaviewClient from "octaview-client";

function App() {
  const config = {
    background: "#F5F5F5",
    textColor: "#2F4F4F",
    buttonColor: "#00796B",
    api: "your_api_key",
    userId: "your_user_id",
  };

  return (
    <div className="app-container">
      <OctaviewClient {...config} />
    </div>
  );
}

export default App;`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-zinc-950/90 backdrop-blur-sm z-50 border-b border-zinc-800">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 h-8 w-8 rounded-md flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">octaview-client</h1>
              <p className="text-xs text-zinc-400">Documentation</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="hidden md:flex">
              <ExternalLink className="h-4 w-4 mr-2" />
              GitHub
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-zinc-900 border-r border-zinc-800 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 z-40`}
      >
        <ScrollArea className="h-full py-6 px-4">
          <div className="mb-6 px-3">
            <Badge variant="outline" className="text-blue-400 border-blue-400/30">v1.2.0</Badge>
          </div>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center py-2 px-3 rounded-md transition-colors ${activeSection === link.href.substring(1)
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
        <div className="container max-w-4xl mx-auto px-4 md:px-8">
          {/* Introduction */}
          <section id="introduction" className="mb-16">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
                  octaview-client
                </h1>
                <Badge variant="outline" className="text-blue-400 border-blue-400/30">v1.2.0</Badge>
              </div>
              <p className="text-xl text-zinc-400">
                A professional React component for seamless job listings integration.
              </p>
              <Separator className="my-6 bg-zinc-800" />
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-zinc-300 leading-relaxed">
                <p>
                  The octaview-client is a production-ready React component designed to integrate dynamic job listings into your application.
                  With a focus on performance and customization, it provides a complete solution for displaying job opportunities from your API.
                </p>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Real-time Job Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Fetch and display job listings in real-time with automatic updates and pagination.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Enterprise-ready Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    API key authentication and secure data handling to protect sensitive information.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Complete Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Flexible styling options that seamlessly integrate with your application's design system.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Optimized</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-zinc-400">
                    Lightweight implementation with optimized rendering for smooth user experience.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Installation
            </h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <div className="space-y-4">
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
                </div>
              </CardContent>
            </Card>

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Import in Your Project</h3>
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

          {/* Configuration */}
          <section id="configuration" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Configuration
            </h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 mb-4">
                  To configure octaview-client, you'll need to provide the following required parameters:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                  <li><strong>api</strong>: Your API key obtained from the octaview dashboard</li>
                  <li><strong>userId</strong>: Your unique identifier for authentication</li>
                </ul>
                <p className="text-zinc-400 mt-4 mb-2">
                  Additionally, you can customize the appearance with:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-zinc-300">
                  <li><strong>background</strong>: Background color of the component (hex code)</li>
                  <li><strong>textColor</strong>: Primary text color (hex code)</li>
                  <li><strong>buttonColor</strong>: Action button color (hex code)</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Usage */}
          <section id="usage" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Usage
            </h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <p className="text-zinc-400 mb-4">
                  Integrate the <code>OctaviewClient</code> component into your React application like this:
                </p>
                <div className="relative">
                  <div className="bg-zinc-950 rounded-md p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-zinc-300">
                      <code>{exampleCode}</code>
                    </pre>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-zinc-400 hover:text-white"
                    onClick={() => copyToClipboard(exampleCode, 'usage')}
                  >
                    {copiedCode === 'usage' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-zinc-400 mt-4">
                  Ensure you replace <code>"your_api_key"</code> and <code>"your_user_id"</code> with your actual credentials. You can also customize the <code>background</code>, <code>textColor</code>, and <code>buttonColor</code> props to match your application's theme.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* API Reference */}
          <section id="api-reference" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              API Reference
            </h2>
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
                      <TableCell className="text-zinc-400">Sets the background color of the job listings component.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">textColor</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">Sets the primary text color for the job listings.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">buttonColor</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">Sets the background color for the action buttons (e.g., Apply Now).</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">api</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">Your unique API key for authenticating with the Octaview job listings service.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">userId</TableCell>
                      <TableCell className="text-zinc-400">string</TableCell>
                      <TableCell className="text-zinc-400">Your specific user or account identifier for accessing job listings.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Examples */}
          <section id="examples" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Examples
            </h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Basic Integration</h3>
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
                <p className="text-zinc-400 mt-4">
                  This is a basic example of how to integrate the <code>OctaviewClient</code> component with minimal configuration.
                </p>
              </CardContent>
            </Card>
            {/* You can add more examples here if needed */}
          </section>

          {/* Support */}
          <section id="support" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="w-8 h-8 bg-blue-600/20 rounded-md flex items-center justify-center mr-3">
                <ChevronRight className="h-5 w-5 text-blue-400" />
              </span>
              Support
            </h2>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  Thank you for using <code>octaview-client</code>! If you encounter any issues or have questions, please don't hesitate to reach out.
                </p>
                <h3 className="text-lg font-medium">Contact</h3>
                <p className="text-zinc-400">
                  For support inquiries, please email us at <a href="mailto:support@octaview.com" className="text-blue-500 hover:underline">mammen999@gmail.com</a>.
                </p>
                <h3 className="text-lg font-medium">Bug Reports</h3>
                <p className="text-zinc-400">
                  If you find a bug, please submit a detailed report on our <Button variant="link" className="pl-0 text-blue-500"><a href="https://github.com/Octaview-b2b/octaview-client-pkg" target="_blank" rel="noopener noreferrer">
                      GitHub repository
                    </a></Button>.
                </p>
                <h3 className="text-lg font-medium">Feature Requests</h3>
                <p className="text-zinc-400">
                  Have a suggestion for a new feature? Let us know by creating an issue on our
                  <Button variant="link" className="pl-0 text-blue-500" asChild>
                    <a href="https://github.com/Octaview-b2b/octaview-client-pkg" target="_blank" rel="noopener noreferrer">
                      GitHub repository
                    </a>
                  </Button>.
                </p>

              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;