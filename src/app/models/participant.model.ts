import {IMatch} from './poule.model';
import {IStandLine} from './stand.model';

export interface IParticipant {
  id?: string;
  displayName: string;
  email?: string;
  isAllowed?: boolean;
}

export interface IMatchPrediction {
  id?: string;
  homeScore: number;
  awayScore: number;
  spelpunten?: number;
  match?: IMatch;
  participant?: IParticipant;
  tableLine?: IStandLine;
}

export interface IPoulePrediction {
  id?: string;
  poule: string;
  position: number;
  thirdPositionScore: number;
}
