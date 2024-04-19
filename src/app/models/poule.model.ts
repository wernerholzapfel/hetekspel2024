import {IMatchPrediction} from './participant.model';

export interface IPoule {
    pouleName: string;
    matches: IMatch[];
}

export interface IMatch {
    id: string;
    date: string;
    poule: string;
    city: string;
    homeTeam: ITeam;
    awayTeam: ITeam;
    homeScore: number;
    awayScore: number;
    ordering: number;
    matchPredictions?: IMatchPrediction[];
}

export class UpdateMatchDto {
    id: string;
    homeScore: number;
    awayScore: number;

}

export interface ITeam {
    id: string;
    name?: string;
    logoUrl?: string;
    isEliminated?: boolean;
    eliminationRound?: string;
    latestActiveRound?: string;
    poulePosition?: number;
}

export interface ITeamKnockout extends ITeam {
    isInRound?: boolean;
    points?: number;
}


export class UpdateTeamPositionDto {
    id: string;
    poulePosition: number;
    isEliminated: boolean;
    eliminationRound: string;
    isPositionFinal: boolean;
}

export interface ITable {
    tableLines: ITableLine[];
}

export interface ITableLine {
    team: ITeam;
    positie: number;
    gespeeld: number;
    winst: number;
    punten: number;
    goalsFor: number;
    goalsAgainst: number;
    sortering: number;
    thirdPositionScore?: number;
    spelpunten?: number;
    isPositionFinal?: boolean;
    positieVoorspelling?: number; 
}

export interface PouleNav {
    current: string;
    next?: string;
    previous?: string;
    disabled: boolean;
    isFinal?: boolean;
    text: string;
}
