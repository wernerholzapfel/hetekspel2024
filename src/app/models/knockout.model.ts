import {ITeam} from './poule.model';
import {ISaveKnockoutPredictionsBody} from './knockout-predictions.model';

export interface IKnockout {
    id: string;
    matchId: string;
    homeId: string;
    awayId: string;
    round: string;
    city: string;
    date: string;
    selectedTeam?: ITeam;
    homeTeam?: ITeam;
    awayTeam?: ITeam;
    homeScore?: number;
    awayScore?: number;
    prediction: ISaveKnockoutPredictionsBody; // todo prediction get body?
    isLoading?: boolean;
}

export class UpdateKnockoutDto {
    id: string;
    homeTeam: { id: string };
    awayTeam: { id: string };
    winnerTeam: { id: string };
    homeScore: number;
    awayScore: number;
}
