var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new mongoose.Schema({
  name: String,       // name
  mana_cost: String,  // mana_cost
  type_line: String,  // type_line
  power: String,      // power
  toughness: String,  // toughness
  oracle_text: String,// oracle_text
  nonfoil: Boolean,   // nonfoil
  foil: Boolean,      // foil
  copiesInDeck: {
    type: Number,
    default: 0,
  },
  condition: {
    type: String,
    default: "NM",
  },

  set: String,        // set
  set_name: String,   // set_name
  collector_number: String, // collector_number
  rarity: String,     // rarity
  image_link: String,  //image_uris.normal
  user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: false
});

module.exports = mongoose.model('Card', cardSchema);
