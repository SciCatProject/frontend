import * as fromActions from "./actions.actions";

describe("Actions Actions", () => {
  describe("actionSuccessAction", () => {
    it("should create action without message", () => {
      const action = fromActions.actionSuccessAction();

      expect({ ...action }).toEqual({
        type: "[UI] Action Success",
        message: undefined,
        link: undefined,
      });
    });

    it("should create action with message", () => {
      const message = "Everything worked";
      const action = fromActions.actionSuccessAction(message);

      expect({ ...action }).toEqual({
        type: "[UI] Action Success",
        message,
        link: undefined,
      });
    });

    it("should create action with message and link", () => {
      const message = "Job submitted";
      const link = { label: "View", route: "/user/jobs" };
      const action = fromActions.actionSuccessAction(message, link);

      expect({ ...action }).toEqual({
        type: "[UI] Action Success",
        message,
        link,
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
