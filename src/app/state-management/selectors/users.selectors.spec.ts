import * as fromUserSelectors from "./users.selectors";

import { UserState } from "../state/user.store";

const initialUserState: UserState = {
  currentUser: null,
  currentUserGroups: [],
  email: undefined,
  isLoggingIn: false,
  message: { content: undefined, type: undefined, duration: undefined },
  settings: {
    tapeCopies: "one",
    datasetCount: 30,
    jobCount: 30,
    darkTheme: false
  }, // TODO sync with server settings?
  isLoggedIn: false,
  columns: ["datasetName"]
};

describe("test User Selectors", () => {
  it("should get IsLoggingIn", () => {
    expect(
      fromUserSelectors.getIsLoggingIn.projector(initialUserState)
    ).toEqual(false);
  });
});
