import * as fromActions from "./actions.actions";

describe("Actions Actions", () => {
  describe("actionSuccessAction", () => {
    it("should create action without message", () => {
      const action = fromActions.actionSuccessAction();

      expect({ ...action }).toEqual({
        type: "[UI] Action Success",
        message: undefined,
      });
    });

    it("should create action with message", () => {
      const message = "Everything worked";
      const action = fromActions.actionSuccessAction(message);

      expect({ ...action }).toEqual({
        type: "[UI] Action Success",
        message,
      });
    });
  });

  describe("actionFailureAction", () => {
    it("should create action without message", () => {
      const action = fromActions.actionFailureAction();

      expect({ ...action }).toEqual({
        type: "[Actions] Action Failure",
        message: undefined,
      });
    });

    it("should create action with message", () => {
      const message = "Request failed";
      const action = fromActions.actionFailureAction(message);

      expect({ ...action }).toEqual({
        type: "[Actions] Action Failure",
        message,
      });
    });
  });
});
