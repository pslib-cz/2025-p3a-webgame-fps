import { useState } from 'react';
import type { CardType, DiceSymbol } from '../types';

export type EnemyCard = {
    id: number;
    name: string;
    type: CardType;
    health: number;
    maxHealth?: number;
    shield: number;
    skill1Name?: string;
    skill1Damage?: number;
    skill1Cost?: number;
    skill2Name?: string;
    skill2Damage?: number;
    skill2Cost?: number;
    skill2Effect?: string;
    isAlive: boolean;
};

export type PlayerCard = {
    id: number;
    name?: string;
    health?: number;
    maxHealth?: number;
    shield?: number;
    skill1Damage?: number;
    skill2Damage?: number;
    skill2Effect?: string;
    isAlive?: boolean;
};

type EnemyAttackResult = {
    actionType: 'attack' | 'heal' | 'shield' | 'switch' | 'endTurn';
    targetId: number;
    damage?: number;
    healAmount?: number;
    shieldAmount?: number;
    skillUsed: string;
    newActiveCardId?: number;
    usedDiceIndices?: number[];
};

interface EvaluatedMove {
    type: 'skill1' | 'skill2' | 'switch' | 'endTurn';
    score: number;
    targetId: number;
    damage?: number;
    healAmount?: number;
    shieldAmount?: number;
    skillName: string;
    reason: string;
    cost: number;
    requiredDiceType?: DiceSymbol;
    usedDiceIndices?: number[];
}

export class EnemyAI {
    private enemyCards: EnemyCard[];
    private activeEnemyCard: number | null;
    private enemyTurnCounter: number;
    private difficulty: number;
    private availableDice: DiceSymbol[];

    constructor(cards: EnemyCard[], activeCard: number | null, availableDice: DiceSymbol[], turnCounter?: number, difficulty: number = 0.75) {
        this.enemyCards = cards;
        this.activeEnemyCard = activeCard;
        this.availableDice = [...availableDice];
        this.enemyTurnCounter = turnCounter || 0;
        this.difficulty = Math.max(0, Math.min(1, difficulty));
    }

    public evaluateAttack(playerCards: PlayerCard[], activePlayerId: number | null): EnemyAttackResult | null {
        if (!this.activeEnemyCard) {
            return null;
        }

        const activeCard = this.enemyCards.find(c => c.id === this.activeEnemyCard && c.isAlive);
        if (!activeCard) {
            return null;
        }

        const aliveTargets = playerCards.filter(c => c.isAlive && (c.health ?? 0) > 0);
        if (aliveTargets.length === 0) {
            return null;
        }

        if (this.availableDice.length === 0) {
            return {
                actionType: 'endTurn',
                targetId: 0,
                skillUsed: 'End Turn',
                usedDiceIndices: []
            };
        }

        this.enemyTurnCounter++;

        const allMoves = this.evaluateAllMoves(activeCard, playerCards, activePlayerId);
        
        if (allMoves.length === 0) {
            return {
                actionType: 'endTurn',
                targetId: 0,
                skillUsed: 'End Turn',
                usedDiceIndices: []
            };
        }

        const selectedMove = this.selectMoveWithDifficulty(allMoves);

        return this.convertMoveToResult(selectedMove);
    }

    private canAffordMove(cost: number, requiredType?: DiceSymbol): { canAfford: boolean, usedIndices: number[] } {
        if (cost === 0) return { canAfford: true, usedIndices: [] };
        
        const usedIndices: number[] = [];
        let remaining = cost;

        if (requiredType) {
            for (let i = 0; i < this.availableDice.length && remaining > 0; i++) {
                if (!usedIndices.includes(i) && this.availableDice[i] === requiredType) {
                    usedIndices.push(i);
                    remaining--;
                }
            }
        }

        for (let i = 0; i < this.availableDice.length && remaining > 0; i++) {
            if (!usedIndices.includes(i) && this.availableDice[i] === 'Jester') {
                usedIndices.push(i);
                remaining--;
            }
        }

        if (!requiredType && remaining > 0) {
            for (let i = 0; i < this.availableDice.length && remaining > 0; i++) {
                if (!usedIndices.includes(i)) {
                    usedIndices.push(i);
                    remaining--;
                }
            }
        }

        return { canAfford: remaining === 0, usedIndices };
    }

    private getRequiredDiceType(effect?: string): DiceSymbol | undefined {
        if (!effect) return undefined;
        
        const effectLower = effect.toLowerCase();
        
        if (effectLower === 'attack') return 'Knight';
        if (effectLower === 'shield') return 'Tank';
        if (effectLower === 'heal') return 'Healer';
        if (effectLower === 'magic') return 'Mage';
        if (effectLower === 'rogue' || effectLower === 'stealth') return 'Rogue';
        
        return undefined;
    }

    private evaluateAllMoves(activeCard: EnemyCard, playerCards: PlayerCard[], activePlayerId: number | null): EvaluatedMove[] {
        const moves: EvaluatedMove[] = [];

        const switchMove = this.evaluateSwitch(activeCard);
        if (switchMove) moves.push(switchMove);

        const skill2Moves = this.evaluateSkill2(activeCard, playerCards, activePlayerId);
        moves.push(...skill2Moves);

        const skill1Move = this.evaluateSkill1(activeCard, playerCards, activePlayerId);
        if (skill1Move) moves.push(skill1Move);

        return moves.sort((a, b) => b.score - a.score);
    }

    private evaluateSwitch(currentCard: EnemyCard): EvaluatedMove | null {
        const healthPercent = currentCard.health / (currentCard.maxHealth || currentCard.health);
        
        const affordCheck = this.canAffordMove(1);
        if (!affordCheck.canAfford) return null;
        
        if (healthPercent < 0.3) {
            const aliveCards = this.enemyCards.filter(c => c.isAlive && c.health > 0 && c.id !== currentCard.id);
            
            if (aliveCards.length > 0) {
                const bestCard = aliveCards.reduce((best, current) => {
                    const bestHP = best.health / (best.maxHealth || best.health);
                    const currentHP = current.health / (current.maxHealth || current.health);
                    return currentHP > bestHP ? current : best;
                });

                const bestCardHealth = bestCard.health / (bestCard.maxHealth || bestCard.health);
                
                if (bestCardHealth > healthPercent + 0.15) {
                    return {
                        type: 'switch',
                        score: 95,
                        targetId: bestCard.id,
                        skillName: 'Switch',
                        reason: `Switch from ${currentCard.name} (${Math.round(healthPercent * 100)}% HP) to ${bestCard.name}`,
                        cost: 1,
                        usedDiceIndices: affordCheck.usedIndices
                    };
                }
            }
        }

        return null;
    }

    private evaluateSkill2(activeCard: EnemyCard, playerCards: PlayerCard[], activePlayerId: number | null): EvaluatedMove[] {
        const moves: EvaluatedMove[] = [];
        
        if (!activeCard.skill2Damage && !activeCard.skill2Effect) return moves;

        const effect = activeCard.skill2Effect?.toLowerCase();
        const activePlayerCard = playerCards.find(c => c.id === activePlayerId);

        switch (effect) {
            case 'heal': {
                const cost = activeCard.skill2Cost || 0;
                const requiredType = this.getRequiredDiceType(effect);
                const affordCheck = this.canAffordMove(cost, requiredType);
                
                if (!affordCheck.canAfford) break;

                const woundedAllies = this.enemyCards
                    .filter(c => c.isAlive && c.health > 0)
                    .map(c => ({
                        card: c,
                        healthPercent: c.health / (c.maxHealth || c.health),
                        missingHealth: (c.maxHealth || c.health) - c.health
                    }))
                    .filter(a => a.healthPercent < 0.9 && a.missingHealth > 0);

                if (woundedAllies.length > 0) {
                    const mostWounded = woundedAllies.reduce((worst, current) => 
                        current.healthPercent < worst.healthPercent ? current : worst
                    );

                    const score = 60 + (1 - mostWounded.healthPercent) * 30;

                    moves.push({
                        type: 'skill2',
                        score,
                        targetId: mostWounded.card.id,
                        healAmount: activeCard.skill2Damage || 0,
                        skillName: activeCard.skill2Name || 'Heal',
                        reason: `Heal ${mostWounded.card.name} (${Math.round(mostWounded.healthPercent * 100)}% HP)`,
                        cost,
                        requiredDiceType: requiredType,
                        usedDiceIndices: affordCheck.usedIndices
                    });
                }
                break;
            }

            case 'shield': {
                const cost = activeCard.skill2Cost || 0;
                const requiredType = this.getRequiredDiceType(effect);
                const affordCheck = this.canAffordMove(cost, requiredType);
                
                if (!affordCheck.canAfford) break;

                const vulnerableAllies = this.enemyCards
                    .filter(c => c.isAlive && c.health > 0)
                    .map(c => ({
                        card: c,
                        healthPercent: c.health / (c.maxHealth || c.health),
                        totalDefense: c.health + c.shield
                    }))
                    .sort((a, b) => a.healthPercent - b.healthPercent);

                if (vulnerableAllies.length > 0) {
                    const target = vulnerableAllies[0];
                    const score = 55 + (1 - target.healthPercent) * 25;

                    moves.push({
                        type: 'skill2',
                        score,
                        targetId: target.card.id,
                        shieldAmount: activeCard.skill2Damage || 0,
                        skillName: activeCard.skill2Name || 'Shield',
                        reason: `Shield ${target.card.id === activeCard.id ? 'self' : target.card.name} (${Math.round(target.healthPercent * 100)}% HP)`,
                        cost,
                        requiredDiceType: requiredType,
                        usedDiceIndices: affordCheck.usedIndices
                    });
                }
                break;
            }

            case 'magic': {
                const cost = activeCard.skill2Cost || 0;
                const requiredType = this.getRequiredDiceType(effect);
                const affordCheck = this.canAffordMove(cost, requiredType);
                
                if (!affordCheck.canAfford) break;

                if (activePlayerCard) {
                    const weakPlayerCards = playerCards.filter(c => 
                        c.isAlive && (c.health ?? 0) > 0 && (c.health ?? 0) < 40
                    );

                    const splashBonus = Math.min(weakPlayerCards.length * 15, 40);
                    const score = 50 + splashBonus;

                    moves.push({
                        type: 'skill2',
                        score,
                        targetId: activePlayerCard.id,
                        damage: activeCard.skill2Damage || 0,
                        skillName: activeCard.skill2Name || 'Magic Splash',
                        reason: `Splash damage on active + ${weakPlayerCards.length} weak targets`,
                        cost,
                        requiredDiceType: requiredType,
                        usedDiceIndices: affordCheck.usedIndices
                    });
                }
                break;
            }

            case 'rogue':
            case 'stealth': {
                const cost = activeCard.skill2Cost || 0;
                const requiredType = this.getRequiredDiceType(effect);
                const affordCheck = this.canAffordMove(cost, requiredType);
                
                if (!affordCheck.canAfford) break;

                const targets = playerCards
                    .filter(c => c.isAlive && (c.health ?? 0) > 0)
                    .map(c => ({
                        card: c,
                        priority: this.calculateRogueTargetPriority(c, activePlayerId, activeCard.skill2Damage || 0)
                    }))
                    .sort((a, b) => b.priority - a.priority);

                if (targets.length > 0) {
                    const bestTarget = targets[0];
                    const isBackline = bestTarget.card.id !== activePlayerId;

                    moves.push({
                        type: 'skill2',
                        score: bestTarget.priority,
                        targetId: bestTarget.card.id,
                        damage: activeCard.skill2Damage || 0,
                        skillName: activeCard.skill2Name || 'Stealth Attack',
                        reason: `Rogue ${isBackline ? 'backline' : 'active'} attack on ${bestTarget.card.name || 'target'}`,
                        cost,
                        requiredDiceType: requiredType,
                        usedDiceIndices: affordCheck.usedIndices
                    });
                }
                break;
            }

            case 'attack':
            default: {
                const cost = activeCard.skill2Cost || 0;
                const requiredType = this.getRequiredDiceType(effect);
                const affordCheck = this.canAffordMove(cost, requiredType);
                
                if (!affordCheck.canAfford) break;

                if (activePlayerCard) {
                    const canKill = (activePlayerCard.health ?? 0) + (activePlayerCard.shield ?? 0) <= (activeCard.skill2Damage || 0);
                    const score = canKill ? 85 : 55;

                    moves.push({
                        type: 'skill2',
                        score,
                        targetId: activePlayerCard.id,
                        damage: activeCard.skill2Damage || 0,
                        skillName: activeCard.skill2Name || 'Power Attack',
                        reason: canKill ? `KILL active card with skill2` : `Heavy damage to active card`,
                        cost,
                        requiredDiceType: requiredType,
                        usedDiceIndices: affordCheck.usedIndices
                    });
                }
                break;
            }
        }

        return moves;
    }

    private evaluateSkill1(activeCard: EnemyCard, playerCards: PlayerCard[], activePlayerId: number | null): EvaluatedMove | null {
        const activePlayerCard = playerCards.find(c => c.id === activePlayerId);
        
        if (!activePlayerCard || !activeCard.skill1Damage) return null;

        const cost = activeCard.skill1Cost || 0;
        const affordCheck = this.canAffordMove(cost);
        
        if (!affordCheck.canAfford) return null;

        const totalHP = (activePlayerCard.health ?? 0) + (activePlayerCard.shield ?? 0);
        const canKill = totalHP <= activeCard.skill1Damage;
        
        const score = canKill ? 75 : 40;

        return {
            type: 'skill1',
            score,
            targetId: activePlayerCard.id,
            damage: activeCard.skill1Damage,
            skillName: activeCard.skill1Name || 'Basic Attack',
            reason: canKill ? `KILL active card with skill1` : `Basic attack on active card`,
            cost,
            usedDiceIndices: affordCheck.usedIndices
        };
    }

    private calculateRogueTargetPriority(target: PlayerCard, activePlayerId: number | null, rogueDamage: number): number {
        let priority = 0;

        const health = target.health ?? 0;
        const shield = target.shield ?? 0;
        const totalHP = health + shield;

        if (totalHP <= rogueDamage) {
            priority += 100;
        }

        if (target.skill2Effect?.toLowerCase() === 'heal') {
            priority += 60;
        }

        if (target.skill2Effect?.toLowerCase() === 'shield') {
            priority += 40;
        }

        const healthPercent = health / Math.max(health + 20, 100);
        priority += (1 - healthPercent) * 30;

        if (target.id !== activePlayerId) {
            priority += 25;
        }

        priority += ((target.skill2Damage ?? 0) / 10) * 10;

        return priority;
    }

    private selectMoveWithDifficulty(moves: EvaluatedMove[]): EvaluatedMove {
        if (Math.random() > this.difficulty) {
            const randomIndex = Math.floor(Math.random() * Math.min(moves.length, 3));
            return moves[randomIndex];
        }
        return moves[0];
    }

    private convertMoveToResult(move: EvaluatedMove): EnemyAttackResult {
        if (move.type === 'endTurn') {
            return {
                actionType: 'endTurn',
                targetId: 0,
                skillUsed: 'End Turn',
                usedDiceIndices: []
            };
        }

        if (move.type === 'switch') {
            return {
                actionType: 'switch',
                targetId: this.activeEnemyCard!,
                newActiveCardId: move.targetId,
                skillUsed: move.skillName,
                usedDiceIndices: move.usedDiceIndices || []
            };
        }

        if (move.healAmount) {
            return {
                actionType: 'heal',
                targetId: move.targetId,
                healAmount: move.healAmount,
                skillUsed: move.skillName,
                usedDiceIndices: move.usedDiceIndices || []
            };
        }

        if (move.shieldAmount) {
            return {
                actionType: 'shield',
                targetId: move.targetId,
                shieldAmount: move.shieldAmount,
                skillUsed: move.skillName,
                usedDiceIndices: move.usedDiceIndices || []
            };
        }

        return {
            actionType: 'attack',
            targetId: move.targetId,
            damage: move.damage || 0,
            skillUsed: move.skillName,
            usedDiceIndices: move.usedDiceIndices || []
        };
    }

    public removeDice(indices: number[]): void {
        this.availableDice = this.availableDice.filter((_, i) => !indices.includes(i));
    }

    public getAvailableDice(): DiceSymbol[] {
        return [...this.availableDice];
    }

    public switchActiveCard(newCardId: number): boolean {
        const card = this.enemyCards.find(c => c.id === newCardId && c.isAlive);
        if (card) {
            this.activeEnemyCard = newCardId;
            return true;
        }
        return false;
    }

    public getTurnCounter(): number {
        return this.enemyTurnCounter;
    }

    public updateCards(cards: EnemyCard[]): void {
        this.enemyCards = cards;
    }
}

export function useEnemyAI(
    enemyCards: EnemyCard[],
    activeEnemyCard: number | null,
    playerCards: PlayerCard[],
    activePlayerId: number | null,
    availableDice: DiceSymbol[],
    onEnemyAction: (action: EnemyAttackResult) => void
) {
    const [isThinking, setIsThinking] = useState(false);
    const [turnCounter, setTurnCounter] = useState(0);
    
    const executeEnemyTurn = async () => {
        setIsThinking(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        const ai = new EnemyAI(enemyCards, activeEnemyCard, availableDice, turnCounter, 0.75);

        const action = ai.evaluateAttack(playerCards, activePlayerId);
        
        if (action) {
            onEnemyAction(action);
            setTurnCounter(ai.getTurnCounter());
        }
        
        setIsThinking(false);
    };

    return { executeEnemyTurn, isThinking };
}

export default EnemyAI;