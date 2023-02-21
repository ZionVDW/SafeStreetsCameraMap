import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <div className="heading">
      <ul>
        <div className="left">
          <p>Overzicht van Camera's</p>
        </div>
        {/* <li>
          <Link to="/login">Login</Link>
        </li> */}
        <li>
          <Link to="/camera">Cameras</Link>
        </li>
        <li>
          <Link to="/" onClick={useLocation(0)}>
            Map
          </Link>
        </li>
      </ul>
    </div>
  );
}
