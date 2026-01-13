import { type FC } from "react"
import styles from "../styles/TutorialPage.module.css"
import { Link } from "react-router"

export const TutorialPage: FC = () =>{
    return(
        <div className={styles.Tutorial}>
            <Link to="/"><span>&lt;- BACK</span></Link>
            <h1>Tutorial</h1>
            <p></p>
        </div>
    )
}
export default TutorialPage;