import { CanDeactivateFn } from "@angular/router";
import { Observable } from "rxjs";

export interface EditableComponent {
  hasUnsavedChanges: () => boolean | Observable<boolean>;
}

export const leavingPageGuard: CanDeactivateFn<EditableComponent> = (
  component,
) => {
  const hasUnsavedChanges = component.hasUnsavedChanges();

  if (typeof hasUnsavedChanges === "boolean") {
    return hasUnsavedChanges
      ? confirm(
          "You have unsaved changes. Press Cancel to go back and save these changes, or OK to leave without saving.",
        )
      : true;
  }

  if (hasUnsavedChanges instanceof Observable) {
    return new Observable<boolean>((subscriber) => {
      hasUnsavedChanges.subscribe((unsaved) => {
        subscriber.next(
          !unsaved ||
            confirm(
              "You have unsaved changes. Press Cancel to go back and save these changes, or OK to leave without saving.",
            ),
        );
        subscriber.complete();
      });
    });
  }

  return true;
};
