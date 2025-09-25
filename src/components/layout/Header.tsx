import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, UserPlus, PlusCircle } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Events', icon: Calendar },
    { path: '/register', label: 'Register', icon: UserPlus },
    { path: '/create-event', label: 'Create Event', icon: PlusCircle },
  ];

  return (
    <header className="gradient-hero shadow-elegant">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-bold text-primary-foreground">
              EventMaster
            </h1>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path}>
                <Button
                  variant={location.pathname === path ? "secondary" : "ghost"}
                  className={location.pathname === path ? 
                    "text-primary bg-white/20 hover:bg-white/30" :
                    "text-primary-foreground hover:bg-white/10"
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            ))}
            <Link to="/admin">
              <Button
                variant={location.pathname === '/admin' ? "secondary" : "ghost"}
                className={location.pathname === '/admin' ? 
                  "text-primary bg-white/20 hover:bg-white/30" :
                  "text-primary-foreground hover:bg-white/10"
                }
              >
                Admin
              </Button>
            </Link>
          </nav>

          <div className="md:hidden">
            <Button variant="ghost" className="text-primary-foreground">
              <Calendar className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;