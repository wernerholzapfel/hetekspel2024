import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterPouleMatches',
  pure: false
  
})
export class FilterPouleMatchesPipe implements PipeTransform {

  transform(items: any[], args: string): unknown {
    if (!items || !args) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => item.match.poule === args).sort((a, b) => a.match.ordering - b.match.ordering
    );
  }

}
