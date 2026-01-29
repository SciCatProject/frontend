import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { timeout } from "rxjs/operators";
import { light, Theme } from "theme";

@Injectable()
export class AppThemeService {
  private activeTheme: Theme = light;

  constructor(private http: HttpClient) {}

  async loadTheme(): Promise<void> {
    try {
      this.activeTheme = await firstValueFrom(
        this.http.get<Theme>("/api/v3/admin/theme").pipe(timeout(2000)),
      );
    } catch (err) {
      this.activeTheme = await firstValueFrom(
        this.http.get<Theme>("/assets/theme.json").pipe(timeout(2000)),
      );
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
