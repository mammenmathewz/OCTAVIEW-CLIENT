import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Copy, Check } from 'lucide-react';


const DocumentationPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = '80px';
    return () => {
      document.documentElement.style.scrollPaddingTop = '0';
    };
  }, []);

  const sidebarLinks = [
    { title: 'Introduction', href: '#introduction' },
    { title: 'Features', href: '#features' },
    { title: 'Installation', href: '#installation' },
    { title: 'Props', href: '#props' },
    { title: 'Examples', href: '#examples' },
  ];

  const handleNavClick = (e: { preventDefault: () => void; currentTarget: { getAttribute: (arg0: string) => any; }; }) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const element = document.querySelector(href);
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

  const copyToClipboard = async (code:any, blockId:any) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(blockId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exampleCode = `import React from 'react';
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

export default App;`;

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-50 transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="p-6 pt-16">
          <nav className="space-y-4">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors"
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
      <main className="md:ml-64 p-6 pt-16 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <section id="introduction" className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-10">
              octaview-client Documentation
            </h1>
            <p className="text-gray-600 leading-relaxed">
              The octaview-client is a React component designed to integrate job listing functionalities 
              into your application. It fetches job data from a specified URL and renders it with 
              customizable styles.
            </p>
          </section>

          {/* Features */}
          <section id="features" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Dynamic Job Listings: Fetches job data in real-time from your backend application.</li>
              <li>Customizable Appearance: Easy customization options for background and text color.</li>
              <li>Seamless Integration: Built as a React component for easy integration.</li>
            </ul>
          </section>

          {/* Installation */}
          <section id="installation" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Installation
            </h2>
            <p className="text-gray-600 mb-4">
              To use octaview-client in your React application, follow these steps:
            </p>
            <div className="relative bg-gray-100 rounded-lg p-4 mb-6">
              <button
                onClick={() => copyToClipboard('npm install octaview-client', 'install')}
                className="absolute top-3 right-3 p-2 hover:bg-gray-200 rounded transition-colors"
                aria-label={copiedCode === 'install' ? 'Copied!' : 'Copy command'}
              >
                {copiedCode === 'install' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
              <code className="text-sm font-mono text-gray-800">
                npm install octaview-client
              </code>
            </div>
            
            <p className="text-gray-600 mb-4">Import the Component:</p>
            <div className="relative bg-gray-100 rounded-lg p-4">
              <button
                onClick={() => copyToClipboard("import OctaviewClient from 'octaview-client';", 'import')}
                className="absolute top-3 right-3 p-2 hover:bg-gray-200 rounded transition-colors"
                aria-label={copiedCode === 'import' ? 'Copied!' : 'Copy code'}
              >
                {copiedCode === 'import' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
              <code className="text-sm font-mono text-gray-800">
                import OctaviewClient from 'octaview-client';
              </code>
            </div>
          </section>

          {/* Props */}
          <section id="props" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Props
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      url
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      The endpoint to fetch job data from
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      background
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      The background color for the component
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      textColor
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      string
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      The text color for the component
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Examples */}
          <section id="examples" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Examples
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">
                  Below is an example of how to use the OctaviewClient component:
                </p>
                <div className="relative mt-4">
                  <div className="bg-gray-100 rounded-lg p-6">
                    <button
                      onClick={() => copyToClipboard(exampleCode, 'example')}
                      className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-md transition-colors"
                      aria-label={copiedCode === 'example' ? 'Copied!' : 'Copy code'}
                    >
                      {copiedCode === 'example' ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      )}
                    </button>
                    <pre className="overflow-x-auto">
                      <code className="text-sm font-mono text-gray-800 whitespace-pre">
                        {exampleCode}
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocumentationPage;