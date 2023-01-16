import React from 'react';
import { getCardPrints } from '../../services/get-all-prints';

class PrintChange extends React.Component {
    state = {
        cardName: "",
        prints: [],
    }

    componentDidMount = async () => {
        this.getPrints();
    }

    getPrints = async () => {
        this.setState({ prints: [] });
        let prints = [];
        let pathName = window.location.pathname;
        let cardId = pathName.split('/')[2];
        try {
            const jwt = localStorage.getItem('token')
            const card = await fetch(`/api/cards/${cardId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(res => res.json());
            const cardPrints = await getCardPrints(card.name);
            this.setState({cardName: card.name})
            cardPrints.data.forEach(function(card) {
                let cardObj = { collector_number: card.collector_number, set: card.set, set_name: card.set_name, rarity: card.rarity, image_link: card.image_uris.normal, image_small: card.image_uris.small }
                prints.push(cardObj);
            })
            this.setState({prints: prints});
            console.log(this.state.prints);
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    render() {
        return (
            <div>
                {this.state.cardName}
                {this.state.prints.map(print => (
                    <div>
                        <p>{print.set_name}</p>
                    </div>
                ))}
            </div>
        )
    }
}

export default PrintChange;