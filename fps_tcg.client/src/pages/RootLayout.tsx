import { type FC } from "react";
import { Link, Outlet } from "react-router";

export const RootLayout: FC = () => {
    return(
        <div>
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </div>
    )
}
export default RootLayout