import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CityCardHeaderComponent} from '../city-card-header/city-card-header.component';
import {IonicModule} from '@ionic/angular';
import {StandCardComponent} from '../stand-card/stand-card.component';
import {LeagueTableRowComponent} from '../league-table-row/league-table-row.component';
import {FilterKnockoutRoundsPipe} from '../../pipes/filter-knockout-rounds.pipe';
import {MatchCardComponent} from '../match-card/match-card.component';
import {PuntenChipComponent} from '../punten-chip/punten-chip.component';
import {ParticipantCardComponent} from '../participant-card/participant-card.component';
import {FromNowPipe} from '../../pipes/fromNow.pipe';
import {HeadlineComponent} from '../headline/headline.component';
import {EditHeadlineComponent} from '../edit-headline/edit-headline.component';
import {FormsModule} from '@angular/forms';
import {RoundTextPipe} from '../../pipes/roundText.pipe';
import {ScrollVanishDirective} from '../../directives/scroll-vanish.directive';
import {KnockoutTeamHeaderComponent} from '../knockout-team-header/knockout-team-header.component';
import {GestureDirective} from '../../directives/gestures.directive';
import {ToggleStandListComponent} from '../toggle-stand-list/toggle-stand-list.component';
import {FilterPouleMatchesPipe} from '../../pipes/filter-poule-matches.pipe';
import { KnockoutIconRowComponent } from '../knockout-icon-row/knockout-icon-row.component';
import { MenuToolbarComponent } from '../menu-toolbar/menu-toolbar.component';
import { SpeelschemaMatchItemComponent } from '../speelschema-match-item/speelschema-match-item.component';
import { KnockoutCardTextPipe } from 'src/app/pipes/knockoutCardText.pipe';


@NgModule({
    declarations: [CityCardHeaderComponent,
        StandCardComponent,
        LeagueTableRowComponent,
        FilterKnockoutRoundsPipe,
        FilterPouleMatchesPipe,
        FromNowPipe,
        RoundTextPipe,
        KnockoutCardTextPipe,
        MatchCardComponent,
        PuntenChipComponent,
        ParticipantCardComponent,
        HeadlineComponent,
        EditHeadlineComponent,
        ScrollVanishDirective,
        GestureDirective,
        KnockoutTeamHeaderComponent,
        KnockoutIconRowComponent,
        ToggleStandListComponent,
        SpeelschemaMatchItemComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule
    ],
    exports: [CityCardHeaderComponent,
        StandCardComponent,
        LeagueTableRowComponent,
        MatchCardComponent,
        PuntenChipComponent,
        ParticipantCardComponent,
        HeadlineComponent,
        EditHeadlineComponent,
        FilterKnockoutRoundsPipe,
        FilterPouleMatchesPipe,
        FromNowPipe,
        RoundTextPipe,
        KnockoutCardTextPipe,
        ScrollVanishDirective,
        GestureDirective,
        KnockoutTeamHeaderComponent,
        KnockoutIconRowComponent,
        ToggleStandListComponent,
        SpeelschemaMatchItemComponent
    ]
})
export class CustomComponentsModule {
}
