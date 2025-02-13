import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Pipe({ name: "link" })
export class ToLinkPipe implements PipeTransform {
  constructor(private sanitize: DomSanitizer) {}

  transform(value: any, type?: string): any {
    return this.textToLinks(value);
  }

  textToLinks(value: string): SafeHtml {
    const linkRegex = /https?:\/\/\S+/gm;
    return this.sanitize.bypassSecurityTrustHtml(
      value.replace(
        linkRegex,
        (m, $1) => `<a target="_blank" href="${m}">${m}</a>`,
      ),
    );
  }
}
