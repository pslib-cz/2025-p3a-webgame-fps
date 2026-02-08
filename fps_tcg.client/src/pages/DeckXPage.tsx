import { Link, useParams, useNavigate } from 'react-router';
import styles from '../styles/DeckXPage.module.css';
import { useState, useEffect } from 'react';
import { type CardType } from '../types';
import Card, { type CardProps } from '../components/Card';

interface DeckData {
    deckId?: number;
    name: string;
    cards: { cardId: number }[];
}

const DeckXPage = () => {
    const { deckId } = useParams<{ deckId: string }>();
    const navigate = useNavigate();
    const isNewDeck = deckId === 'new';
    const numericDeckId = isNewDeck ? null : parseInt(deckId || '0', 10);

    const [deckName, setDeckName] = useState(isNewDeck ? "New Deck" : `Deck ${deckId}`);
    const [originalDeckName, setOriginalDeckName] = useState(isNewDeck ? "New Deck" : `Deck ${deckId}`);
    const [isEditing, setIsEditing] = useState(false);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [selectedType, setSelectedType] = useState<CardType | null>(null);
    const [selectedAttackIds, setSelectedAttackIds] = useState<number[]>([]);
    const [originalAttackIds, setOriginalAttackIds] = useState<number[]>([]);
    const [tempAttackIds, setTempAttackIds] = useState<number[]>([]);
    const [showAttackContainer, setShowAttackContainer] = useState(false);
    const [selectedSupportIds, setSelectedSupportIds] = useState<number[]>([]);
    const [originalSupportIds, setOriginalSupportIds] = useState<number[]>([]);
    const [tempSupportIds, setTempSupportIds] = useState<number[]>([]);
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
    }, []);

    useEffect(() => {
        const loadDeckFromDB = async () => {
            if (isNewDeck || !numericDeckId) return;

            try {
                const response = await fetch(`https://localhost:7077/api/Decks/${numericDeckId}/with-cards`);
                if (!response.ok) {
                    throw new Error('Failed to fetch deck');
                }
                const deck = await response.json();
                
                setExistingDeck(deck);
                setDeckName(deck.name ?? `Deck ${numericDeckId}`);
                setOriginalDeckName(deck.name ?? `Deck ${numericDeckId}`);

                if (deck.cards) {
                    const attacks = deck.cards
                        .filter((c: any) => c.type === 'attack')
                        .map((c: any) => c.cardId);
                    const supports = deck.cards
                        .filter((c: any) => c.type === 'support')
                        .map((c: any) => c.cardId);
                    setSelectedAttackIds(attacks);
                    setOriginalAttackIds(attacks);
                    setSelectedSupportIds(supports);
                    setOriginalSupportIds(supports);
                }
            } catch (error) {
                console.error('Error loading deck from DB', error);
            }
        };

        if (cards.length > 0) {
            loadDeckFromDB();
        }
    }, [cards, deckId, isNewDeck, numericDeckId]);

    const handleAttackClick = () => {
        if (!showAttackContainer) {
            setTempAttackIds([...selectedAttackIds]);
        }
        setShowAttackContainer(!showAttackContainer);
        setSelectedType('attack');
    };

    const toggleAttackSelect = (id: number) => {
        setSelectedAttackIds(prev => {
            const exists = prev.includes(id);
            if (exists) return prev.filter(x => x !== id);
            if (prev.length >= 3) return prev;
            return [...prev, id];
        });
    };

    const handleConfirmAttack = () => {
        setShowAttackContainer(false);
    };

    const handleCancelAttack = () => {
        setSelectedAttackIds([...tempAttackIds]);
        setShowAttackContainer(false);
    };

    const handleSupportClick = () => {
        if (!showSupportContainer) {
            setTempSupportIds([...selectedSupportIds]);
        }
        setShowSupportContainer(!showSupportContainer);
        setSelectedType('support');
    };

    const toggleSupportSelect = (id: number) => {
        setSelectedSupportIds(prev => {
            const exists = prev.includes(id);
            if (exists) return prev.filter(x => x !== id);
            return [...prev, id];
        });
    };

    const handleConfirmSupport = () => {
        setShowSupportContainer(false);
    };

    const handleCancelSupport = () => {
        setSelectedSupportIds([...tempSupportIds]);
        setShowSupportContainer(false);
    };

    const hasChanges = (): boolean => {
        if (isNewDeck) return selectedAttackIds.length > 0;
        if (deckName !== originalDeckName) return true;
        if (selectedAttackIds.length !== originalAttackIds.length) return true;
        if (!selectedAttackIds.every((id, idx) => originalAttackIds[idx] === id)) return true;
        if (selectedSupportIds.length !== originalSupportIds.length) return true;
        if (!selectedSupportIds.every((id, idx) => originalSupportIds[idx] === id)) return true;
        return false;
    };

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
    };

    const handleSaveDeck = async () => {
        if (selectedAttackIds.length !== 3) {
            alert('Deck must have 3 attack cards!');
            return;
        }
        
        if (selectedSupportIds.length !== 6) {
            alert('Deck must have 6 support cards!');
            return;
        }

        const trimmedDeckName = deckName === '' ? "New Deck" : deckName.slice(0, 15);
        
        const deckData = {
            deckId: isNewDeck ? 0 : numericDeckId,
            name: trimmedDeckName,
            cards: buildSelectedCards()
        };

        try {
            let response;

            if (isNewDeck) {
                response = await fetch(`https://localhost:7077/api/Decks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(deckData)
                });
            } else if (existingDeck && existingDeck.deckId === numericDeckId) {
                response = await fetch(`https://localhost:7077/api/Decks/${numericDeckId}`, {
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
                const refresh = await fetch(`https://localhost:7077/api/Decks/${numericDeckId}/with-cards`);
                if (refresh.ok) {
                    savedDeck = await refresh.json();
                }
            } else {
                savedDeck = await response.json();
            }

            if (savedDeck) {
                console.log('Deck saved with ID:', savedDeck.deckId);
                
                const storedIds = JSON.parse(localStorage.getItem('deckIds') || '[]');
                if (!storedIds.includes(savedDeck.deckId)) {
                    storedIds.push(savedDeck.deckId);
                    localStorage.setItem('deckIds', JSON.stringify(storedIds));
                }

                if (isNewDeck) {
                    navigate(`/decksEdit/${savedDeck.deckId}`);
                } else {
                    setExistingDeck(savedDeck);
                    setOriginalDeckName(trimmedDeckName);
                    if (savedDeck.cards) {
                        const attacks = savedDeck.cards.filter((c: any) => cards.find(card => card.id === c.cardId && card.type === 'attack')).map((c: any) => c.cardId);
                        const supports = savedDeck.cards.filter((c: any) => cards.find(card => card.id === c.cardId && card.type === 'support')).map((c: any) => c.cardId);
                        setSelectedAttackIds(attacks);
                        setOriginalAttackIds(attacks);
                        setSelectedSupportIds(supports);
                        setOriginalSupportIds(supports);
                    }
                }
            }
        } catch (error) {
            console.error('Error saving deck', error);
        }
    };

    return (
        <div className={styles.deckPage}>
            <Link className={styles.button} to="/decksEdit/"><span>&lt;- BACK</span></Link>
            {isEditing ? (
                <input
                    className={styles.nameInput}
                    value={deckName}
                    onChange={(e) => setDeckName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && deckName !== '') setIsEditing(false);
                        else if (e.key === 'Enter' && deckName === '') setDeckName("New Deck");
                    }}
                />
            ) : (
                <div
                    className={styles.name}
                    onClick={() => setIsEditing(true)}
                >
                    {deckName}
                </div>
            )}
            <div className={styles.attackContainer}>
                {[0, 1, 2].map((i) => {
                    const card = cards.find(c => c.id === selectedAttackIds[i]);
                    return (
                        <div key={i}>
                            {card ? (
                                <Card {...card} onClick={handleAttackClick}/>
                            ) : (
                                <button className={styles.placeholder} onClick={handleAttackClick}></button>
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
                    <div className={styles.confirmContainer}>
                        <span className={styles.button} onClick={handleCancelAttack}>CANCEL</span>
                        {selectedAttackIds.length > 2 && (
                            <span className={styles.button} onClick={handleConfirmAttack}>CONFIRM</span>
                        )}
                    </div>
                </div>
            )}
            <div className={styles.supportContainer}>
                {[0, 1, 2, 3, 4, 5].map((i) => {
                    const card = cards.find(c => c.id === selectedSupportIds[i]);
                    return (
                        <div key={i}>
                            {card ? (
                                <Card {...card} onClick={handleSupportClick}/>
                            ) : (
                                <button className={styles.placeholder} onClick={handleSupportClick}></button>
                            )}
                        </div>
                    );
                })}
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
                    <div className={styles.confirmContainer}>
                        <span className={styles.button} onClick={handleCancelSupport}>CANCEL</span>
                        {selectedSupportIds.length > 5 && (
                            <span className={styles.button} onClick={handleConfirmSupport}>CONFIRM</span>
                        )}
                    </div>
                </div>
            )}
            {hasChanges() && (
                <span className={`${styles.button} ${styles.saveButton}`} onClick={handleSaveDeck}>SAVE</span>
            )}
        </div>
    );
};

export default DeckXPage;
