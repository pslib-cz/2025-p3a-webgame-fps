import { Link } from 'react-router';
import styles from '../styles/DeckPage.module.css';
import { useState } from 'react';


const Deck1Page = () => {
    const [deckName, setDeckName] = useState("Deck1")
    const [isEditing, setIsEditing] = useState(false);

    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit/"><p>&lt;- BACK</p></Link>
            {isEditing ? (
                <input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
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
                <button></button>
                <button></button>
                <button></button>
            </div>
            <div className={styles.containerEdit}>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
                <button></button>
            </div>
        </div>
    );
}
export default Deck1Page;