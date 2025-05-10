import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../assets/logo.png';
import { logout, isAuthenticated } from '../api/auth';

function CustomNavbar() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);
    const location = useLocation();

    useEffect(() => {
        setLoggedIn(isAuthenticated());
        // Get user type from localStorage or your auth context
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
    }, []);

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setUserType(null);
    };

    return (
        <Navbar variant="dark" expand="lg" sticky="top" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={logo}
                        alt="AharConnect Logo"
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                    />
                    <span className="brand-text">AharConnect</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        {/* Public Routes */}
                        <Nav.Link as={Link} to="/restaurants" className={location.pathname === '/restaurants' ? 'active' : ''}>
                            Restaurants
                        </Nav.Link>
                        <Nav.Link as={Link} to="/events" className={location.pathname === '/events' ? 'active' : ''}>
                            Event Spaces
                        </Nav.Link>

                        {/* Authentication and User-specific Routes */}
                        {loggedIn ? (
                            <>
                                {/* Restaurant Dashboard - Only for restaurant users */}
                                {userType === 'restaurant' && (
                                    <Nav.Link 
                                        as={Link} 
                                        to="/restaurant-dashboard" 
                                        className={location.pathname === '/restaurant-dashboard' ? 'active' : ''}
                                    >
                                        Dashboard
                                    </Nav.Link>
                                )}

                                {/* Profile and Messages - Only for foodie users */}
                                {userType === 'foodie' && (
                                    <>
                                        <Nav.Link 
                                            as={Link} 
                                            to="/foodie-profile" 
                                            className={location.pathname === '/foodie-profile' ? 'active' : ''}
                                        >
                                            Profile
                                        </Nav.Link>
                                        <Nav.Link 
                                            as={Link} 
                                            to="/messages" 
                                            className={location.pathname === '/messages' ? 'active' : ''}
                                        >
                                            Messages
                                        </Nav.Link>
                                    </>
                                )}

                                {/* Logout for all authenticated users */}
                                <Nav.Link onClick={handleLogout} className="logout-link">
                                    Logout
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/sign-in" className={location.pathname === '/sign-in' ? 'active' : ''}>
                                    Login
                                </Nav.Link>
                                <Nav.Link as={Link} to="/sign-up" className={location.pathname === '/sign-up' ? 'active' : ''}>
                                    Sign Up
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
