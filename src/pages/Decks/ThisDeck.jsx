import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CardSearch from '../../components/CardSearch/CardSearch';

export const ThisDeck = () => {
    const [state, setState] = useState({
        deck: "",
        deckID: "",
        cards: [],
    })

    const { id: deckId } = useParams();

    useEffect(() => {
        getCards();
    }, []);

    const getCards = async () => {
        try {
            const jwt = localStorage.getItem('token')
            const decksList = await fetch(`/api/decks/${deckId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(res => res.json());
            if (decksList.cards) {
                setState({ deckID: deckId, cards: decksList.cards });
            } else {
                console.error("Error");
            }
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const jwt = localStorage.getItem('token')
            const cardID = e.currentTarget.id;
            let options = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
            };
            await fetch(`/api/cards/${cardID}`, options)
            .then(res => {
                if (res.status === 200) {
                    getCards();
                } else {
                    console.error("Error code " + res.status);
                }
            })
        } catch (err) {
            console.error("Error: ", err); 
        }
    }

    const handleSelect = async (e) => {
        try {
            const jwt = localStorage.getItem('token')
            const cardID = e.currentTarget.id;
            const quanInt = parseInt(e.currentTarget.value);
            const body = { cardId: cardID, quantity: quanInt };
            let options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify(body)
            };
            await fetch('/api/cards', options)
            .then(res => {
                if (res.status === 201) {
                    getCards();
                } else {
                    console.error("Error code " + res.status + ": " + res.json());
                }
            })
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    return (
        <>
            <div className='center-div'>
            <CardSearch addable={true} getCards={getCards} type={"deck"} deckId={deckId}/>
            <div className="container">
                <div className="row table-headers">
                    <p className="flex table-header-left table-header-right table-header-bottom">Quantity</p>
                    <p className="flex table-header-right table-header-bottom">Card Name</p>
                    <p className="flex table-header-right table-header-bottom">Set</p>
                    <p className="flex table-header-right table-header-bottom">Num</p>
                    <p className="flex table-header-right table-header-bottom">Type</p>
                    <p className="flex table-header-right table-header-bottom">Foil?</p>
                    <p className="flex table-header-right table-header-bottom">Delete</p>
                </div>
                {state.cards.length ? 
                    state.cards.map(card => (
                        <div className="text-row">
                            <select id={card._id} name="quantity" className="flex" defaultValue={card.quantity} onChange={handleSelect}>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                            </select>
                            <p className="flex" id={card._id}>{card.name}</p>                                    
                            <p className="flex">{card.set_name}</p>
                            <p className="flex">{card.collector_number}</p>
                            <p className="flex">{card.type_line}</p>
                            <p className="flex">{card.nonfoil ? "No" : "Yes"}</p>
                            <p className="flex">
                                <button id={card._id} className="delete-button" type="submit" onClick={handleDelete}>X</button>
                            </p>
                        </div>
                    ))
                : <p>No Cards!</p>}
                </div>
            </div>
        </>
    )
}