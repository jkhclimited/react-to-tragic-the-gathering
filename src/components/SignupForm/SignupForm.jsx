import React from "react";
import './SignupForm.css';

 class SignupForm extends React.Component {
    state = {
        name: '',
        email: '',
        password: '',
        confirm: '',
        error: ''
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, error: '' })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fetchResponse = await fetch('/api/users/signup', {
              method: 'POST',
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({name: this.state.name, email: this.state.email, password: this.state.password,})
            })
            if (!fetchResponse.ok) throw new Error('Fetch failed - Bad request')   
            let token = await fetchResponse.json()
            localStorage.setItem('token', token);
            const userDoc = JSON.parse(atob(token.split('.')[1])).user;
            this.props.setUserInState(userDoc)
        } catch (error) {
            console.log('Signup Form Error', error)
            this.setState({ error: 'Signup Failed - Try Again' })
        }
    }

    render() {
        // returns true if state's password and confirm don't match
        const disable = this.state.password !== this.state.confirm;
        return (
            <div className='signup-container'>
                <form autoComplete="off" onSubmit={this.handleSubmit}>
                <div className='form-group'>
                    <label className='signup-label'>Name: </label>
                    <input className='signup-input' type='text' name='name' value={this.state.name} onChange={this.handleChange} required />
                </div>
                <div className='form-group'>
                    <label className='signup-label'>Email: </label>
                    <input className='signup-input' type='email' name='email' value={this.state.email} onChange={this.handleChange} required />
                </div>
                <div className='form-group'>
                    <label className='signup-label'>Password: </label>
                    <input className='signup-input' type='password' name='password' value={this.state.password} onChange={this.handleChange} required />
                </div>
                <div className='form-group'>
                    <label className='signup-label'>Confirm: </label>
                    <input className='signup-input' type='password' name='confirm' value={this.state.confirm} onChange={this.handleChange} required />
                </div>
                    <button className='signup-input' type='submit' disabled={disable}>Sign Up</button>
                </form>
                <p className='error-message'>&nbsp;{this.state.error}</p>
            </div>
        )
    }
}

export default SignupForm;