import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ParticipantService } from './services/participant.service';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { LoaderInterceptor } from './interceptor/loader.interceptor';
import { HttpErrorInterceptor } from './interceptor/http-error.interceptor';
import { LoaderService } from './services/loader.service';
import { MenuService } from './services/menu.service';
import { FilterKnockoutRoundsPipe } from './pipes/filter-knockout-rounds.pipe';
import { LoaderModule } from './components/loader/loader.module';
import { UiService } from './services/ui.service';
import { CanDeactivateGuard } from './guards/candeactivate.guard';
import localeNl from '@angular/common/locales/nl';
import { registerLocaleData } from '@angular/common';
import { HeadlineService } from './services/headline.service';
import { FromNowPipe } from './pipes/fromNow.pipe';
import { DeelnemerGuard } from './guards/deelnemer.guard';
import { KnockoutHelperService } from './services/knockoutHelper.service';
import { RouteReuseStrategy } from '@angular/router';
import { FilterPoulePositionPipe } from './pipes/filter-pouleposition.pipe';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';

registerLocaleData(localeNl);


@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            animated: true,
            rippleEffect: false,
            mode: 'md'
        }),
        AppRoutingModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase, 'angular-auth-firebase'),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        LoaderModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        { provide: LOCALE_ID, useValue: 'nl-NL' },
        AuthService,
        HeadlineService,
        ParticipantService,
        LoaderService,
        MenuService,
        UiService,
        CanDeactivateGuard,
        DeelnemerGuard,
        FilterKnockoutRoundsPipe,
        FromNowPipe,
        FilterPoulePositionPipe,
        KnockoutHelperService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
