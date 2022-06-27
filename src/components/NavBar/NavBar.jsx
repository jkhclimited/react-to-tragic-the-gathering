import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

class NavBar extends React.Component {
    handleLogout = () => {
        localStorage.removeItem('token');
        this.props.setUserInState(null);
    }

    render() {
        return (
            <nav className="header-bar">
                <Link to="/home" className="">Main Page</Link>
                <Link to="/cards" className="">Cards List</Link>
                <Link to="/decks" className="">Decks List</Link>
                { this.props.user ?
                    <a href="/logout" className="" onClick={this.handleLogout}>Logout</a>
                    : <Link to="/authenticate" className="">Login/Sign Up</Link>
                }
            </nav>
        )
    }
}

export default NavBar;