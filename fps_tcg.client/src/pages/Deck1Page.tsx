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
    const [selectedAttackIds, setSelectedAttackIds] = useState<number[]>([]);
    const [showAttackContainer, setShowAttackContainer] = useState(false);
    const [selectedSupportIds, setSelectedSupportIds] = useState<number[]>([]);
    const [showSupportContainer, setShowSupportContainer] = useState(false);

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

    useEffect(() => {
        const savedAttacks = localStorage.getItem('selectedAttackIds');
        const savedSupport = localStorage.getItem('selectedSupportIds');
        if (savedAttacks) setSelectedAttackIds(JSON.parse(savedAttacks));
        if (savedSupport) setSelectedSupportIds(JSON.parse(savedSupport));
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedAttackIds', JSON.stringify(selectedAttackIds));
    }, [selectedAttackIds]);

    useEffect(() => {
        localStorage.setItem('selectedSupportIds', JSON.stringify(selectedSupportIds));
    }, [selectedSupportIds]);

    const handleSaveDeck = () => {
        const deckData = {
            name: deckName,
            attacks: selectedAttackIds,
            supports: selectedSupportIds
        };
        localStorage.setItem('myDeck', JSON.stringify(deckData));
    }

    useEffect(() => {
        const savedDeck = localStorage.getItem('myDeck');
        if (savedDeck) {
            const { name, attacks, supports } = JSON.parse(savedDeck);
            setDeckName(name);
            setSelectedAttackIds(attacks);
            setSelectedSupportIds(supports);
        }
    }, []);

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
                <button onClick={handleSupportClick}></button>
                <button onClick={handleSupportClick}></button>
                <button onClick={handleSupportClick}></button>
                <button onClick={handleSupportClick}></button>
                <button onClick={handleSupportClick}></button>
                <button onClick={handleSupportClick}></button>
            </div>
            {showSupportContainer && (
                <div className={styles.cardContainer}>
                    <div>  
                        {cards.filter(card => card.type === selectedType)
                            .map((card) => (
                                <div key={card.id}>
                                    <Card {...card}  isSelected={selectedSupportIds.includes(card.id)} onClick={() => toggleSupportSelect(card.id)}/>
                                </div>
                            ))
                        }
                    </div>
                    <span onClick={handleSupportClick}>CANCEL</span>
                </div>
            )}
            {selectedAttackIds.length > 0 && (
                <span onClick={handleSaveDeck}>SAVE</span>
            )}
        </div>
    );
}
export default Deck1Page;