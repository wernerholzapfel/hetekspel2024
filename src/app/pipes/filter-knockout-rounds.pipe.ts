import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterKnockoutRounds',
    standalone: false
})
export class FilterKnockoutRoundsPipe implements PipeTransform {

    transform(items: any[], args: number): any[] {
        if (!items || !args) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.round === args.toString()); // gek misschien nog omzetten
    }
}


