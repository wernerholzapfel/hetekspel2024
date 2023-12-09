import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
    name: 'fromNow'
})
export class FromNowPipe implements PipeTransform {

    constructor() {
        moment.locale('nl');
    }

    transform(value: unknown, ...args: unknown[]): unknown {
        return moment(value).fromNow();
    }

}
