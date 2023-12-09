import {Injectable} from '@angular/core';
import {ITableLine, ITeam} from '../models/poule.model';
import {IMatchPrediction} from '../models/participant.model';

@Injectable({
    providedIn: 'root'
})
export class VoorspellingHelperService {

    constructor() {
    }

    public berekenStand(matchPredictions: IMatchPrediction[], sortTable: boolean): ITableLine[] {
        let table: ITableLine[] = [];

        for (const match of matchPredictions) {
            const index = table.findIndex(t => t.team.id === match.match.homeTeam.id);

            if (index === -1) {
                table.push(this.createInitialTableLine(match.match.homeTeam));
            }
        }

        for (const match of matchPredictions) {
            const index = table.findIndex(t => t.team.id === match.match.awayTeam.id);

            if (index === -1) {
                table.push(this.createInitialTableLine(match.match.awayTeam));
            }
        }

        for (const match of matchPredictions) {
            table = this.updateTableLine(table, match);
        }

        if (sortTable) {
            table = table.map(line => {
                return {
                    ...line,
                    thirdPositionScore: this.calculateScoreForThirdPosition(line),
                    sortering: this.calculateSortering(line, matchPredictions, table)
                };
            })
                .sort((a, b) =>
                    (b.sortering - a.sortering))
                .reduce((accumulator, currentValue, index) => {
                    return [...accumulator, Object.assign({}, currentValue, {
                        positie: this.calculatePosition(currentValue, index, accumulator)
                    })];
                }, []);
        }
        return table;
    }

    calculatePosition(tableLine: ITableLine, index, table: ITableLine[]) {
        return index + 1;
        // return index > 0 && tableLine.sortering === table[index - 1].sortering ?
        //     table[index - 1].positie : index + 1;
    }

    calculateSortering(tableLine: ITableLine, matches: IMatchPrediction[], table: ITableLine[]) {
        const teamsEqualOnPoints = table.filter(line => line.punten === tableLine.punten).map(line => {
            return line.team.id;
        });

        if (teamsEqualOnPoints.length > 1) {
            const matchesForTeam = matches.filter(match => {
                return teamsEqualOnPoints.includes(match.match.homeTeam.id) && (teamsEqualOnPoints.includes(match.match.awayTeam.id));
            });
            const tableWithTeamsEqualOnPoints: ITableLine[] = this.berekenStand(matchesForTeam, false);
            const tableLineWithTeamEqualOnPoints: ITableLine = tableWithTeamsEqualOnPoints.find(line => line.team.id === tableLine.team.id);
            return (tableLine.punten * 10000000 +
                tableLineWithTeamEqualOnPoints.punten * 100000 +
                ((tableLineWithTeamEqualOnPoints.goalsFor - tableLineWithTeamEqualOnPoints.goalsAgainst) * 100) +
                tableLineWithTeamEqualOnPoints.goalsFor +
                ((tableLine.goalsFor - tableLine.goalsAgainst) / 100) +
                tableLine.goalsFor / 10000);
        } else {
            return (tableLine.punten * 10000000 +
                ((tableLine.goalsFor - tableLine.goalsAgainst) * 100) +
                tableLine.goalsFor);

        }
        // a. higher number of points obtained in the matches played among the teams in
        // question;
        // b. superior goal difference resulting from the matches played among the teams
        // in question;
        // c. higher number of goals scored in the matches played among the teams in
        // question;
        // d. if, after having applied criteria a) to c), teams still have an equal ranking,
        // criteria a) to c) are reapplied exclusively to the matches between the
        // remaining teams to determine their final rankings. If this procedure does not
        // lead to a decision, criteria e) to i) apply in the order given to the two or more
        // teams still equal:
        // e. superior goal difference in all group matches;
        // f. higher number of goals scored in all group mat

    }


    // a. higher number of points;
    // b. superior goal difference;
    // c. higher number of goals scored;
    // d. higher number of wins;
    calculateScoreForThirdPosition(tableLine: ITableLine) {
        return (tableLine.punten * 1000000 +
            ((tableLine.goalsFor - tableLine.goalsAgainst) * 10000) +
            tableLine.goalsFor * 100 +
            tableLine.winst);
    }

    createInitialTableLine(team: ITeam): ITableLine {
        return {
            team,
            positie: 0,
            gespeeld: 0,
            winst: 0,
            punten: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            sortering: 0
        };
    }

    private updateTableLine(table: ITableLine[], matchPrediction: IMatchPrediction): ITableLine[] {
        return table.map(line => {
            if (line.team.id === matchPrediction.match.homeTeam.id) {
                return this.updateTeamLine(line, matchPrediction, true);
            } else if (line.team.id === matchPrediction.match.awayTeam.id) {
                return this.updateTeamLine(line, matchPrediction, false);
            } else {
                return {...line};
            }
        });

    }

    updateTeamLine(line: ITableLine, matchPrediction: IMatchPrediction, homeTeam: boolean) {
        return matchPrediction.homeScore === undefined || matchPrediction.awayScore === undefined ||
        matchPrediction.homeScore === null || matchPrediction.awayScore === null ?
            {...line} :
            {
                ...line,
                gespeeld: line.gespeeld + 1,
                winst: (this.punten(homeTeam ?
                    matchPrediction.homeScore : matchPrediction.awayScore, homeTeam ?
                    matchPrediction.awayScore : matchPrediction.homeScore) === 3) ? line.winst + 1 : line.winst,
                punten: line.punten +
                    this.punten(homeTeam ?
                        matchPrediction.homeScore : matchPrediction.awayScore, homeTeam ?
                        matchPrediction.awayScore : matchPrediction.homeScore),
                goalsFor: line.goalsFor + (homeTeam ? matchPrediction.homeScore : matchPrediction.awayScore),
                goalsAgainst: line.goalsAgainst + (homeTeam ? matchPrediction.awayScore : matchPrediction.homeScore)
            };
    }

    private punten(gescoord: number, tegen: number): number {
        return gescoord === null || tegen === null ?
            0 : gescoord > tegen ?
                3 : gescoord < tegen ?
                    0 : 1;
    }
}
