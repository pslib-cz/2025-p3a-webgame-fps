import { type FC } from "react";
import { Link } from "react-router";
import styles from '../styles/DeckPage.module.css';
import { useParams } from "react-router";

type DeckEditPageParams ={
    query?:string
}

export const DeckEditPage: FC = () => {
    const {query} = useParams<DeckEditPageParams>()

    if(query === "Deck1"){
        return "/decksEdit/Deck1"
    }
    else if(query === "Deck2"){
        return "/decksEdit/Deck2"
    }
    else if(query === "Deck3"){
        return "/decksEdit/Deck3"
    }

    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit"><p>&lt;- BACK</p></Link>
            {query ? (
                <Link to={query} />
            ): (
                <p>Deck nebyl nalezen</p>
            )}
            <p>EDIT</p>
        </div>
    )
}
export default DeckEditPage;