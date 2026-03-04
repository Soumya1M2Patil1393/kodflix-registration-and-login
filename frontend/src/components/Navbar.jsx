import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-logo">
          KODFLIX
        </Link>
        
        {isAuthenticated && (
          <ul className="navbar-links">
            <li><Link to="/dashboard">Home</Link></li>
            <li><Link to="/dashboard?category=tv-shows">TV Shows</Link></li>
            <li><Link to="/dashboard?category=movies">Movies</Link></li>
            <li><Link to="/dashboard?category=popular">Popular</Link></li>
          </ul>
        )}
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <div className="navbar-user">
            <span className="navbar-username">{user?.username}</span>
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </button>
              
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleLogout} className="dropdown-item">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="navbar-auth">
            <Link to="/login" className="navbar-signin">Sign In</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
