import { useState, useEffect, type FC } from "react";
import { Link, useNavigate } from "react-router";
import styles from '../styles/DeckPage.module.css';
import Card from '../components/Card';
import type { CardProps } from '../components/Card';
import type { CardType } from '../types';

interface Deck {
    deckId: number;
    name: string;
    cards?: any[];
}

export const DeckPage: FC = () => {
    const [deckSelect, setDeckSelect] = useState<Deck | null>(null)
    const [decks, setDecks] = useState<Deck[]>([]);
    const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await fetch('https://localhost:7077/api/Decks');
                if (!response.ok) {
                    throw new Error('Failed to fetch decks');
                }
                const data = await response.json();
                
                const deckData = [1, 2, 3].map(id => {
                    const found = data.find((d: any) => d.deckId === id);
                    return found ? { deckId: id, name: found.name, cards: found.cards || [] } : { deckId: id, name: `Deck${id}`, cards: [] };
                });
                
                setDecks(deckData);
            } catch (error) {
                console.error('Error fetching decks', error);
                setDecks([
                    { deckId: 1, name: "Deck1", cards: [] },
                    { deckId: 2, name: "Deck2", cards: [] },
                    { deckId: 3, name: "Deck3", cards: [] }
                ]);
            }
        };
        fetchDecks();
    }, []);

    const getAttackCards = (cards: any[]): CardProps[] => {
        return cards
            .filter(card => card.type?.toLowerCase() === 'attack')
            .slice(0, 3)
            .map(card => ({
                id: card.cardId,
                name: card.name,
                type: 'attack' as CardType,
                imgSrc: card.imagePath,
                health: card.health,
                shield: card.shield
            }));
    };

    const handleSetActiveDeck = (deck: Deck) => {
        setActiveDeck(deck);
        localStorage.setItem('activeDeck', JSON.stringify(deck));
    };

    return(
        <div className={styles.DeckPage}>
            <Link to="/"><span>&lt;- BACK</span></Link>
            <div className={styles.container}>
                {decks.map(deck => {
                    const attackCards = getAttackCards(deck.cards || []);
                    return (
                        <div key={deck.deckId}>
                            {attackCards.length > 0 ? (
                                <div className={styles.cardFan} onClick={() => setDeckSelect(deck)}>
                                    {attackCards.map((card, index) => (
                                        <div key={card.id} className={`${styles.fanCard} ${styles[`fanCard${index + 1}`]}`}>
                                            <Card {...card} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <button onClick={() => setDeckSelect(deck)} />
                            )}
                            <h3>{deck.name}</h3>
                        </div>
                    );
                })}
            </div>
            {deckSelect && (
                <p className={styles.buttonEdit} onClick={() => navigate(`/decksEdit/Deck${deckSelect.deckId}`)}>EDIT</p>
            )}
            {deckSelect && deckSelect !== activeDeck && (
                <p className={styles.buttonEdit} onClick={() => handleSetActiveDeck(deckSelect)}>SET ACTIVE</p>
            )}
        </div>
    )
            

}
export default DeckPage;