import { type FC } from "react";
import { Link } from "react-router";
import styles from '../styles/DeckPage.module.css';
import { useParams } from "react-router";

type DeckEditPageParams ={
    deckId: string
}

export const DeckEditPage: FC = () => {
    const {deckId} = useParams<DeckEditPageParams>()

    if (!deckId) {
        return <p>Deck nebyl nalezen</p>;
    }

    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit"><p>&lt;- BACK</p></Link>
        </div>
    )
}
export default DeckEditPage;