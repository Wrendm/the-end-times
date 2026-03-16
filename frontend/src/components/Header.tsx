import { Link } from 'react-router-dom';
import Nav from "./Nav";
import { useContext } from "react";
import { AuthContext } from "../context/authcontext";

const Header = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");
  return (
    <div className="Header">
        <h1><Link to='/'>The End Times</Link></h1>
        <Nav />
          {auth.user ? (
            <div className='AccountActionNav'>
              <h3 className='AccountAction'><Link to='/dashboard'>Profile</Link></h3>
              <h3 className='AccountAction'><Link to='/logout'>Log Out</Link></h3>
           </div>
           ) : (
            <div className='AccountActionNav'>
              <h3 className='AccountAction'><Link to='/login'>Login</Link></h3>
              <h3 className='AccountAction'><Link to='/register'>Register</Link></h3>
            </div>
           )}

    </div>
  )
}

export default Header