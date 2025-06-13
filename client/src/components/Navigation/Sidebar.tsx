import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: "fas fa-th-large",
      path: "/dashboard",
      description: "Overview & Analytics"
    },
    {
      title: "Energy Access",
      icon: "fas fa-bolt",
      path: "/energy",
      description: "Grid & Distribution",
      submenu: [
        {
          title: "Community Vulnerability",
          icon: "fas fa-shield-alt",
          path: "/energy/vulnerability",
          description: "Assessment & Mapping"
        },
        {
          title: "Energy Distribution",
          icon: "fas fa-project-diagram",
          path: "/energy/distribution",
          description: "Grid Planning & Optimization"
        }
      ]
    },
    {
      title: "Climate Action",
      icon: "fas fa-leaf",
      path: "/climate",
      description: "Tracking & Implementation",
      submenu: [
        {
          title: "Action Tracker",
          icon: "fas fa-tasks",
          path: "/climate/actions",
          description: "Initiative Management"
        },
        {
          title: "Progress Monitor",
          icon: "fas fa-chart-line",
          path: "/climate/progress",
          description: "Performance Analytics"
        }
      ]
    },
    {
      title: "Sustainability",
      icon: "fas fa-seedling",
      path: "/sustainability",
      description: "Equitable Future Building",
      submenu: [
        {
          title: "Sustainable Jobs",
          icon: "fas fa-briefcase",
          path: "/sustainability/jobs",
          description: "Green Economy Opportunities"
        },
        {
          title: "Cultural Heritage",
          icon: "fas fa-landmark",
          path: "/sustainability/cultural",
          description: "Preservation & Documentation"
        },
        {
          title: "Economic Equity",
          icon: "fas fa-balance-scale",
          path: "/sustainability/equity",
          description: "Fair Distribution & Transparency"
        }
      ]
    }
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const sidebarVariants = {
    hidden: { x: -320 },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-80 h-full glass backdrop-blur-xl border-r border-white/10"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <motion.div variants={itemVariants} className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-globe-americas text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Climate AI</h1>
                <p className="text-xs text-white/60">Energy & Climate Platform</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </motion.div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.div key={item.path} variants={itemVariants} className="space-y-1">
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                    isActiveLink(item.path)
                      ? 'bg-gradient-to-r from-blue-500/20 to-green-500/20 text-white border border-blue-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActiveLink(item.path)
                      ? 'bg-blue-500/30 text-blue-400'
                      : 'bg-white/10 text-white/70 group-hover:text-white group-hover:bg-white/20'
                  }`}>
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.title}</div>
                    <div className="text-xs text-white/50 truncate">{item.description}</div>
                  </div>
                  {item.submenu && (
                    <i className="fas fa-chevron-right text-xs text-white/50"></i>
                  )}
                </Link>

                {/* Submenu */}
                {item.submenu && isActiveLink(item.path) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 space-y-1 border-l border-white/10 pl-4"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-sm ${
                          location.pathname === subItem.path
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <i className={`${subItem.icon} text-xs`}></i>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{subItem.title}</div>
                          <div className="text-xs text-white/40 truncate">{subItem.description}</div>
                        </div>
                        {location.pathname === subItem.path && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>
        </div>

        {/* System Status */}
        <motion.div variants={itemVariants} className="p-4 border-t border-white/10">
          <div className="glass p-4 rounded-xl">
            <h3 className="text-sm font-semibold text-white mb-3">System Status</h3>
            <div className="space-y-2">
              {[
                { label: "AI Algorithms", status: "online", color: "bg-green-400" },
                { label: "Data Streams", status: "online", color: "bg-green-400" },
                { label: "3D Rendering", status: "optimal", color: "bg-blue-400" },
                { label: "API Services", status: "healthy", color: "bg-green-400" }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white/70 text-xs">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}></div>
                    <span className="text-white text-xs capitalize">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Climate AI v2.1.0</span>
            <div className="flex items-center space-x-3">
              <button className="hover:text-white transition-colors">
                <i className="fas fa-cog"></i>
              </button>
              <button className="hover:text-white transition-colors">
                <i className="fas fa-question-circle"></i>
              </button>
              <button className="hover:text-white transition-colors">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
