import { createAction } from "@ngrx/store";

export const actionSuccessAction = createAction(
  "[UI] Action Success",
  (message?: string, link?: Record<string, string>) => ({ message, link }),
);

export const actionFailureAction = createAction(
  "[Actions] Action Failure",
  (message?: string) => ({ message }),
);
