import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundText',
    standalone: false
})
export class RoundTextPipe implements PipeTransform {

    constructor() {
    }

    transform(value: unknown, isSpeelschema?: boolean): unknown {
        switch (value) {
            case '32':
            case 32:
                return 'Zestiende finale';
            case '16':
            case 16:
                return 'Achtste finale';
            case '8':
            case 8:
                return 'Kwartfinale';
            case '4':
            case 4:
                return 'Halve Finale';
            case '3':
            case 3:
                return 'Troostfinale';
            case '2':
            case 2:
                return 'Finale';
            case '1,5':
            case 1.5:
                return 'Winnaar troostfinale';
            default:
                return 'Wereldkampioen';
        }
    }

}
