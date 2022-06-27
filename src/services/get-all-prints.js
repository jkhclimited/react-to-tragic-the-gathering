export function getCardPrints(name, set) {
    let reqURL = `https://api.scryfall.com/cards/search?order=released&q=${name}+include%3Aextras&unique=prints`
    return fetch(reqURL).then(res => res.json());
}

// https://api.scryfall.com/cards/search?order=released&q=%21%22Yuriko%2C+the+Tiger%27s+Shadow%22+include%3Aextras&unique=prints
// https://api.scryfall.com/cards/search?order=released&q=${name}+include%3Aextras&unique=prints