import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import logo from '../assets/logo.png'; // update path if needed

function CustomNavbar() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={logo}
                        alt="AharConnect Logo"
                        width="40"
                        height="40"
                        className="d-inline-block align-top me-2"
                    />
                    <span className="brand-text">AharConnect</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="navbar-nav" />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/#features">Features</Nav.Link>
                        <Nav.Link as={Link} to="/#visuals">How It Works</Nav.Link>
                        <Nav.Link as={Link} to="/#testimonials">Testimonials</Nav.Link>
                        <Nav.Link as={Link} to="/auth">Get Started</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
