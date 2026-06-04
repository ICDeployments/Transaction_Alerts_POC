import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity } from 'lucide-react';
// Logo images
const cognizantLogo = '/image_folder/Cognizant-Logo.wine (1).png';
const Layout = ({ children }) => {
    const location = useLocation();
    const navItems = [
        { path: '/', label: 'Alert Center', icon: _jsx(Shield, { size: 18 }) },
        { path: '/system-flow', label: 'System Flow', icon: _jsx(Activity, { size: 18 }) }
    ];
    return (_jsxs("div", { className: "min-h-screen flex flex-col bg-slate-950", children: [_jsx("nav", { className: "sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 shadow-xl", children: _jsx("div", { className: "mx-auto px-8", children: _jsxs("div", { className: "flex items-center justify-between h-20", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "relative group", children: _jsx("div", { className: "relative h-14 px-4 bg-white rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow", children: _jsx("img", { src: cognizantLogo, alt: "Cognizant", className: "h-10 w-auto object-contain" }) }) }), _jsxs("div", { className: "border-l border-slate-700 pl-4", children: [_jsx("h1", { className: "text-white font-bold text-xl tracking-tight", children: "Actimize Screen Mockup" }), _jsx("p", { className: "text-slate-400 text-xs font-medium tracking-wide", children: "Demo Interface" })] })] }), _jsx("div", { className: "flex items-center gap-3", children: navItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (_jsxs(Link, { to: item.path, className: `
                      relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm 
                      transition-all duration-200 group
                      ${isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800'}
                    `, children: [isActive && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50" })), _jsx("span", { className: "relative z-10 flex items-center justify-center", children: item.icon }), _jsx("span", { className: "relative z-10 tracking-wide", children: item.label }), !isActive && (_jsx("div", { className: "absolute inset-0 bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" }))] }, item.path));
                                }) }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { className: "px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700", children: [_jsx("div", { className: "text-xs text-slate-400 font-medium", children: "System Status" }), _jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full animate-pulse" }), _jsx("span", { className: "text-xs text-emerald-400 font-bold", children: "Online" })] })] }) })] }) }) }), _jsx("main", { className: "flex-1 overflow-auto", children: children })] }));
};
export default Layout;
//# sourceMappingURL=Layout.js.map