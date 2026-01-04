import styles from '../styles/DeckPage.module.css';
import { Link } from 'react-router';
import { useState } from 'react';

const Deck3Page = () => {
    const [deckName, setDeckName] = useState("Deck3")
    const [isEditing, setIsEditing] = useState(false);

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
export default Deck3Page;