import { type FC } from "react"
import styles from "../styles/TutorialPage.module.css"
import { Link } from "react-router"
import imgZones from '../assets/tutorial_zones.jpg'
import imgDiceRoll from '../assets/tutorial_diceroll.png'

export const TutorialPage: FC = () =>{
    return(
        <div className={styles.tutorialPage}>
            <div className={styles.tutorialContent}>
                <Link className={styles.button} to="/"><span>&lt;- BACK</span></Link>
                <h1 className={styles.tutorialTitle}>Tutorial</h1>
                <div>
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
                        <li>6 Support Cards (gives dices)</li>
                    </ul>
                    <h3>Match Start</h3>
                    <ol>
                        <li>The player draw 2 cards from their Draw Pile → this becomes their starting Hand.</li>
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
                        <img className={styles.img} src={imgDiceRoll} alt="Dice Roll" />
                        <li><h3>Action Phase (opponents take turns)</h3></li>
                        <p> Possible actions:</p>
                        <ul>
                            <li>Use Attack — spend required Symbol Dice to use the active character's skill (Normal Attack or Special Skill).</li>
                            <li>Switch Character — spend 1 Symbol Die to swap your Active Character with one on standby.</li>
                            <li>Play a Support Card — using Symbol Dice to pay the card's cost.</li>
                            <li>Declare Round End — voluntarily end your actions for this round. The first player to declare ends their Round first, and will go first next round; the other can still take actions until they also End Round.</li>
                        </ul>
                        <li><h3>End Phase</h3></li>
                        <ul>
                            <li>Each player automatically gets new support cards</li>
                            <li>Proceed to next Round.</li>
                        </ul>
                    </ol>
                    <p>Rounds repeat until one player has all opponent Character Cards defeated.</p>
                    <h2>Card Types & Zones</h2>
                    <p>Here's how cards and game zones work:</p>
                    <ol>
                        <li>Character Zone - Holds your 3 Character Cards. One is “Active” — only Active can act or be attacked. Character has HP and Shield.</li>
                        <li>Hand - Your current playable Support Cards.</li>
                        <li>Draw Pile - Contains the 6 Support Cards (shuffled at start).</li>
                        <li>Symbol Dice Panel - Displays available Symbol Dice, used as resource to play cards, use skills, switch, etc. Jester dice act as wildcard.</li>
                    </ol>
                    <img className={styles.img} src={imgZones} alt="Game Zones" />
                        <h3>Ultimate attacks description</h3>
                        <ul>
                            <li><b>Normal Attack</b> Basic attack with no special effect can be used without the need for specific Symbol Dice</li>
                            <li><b>Knight-Strike</b> More powerful single target attack</li>
                            <li><b>Tank-Guard</b>  A defensive skill that adds shield to one of the players cards (player can choose the target)</li>
                            <li><b>Mage-Fireball</b>  An area attack that damages all opponent characters</li>
                            <li><b>Healer-Heal</b>  A support skill that gives hp to one of the player cards (player can choose the target)</li>
                            <li><b>Rogue-Assasination</b>   Can be used on an opponent's card if it is alive (player can choose the target)</li>
                        </ul>
                        <h3>Rules Summary</h3>
                        <ol>
                            <li><b>Deck Building:</b><p>Click button <strong>Edit Decks</strong> after that click the + sign. Click on one of those three top + signs and choose 3 Character Cards after that click on one of the bottom ones and choose 6 Support Cards. You can also change the name by clicking on the text above</p></li>
                            <li><b>Saving deck:</b><p>Click the save button under.</p></li>
                            <li><b>Active deck:</b><p>Click BACK on the top left corner. Click on the deck that you made and under EDIT button there is SET ACTIVE button that sets your deck as active.</p></li>
                            <li><b>Starting a match:</b><p>Go back to the main page and click Start New Game. Click on one of your three cards to set it active. After you did that you will roll eight dices which you can reroll by clicking on them.</p></li>
                            <li><b>Valid Moves:</b>
                            <ul>
                                <li>Click on your card to see available actions, after that, choose the amount of dices it costs and click on the ability you want to use. Skill2 can be performed only with specific symbol dice (the color on the top right of the attack) but skill1 can be used with any dice.</li>
                                <li>Click on one of your non-active character cards, choose one dice, and switch your active card by clicking on the confirm button on the left bottom.</li>
                                <li>Click on the deck of support cards on the bottom right, click on a symbol you want to exchange, click on the dice you want to exchange and click play.</li>
                            </ul>
                            </li>
                            <li><b>Ending a turn:</b><p>After you have used all your actions or decided to end your turn, click the End Turn button.</p></li>
                        </ol>
                </div>
            </div>
        </div>
    )
}
export default TutorialPage;