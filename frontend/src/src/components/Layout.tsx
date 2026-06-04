import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity } from 'lucide-react';

// Logo images
const cognizantLogo = '/image_folder/Cognizant-Logo.wine (1).png';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Alert Center', icon: <Shield size={18} /> },
    { path: '/system-flow', label: 'System Flow', icon: <Activity size={18} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Professional Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-xl">
        <div className="mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo/Brand Section */}
            <div className="flex items-center gap-4">
              {/* Cognizant Logo */}
              <div className="relative group">
                <div className="relative h-14 px-4 bg-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <img 
                    src={cognizantLogo} 
                    alt="Cognizant" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
              </div>
              
              <div className="border-l border-slate-700 pl-4">
                <h1 className="text-white font-bold text-xl tracking-tight">
                  Actimize Screen Mockup
                </h1>
                <p className="text-slate-400 text-xs font-medium tracking-wide">
                  Demo Interface
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm 
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
                    )}
                    
                    {/* Icon */}
                    <span className="relative z-10 flex items-center justify-center">
                      {item.icon}
                    </span>
                    
                    {/* Label */}
                    <span className="relative z-10 tracking-wide">
                      {item.label}
                    </span>
                    
                    {/* Hover Effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User/Settings Section (Optional) */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-xs text-slate-400 font-medium">System Status</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400 font-bold">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
