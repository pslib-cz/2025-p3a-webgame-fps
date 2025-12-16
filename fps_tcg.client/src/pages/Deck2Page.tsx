import styles from '../styles/DeckPage.module.css';
import { Link } from 'react-router';
const Deck2Page = () => {
    return(
        <div className={styles.DeckPage}>
            <Link to="/"><p>&lt;- BACK</p></Link>
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
export default Deck2Page;