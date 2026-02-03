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
    const [deckSelect, setDeckSelect] = useState<Deck | null>(null);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [activeDeck, setActiveDeck] = useState<Deck | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('activeDeck');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setActiveDeck(parsed);
            } catch {}
        }
    }, []);

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const deckIds = [1, 2, 3];
                const decksWithCards = await Promise.all(
                    deckIds.map(async (id) => {
                        try {
                            const response = await fetch(`https://localhost:7077/api/Decks/${id}/with-cards`);
                            if (response.ok) {
                                const deck = await response.json();
                                return deck;
                            } else {
                                return { deckId: id, name: `Deck${id}`, cards: [] };
                            }
                        } catch (error) {
                            console.error(`Error fetching deck ${id}`, error);
                            return { deckId: id, name: `Deck${id}`, cards: [] };
                        }
                    })
                );
    
                setDecks(decksWithCards);
    
                const stored = localStorage.getItem('activeDeck');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        const match = decksWithCards.find(d => d.deckId === parsed.deckId);
                        if (match) setActiveDeck(match);
                    } catch {}
                }
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
                imgSrc: `https://localhost:7077/api/images/${card.cardId}.png`,
                health: card.health,
                shield: card.shield
            }));
    };

    const handleSetActiveDeck = (deck: Deck) => {
        setActiveDeck(deck);
        localStorage.setItem('activeDeck', JSON.stringify(deck));
    };

    return (
        <div className={styles.deckPage}>
            <Link className={`${styles.button} ${styles.backButton}`} to="/"><span>&lt;- BACK</span></Link>
            {decks.map(deck => {
                const attackCards = getAttackCards(deck.cards || []);
                return (
                    < div key={deck.deckId} className={styles.deck}>
                        {attackCards.length > 0 ? (
                            <div className={styles.cardFan} onClick={() => setDeckSelect(deck)}>
                                {attackCards.map((card, index) => (
                                    <div key={card.id} className={`${styles.fanCard} ${styles[`fanCard${index + 1}`]}`}>
                                        <Card {...card} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <button className={styles.placeholder} onClick={() => setDeckSelect(deck)} />
                        )}
                        <h3 className={styles.deckName}>{deck.name}</h3>
                        {deckSelect && (
                            <p className={styles.button} onClick={() => navigate(`/decksEdit/Deck${deckSelect.deckId}`)}>EDIT</p>
                        )}
                        {deckSelect && (!activeDeck || deckSelect.deckId !== activeDeck.deckId) && (
                            <p className={styles.button} onClick={() => handleSetActiveDeck(deckSelect)}>SET ACTIVE</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DeckPage;