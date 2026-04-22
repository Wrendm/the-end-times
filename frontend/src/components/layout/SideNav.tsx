import { NavLink } from 'react-router-dom';
import type { CategoryType } from '../../types/index';
import { MdLogout, MdOutlineAccountCircle } from "react-icons/md";
import useAxiosFetch from '../../hooks/useAxiosFetch';
import DataState from '../DataState';
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

const SideNav = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

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
      <div className="SideNav">
          <ul>
            {/* Categories */}
            {categories.map(category => (
              <li key={category.name}>
                <NavLink
                  to={`/categories/${category.name}`}
                  className={({ isActive, isPending }) =>
                    isPending ? "pending" : isActive ? "active" : ""
                  }
                >
                  {category.name}
                </NavLink>
              </li>
            ))}

            {/* Auth section */}
            {auth.user ? (
              <>
                {auth.user.roles.includes("Admin") && (
                  <li>
                    <NavLink to="/admin">Admin Dashboard</NavLink>
                  </li>
                )}

                <li>
                  <NavLink to="/dashboard">Profile <MdOutlineAccountCircle /></NavLink>
                </li>

                <li>
                  <button onClick={auth.logout}>Log Out <MdLogout /></button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>

                <li>
                  <NavLink to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
      </div>
    </DataState>
  );
}

export default SideNav;
