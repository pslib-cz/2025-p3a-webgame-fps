import { type FC } from "react";
import { Link } from "react-router";
export const DeckEditPage: FC = () => {
    return(
        <div>
            <Link to="/decksEdit"><p>&lt;- BACK</p></Link>
            <p>EDIT</p>
        </div>
    )
}
export default DeckEditPage;