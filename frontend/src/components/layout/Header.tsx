import { Link } from 'react-router-dom';
import Nav from "./Nav";
import SideNav from './SideNav';
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

const Header = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");
  return (
    <div className="Header">
      <div className='TopRow'>
        <h1><Link to='/'>The End Times</Link></h1>
        <div className='mobile-only'>
          <SideNav />
        </div>
        <div className='desktop-only'>
          {auth.user ? (
            <div className='AccountActionNav desktop-only'>
              {auth.user?.roles.includes("Admin") && (
                <h3 className='AccountAction'>
                  <Link to="/admin">Admin Dashboard</Link>
                </h3>
              )}
              <h3 className='AccountAction'><Link to='/dashboard'>Profile</Link></h3>
              <h3 className='AccountAction'><button onClick={auth.logout}>Log Out</button></h3>
            </div>
          ) : (
            <div className='AccountActionNav'>
              <h3 className='AccountAction'><Link to='/login'>Login</Link></h3>
              <h3 className='AccountAction'><Link to='/register'>Register</Link></h3>
            </div>
          )}
        </div>
      </div>
      <div className='desktop-only'>
        <Nav />
      </div>
    </div>
  )
}

export default Header