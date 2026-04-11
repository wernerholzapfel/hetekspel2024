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
