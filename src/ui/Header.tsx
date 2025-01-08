// src/components/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul className="header-nav">
          <li>
            <NavLink className="nav-item" to="/">
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink className="nav-item" to="/create-product">
              Создать продукт
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
