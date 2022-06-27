import React from "react";
import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';
import './AuthPage.css';

class AuthPage extends React.Component {
    state = {
        showLogin: true,
    }

    render() {
        return (
            <div className="AuthPage">
                <h1 className="text-center" onClick={() => this.setState({ showLogin: !this.state.showLogin })}>
                    { this.state.showLogin ? "Log In (Click Here to Sign Up)" : "Sign Up (Click Here to Log In)" }
                </h1>
                { this.state.showLogin ? (<LoginForm setUserInState={this.props.setUserInState}/>) 
                : (<SignupForm setUserInState={this.props.setUserInState}/>) }
            </div>
        )
    }
}

export default AuthPage;