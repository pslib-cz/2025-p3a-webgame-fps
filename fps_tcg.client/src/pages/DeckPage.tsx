import { useState, type FC } from "react";
import { Link } from "react-router";
import styles from '../styles/DeckPage.module.css';
//import coins from '../assets/gold_coins.png', <img className={styles.coins} src={coins} alt="pixel_coins" />
export const DeckPage: FC = () => {
    const [deckSelect, setDeckSelect] = useState(false)
    return(
        <div className={styles.DeckPage}>
            <Link to="/"><p>&lt;- BACK</p></Link>
            <div className={styles.container}>
                <div>
                    <button onClick={() => setDeckSelect(true)}></button>
                    <h3>Deck1</h3>
                </div>
                <div>
                    <button onClick={() => setDeckSelect(true)}></button>
                    <h3>Deck2</h3>
                </div>
                <div>
                    <button onClick={() => setDeckSelect(true)}></button>
                    <h3>Deck3</h3>
                </div>
            </div>
            <Link to="/decksEdit/Edit"><p className={styles.edit}>EDIT</p></Link>
        </div>
    )
}
export default DeckPage;