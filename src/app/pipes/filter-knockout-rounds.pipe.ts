import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterKnockoutRounds'
})
export class FilterKnockoutRoundsPipe implements PipeTransform {

    transform(items: any[], args: string): unknown {
        if (!items || !args) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.round === args);
    }
}


