import { Pipe, PipeTransform } from '@angular/core';
import * as Dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  constructor(){
    Dayjs.extend(relativeTime);
  }

  transform(value: string, ...args: unknown[]): string {

    return Dayjs(value).fromNow();
  }

}
