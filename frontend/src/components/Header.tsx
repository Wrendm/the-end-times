import { Link } from 'react-router-dom';
import Nav from "./Nav";

const Header = () => {
  return (
    <div className="Header">
        <h1><Link to='/'>The End Times</Link></h1>
        <Nav />
    </div>
  )
}

export default Header