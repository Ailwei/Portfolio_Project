import React from 'react';
import { Link } from 'react-router-dom';


import communityImage from '../images/community.jpg';

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
      <section className="features">
        <div className="feature">
          <h3>Join Groups/Follow users</h3>
          <p>Stay updated with the latest content from users you follow.</p>
        </div>
        <div className="feature">
          <h3>Send Messages</h3>
          <p>Connect with other users through private messaging.</p>
        </div>
        <div className="feature">
          <h3>Create Posts</h3>
          <p>Share your thoughts, ideas, and experiences with the community.</p>
        </div>
      </section>
      <section className="testimonials">
        <div className="testimonial">
          <blockquote>"This platform has helped me connect with like-minded individuals and expand my network."</blockquote>
          <cite>- John Doe</cite>
        </div>
        <div className="testimonial">
          <blockquote>"I love the simplicity and usability of this platform. It's easy to navigate and interact with others."</blockquote>
          <cite>- Jane Smith</cite>
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

