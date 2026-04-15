import { NavLink } from 'react-router-dom';
import type { CategoryType } from '../types/index';
import useAxiosFetch from '../hooks/useAxiosFetch';
import DataState from './DataState';
const Nav = () => {
  const { data, fetchError, isLoading } = useAxiosFetch<CategoryType[]>(
    `/categories`
  );

  const categories = data ?? [];

  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={categories.length === 0 && !isLoading && !fetchError}
      emptyMessage="No categories to display. You should make one!"
    >
      <div className="Nav">
        <ul>
          {categories.map(category => (
            <li key={category.name}>
              <NavLink to={`/categories/${category.name}`} className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }>{category.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>
    </DataState>
  );
}

export default Nav;
