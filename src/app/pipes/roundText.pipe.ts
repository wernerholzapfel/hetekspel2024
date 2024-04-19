import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'roundText'
})
export class RoundTextPipe implements PipeTransform {

    constructor() {
    }

    transform(value: unknown, isSpeelschema?: boolean): unknown {
        switch (value) {
            case '16':
                return 'Achtste finale';
            case '8':
                return 'Kwartfinale';
            case '4':
                return 'Halve Finale';
            case '3':
                return isSpeelschema ? 'Troostfinale' : 'Winnaar troostfinale'
            case '2':
                return 'Finale';
            default:
                return 'Europees kampioen';
        }
    }

}
