import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../assets/logo.png'; // update path if needed
import { logout, isAuthenticated } from '../api/auth';

function CustomNavbar() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setLoggedIn(isAuthenticated());
    }, []);

    return (
        <Navbar  variant="dark" expand="lg" sticky="top" className="custom-navbar">
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
                        <Nav.Link as={Link} to="/#features">Features</Nav.Link>
                        <Nav.Link as={Link} to="/#visuals">How It Works</Nav.Link>
                        <Nav.Link as={Link} to="/expenses">Expenses</Nav.Link>
                        <Nav.Link as={Link} to="/menu-edit">Menu</Nav.Link>
                        {loggedIn ? (
                            <Nav.Link onClick={logout} style={{ cursor: 'pointer', color: 'red' }}>Logout</Nav.Link>
                        ) : (
                            <Nav.Link as={Link} to="/sign-in">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
