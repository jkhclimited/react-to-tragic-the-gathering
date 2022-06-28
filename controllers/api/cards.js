const Card = require('../../models/Card');
const User = require('../../models/User');
const ObjectId = require('mongodb').ObjectId;

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
        let cards = await User.findById(req.user._id).populate('cards.card').exec();
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
                if (err !== null){
                    console.log(err);
                }
            }
        );
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(400);
    }
}

function updateOne(req, res) {
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