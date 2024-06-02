import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterPoulePosition'
})
export class FilterPoulePositionPipe implements PipeTransform {

    transform(items: any[], args: number): unknown {
        console.log(items)
        console.log(args)
        if (!items || !args) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.positie === args);
    }
}


