const Suit = {
    Spades: 'S',
    Hearts: 'H',
    Clubs: 'C',
    Diamonds: 'D',
	No: 'No',
}

const Rank = {
    Two: '2',
    Three: '3',
    Four: '4',
    Five: '5',
    Six: '6',
    Seven: '7',
    Eight: '8',
    Nine: '9',
    Ten: 'T',
    Jack: 'J',
    Queen: 'Q',
    King: 'K',
    Ace: 'A',
	No: 'No'
}

function rankValue(card) {
	switch(card.rank) {
		case Rank.Ace: return 1;
        case Rank.Two: return 2;
        case Rank.Three: return 3;
        case Rank.Four: return 4;
        case Rank.Five: return 5;
        case Rank.Six: return 6;
        case Rank.Seven: return 7;
        case Rank.Eight: return 8;
        case Rank.Nine: return 9;
        case Rank.Ten: return 10;
        case Rank.Jack: return 11;
        case Rank.Queen: return 12;
        case Rank.King: return 13;
        default: return 0;
    }
}

function pyramidMatch(card, deckCard) {
	const cardVal = rankValue(card);
	const deckCardVal = rankValue(deckCard);
	
	return Math.abs(cardVal - deckCardVal) % 11 == 1;
}

const SetType = {
    Set52: 52,
    Set36: 36,
    Set32: 32,
    Set24: 24
}

const SuitSet = [
    Suit.Spades,
    Suit.Hearts,
    Suit.Clubs,
    Suit.Diamonds,
];

const RankSet_52 = [
    Rank.Two,
    Rank.Three,
    Rank.Four,
    Rank.Five,
    Rank.Six,
    Rank.Seven,
    Rank.Eight,
    Rank.Nine,
    Rank.Ten,
    Rank.Jack,
    Rank.Queen,
    Rank.King,
    Rank.Ace,
];

const RankSet_36 = [
    Rank.Six,
    Rank.Seven,
    Rank.Eight,
    Rank.Nine,
    Rank.Ten,
    Rank.Jack,
    Rank.Queen,
    Rank.King,
    Rank.Ace,
];

const RankSet_32 = [
    Rank.Seven,
    Rank.Eight,
    Rank.Nine,
    Rank.Ten,
    Rank.Jack,
    Rank.Queen,
    Rank.King,
    Rank.Ace,
];

const RankSet_24 = [
    Rank.Nine,
    Rank.Ten,
    Rank.Jack,
    Rank.Queen,
    Rank.King,
    Rank.Ace,
];

function getRandSuit() {
    const r = Math.floor(Math.random() * 3);
    switch(r) {
        case 0: return Suit.Spades;
        case 1: return Suit.Hearts;
        case 2: return Suit.Clubs;
        case 3: return Suit.Diamonds;
    }
}

function getRandRank() {
    const r = Math.floor(Math.random() * 13);
    switch(r) {
        case 0: return Rank.Two;
        case 1: return Rank.Three;
        case 2: return Rank.Four;
        case 3: return Rank.Five;
        case 4: return Rank.Six;
        case 5: return Rank.Seven;
        case 6: return Rank.Eight;
        case 7: return Rank.Nine;
        case 8: return Rank.Ten;
        case 9: return Rank.Jack;
        case 10: return Rank.Queen;
        case 11: return Rank.King;
        case 12: return Rank.Ace;
    }
}

class Card {
    constructor(rank, suit, opened) {
        this.rank = rank;
        this.suit = suit;
        this.opened = opened;
    }

    open() {
        this.opened = true;
    };

    close() {
        this.opened = false;
    };

    toggle() {
        this.opened = !this.opened;
    };

    isEmpty() {
        return this.rank == Rank.No || this.suit == Suit.No;
    };

    reset() {
        this.rank = Rank.No;
        this.suit = Suit.No;
    };
}

function getCardPath(card) {
    let url;
	if(card.isEmpty()) {
		url = '';
	} else if (card.opened) {
        const ext = '.svg'
        url = 'cards/' + card.rank + card.suit + ext;
    } else {
        url = 'cards/shirt.svg';
    }
    return url;
}

function getCardUrl(card) {
    let url;
	if(card.isEmpty()) {
		url = '';
	} else if (card.opened) {
        const ext = '.svg'
        url = 'url("cards/' + card.rank + card.suit + ext + '")';
    } else {
        url = 'url("cards/shirt.svg")';
    }
    return url;
}

function preloadImage(im_url) {
    const img = new Image();
    img.src = im_url;
}

class Deck {
    constructor(setType, deckCount) {
        this.cards = [];

        let rankSet;
        switch (setType) {
            case SetType.Set52: rankSet = RankSet_52; break;
            case SetType.Set36: rankSet = RankSet_36; break;
            case SetType.Set32: rankSet = RankSet_32; break;
            case SetType.Set24: rankSet = RankSet_24; break;
        }

        for (let d = 0; d < deckCount; ++d) {
            for (let s = 0; s < SuitSet.length; ++s) {
                for (let r = 0; r < rankSet.length; ++r) {
                    const c = new Card(rankSet[r], SuitSet[s], false);
                    this.cards.push(c);

                    preloadImage(getCardPath(new Card(rankSet[r], SuitSet[s], true)));
                }
            }
        }
    }

    shuffle() {
        const cards = this.cards;
        for (let i = cards.length; i; --i) {
            const j = Math.floor(Math.random() * i);
            const x = cards[i - 1];
            cards[i - 1] = cards[j];
            cards[j] = x;
        }
    };

    open() {
        for (let i = 0; i < this.cards.length; ++i) {
            this.cards[i].open();
        }
    };

    isEmpty() {
        return this.cards.length < 1;
    };

    last() {
        return this.cards[this.cards.length - 1];
    };

    render(viewId) {
        const view = document.getElementById(viewId);

        if (this.isEmpty()) {
            view.style.backgroundImage = getCardUrl(new Card(Rank.No, Suit.No, true));
            view.style.backgroundRepeat = 'no-repeat';
            return;
        }

        const c = this.last();
        view.style.backgroundImage = getCardUrl(c);
        view.style.backgroundRepeat = 'no-repeat';

        let shadow = '';
        const cardsCount = this.cards.length;
        const x = cardsCount % 2; // to make same color sequence for stacked shadows

        for (let i = 0; i < cardsCount; ++i) {
            let color = (i + x) % 2 ? '#777' : '#e9e5b8';
            let delim = i == cardsCount - 1 ? '' : ',';

            shadow += '-' + i + 'px -' + i + 'px ' + color + delim;
        }

        view.style.boxShadow = shadow;
        view.style.transform = 'translate(' + cardsCount + 'px, ' + cardsCount + 'px)';
    };
}

class Pyramid {
    constructor(deck, stepFunc) {
        this.cards = [];
        this.levels = 7;
        this.stepFunc = stepFunc

        for (let i = 0; i < this.levels; ++i) {
            this.cards[i] = [];
        }

        this.ballast = 1;

        for (let row = 0; row < this.levels; ++row) {
            for (let col = 0; col < row + 1; ++col) {
                const c = deck.cards.pop();
                this.cards[row].push(c);
            }
        }

        for (let i = 0; i < this.levels; ++i) {
            this.cards[this.levels - 1][i].open();
        }
    }

    render(viewId) {
        const rows = document.getElementsByClassName('row');
        for (const row of rows) {
            while (row.firstChild) {
                row.removeChild(row.firstChild);
            }
        }

        for (let row = 0; row < this.levels; ++row) {
            const cols = this.cards[row].length;
            for (let col = 0; col < cols; ++col) {

                const cardView = document.createElement('div');
                const card = this.cards[row][col];

                const cardUrl = getCardUrl(card);
                if (cardUrl == '') {
                    cardView.setAttribute('class', 'card-space no-card');
                } else {
                    cardView.setAttribute('class', 'card-space card');
                    cardView.style.backgroundImage = getCardUrl(card);
                    cardView.style.backgroundRepeat = 'no-repeat';
                }

                (function (_cardView, _card, _deck, _pyramid, _stepFunc) {
                    cardView.onclick = function () { _stepFunc(_cardView, _card, _deck, _pyramid); };
                })(cardView, card, deck, this, this.stepFunc);

                rows[row].appendChild(cardView);
            }
        }
    };

    recalc() {
        const rows = this.levels - 1;
        for (let row = 0; row < rows; ++row) {
            const cols = this.cards[row].length;
            for (let col = 0; col < cols; ++col) {
                const card = this.cards[row][col];
                if (card.opened) continue;
                if (this.cards[row + 1][col].isEmpty() && this.cards[row + 1][col + 1].isEmpty()) {
                    card.open();
                }
            }
        }
    };

    isEmpty() {
        return this.cards[0][0].isEmpty();
    };
}
