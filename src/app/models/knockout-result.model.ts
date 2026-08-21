import { ITeam } from './poule.model';

export interface ISaveKnockoutResultBody {
    winnerTeam: ITeam;
    loserTeam: ITeam;
    knockoutId: string;
    round: string;
    knockoutMatchPosition: string;
    homeScore?: number;
    awayScore?: number;
}

export interface ISaveKnockoutResultLoserBody {
    team: ITeam;
    round: string;
    knockoutMatchPosition: string;
}
