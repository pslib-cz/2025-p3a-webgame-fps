import { useState } from 'react';
import type { CardType } from '../types';

export type EnemyCard = {
    id: number;
    name: string;
    type: CardType;
    health: number;
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

type EnemyAttackResult = {
    targetId: number;
    damage: number;
    skillUsed: string;
};

export class EnemyAI {
    private enemyCards: EnemyCard[];
    private activeEnemyCard: number | null;
    private enemyTurnCounter: number;

    constructor(cards: EnemyCard[], activeCard: number | null, turnCounter?: number) {
        this.enemyCards = cards;
        this.activeEnemyCard = activeCard;
        this.enemyTurnCounter = turnCounter || 0;
    }

    public evaluateAttack(playerCards: any[]): EnemyAttackResult | null {
        if (!this.activeEnemyCard) {
            console.log('Enemy: No active card');
            return null;
        }

        const activeCard = this.enemyCards.find(c => c.id === this.activeEnemyCard && c.isAlive);
        if (!activeCard) {
            console.log('Enemy: Active card not found or dead');
            return null;
        }

        const aliveTargets = playerCards.filter(c => c.isAlive && c.health > 0);
        if (aliveTargets.length === 0) {
            console.log('Enemy: No alive targets');
            return null;
        }

        const nextAttackNumber = this.enemyTurnCounter + 1;
        const bestAttack = this.selectBestAttack(activeCard, aliveTargets, nextAttackNumber);

        if (bestAttack) {
            this.enemyTurnCounter = nextAttackNumber;
        }
        return bestAttack;
    }

    private selectBestAttack(activeCard: EnemyCard, targets: any[], turnNumber: number): EnemyAttackResult | null {
        const useUltimate = turnNumber % 3 === 0;

        if (useUltimate && activeCard.skill2Damage) {
            const target = this.selectTarget(targets, 'strongest');
            console.log(`Enemy card ${activeCard.name} uses ULTIMATE on turn ${turnNumber}!`);
            return {
                targetId: target.id,
                damage: activeCard.skill2Damage,
                skillUsed: activeCard.skill2Name || 'Skill 2'
            };
        }

        if (activeCard.skill1Damage) {
            const target = this.selectTarget(targets, 'weakest');
            return {
                targetId: target.id,
                damage: activeCard.skill1Damage,
                skillUsed: activeCard.skill1Name || 'Skill 1'
            };
        }

        console.log('Enemy: No skills available');
        return null;
    }

    private selectTarget(targets: any[], strategy: 'weakest' | 'strongest' = 'weakest'): any {
        if (strategy === 'weakest') {
            return targets.reduce((weakest, current) => 
                (current.health + current.shield) < (weakest.health + weakest.shield) ? current : weakest
            );
        } else {
            return targets.reduce((strongest, current) => 
                (current.health + current.shield) > (strongest.health + strongest.shield) ? current : strongest
            );
        }
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
}

export function useEnemyAI(
    enemyCards: EnemyCard[],
    activeEnemyCard: number | null,
    playerCards: any[],
    onEnemyAttack: (attack: EnemyAttackResult) => void
) {
    const [isThinking, setIsThinking] = useState(false);
    const [turnCounter, setTurnCounter] = useState(0);
    
    const executeEnemyTurn = async () => {
        setIsThinking(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        const ai = new EnemyAI(enemyCards, activeEnemyCard, turnCounter);

        const attack = ai.evaluateAttack(playerCards);
        
        if (attack) {
            console.log('Enemy attacks with:', attack);
            onEnemyAttack(attack);
            setTurnCounter(ai.getTurnCounter());
        } else {
            console.log('Enemy has no valid target or active card');
        }
        
        setIsThinking(false);
    };

    return { executeEnemyTurn, isThinking };
}

export default EnemyAI;
