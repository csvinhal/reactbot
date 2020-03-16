import React from "react";
import { Link } from "react-router-dom";

const Header = () => (
  <nav>
    <div className="nav-wrapper row">
      <div className="col s12">
        <Link to={"/"} className="brand-logo">
          IT courses
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li>
            <Link to={"/shop"}>Shop</Link>
          </li>
          <li>
            <Link to={"/about"}>About us</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Header;
