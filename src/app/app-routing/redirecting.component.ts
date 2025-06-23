// dummy.component.ts
import { Component } from "@angular/core";

@Component({
  selector: "app-redirecting",
  template: `
    <div class="redirecting-wrapper">
      <div class="redirecting-logo"></div>
      <div class="spinner"></div>
      <p>Redirecting, please wait...</p>
    </div>
  `,
  styles: [
    `
      .redirecting-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        font-family: Arial, sans-serif;
        color: #444;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3f51b5;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class RedirectingComponent {}
