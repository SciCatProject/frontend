import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs/operators";
import { light, Theme } from "theme";

@Injectable()
export class AppThemeService {
  private activeTheme: Theme = light;

  constructor(private http: HttpClient) {}

  async loadTheme(): Promise<void> {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      throw new Error("Environment variable API_URL not set");
    }

    try {
      this.activeTheme = (await this.http
        .get(`${apiUrl}/admin/theme`)
        .pipe(timeout(2000))
        .toPromise()) as Theme;
    } catch (err) {
      console.log("No theme available in backend, using local theme.");
      this.activeTheme = (await this.http
        .get("/assets/theme.json")
        .toPromise()) as Theme;
    }
    this.setActiveTheme();
  }

  setActiveTheme(): void {
    Object.keys(this.activeTheme.properties).forEach((property) => {
      document.documentElement.style.setProperty(
        property,
        this.activeTheme.properties[property]
      );
    });
  }
}
