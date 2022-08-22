import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  public get(name: string) {
    const matches = this.document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  public set(name: string, value: any, options: any = {}) {
    // const date = new Date();
    // date.setMinutes(date.getMinutes() + 60);
    options = {
      path: '/',
      // expires: date,
      ...options
    };

    if (options.expires) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (const optionKey in options) {
      updatedCookie += '; ' + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }

    this.document.cookie = updatedCookie;
  }

  public delete(name: string) {
    this.set(name, '', {
      'max-age': -1
    });
  }
  constructor(@Inject( DOCUMENT ) private document: any) { }
}
