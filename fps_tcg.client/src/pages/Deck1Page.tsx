import { Link } from 'react-router';
import styles from '../styles/DeckPage.module.css';
import { useState, useEffect } from 'react';
import { type CardType } from '../types';

const Deck1Page = () => {
    const [deckName, setDeckName] = useState("Deck1")
    const [isEditing, setIsEditing] = useState(false);
    const [cards, setCards] = useState([]);
    const [selectedType, setSelectedType] = useState<CardType | null>(null)
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
    
    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit/"><p>&lt;- BACK</p></Link>
            {isEditing ? (
                <input
                className={styles.nameOfDeckInp}
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditing(false);
                }}
                />
            ) : (
                <div
                className={styles.nameOfDeck}
                onClick={() => setIsEditing(true)}
                >
                {deckName}
                </div>
            )}
            <div className={styles.container}>
                <button onClick={() => setSelectedType('attack')}></button>
                <button onClick={() => setSelectedType('attack')}></button>
                <button onClick={() => setSelectedType('attack')}></button>
            </div>
            <div className={styles.containerEdit}>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
            </div>
        </div>
    );
}
export default Deck1Page;