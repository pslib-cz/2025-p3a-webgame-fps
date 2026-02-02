import { Link } from 'react-router';
import styles from '../styles/DeckPage.module.css';
import { useState, useEffect } from 'react';
import { type CardType } from '../types';
import Card, { type CardProps } from '../components/Card';

interface DeckData {
    deckId?: number;
    name: string;
    cards: { cardId: number }[];
}

const Deck1Page = () => {
    const [deckName, setDeckName] = useState("Deck1")
    const [isEditing, setIsEditing] = useState(false);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [selectedType, setSelectedType] = useState<CardType | null>(null)
    const [selectedAttackIds, setSelectedAttackIds] = useState<number[]>([]);
    const [showAttackContainer, setShowAttackContainer] = useState(false);
    const [selectedSupportIds, setSelectedSupportIds] = useState<number[]>([]);
    const [showSupportContainer, setShowSupportContainer] = useState(false);
    const [existingDeck, setExistingDeck] = useState<DeckData | null>(null);

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
                          imgSrc: `https://localhost:7077/api/images/${c.cardId}.png`,
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

    useEffect(() => {
        const loadDeckFromDB = async () => {
            try {
                const TARGET_ID = 1;
                const response = await fetch(`https://localhost:7077/api/Decks/${TARGET_ID}/with-cards`);
                if (!response.ok) {
                    throw new Error('Failed to fetch decks');
                }
                const deck = await response.json();
                if (deck.deckId !== TARGET_ID) {
                    throw new Error(`Deck ID mismatch. Expected ${TARGET_ID}, got ${deck.deckId}`);
                }
                setExistingDeck(deck);
                setDeckName(deck.name ?? "Deck1");

                if (deck.cards) {
                    const attacks = deck.cards
                        .filter((c: any) => c.type === 'attack')
                        .map((c: any) => c.cardId);
                    const supports = deck.cards
                        .filter((c: any) => c.type === 'support')
                        .map((c: any) => c.cardId);
                    setSelectedAttackIds(attacks);
                    setSelectedSupportIds(supports);
                }
            } catch (error) {
                console.error('Error loading deck from DB', error);
            }
        };

        if (cards.length > 0) {
            loadDeckFromDB();
        }
    }, [cards]);

    const handleAttackClick = () => {
        setShowAttackContainer(!showAttackContainer);
        setSelectedType('attack');
    }

    const toggleAttackSelect = (id: number) => {
        setSelectedAttackIds(prev => {
            const exists = prev.includes(id);
            if (exists) return prev.filter(x => x !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    }

    const handleConfirmAttack = () => {
        setShowAttackContainer(false);
    }

    const handleSupportClick = () => {
        setShowSupportContainer(!showSupportContainer);
        setSelectedType('support');
    }

    const toggleSupportSelect = (id: number) => {
        setSelectedSupportIds(prev => {
            const exists = prev.includes(id);
            if (exists) return prev.filter(x => x !== id);
            return [...prev, id];
        });
    }

    const handleConfirmSupport = () => {
        setShowSupportContainer(false);
    }

    const buildSelectedCards = () => {
        const mergedIds = [...selectedAttackIds, ...selectedSupportIds];
        return mergedIds
            .map(id => cards.find(c => c.id === id))
            .filter((c): c is CardProps => Boolean(c))
            .map(card => ({
                CardId: card.id,
                Name: card.name,
                Type: card.type,
                Health: card.health ?? 0,
                Shield: card.shield ?? 0,
                Skill1Name: card.skill1Name ?? "",
                Skill1Damage: card.skill1Damage ?? 0,
                Skill1Cost: card.skill1Cost ?? 0,
                Skill2Name: card.skill2Name ?? "",
                Skill2Effect: card.skill2Effect ?? "",
                Skill2Damage: 0,
                Skill2Cost: card.skill2Cost ?? 0,
                SupportCost: card.supportCost ?? 0,
                SupportEffect: card.supportEffect ?? ""
            }));
    }

    const handleSaveDeck = async () => {
        const trimmedDeckName = deckName === '' ? "Deck1" : deckName.slice(0, 15);
        const TARGET_ID = 1;
        const deckData = {
            deckId: TARGET_ID,
            name: trimmedDeckName,
            cards: buildSelectedCards()
        };
        
        try {
            let response;

            if (existingDeck && existingDeck.deckId === TARGET_ID) {
                response = await fetch(`https://localhost:7077/api/Decks/${TARGET_ID}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deckData)
                });
            } else {
                response = await fetch(`https://localhost:7077/api/Decks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deckData)
                });
            }
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server error response:', JSON.stringify(errorData, null, 2));
                if (errorData.errors) {
                    console.error('Validation errors:', errorData.errors);
                }
                throw new Error(errorData.detail || errorData.title || 'Failed to save deck');
            }

            let savedDeck: any = null;
            if (response.status === 204) {
                const refresh = await fetch(`https://localhost:7077/api/Decks/${TARGET_ID}/with-cards`);
                if (refresh.ok) {
                    savedDeck = await refresh.json();
                }
            } else {
                savedDeck = await response.json();
            }

            if (savedDeck) {
                console.log('Deck saved with ID:', savedDeck.deckId);
                setExistingDeck(savedDeck);
                if (savedDeck.cards) {
                    const attacks = savedDeck.cards.filter((c: any) => cards.find(card => card.id === c.cardId && card.type === 'attack')).map((c: any) => c.cardId);
                    const supports = savedDeck.cards.filter((c: any) => cards.find(card => card.id === c.cardId && card.type === 'support')).map((c: any) => c.cardId);
                    setSelectedAttackIds(attacks);
                    setSelectedSupportIds(supports);
                }
            }
        } catch (error) {
            console.error('Error saving deck', error);
        }
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
                    if (e.key === 'Enter' && deckName !== '') setIsEditing(false);
                    else if (e.key === 'Enter' && deckName === '') setDeckName("Deck1");
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
                {[0, 1, 2].map((i) => {
                    const card = cards.find(c => c.id === selectedAttackIds[i]);
                    return (
                        <div key={i}>
                            {card ? (
                                <Card {...card} onClick={handleAttackClick}/>
                            ) : (
                                <button onClick={handleAttackClick}></button>
                            )}
                        </div>
                    );
                })}
            </div>
            {showAttackContainer && (
                <div className={styles.cardContainer}>
                    <div className={styles.cards}>  
                        {cards.filter(card => card.type === selectedType)
                            .map((card) => (
                                <div key={card.id}>
                                    <Card {...card} isSelected={selectedAttackIds.includes(card.id)} onClick={() => toggleAttackSelect(card.id)}/>
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        <span onClick={handleAttackClick}>CANCEL</span>
                        {selectedAttackIds.length > 0 && (
                            <span onClick={handleConfirmAttack}>CONFIRM</span>
                        )}
                    </div>
                </div>
            )}
            <div className={styles.containerEdit}>
                <div className={styles.container}>
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                        const card = cards.find(c => c.id === selectedSupportIds[i]);
                        return (
                            <div key={i}>
                                {card ? (
                                    <Card {...card} onClick={handleSupportClick}/>
                                ) : (
                                    <button onClick={handleSupportClick}></button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {showSupportContainer && (
                <div className={styles.cardContainer}>
                    <div className={styles.cards}>  
                        {cards.filter(card => card.type === selectedType)
                            .map((card) => (
                                <div key={card.id}>
                                    <Card {...card}  isSelected={selectedSupportIds.includes(card.id)} onClick={() => toggleSupportSelect(card.id)}/>
                                </div>
                            ))
                        }
                    </div>
                    <span onClick={handleSupportClick}>CANCEL</span>
                    {selectedSupportIds.length > 0 && (
                            <span onClick={handleConfirmSupport}>CONFIRM</span>
                        )}
                </div>
            )}
            {selectedAttackIds.length > 0 && (
                <span onClick={handleSaveDeck}>SAVE</span>
            )}
        </div>
    );
}
export default Deck1Page;