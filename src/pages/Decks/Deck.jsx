import React from 'react';
import '../Decks/Deck.css';

class Decks extends React.Component {
    state = {
        deck: "",
        decks: [],
        deckID: "",
    }

    getDecks = async () => {
        try {
            const jwt = localStorage.getItem('token')
            const decksList = await fetch('/api/decks', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(res => res.json());
            this.setState({ decks: decksList });
        } catch (err) {
            console.error("Error:", err);
        }
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    handleAdd = async (e) => {
        e.preventDefault();
        try {
            const jwt = localStorage.getItem('token')
            const body = { deck: this.state.deck }
            console.log(body);
            let options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify(body)
            };
            await fetch('/api/decks', options)
            .then(res => {
                if (res.status === 201) {
                    this.getDecks();
                } else {
                    console.error("Error code " + res.status + ": " + res.json());
                }
            })
        } catch (err) {
            console.error("Error:", err);
        }
    }

    handleDelete = async (e) => {
        e.preventDefault();
        try {
            const jwt = localStorage.getItem('token');
            await this.setState({deckID: e.currentTarget.id});
            let options = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
            };
            await fetch(`/api/decks/${this.state.deckID}`, options)
            .then(res => {
                if (res.status === 200) {
                    this.getDecks();
                } else {
                    console.error("Error code " + res.status);
                }
            });
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    componentDidMount = async () => {
        this.getDecks()
    }

    render() {
        return (
            <div>
                <div className='center-div'>
                    <div className='decks-container' onSubmit={this.handleAdd}>
                        <form autoComplete="off" className='deckname-form'>
                            <h1 className='text-center'>Your Decks</h1>
                            <div className='form-group'>
                                <label className="left" htmlFor='deck'>Name:</label>
                                <input className="input" type="text" name="deck" placeholder="Enter a Deck Name" value={this.state.name} onChange={this.handleChange} required />
                            </div>
                            <div className='form-group bottom'>
                                <button className='input' type='submit'>Create Deck</button>
                            </div>
                        </form>
                    </div>
                    <div className="deck-display-container">
                        <div className="row table-headers">
                        <p className="flex table-header-left table-header-right table-header-bottom">Deck Name</p>
                        <p className="flex table-header-right table-header-bottom">Edit Deck</p>
                        <p className="flex table-header-right table-header-bottom">Delete</p>
                        </div>
                        {this.state.decks.length ?
                        this.state.decks.map(deck => (
                            <div className="text-row">
                                <p className="flex">{deck.name}</p>
                                <a href={`/decks/${deck._id}`} className="" id={deck._id}>Edit</a>
                                <p className="flex">
                                        <button id={deck._id} className="delete-button" type="submit" onClick={this.handleDelete}>X</button>
                                </p>
                            </div>
                        ))
                    : <p>No Decks!</p>}
                    </div>
                </div>
            </div>

        )
    }
}

export default Decks;