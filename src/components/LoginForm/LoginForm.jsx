import React from "react";
import './LoginForm.css';

class LoginForm extends React.Component {
    state = {
        email: "",
        password: "",
        error: "",
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: "" })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fetchResponse = await fetch('/api/users/login', {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: this.state.email, password: this.state.password, })
            })
            if (!fetchResponse.ok) throw new Error('Fetch failed - Bad request')      
            let token = await fetchResponse.json()
            localStorage.setItem('token', token);      
            const userDoc = JSON.parse(atob(token.split('.')[1])).user;
            this.props.setUserInState(userDoc)
        } catch (error) {
            console.log('Login Error', error);
            this.setState({ error: 'Incorrect Email or Password - Try Again' });
        }
    }

    render() {
        return (
            <div className='login-container' onSubmit={this.handleSubmit}>
                <form autoComplete="off">
                    <div className='form-group'>
                        <label className='left'>Email: </label>
                        <input className='input' type='text' name='email' value={this.state.email} onChange={this.handleChange} required />
                    </div>
                    <div className='form-group'>
                        <label className='left'>Password: </label>
                        <input className='input' type='password' name='password' value={this.state.password} onChange={this.handleChange} required />
                    </div>
                    <div className='form-group'>
                        <button className='input' type='submit'>Login</button>
                    </div>
                    
                </form>
                <p className='error-message'>&nbsp;{this.state.error}</p>
            </div>
        )
    }
}

export default LoginForm;