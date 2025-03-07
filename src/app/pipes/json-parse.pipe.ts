import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'jsonParse',
  standalone: false
})
export class JsonParsePipe implements PipeTransform {

  transform(value: string): any {
    try {
      return JSON.parse(value);
    } catch (error) {
      return [];
    }
  }
}
