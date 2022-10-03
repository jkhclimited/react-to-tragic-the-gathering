import React from "react";
import { Link } from "react-router-dom";
import CardSearch from "../../components/CardSearch/CardSearch";
import '../Deckbox/Deckbox.css';

class Deckbox extends React.Component {
    state = {
        cards: [],
        cardID: "",
    };

    displayHover = async (e, id) => {
        e.preventDefault();
        await this.setState({cardID: e.currentTarget.id})
        let cardID = this.state.cardID;
        let card = (this.state.cards).find(i => i._id === cardID);
        let thisCardDisplay = document.getElementById("hoverImage");
        thisCardDisplay.innerHTML = `<img src=${card.card.image_link} alt="${card.card.name} from ${card.card.set_name}"></img><br /><p>Card Num: ${card.card.collector_number}<br />Type: ${card.card.type_line}<br />Foil: ${card.card.nonfoil ? "No" : "Yes"}</p>`;
    }

    getCards = async () => {
        try {
            const jwt = localStorage.getItem('token')
            const cardList = await fetch('/api/cards', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(res => res.json());
            this.setState({ cards: cardList });
        } catch (err) {
            console.error("Error:", err);
        }
    };

    componentDidMount = async () => {
        this.getCards()
    };

    handleDelete = async (e) => {
        e.preventDefault();
        console.log(e.currentTarget.id);
        try {
            const jwt = localStorage.getItem('token')
            let options = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
            };
            await fetch(`/api/cards/${e.currentTarget.id}`, options)
            .then(res => {
                if (res.status === 200) {
                    this.getCards();
                } else {
                    console.error("Error code " + res.status);
                }
            })
        } catch (err) {
            console.error("Error:", err); 
        }
    };

    handleQuantitySelect = async (e) => {
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
                    this.getCards();
                } else {
                    console.error("Error code " + res.status + ": " + res.json());
                }
            })
        } catch (err) {
            console.error("Error: ", err);
        }
    };

    render() {
        return (
            <div className='center-div'>                
                <CardSearch addable={true} type={"deckbox"} getCards={this.getCards}/>
                <div id="hoverImage" className="hoverCardImage">
                    <img src="https://i.imgur.com/cI9uGt2.jpeg"></img><br />
                </div>
                <div className="container">
                    <div className="row table-headers">
                        <p className="flex text-align-left table-header-left table-header-right table-header-bottom">Card Name</p>
                        <p className="flex text-align-left table-header-right table-header-bottom">Quantity</p>
                        <p className="flex text-align-left table-header-right table-header-bottom">Set</p>
                        <p className="flex text-align-left table-header-right table-header-bottom">Change Version</p>
                        <p className="flex text-align-left table-header-right table-header-bottom">Delete</p>
                    </div>
                    {this.state.cards.length ? 
                        this.state.cards.map(card => (
                            <div className="text-row">
                                <p className="flex text-align-left" id={card._id} onMouseEnter={this.displayHover}>{card.card.name}</p>
                                <select id={card._id} name="quantity" className="flex" value={card.quantity} onChange={this.handleQuantitySelect}>
                                    <option value='1'>1</option>
                                    <option value='2'>2</option>
                                    <option value='3'>3</option>
                                    <option value='4'>4</option>
                                    <option value='5'>5</option>
                                    <option value='6'>6</option>
                                    <option value='7'>7</option>
                                    <option value='8'>8</option>
                                    <option value='9'>9</option>
                                    <option value='10'>10</option>
                                    <option value='11'>11</option>
                                    <option value='12'>12</option>
                                    <option value='13'>13</option>
                                    <option value='14'>14</option>
                                    <option value='15'>15</option>
                                    <option value='16'>16</option>
                                    <option value='17'>17</option>
                                    <option value='18'>18</option>
                                    <option value='19'>19</option>
                                    <option value='20'>20</option>
                                </select>                                    
                                <p className="flex text-align-left">{card.card.set_name}</p>
                                <Link to={`/cards/${card.card._id}`} id={card.card._id} className="changeVersion">Switch Version</Link>
                                <p className="flex text-align-left">
                                    <button id={card._id} className="delete-button" type="submit" onClick={this.handleDelete}>X</button>
                                </p>
                            </div>
                        ))
                    : <p>No Cards!</p>}
            </div>
        </div>
        )
    }
}

export default Deckbox;
