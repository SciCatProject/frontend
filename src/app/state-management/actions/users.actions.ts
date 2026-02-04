import { createAction, props } from "@ngrx/store";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";

export const loadUsers = createAction("[Users] Load Users");

export const loadUsersSuccess = createAction(
  "[Users] Load Users Success",
  props<{ users: ReturnedUserDto[] }>(),
);

export const loadUsersFailure = createAction(
  "[Users] Load Users Failure",
  props<{ error: any }>(),
);
