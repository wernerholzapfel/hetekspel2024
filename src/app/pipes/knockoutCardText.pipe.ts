import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'knockoutCardText'
})
export class KnockoutCardTextPipe implements PipeTransform {

    constructor() {
    }

    transform(value: unknown, ...args: unknown[]): unknown {
        switch (value) {
            case '16':
                return 'Is door naar de achtste finales';
            case '8':
                return 'Is door naar de kwartfinales';
            case '4':
                return 'Is door naar de halve finales';
            case '3':
                return 'Is derde geworden'
            case '2':
                return 'Is door naar de finale';
            default:
                return 'Is Wereldkampioen';
        }
    }

}
