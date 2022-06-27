const Card = require('../../models/Card');
const User = require('../../models/User');

module.exports = {
    index,
    create,
    delete: deleteOne,
    update: updateOne,
    getOne,
}

async function getOne(req, res) {
    try {
        let card = await Card.findById(req.params.id);
        console.log(card);
        res.status(302).json(card);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function index(req, res) {
    try {
        let cards = await User.findById(req.user._id).populate({path: 'cards', options: {sort: {name: 1}}}).exec();
        res.status(200).json(cards.cards);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function create(req, res) {
    try {
        const cardCache = req.body.card;
        let query = { set: cardCache.set , collector_number: cardCache.collector_number, name: cardCache.name };
        Card.findOne(query, function(err, found) {
            if (found === null) {
                Card.create(cardCache, function(err, card){
                    card.image_link = cardCache.image_uris.normal;
                    card.save();
                    User.findById(req.user._id).exec(function(err, user){
                        user.cards.push(card);
                        user.save();
                        console.log("New card item created");
                    });
                });
            } else { // The card is found
                User.findById(req.user._id).populate('cards').exec(function(err, user){ // Find the user and populate
                    let needNew = true;
                    user.cards.forEach(function(err, idx){
                        let card = user.cards[idx];
                        if (card.set === cardCache.set && card.collector_number === cardCache.collector_number && card.name === cardCache.name){
                            card.quantity++;
                            card.save();
                            needNew = false;
                            console.log("Dupe counted");
                        };
                    });
                    if (needNew) {
                        Card.create(cardCache, function(err, card){
                            card.image_link = cardCache.image_uris.normal;
                            card.save();
                            User.findById(req.user._id).exec(function(err, user){
                                user.cards.push(card);
                                user.save();
                                console.log("New to user card created");
                            });
                        });
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
        Card.findByIdAndDelete(req.params.id, (err, card) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted " + card._id);
            }
        });
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(400);
    }
}

function updateOne(req, res) {
    try {
        Card.findById(req.body.cardId, (err, card) => {
            card.quantity = req.body.quantity;
            card.save();
            console.log(card);
        });
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(400);
    }
}