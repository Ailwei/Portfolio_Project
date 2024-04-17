import React from 'react';
import { Link } from 'react-router-dom';


import communityImage from '../images/community.jpg';
import loginimage from '../images/login.png'
import Groupsimage from '../images/group.png'
import Sendmessagesimage from '../images/sendmessage.png'
import postsimages from '../images/postimages.png'

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header>
        
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/aboutus">About us</Link></li>
           
           
          </ul>
        </nav>
      </header>
      <section className="hero" style={{ backgroundImage: `url(${communityImage})` }}>
        <div className="hero-content">
          <h2>Connect and Interact</h2>
          <p>Join our platform and engage with a vibrant community of users.</p>
          <Link to="/register" className="button">Get Started</Link>
        </div>
      </section>
      <h1 style={{ textAlign: 'center' }}>Features</h1>
      <section className="features">
     
      <div className="feature">
      
          <h3>Login/Register Acoount</h3>
          <p>Stay updated with the latest content from users you follow.</p>
          <img src={loginimage} alt="img" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <div className="feature">
        
          <h3>Create/Join Groups</h3>
          <p>Stay updated with the latest content from users you follow.</p>
          <img src={Groupsimage} alt="img" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <div className="feature">
          <h3>Send messages</h3>
          <p>Connect with other users through private messaging.</p>
          <img src={Sendmessagesimage} alt="img" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <div className="feature">
          <h3>Create Posts/add comments </h3>
          <p>Share your thoughts, ideas, and experiences with the community.</p>
          <img src={postsimages} alt="img" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </section>
      <section className="testimonials">
      <h3 style={{
        color: '#333',
        fontSize: '24px',
        fontWeight: 'bold',
        margin: '10px 0',
        textDecoration: 'underline', 
      }}>About</h3>
        <div className="testimonial">
        <h3>Project Description</h3>
        <p>CommuHub is born out of a personal journey of feeling disconnected in an increasingly digital world. Inspired by my own experiences, I set out to create a solution that prioritizes human connection and inclusivity.</p>
      <p>CommHub aims to provide users with a centralized platform where they can connect with like-minded individuals, participate in meaningful discussions</p>
      <p>Through features such as user authentication and registration, profile management, group creation and management, post and comment functionality, and private messaging, I empower users to build and nurture communities tailored to their interests and needs.</p>
      <p>My journey in developing CommunityHub has been driven by a passion for leveraging technology to bring people together. I believe that by fostering genuine connections and facilitating collaboration, we can create a more connected and compassionate digital world.</p>      </div>
        <div className="testimonial">
        <h3>Links</h3>
        <p>Check out the project repository on <a href="https://github.com/Ailwei/Portfolio_Project">GitHub</a>.</p>
        </div>
      </section>
      <section className="join-community">
        <h2>Join Our Community Today</h2>
        <p>Start exploring, connecting, and sharing with our diverse community of users.</p>
        <Link to="/register" className="button">Get Started</Link>
      </section>
      <footer>
        <p>&copy; 2024 CommHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

