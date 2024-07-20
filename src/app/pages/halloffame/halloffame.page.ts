import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-halloffame',
    templateUrl: './halloffame.page.html',
    styleUrls: ['./halloffame.page.scss'],
})
export class HalloffamePage implements OnInit {

    tournaments: { jaar: string, aantal: number, halloffame: { naam: string, positie: number }[] }[] = [];

    constructor() {
        this.tournaments = [
            {
                jaar: 'EK 2024',
                aantal: 175,
                halloffame: [{
                    naam: 'Mattijs',
                    positie: 1
                }, {
                    naam: 'Werner Holzapfel',
                    positie: 2
                }, {
                    naam: 'Frans Witt',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden EK 2024',
                aantal: 175,
                halloffame: [{
                    naam: 'Lina',
                    positie: 1
                }, {
                    naam: 'Tessa van Leeuwen',
                    positie: 1
                }, {
                    naam: 'John D\'H',
                    positie: 1
                }]
            },
            {
                jaar: 'WK 2022',
                aantal: 158,
                halloffame: [{
                    naam: 'Frank van Maanen',
                    positie: 1
                }, {
                    naam: 'Jarno Hilhorst',
                    positie: 2
                }, {
                    naam: 'GJ11',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden WK 2022',
                aantal: 158,
                halloffame: [{
                    naam: 'Hilde Pelgrum',
                    positie: 1
                }, {
                    naam: 'Stijn Koolschijn',
                    positie: 2
                }, {
                    naam: 'Pascal van Dijk',
                    positie: 3
                }]
            }, {
                jaar: 'EK 2021',
                aantal: 170,
                halloffame: [{
                    naam: 'Menno Beekman',
                    positie: 1
                }, {
                    naam: 'Sander',
                    positie: 2
                }, {
                    naam: 'Remy Verberkt en Robert-Jan',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden EK 2021',
                aantal: 170,
                halloffame: [{
                    naam: 'Bas Benning',
                    positie: 1
                }, {
                    naam: 'Jirka Franssen',
                    positie: 2
                }, {
                    naam: 'Loes Arentsen en Martijn Spruijt',
                    positie: 3
                }]
            }, {



                jaar: 'WK 2014',
                aantal: 168,
                halloffame: [{
                    naam: 'Tamar Vloedgraven',
                    positie: 1
                }, {
                    naam: 'Peer Donders',
                    positie: 2
                }, {
                    naam: 'Frank Buis',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden WK 2014',
                aantal: 168,
                halloffame: [{
                    naam: 'Wim Holzapfel',
                    positie: 1
                }, {
                    naam: 'Paul Meijerink',
                    positie: 2
                }, {
                    naam: 'Patrick Speijers',
                    positie: 3
                }]
            }, {
                jaar: 'EK 2012',
                aantal: 154,
                halloffame: [{
                    naam: 'Rogier Alarm',
                    positie: 1
                }, {
                    naam: 'Renske Praamstra',
                    positie: 2
                }, {
                    naam: 'Marvin de Ruiter',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden EK 2012',
                aantal: 154,
                halloffame: [{
                    naam: 'Maikel Staring',
                    positie: 1
                }, {
                    naam: 'Renske Praamstra',
                    positie: 2
                }, {
                    naam: 'Hermien Koers',
                    positie: 2
                }]
            }, {
                jaar: 'WK 2010',
                aantal: 147,
                halloffame: [{
                    naam: 'Chantal Garstenveld',
                    positie: 1
                }, {
                    naam: 'Dimitri Fioole',
                    positie: 2
                }, {
                    naam: 'Michelle Wijsman',
                    positie: 3
                }]
            },
            {
                jaar: 'Poulewedstrijden WK 2010',
                aantal: 147,
                halloffame: [{
                    naam: 'Justin Kuipers',
                    positie: 1
                }, {
                    naam: 'Maurice Berndsen',
                    positie: 2
                }, {
                    naam: 'Jasper van Maanen',
                    positie: 2
                }]
            }, {
                jaar: 'EK 2008',
                aantal: 120,
                halloffame: [{
                    naam: 'Anne Knoef',
                    positie: 1
                }, {
                    naam: 'Emiel Maarschalkerweerd',
                    positie: 2
                }, {
                    naam: 'Niek Leemreize',
                    positie: 3
                }]
            }, {
                jaar: 'Poulewedstrijden EK 2008',
                aantal: 120,
                halloffame: [{
                    naam: 'Michelle Wijsman',
                    positie: 1
                }, {
                    naam: 'Werner Holzapfel',
                    positie: 2
                }, {
                    naam: 'Eduardo Serrano',
                    positie: 3
                }]
            }, {
                jaar: 'WK 2006',
                aantal: 116,
                halloffame: [{
                    naam: 'Tom Luttikhold',
                    positie: 1
                }, {
                    naam: 'Frank Letteboer',
                    positie: 2
                }, {
                    naam: 'Ronald Eitens',
                    positie: 3
                }]
            }, {
                jaar: 'WK 2004',
                aantal: 85,
                halloffame: [{
                    naam: 'Maikel Staring',
                    positie: 1
                }, {
                    naam: 'Rene van Hoorn',
                    positie: 2
                }, {
                    naam: 'Harm groot Wesseldijk',
                    positie: 3
                }]
            }
        ];

    }

    ngOnInit() {
    }

}
