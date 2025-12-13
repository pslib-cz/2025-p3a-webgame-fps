import { type CardType } from "../types";
import { type FC } from "react";

type CardProps = {
    id: number,
    name: string,
    type: CardType,

    health?: number,
    shield?: number,
    skill1Name?: string,
    skill1Damage?: number,
    skill1Cost?: { [key: string]: number },
    skill2Name?: string,
    skill2Effect?: string,
    skill2Cost?: { [key: string]: number },

    supportCost?: { [key: string]: number },
    supportEffect?: string
}

const Card: FC<CardProps> = (props) =>{
    
    if(props.type === 'character'){
        return(
            <div className="card character-card">
                <p className="card-name">{props.name}</p>
                <div className="card-stats">
                    <p>{props.health}</p>
                    <p>{props.shield}</p>
                </div>
            </div>
        )
    }
    if(props.type === 'support'){

        return(
            <div className="card support-card">
                <p className="cost-tag"></p>
                <p className="card-name">{props.name}</p>
                <p className="card-effect">{props.supportEffect}</p>
            </div>
        )
    }

    return(
        <div className="card error-card">
            <p>ERROR: Unknown Card Type!</p>
            <p>Card ID: {props.id}</p>
        </div>
    )
}
export default Card;