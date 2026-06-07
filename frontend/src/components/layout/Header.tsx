import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import Nav from "./Nav";
import SideNav from './SideNav';
import { AuthContext } from "../../context/authcontext";
import SearchBar from './SearchBar';

const Header = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      // Ignore clicks on the hamburger button itself
      const target = e.target as HTMLElement;

      if (target.closest("#sidenav-toggle")) {
        return;
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="Header">
      <div className='TopRow'>
        <div className='left desktop-only'>
          <SearchBar />
        </div>
        <div className='middle'>
          <h1><Link to='/'>The End Times</Link></h1>
        </div>
        <div className='right desktop-only'>
          {auth.user ? (
            <div className='AccountActionNav desktop-only'>
              {auth.user?.roles.includes("Admin") && (
                <h3 className='AccountAction'>
                  <Link to="/admin">Admin Dashboard</Link>
                </h3>
              )}

              <h3 className='AccountAction'>
                <Link to='/dashboard'>Profile</Link>
              </h3>

              <h3 className='AccountAction'>
                <button onClick={auth.logout}>Log Out</button>
              </h3>
            </div>
          ) : (
            <div className='AccountActionNav'>
              <h3 className='AccountAction'>
                <Link to='/login'>Login</Link>
              </h3>

              <h3 className='AccountAction'>
                <Link to='/register'>Register</Link>
              </h3>
            </div>
          )}
        </div>
        <div className='right mobile-only mobile-only-flex'>
          <button
            className="btn-minimal"
            onClick={() => setOpen(prev => !prev)}
            style={{ fontSize: "25px" }}
            id="sidenav-toggle"
          >
            <RxHamburgerMenu />
          </button>
        </div>

      </div>
      <div className='desktop-only'>
        <Nav />
      </div>
      <div className='mobile-only' ref={menuRef}>
        {open && <SideNav />}
      </div>

    </div>
  );
};

export default Header;