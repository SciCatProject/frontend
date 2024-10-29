import { Injectable } from "@angular/core";
export interface CookieInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

@Injectable()
export class CookieBrowser {
  private cookies: CookieInterface = {};

  private parse(value: string) {
    try {
      return JSON.parse(decodeURI(value));
    } catch (e) {
      return value;
    }
  }

  get(key: string): string {
    if (!this.cookies[key]) {
      const cookie = window.document.cookie
        .split("; ")
        .filter((item) => item.split("=")[0] === key)
        .pop();
      if (!cookie) {
        return null;
      }

      this.cookies[key] = this.parse(cookie.split("=").slice(1).join("="));
    }

    return this.cookies[key];
  }

  set(key: string, value: string, expires?: Date): void {
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
