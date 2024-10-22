/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from "@angular/core";
export interface CookieInterface {
  [key: string]: any;
}

@Injectable()
export class CookieBrowser {
  private cookies: CookieInterface = {};

  private parse(value: any) {
    try {
      return JSON.parse(decodeURI(value));
    } catch (e) {
      return value;
    }
  }

  get(key: string): any {
    if (!this.cookies[key]) {
      const cookie = window.document.cookie
        .split("; ")
        .filter((item: any) => item.split("=")[0] === key)
        .pop();
      if (!cookie) {
        return null;
      }

      this.cookies[key] = this.parse(cookie.split("=").slice(1).join("="));
    }

    return this.cookies[key];
  }

  set(key: string, value: any, expires?: Date): void {
    this.cookies[key] = value;
    const cookie = `${key}=${encodeURI(value)}; path=/${
      expires ? `; expires=${expires.toUTCString()}` : ""
    }`;
    window.document.cookie = cookie;
  }

  remove(key: string) {
    document.cookie = key + "=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    delete this.cookies[key];
  }
}
