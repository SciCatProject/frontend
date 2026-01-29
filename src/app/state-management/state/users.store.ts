import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";

export interface UsersState {
  users: ReturnedUserDto[];
  loading: boolean;
  error: any;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  error: null,
};
