import { type FC } from "react";
import { Link } from "react-router";
export const DeckPage: FC = () => {
    return(
        <div>
            <Link to="/"><p>&lt;- BACK</p></Link>
            <Link to="/decksEdit/Edit"><p>EDIT</p></Link>
        </div>
    )
}
export default DeckPage;