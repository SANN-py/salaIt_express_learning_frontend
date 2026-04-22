import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h2>logo</h2>
        </div>
        <div className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/products">Product</Link>
          <Link to="/location">Location</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
