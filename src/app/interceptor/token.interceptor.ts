import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {from as fromPromise, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {switchMap, take} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('httpinterceptor')
        // todo asks codereview
        return this.authService.isLoggedIn()
            .pipe(take(1))
            .pipe(switchMap((value) => {
                if (value) {
                    return fromPromise(this.authService.getToken().pipe(take(1)))
                        .pipe(switchMap(token => {
                            request = request.clone({
                                setHeaders: {
                                    'Content-Type': 'application/json',
                                    'Cache-Control': 'no-cache',
                                    Pragma: 'no-cache',
                                    Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
                                    Authorization: `Bearer ${token}`,
                                }
                            });
                            return next.handle(request);
                        }));
                } else {
                    request = request.clone({
                        setHeaders: {
                            'Cache-Control': 'no-cache',
                            Pragma: 'no-cache',
                            Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        }
                    });
                    return next.handle(request);
                }
            }));
    }
}
