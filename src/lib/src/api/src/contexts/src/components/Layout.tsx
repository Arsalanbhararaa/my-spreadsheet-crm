import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Sun, 
  Moon, 
  Menu, 
  ChevronLeft,
  Building2
} from 'lucide-react';

export default function Layout() {
  const { isDark, toggleTheme, sidebarCollapsed, toggleSidebar } = useApp();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: TrendingUp },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Transactions', href: '/transactions', icon: DollarSign },
  ];

  return (
    <div className={`min-h-screen flex ${isDark ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <aside 
        className={`border-r transition-all duration-300 flex flex-col justify-between
          ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
          ${sidebarCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div>
          {/* Logo Brand Frame */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-inherit">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  H
                </div>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  CRM Hub
                </span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 mx-auto rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                H
              </div>
            )}
            <button 
              onClick={toggleSidebar} 
              className={`p-1.5 rounded-lg hover:bg-slate-500/10 hidden md:block`}
            >
              {sidebarCollapsed ? <Menu size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                      : 'hover:bg-slate-500/10 text-slate-400 hover:text-inherit'}`}
                >
                  <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500 transition-colors'} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Theme Control Toggler */}
        <div className="p-3 border-t border-inherit">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-500/10 text-slate-400 hover:text-inherit transition-all"
          >
            {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-600" />}
            {!sidebarCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Screen Dynamic Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`h-16 border-b flex items-center justify-end px-6 md:px-8 gap-4 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold leading-none">Workspace Hub</p>
              <p className="text-xs text-slate-400 mt-1">Hexa Flow • HFA • AWT</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
              A
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          {/* Outlet is where the current subpage view renders dynamically */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}