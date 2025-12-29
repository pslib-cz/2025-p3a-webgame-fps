import { useState, type FC } from "react";
import { Link, useNavigate } from "react-router";
import styles from '../styles/DeckPage.module.css';
//import coins from '../assets/gold_coins.png', <img className={styles.coins} src={coins} alt="pixel_coins" />

export const DeckPage: FC = () => {
    const [deckSelect, setDeckSelect] = useState<string | null>(null)
     const navigate = useNavigate();
    return(
        <div className={styles.DeckPage}>
            <Link to="/"><p>&lt;- BACK</p></Link>
            <div className={styles.container}>
                {["Deck1", "Deck2", "Deck3"].map(deck => (
                    <div key={deck}>
                        <button onClick={() => setDeckSelect(deck)} />
                        <h3>{deck}</h3>
                    </div>
                ))}
            </div>
            {deckSelect && (<p className={styles.buttonEdit}
                onClick={() => navigate(`/decksEdit/${deckSelect}`)}>EDIT</p>)}
        </div>
    )
            

}
export default DeckPage;