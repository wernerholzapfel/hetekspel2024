
export interface IStandLine {
    id: string;
    displayName: string;
    position: number;
    matchPoints: number;
    knockoutPoints: number;
    poulePoints: number;
    totalPoints: number;
    deltaTotalPoints: number;
    deltaMatchPoints: number;
    previousPosition?: number;
    previousMatchPosition?: number;
    matchPosition?: number;
    deltaPosition?: number;
    deltaPoulePoints: number;
    deltaKnockoutPoints: number;
    isMine?: boolean;
}
