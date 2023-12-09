
import {

    HttpEvent,

    HttpInterceptor,

    HttpHandler,

    HttpRequest,

    HttpResponse,

    HttpErrorResponse

} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';

import { retry, catchError } from 'rxjs/operators';
import { UiService } from '../services/ui.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private uiService: UiService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)

            .pipe(

                retry(1),

                catchError((error: HttpErrorResponse) => {

                    let errorMessage = '';

                    if (error.error instanceof ErrorEvent) {

                        // client-side error

                        errorMessage = `Error: ${error.error.message}`;

                    } else {

                        switch (error.status) {
                            case 0:
                                errorMessage = 'We konden geen verbinding maken met de API. Mogelijk is deze down. Probeer het later nog eens'
                                break;
                            case 404:
                                errorMessage = 'Er is een niet bestaand endpoint aangeroepen. Neem contact op met Werner.'
                                break;
                            case 403:
                                errorMessage = 'Je bent niet geautoriseerd om deze actie uit te voeren, log opnieuw in of neem contact op met Werner'
                                break;
                            case 500:
                                errorMessage = 'Er heeft zich een onbekende fout opgedaan. Neem contact op met Werner'
                                break;
                            default:
                                errorMessage = `Error Code: ${error.status} \nMessage: ${error.message}`;
                        }
                    }

                    this.uiService.presentToast(errorMessage, 'warning');

                    return throwError(`Error Code: ${error.status} \nMessage: ${error.message}`);

                })

            )

    }

}
