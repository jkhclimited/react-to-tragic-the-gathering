import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCardPrints } from '../../services/get-all-prints';
import '../PrintChange/PrintChange.css';

export const PrintChange = () => {
    const [state, setState] = useState({
        cardName: "",
        prints: [],
        cardNewPrint: {},
        printSelect: "",
    })
    const { id: cardId } = useParams();
    const printVersion = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPrints();
    }, []);

    const getPrints = async () => {
        let prints = [];
        try {
            const jwt = localStorage.getItem('token')
            const card = await fetch(`/api/cards/${cardId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                }
            }).then(res => res.json());
            const cardPrints = await getCardPrints(card.name);
            cardPrints.data.forEach(function(card) {
                if (card.layout === "normal"){
                    prints.push(card);
                }
            })
            setState({cardName: card.name, prints: prints});
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    const handleSwitchPrint = async (e) => {
        e.preventDefault();
        // Need: set, set_name, collector_number, rarity, image_link = image_uris.normal
        try {
            let cardInfo = e.currentTarget.id;
            let setName = cardInfo.split(',');
            let version = await (state.prints).find(i => i.set_name === setName[0] && i.collector_number === setName[1]);
            console.log(version);
            const jwt = localStorage.getItem('token');
            const body = { cardVer: version, cardName: state.cardName, cardId: cardId };
            let options = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt
                },
                body: JSON.stringify(body),
            };
            await fetch(`/api/cards/${cardId}`, options)
            .then(res => {
                if (res.status === 200) {
                    console.log("Done");
                } else {
                    console.error("Error code " + res.status);
                }
            })
            navigate('/cards');
        } catch (err) {
            console.error("Error: ", err);
        }
    }

    const displayUnder = async (e) => {
        e.preventDefault();
        let cardInfo = e.currentTarget.id;
        let setName = cardInfo.split(',');
        let version = await (state.prints).find(i => i.set_name === setName[0] && i.collector_number === setName[1]);
        let thisPrint = document.getElementById(setName);
        if (thisPrint.innerHTML === `${setName[0]}`) {
            thisPrint.innerHTML = `${version.set_name}<br/><img src=${version.image_uris.normal} alt="${state.cardName} from ${version.set_name}"></img>`;
        } else {
            thisPrint.innerHTML = `${setName[0]}`;
        }
    }

    return (
        <>
            <div className='center-div'>
                <h1 className="text-center">{state.cardName}</h1>
                <div className='print-select-container'>
                    <div className="row table-headers">
                        <p className="flex table-header-left table-header-right table-header-bottom">Set Name</p>
                        <p className="flex table-header-right table-header-bottom">Select</p>
                    </div>
                    {state.prints.length ?
                        state.prints.map(printing => (
                            <div className='text-row'>
                                <p className="flex" id={[printing.set_name, printing.collector_number]} ref={printVersion} onClick={displayUnder}>{printing.set_name}</p>
                                <p className="flex">
                                    <button id={[printing.set_name, printing.collector_number]} className="switch-button" type="submit" onClick={handleSwitchPrint}>Select Print</button>
                                </p>
                            </div>
                        ))
                    : <p></p>}
                </div>
            </div>
        </>
    )
}