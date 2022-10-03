const { queryByLabelText } = require('@testing-library/react');
const Card = require('../../models/Card');
const User = require('../../models/User');
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    index,
    create,
    delete: deleteOne,
    update: updateQuantity,
    getOne,
    updatePrint,
}

async function getOne(req, res) {
    try {
        let card = await Card.findById(req.params.id);
        res.status(302).json(card);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function index(req, res) {
    try {
        let cards = await User.findById(req.user._id).populate('cards.card').exec();
        cards.cards.sort((a,b) => (a.card.name > b.card.name) ? 1 : ((b.card.name > a.card.name) ? -1 : 0));
        res.status(200).json(cards.cards);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

async function create(req, res) {
    try {
        const cardCache = req.body.card;
        let query = { set: cardCache.set , collector_number: cardCache.collector_number, name: cardCache.name };
        Card.findOne(query, function(err, found) {
            if (found === null) { // The card was not found
                Card.create(cardCache, function(err, card){
                    card.image_link = cardCache.image_uris.normal;
                    card.save();
                    User.findById(req.user._id).exec(function(err, user){
                        user.cards.push({card: card, quantity: 1});
                        user.save();
                        console.log("New card item created");
                    });
                });
            } else { // The card is found
                User.findById(req.user._id).populate('cards.card').exec(function(err, user){ // Find the user and populate
                    let needNew = true;
                    user.cards.forEach(function(err, idx){
                        let card = user.cards[idx];
                        if (card.card.set === cardCache.set && card.card.collector_number === cardCache.collector_number && card.card.name === cardCache.name){
                            card.quantity++;
                            user.save();
                            needNew = false;
                            console.log("Duplicate counted");
                        };
                    });
                    if (needNew) {
                        user.cards.push({card: found, quantity: 1});
                        user.save();
                        console.log("New to user card added");
                    };
                });
            };
        });
        res.sendStatus(201);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function deleteOne(req, res) {
    try {
        User.updateOne({ _id: ObjectId(req.user._id) }, 
            { $pull: 
                { cards: { _id: ObjectId(req.params.id) } }
            }, function(err, user) {
                if (err !== null){ console.log(err); }
            }
        );
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function updateQuantity(req, res) {
    try {
        User.findById(req.user._id).populate('cards.card').exec(function(err, user){
            user.cards.forEach(function(err, idx){
                let card = user.cards[idx];
                if (card._id.toString() === req.body.cardId){
                    card.quantity = req.body.quantity;
                    user.save();
                    console.log("Successfully updated quantity.");
                };
            })
        })
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(400);
    }
}

function updatePrint(req, res) {
    try {
        const cardCache = req.body.cardVer;
        const cardId = req.body.cardId;
        console.log(cardId);
        // req.body.cardVer / cardName / cardId
        let query = { set: cardCache.set , collector_number: cardCache.collector_number, name: cardCache.name };
        Card.findOne(query, function(err, card){
            if (card === null) {
                Card.create(cardCache, function(err, card){
                    card.image_link = cardCache.image_uris.normal;
                    card.save();
                    User.findById(req.user._id).exec(function(err, user){
                        let cards = user.cards;
                        let thisCard = cards.filter(function(cardA){
                            return cardA.card.toString() === cardId;
                        });
                        let quantity = thisCard[0].quantity;
                        user.cards.push({card: card, quantity: quantity});
                        user.save();
                    });
                    User.updateOne({ _id: ObjectId(req.user._id) }, 
                        { $pull: 
                            { cards: { card: { _id: ObjectId(cardId)}}}
                        }, function(err, user) {
                            if (err !== null){ console.log(err); }
                        }
                    );
                    console.log("Card version updated with new card.");
                });
            } else { // Card was found
                User.findById(req.user._id).exec(function(err, user){
                    let cards = user.cards;
                    let thisCard = cards.filter(function(cardA){
                        return cardA.card.toString() === cardId;
                    });
                    let quantity = thisCard[0].quantity;
                    
                    // The actual push into the array here
                    user.cards.push({card: card, quantity: quantity});

                    let newCardId = cards[cards.length - 1].card._id.toString()
                    let checkForCard = cards.find(x => x.card.toString() === newCardId);
                    let dupeIdx = cards.findIndex(y => y.card.toString() === newCardId);
                    if (checkForCard !== undefined) {
                        quantity += cards[dupeIdx].quantity;
                        cards[dupeIdx].quantity = quantity;
                        cards.pop();
                    };
                    let removeIdx = cards.findIndex(z => z.card.toString() === cardId);
                    cards.splice(removeIdx, 1);
                    user.save();
                });
                console.log("Card version updated with existing card.");
            }
        })
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}