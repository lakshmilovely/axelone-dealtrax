import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchDropdown'
})
export class SearchDropdownPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    if (!filter){
      return items;
    }
    if (!Array.isArray(items)){
      return items;
    }
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
        return items.filter(item => {
          return filterKeys.some((keyName) => {
            return new RegExp(filter[keyName], 'gi').test(item.details[keyName]) || filter[keyName] == "";
          });
        });
    }
  }
}
