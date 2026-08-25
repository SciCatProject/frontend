// src/app/shared/services/clipboard.service.ts
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

@Injectable({
  providedIn: "root",
})
export class ClipboardService {
  constructor(private store: Store) {}

  /**
   * Copies text to clipboard and displays a success/error message
   * @param text - The text to copy
   * @param successMessage - Custom success message (optional)
   * @param duration - How long to show the message (default: 5000ms)
   */
  copyToClipboard(
    text: string,
    successMessage = "Copied to clipboard",
    duration = 5000,
  ): void {
    navigator.clipboard.writeText(text).then(
      () => {
        const message = new Message(
          successMessage,
          MessageType.Success,
          duration,
        );
        this.store.dispatch(showMessageAction({ message }));
      },
      (err) => {
        const errorMessage = new Message(
          "Failed to copy to clipboard",
          MessageType.Error,
          duration,
        );
        this.store.dispatch(showMessageAction({ message: errorMessage }));
        console.error("Could not copy text: ", err);
      },
    );
  }
}
