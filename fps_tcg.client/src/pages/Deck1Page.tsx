import { Link } from 'react-router';
import styles from '../styles/DeckPage.module.css';
import { useState, useEffect } from 'react';
import { type CardType } from '../types';
import Card, { type CardProps } from '../components/Card';

const Deck1Page = () => {
    const [deckName, setDeckName] = useState("Deck1")
    const [isEditing, setIsEditing] = useState(false);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [selectedType, setSelectedType] = useState<CardType | null>(null)
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null)
    const [showAttackContainer, setShowAttackContainer] = useState(false);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch('https://localhost:7077/api/Cards');
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();
                const normalized = Array.isArray(data)
                    ? data.map((c: any) => ({
                          id: c.cardId,
                          name: c.name,
                          type: c.type as CardType,
                          imgSrc: `/api/Cards/${c.cardId}/image/as-png`,
                          health: c.health ?? 0,
                          shield: c.shield ?? 0,
                          skill1Name: c.skill1Name,
                          skill1Damage: c.skill1Damage,
                          skill1Cost: c.skill1Cost,
                          skill2Name: c.skill2Name,
                          skill2Effect: c.skill2Effect,
                          skill2Cost: c.skill2Cost,
                          supportCost: c.supportCost ?? 0,
                          supportEffect: c.supportEffect ?? ''
                      } as CardProps))
                    : [];

                setCards(normalized);
            } catch (error) {
                console.error('Error fetching cards', error);
            }
        };
        fetchCards();
        console.log({cards});
    }, []);

    const handleAttackClick = () => {
        setShowAttackContainer(!showAttackContainer);
        setSelectedType('attack');
    }

    return(
        <div className={styles.DeckPage}>
            <Link to="/decksEdit/"><span>&lt;- BACK</span></Link>
            {isEditing ? (
                <input
                className={styles.nameOfDeckInp}
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') setIsEditing(false);
                }}
                />
            ) : (
                <div
                className={styles.nameOfDeck}
                onClick={() => setIsEditing(true)}
                >
                {deckName}
                </div>
            )}
            <div className={styles.container}>
                <button onClick={handleAttackClick}></button>
                <button onClick={handleAttackClick}></button>
                <button onClick={handleAttackClick}></button>
            </div>
            {showAttackContainer && (
                <div className={styles.attackContainer}>
                    <div>  
                        {cards.filter(card => card.type === 'attack')
                            .map((card) => (
                                <div key={card.id}>
                                    <Card {...card}/>
                                </div>
                            ))
                        }
                    </div>
                    <button onClick={handleAttackClick}>CANCEL</button>
                </div>
            )}
            <div className={styles.containerEdit}>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
                <button onClick={() => setSelectedType('support')}></button>
            </div>
        </div>
    );
}
export default Deck1Page;