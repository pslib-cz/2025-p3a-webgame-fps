import { Link } from 'react-router';
import styles from '../styles/DeckPage.module.css';
import { useState, type ReactElement } from 'react';


const Deck1Page = () => {
    const [deckName, setDeckName] = useState("Deck1")

    return(
        <div className={styles.DeckPage}>
            <Link to="/"><p>&lt;- BACK</p></Link>
            <div className={styles.nameOfDeck}>{deckName}</div>
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