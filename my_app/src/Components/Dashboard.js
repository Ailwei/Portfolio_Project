import React from 'react';
import { Link, useNavigate} from 'react-router-dom';
import ViewProfile from './ViewProfile'; 
import ViewPostPage from './ViewPostPage';
import Menu from './Menu';
import CreatePostPage from './CreatePostPage'
import '../styles/Dashboard.css'
import GroupPages from './GroupPages';
import CreateGroupForm from './CreateGroup';
import GetGroupWidget from './GetGroupWidget';
import GetPostWidget from './GetPostWidget';



const Dashboard = () => {
 
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
<div className="dashboard">
  <header className="header">
    <h1>Welcome to the Dashboard</h1>
    <nav>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </nav>
    <div className="user-info">
    
      <CreateGroupForm/>
      <CreatePostPage/>
      <Menu/>
    </div>
  </header>
  <table className="main-content">
    <tbody>
      <tr>
        <td>
          <ViewPostPage/>
        </td>
        <td className="sidebar">
        <GetPostWidget/>
        <GetGroupWidget />
        </td>
      </tr>
    </tbody>
  </table>
  <footer className="footer">
    <p>&copy; 2024 Our Platform. All rights reserved.</p>
  </footer>
</div>

  );
};

export default Dashboard;
