import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <div className="Nav">
        <ul>
            <li><Link to='paintings'>Paintings</Link></li>
            <li><Link to='photography'>Photography</Link></li>
            <li><Link to='poetry'>Poetry</Link></li>
            <li><Link to='essays'>Essays</Link></li>
            <li><Link to='fashion'>Fashion</Link></li>
        </ul>
    </div>
  )
}

export default Nav