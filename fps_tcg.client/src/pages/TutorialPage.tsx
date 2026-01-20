import { type FC } from "react"
import styles from "../styles/TutorialPage.module.css"
import { Link } from "react-router"

export const TutorialPage: FC = () =>{
    return(
        <div className={styles.Tutorial}>
            <Link to="/"><span>&lt;- BACK</span></Link>
            <h1>Tutorial</h1>
            <div className={styles.Text}>
            <h2>What is Animalgedon TCG</h2>
            <p>Animalgedon TCG is a card dueling game. It's a card game where players build decks using Character Cards and Support Cards, then duel opponents using dice, skills, and strategic plays.</p>
            <p>In the context of this game, players will:</p>
            <ul>
                <li>Build your deck</li>
                <li>Use Symbol Dice to perform actions each round</li>
                <li>Try to eliminate all opposing characters to win</li>
            </ul>
            <h2>Basic Rules & Flow</h2>
            <p>Here's how a typical match works</p>
            <h3>Deck Composition</h3>
            <ul>
                <li>3 Character Cards</li>
                <li>20 Support Cards (give specific buffs, dice, heals, etc.)</li>
            </ul>
            <h3>Match Start</h3>
            <ol>
                <li>The player draw 5 cards from their Draw Pile → this becomes their starting Hand. Then the player may discard any number of cards from their hand and redraw an equal number.</li>
                <li>The player selects one of their Character Cards to be their Active Character. This character will act first.</li>
            </ol>
            <h3>Round Structure</h3>
            <p>Each round consists of three phases:</p>
            <ol>
                <li><h3>Roll Phase</h3> </li>
                <ul>
                    <li>You roll 8 Symbol Dice. Each die can show one of 6 faces: the 5 symbols (Knight, Tank, Mage, Healer, Rogue) plus Jester (which acts as a wildcard).</li>
                    <li>After the initial roll, you may choose any number of dice to reroll once.</li>
                </ul>
                <li><h3>Action Phase (opponents take turns)</h3></li>
                <p> Possible actions:</p>
                <ul>
                    <li>Use Attack — spend required Symbol Dice to use the active character's skill (Normal Attack or Special Skill).</li>
                    <li>Switch Character — spend 1 Symbol Die to swap your Active Character with one on standby.</li>
                    <li>Play a Support Card — using Symbol Dice to pay the card's cost. This includes gaining buffs, gaining dice, heals, etc.</li>
                    <li>Declare Round End — voluntarily end your actions for this round. The first player to declare ends their Round first, and will go first next round; the other can still take actions until they also End Round.</li>
                </ul>
                <li><h3>End Phase</h3></li>
                <ul>
                    <li>Each player draws 2 cards from their Draw Pile (if cards remain).</li>
                    <li>Proceed to next Round.</li>
                </ul>
            </ol>
            <p>Rounds repeat until one player has all opponent Character Cards defeated.</p>
            <h2>Card Types & Zones</h2>
            <p>Here's how cards and game zones work:</p>
            <ol>
                <li>Character Zone - Holds your 3 Character Cards. One is “Active” — only Active can act or be attacked. Character has HP and Shield.</li>
                <li>Hand - Your current playable Support Cards. Max hand size: 10 cards. Excess drawn cards are discarded.</li>
                <li>Draw Pile - Contains the 20 Support Cards (shuffled at start). When you draw, you draw from here.</li>
                <li>Symbol Dice Panel - Displays available Symbol Dice, used as resource to play cards, use skills, switch, etc. Jester dice act as wildcard.</li>
            </ol>
            </div>
        </div>
    )
}
export default TutorialPage;