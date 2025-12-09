import { type FC } from "react";
import { Link } from "react-router";
import styles from '../styles/DeckPage.module.css';
export const DeckEditPage: FC = () => {
    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit"><p>&lt;- BACK</p></Link>
            <p>EDIT</p>
        </div>
    )
}
export default DeckEditPage;