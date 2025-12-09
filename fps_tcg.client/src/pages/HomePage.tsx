import { type FC } from "react";
import { Link } from "react-router";
import styles from "../styles/HomePage.module.css"
export const HomePage: FC = () => {
    return(
        <div className={styles.HomePage}>
            <h1>Animalgedon TCG</h1>
            <Link to="/game/"><h2>Start New Game</h2></Link>
            <Link to="/decksEdit/"><h2>Edit Decks</h2></Link>
            <Link to="/tutorial"><h2>Tutorial</h2></Link>
        </div>
    )
}
export default HomePage;
