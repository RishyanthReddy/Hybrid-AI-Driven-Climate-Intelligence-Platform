import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Search, Settings, User, LogOut, Globe, Zap, Activity } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggle3D: () => void;
  show3D: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onToggle3D, show3D }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'Dashboard';
      case '/energy/vulnerability':
        return 'Community Vulnerability';
      case '/energy/distribution':
        return 'Energy Distribution';
      case '/climate/actions':
        return 'Action Tracker';
      case '/climate/progress':
        return 'Progress Monitor';
      default:
        return 'Climate AI Platform';
    }
  };

  const getPageIcon = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return 'fas fa-th-large';
      case '/energy/vulnerability':
        return 'fas fa-shield-alt';
      case '/energy/distribution':
        return 'fas fa-project-diagram';
      case '/climate/actions':
        return 'fas fa-tasks';
      case '/climate/progress':
        return 'fas fa-chart-line';
      default:
        return 'fas fa-globe-americas';
    }
  };

  const breadcrumbs = React.useMemo(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Dashboard', path: '/dashboard' }];
    
    if (pathSegments.length > 0) {
      if (pathSegments[0] === 'energy') {
        crumbs.push({ label: 'Energy Access', path: '/energy' });
        if (pathSegments[1] === 'vulnerability') {
          crumbs.push({ label: 'Community Vulnerability', path: '/energy/vulnerability' });
        } else if (pathSegments[1] === 'distribution') {
          crumbs.push({ label: 'Energy Distribution', path: '/energy/distribution' });
        }
      } else if (pathSegments[0] === 'climate') {
        crumbs.push({ label: 'Climate Action', path: '/climate' });
        if (pathSegments[1] === 'actions') {
          crumbs.push({ label: 'Action Tracker', path: '/climate/actions' });
        } else if (pathSegments[1] === 'progress') {
          crumbs.push({ label: 'Progress Monitor', path: '/climate/progress' });
        }
      }
    }
    
    return crumbs;
  }, [location.pathname]);

  const headerVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <motion.header 
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="h-16 glass backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between relative z-40"
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onToggleSidebar}
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <i className="fas fa-bars"></i>
        </Button>

        <div className="h-6 w-px bg-white/20"></div>

        {/* Page Title and Breadcrumbs */}
        <div className="flex items-center space-x-3">
          <div className="p-2 glass rounded-lg">
            <i className={`${getPageIcon()} text-blue-400`}></i>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
            <nav className="flex items-center space-x-2 text-sm text-white/60">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  <span 
                    className={`${
                      index === breadcrumbs.length - 1 ? 'text-white/80' : 'hover:text-white cursor-pointer'
                    }`}
                  >
                    {crumb.label}
                  </span>
                  {index < breadcrumbs.length - 1 && (
                    <i className="fas fa-chevron-right text-xs"></i>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Center Section - Quick Stats */}
      <div className="hidden lg:flex items-center space-x-6">
        <div className="flex items-center space-x-4 glass px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">System Online</span>
          </div>
          <div className="h-4 w-px bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Global Coverage</span>
          </div>
          <div className="h-4 w-px bg-white/20"></div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-medium">98.7% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            placeholder="Search actions, data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder-white/50"
          />
        </div>

        {/* 3D Toggle */}
        <Button
          onClick={onToggle3D}
          variant={show3D ? "default" : "outline"}
          size="sm"
          className="text-white/70 hover:text-white"
        >
          <i className="fas fa-cube mr-2"></i>
          3D View
        </Button>

        <div className="h-6 w-px bg-white/20"></div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-white/70 hover:text-white">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {notifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Energy Grid Optimization Complete</p>
                  <p className="text-sm text-muted-foreground">Efficiency improved by 12% in Sector 7</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Climate Score Updated</p>
                  <p className="text-sm text-muted-foreground">Monthly assessment shows +5 point improvement</p>
                  <p className="text-xs text-muted-foreground">15 minutes ago</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Vulnerability Alert</p>
                  <p className="text-sm text-muted-foreground">High risk communities identified in Region C</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <i className="fas fa-palette mr-2"></i>
              Theme Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-bell mr-2"></i>
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <i className="fas fa-download mr-2"></i>
              Export Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <i className="fas fa-question-circle mr-2"></i>
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white">
                  CA
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Climate Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@climateai.org
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Zap className="mr-2 h-4 w-4" />
              <span>API Keys</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;
