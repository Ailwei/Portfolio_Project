import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Menu.css';
import {useNavigate} from 'react-router-dom'



const Menu = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const HandleProfileUpdateClick = () => {
    navigate('/Profile')
  }

  return (
    <div className="menu-container">
      <button className="menu-toggle" onClick={toggleMenu}>
        {isOpen ? 'Close Menu' : 'Menu'}
      </button>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/profile-update" onClick={HandleProfileUpdateClick} className="menu-link">Update Profile</Link>
          </li>
          <li className="menu-item">
            <Link to="/view-groups" className="menu-link">View Groups</Link>
          </li>
          <li className="menu-item">
            <Link to="/blocked-users" className="menu-link">Blocked Users</Link>
          </li>
          <li className="menu-item">
            <Link to="/unfollow-users" className="menu-link">Unfollow Users</Link>
          </li>
          <li className="menu-item">
            <button className="delete-account-button">Delete Account</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Menu;
