import {ITeam} from './poule.model';
import {IKnockout} from './knockout.model';
import {IParticipant} from './participant.model';

export interface ISaveKnockoutPredictionsBody {
    id?: string;
    selectedTeam: ITeam;
    knockout?: { id: string };
    round?: number|string;
    matchId?: string;
    homeTeam?: ITeam;
    awayTeam?: ITeam;
}

export interface ISaveKnockoutPredictionOneBody {
    id?: string;
    team: ITeam;
    round: string;
    knockoutMatchPosition: string;
}

export interface IKnockoutPrediction {
    id: string;
    knockout: IKnockout;
    selectedTeam: ITeam;
    homeTeam: ITeam;
    homeInRound: boolean;
    awayInRound: boolean;
    awayTeam: ITeam;
    spelpunten: number;
    participant: IParticipant;
    updatedDate: Date;
    createdDate: Date;
}
