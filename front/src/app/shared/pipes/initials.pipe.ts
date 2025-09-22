import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  /**
   * Returns the initials of a name
   * @param value {string} - name
   * @returns {string} Initials of the name
   */
  transform(value: string): string {
    return value.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

}
