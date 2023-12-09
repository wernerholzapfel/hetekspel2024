import {ITeam} from './poule.model';
import {IKnockout} from './knockout.model';
import {IParticipant} from './participant.model';

export interface ISaveKnockoutPredictionsBody {
    id?: string;
    selectedTeam: ITeam;
    homeTeam?: ITeam;
    awayTeam?: ITeam;
    knockout?: { id: string };
    round?: string;
}

export interface ISaveKnockoutPredictionOneBody extends ISaveKnockoutPredictionsBody {
    matchId: string;
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
