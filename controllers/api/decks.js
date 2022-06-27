const Deck = require('../../models/Deck');
const User = require('../../models/User');
const Card = require('../../models/Card');

module.exports = { 
    index,
    create,
    delete: deleteOne,
    decklist,
    addCard,
}

async function index(req, res) {
    try {
        let decks = await User.findById(req.user._id).populate({path: 'decks', options: {sort: {name: 1}}}).exec();
        res.status(200).json(decks.decks);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

function create(req, res) {
    try {
        const deckCache = req.body.deck;
        let query = { name: deckCache };
        Deck.findOne(query, function(err, found) {
            if (found === null) {
                Deck.create({name: deckCache}, function(err, deck) {
                    User.findById(req.user._id).exec(function(err, user) {
                        user.decks.push(deck);
                        user.save();
                        console.log("New deck item created")
                    })
                })
            }
        })
        res.sendStatus(201);
    } catch(err) {
        res.status(400).json(err);
    }
}

async function deleteOne(req, res) {
    try {
        Deck.findByIdAndDelete(req.params.id, (err, deck) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted " + deck._id);
            }
        });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
}

async function decklist(req, res) {
    try {
        let deck = await Deck.findById(req.params.id).populate({path: 'cards', options: {sort: {name: 1}}}).exec();
        res.status(200).json(deck);
    } catch (err) {
        res.sendStatus(400);
    }
}

async function addCard(req, res) {
    try {
        const cardCache = req.body.card;
        let query = { set: cardCache.set , collector_number: cardCache.collector_number, name: cardCache.name };
        const deckID = req.body.deck;
        Card.findOne(query, function(err, found) {
            console.log(found);
            if (found === null) {
                Card.create(cardCache, function(err, card){
                    card.image_link = cardCache.image_uris.normal;
                    console.log(card);
                    card.save();
                    Deck.findById(deckID).exec(function(err, deck){
                        deck.cards.push(card);
                        deck.save();
                        console.log("Added new card to deck");
                    });
                });
            } else { // The card is found
                Deck.findById(deckID).populate('cards').exec(function(err, deck){ // Find the deck and populate
                    let needNew = true;
                    deck.cards.forEach(function(err, idx){
                        let card = deck.cards[idx];
                        if (card.set === cardCache.set && card.collector_number === cardCache.collector_number && card.name === cardCache.name){
                            card.quantity++;
                            card.save();
                            needNew = false;
                            console.log("Duplicate in deck counted");
                        };
                    });
                    if (needNew) {
                        Card.create(cardCache, function(err, card){
                            card.image_link = cardCache.image_uris.normal;
                            card.save();
                            Deck.findById(deckID).exec(function(err, deck){
                                deck.cards.push(card);
                                deck.save();
                                console.log("Added new card to deck");
                            });
                        });
                    };
                });
            };
        });
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}