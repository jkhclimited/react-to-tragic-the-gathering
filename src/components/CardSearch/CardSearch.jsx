import React, { useEffect, useState } from 'react';
import { getCardData } from '../../services/scryfall-api';
import './CardSearch.css';

class CardSearch extends React.Component {
    state = {
        name: "",
        set: "",
        card: "",
        cards: [],
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let name = this.state.name;
        let set = this.state.set;
        const cardData = await getCardData(name, set);
        this.setState({card: cardData, name: "", set: ""});
    };

    handleAdd = async (e) => {
        e.preventDefault();
        let deckId;
        if (this.props.type === "deck") {
            deckId = this.props.deckId;
        };
        try {
            const jwt = localStorage.getItem('token');
            const body = { card: this.state.card, deck: deckId };
            let options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify(body)
            };
            if (this.props.type === "deckbox") {
                await fetch('/api/cards', options)
                .then(res => {
                    if (res.status === 400) {
                        this.props.getCards();
                        console.error("Error code " + res.status + ": " + res.json());
                    } else {
                        this.props.getCards();
                    }
                })
            } else if (this.props.type === "deck") {
                await fetch('/api/decks/addcard', options)
                .then(res => {
                    if (res.status === 201) {
                        this.props.getCards();
                    } else {
                        console.error("Error code " + res.status + ": " + res.json());
                    }
                })
            }
        } catch (err) {
            console.error("Error:", err);
        }
    }

    displayCard(card) {
        if (card.name) {
            return (
                <p> 
                    <span><strong>Name: </strong>{card.name}</span><br/>
                    <span><strong>Mana Cost: </strong>{card.mana_cost}</span><br/>
                    <span><strong>Type: </strong>{card.type_line}</span><br/>
            
                    { (card.power && card.toughness) ? 
                        <span><strong>Power: </strong>{card.power}, <strong>Toughness: </strong>{card.toughness}</span>
                        : '' }
                    <br/><span><strong>Set: </strong>{card.set.toUpperCase()}, <strong>Set Name: </strong>{card.set_name}, <strong>Card No: </strong>{card.collector_number}</span><br/>
                    <span><strong>Oracle Text: </strong>{card.oracle_text}</span>
                </p>
            )
        } else if (card.code) {
            return (
                <p>No card with that name has been found.</p>
            )
        } else {
            return (
                <p>Please search for a card.</p>
            )
        }

    }
    
    noSuchCard() {
        <p>No card with that name has been found.</p>
    }
    
    inputCard() {
        <p>Please search for a card.</p>
    }

    render() {
        return (
            <div>
                <div className="search-center-div">
                    <form action="/home" method="GET">
                        <h1 className="text-center">Tragic the Gathering</h1>
                        <div className="search-group">
                            <label className="search-label" htmlFor="name">Card Name</label>
                            <input type="text" 
                                name="name" 
                                className="block" 
                                placeholder="Enter a Card Name" 
                                value={this.state.name} 
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="search-group">
                            <label className="search-label" htmlFor="set">Card Set (Optional)</label>
                            <input 
                                type="text" 
                                name="set" 
                                className="block" 
                                placeholder="Set Name" 
                                value={this.state.set}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="search-group-button">
                            <button className="button block" type="submit" onClick={this.handleSubmit}>Search</button>
                        </div>
                        { this.props.addable === true ?
                        <div className="add-button">
                            <button className="button block" type="submit" onClick={this.handleAdd}>Add Card</button>
                        </div>
                        : "" }
                    </form>
                </div>
                <div className="search-results">
                    {this.displayCard(this.state.card)}
                </div>
            </div>
        )
    }
};

export default CardSearch;