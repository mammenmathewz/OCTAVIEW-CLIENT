import React, { useState, useEffect } from "react";
import { ChevronRight, Menu, X, Copy, Check } from "lucide-react";

const DocumentationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Add scroll padding to document when component mounts
  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = "80px"; // Adjust this value based on your navbar height
    return () => {
      document.documentElement.style.scrollPaddingTop = "0";
    };
  }, []);

  const sidebarLinks = [
    { title: "Introduction", href: "#introduction" },
    { title: "Features", href: "#features" },
    { title: "Installation", href: "#installation" },
    { title: "Usage", href: "#usage" },
    { title: "Props", href: "#props" },
    { title: "Examples", href: "#examples" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const element = document.querySelector(href as string);
    if (element) {
      const topOffset = 80; // Adjust this value to match your desired top spacing
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };

  const copyToClipboard = async (code: string, blockId: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(blockId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-16"> {/* Added pt-16 for top spacing */}
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-50 dark:bg-gray-900 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        <div className="p-6 pt-16"> {/* Added pt-16 for top spacing */}
          <nav className="space-y-4">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={handleNavClick}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                {link.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6 mt-6 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              octaview-client Docs
            </h1>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The octaview-client is a React component designed to integrate job
              listing functionalities into your application. It fetches job data
              from a specified URL and renders it with customizable styles.
            </p>
          </section>

          {/* Features */}
          <section id="features" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                Dynamic Job Listings: Fetches job data in real-time from your
                backend application.
              </li>
              <li>
                Customizable Appearance: Easy customization options for
                background and text color to match your website's theme.
              </li>
              <li>
                Seamless Integration: Built as a React component, it can be
                easily integrated into existing React applications or other
                frameworks.
              </li>
            </ul>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Installation
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              To use octaview-client in your React application, follow these
              steps:
            </p>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <button
                onClick={() =>
                  copyToClipboard("npm install octaview-client", "install")
                }
                className="absolute top-3 right-3"
              >
                {copiedCode === "install" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </button>
              <code className="text-sm text-gray-800 dark:text-gray-200">
                npm install octaview-client
              </code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Import the Component:
            </p>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() =>
                  copyToClipboard(
                    "import OctaviewClient from 'octaview-client';",
                    "import"
                  )
                }
                className="absolute top-3 right-3"
              >
                {copiedCode === "import" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </button>
              <code className="text-sm text-gray-800 dark:text-gray-200">
                import OctaviewClient from 'octaview-client';
              </code>
            </div>
          </section>

          {/* Props */}
          <section id="props" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Props
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Prop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      url
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      The endpoint to fetch job data from
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      background
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      The background color for the component
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      textColor
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      The text color for the displayed content
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Example */}
          <section id="examples" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Usage Example
            </h2>
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <button
                onClick={() =>
                  copyToClipboard(
                    `import React from 'react';
import OctaviewClient from 'octaview-client';

function App() {
  const props = {
    url: "http://localhost:3030/jobs",
    background: "#f0f0f0",
    textColor: "#000000"
  };

  return (
    <div>
      <h1>Job Listings</h1>
      <OctaviewClient {...props} />
    </div>
  );
}

export default App;`,
                    "example"
                  )
                }
                className="absolute top-3 right-3"
              >
                {copiedCode === "example" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </button>
              <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                <code>{`import React from 'react';
import OctaviewClient from 'octaview-client';

function App() {
  const props = {
    url: "http://localhost:3030/jobs",
    background: "#f0f0f0",
    textColor: "#000000"
  };

  return (
    <div>
      <h1>Job Listings</h1>
      <OctaviewClient {...props} />
    </div>
  );
}

export default App;`}</code>
              </pre>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;
