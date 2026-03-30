import { Link } from 'react-router-dom';

const Nav = () => {
  const categories = ['Painting', 'Photography', 'Poetry', 'Essay', 'Fashion'];

  return (
    <div className="Nav">
      <ul>
        {categories.map(category => (
          <li key={category}>
            <Link to={`/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Nav;