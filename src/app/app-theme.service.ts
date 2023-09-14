import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { timeout } from "rxjs/operators";
import { light, Theme } from "theme";

@Injectable()
export class AppThemeService {
  private activeTheme: Theme = light;

  constructor(private http: HttpClient) {}

  async loadTheme(): Promise<void> {
    try {
      this.activeTheme = (await this.http
        .get("/api/v3/admin/theme")
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
        this.activeTheme.properties[property],
      );
    });
  }
}
