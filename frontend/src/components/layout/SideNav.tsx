import { NavLink } from 'react-router-dom';
import type { CategoryType } from '../../types/index';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import DataState from '../DataState';
import { RxHamburgerMenu } from "react-icons/rx";
import { useEffect, useRef, useState } from 'react';
import { useContext } from "react";
import { AuthContext } from "../../context/authcontext";

const SideNav = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("AuthContext not found");

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const { data, fetchError, isLoading } = useAxiosFetch<CategoryType[]>(
    `/categories`
  );

  const categories = data ?? [];

  const toggleMenu = () => setOpen(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <DataState
      isLoading={isLoading}
      error={fetchError}
      isEmpty={categories.length === 0 && !isLoading && !fetchError}
      emptyMessage="No categories to display. You should make one!"
    >
      <div className="SideNav" ref={menuRef}>
        <button
          className="btn-minimal"
          onClick={toggleMenu}
          style={{ fontSize: "18px", float: "right" }}
        >
          <RxHamburgerMenu />
        </button>

        {open && (
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
                  <NavLink to="/dashboard">Profile</NavLink>
                </li>

                <li>
                  <button onClick={auth.logout}>Log Out</button>
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
        )}
      </div>
    </DataState>
  );
}

export default SideNav;
