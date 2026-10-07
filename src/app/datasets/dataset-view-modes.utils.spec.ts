import {
  buildViewModeQuery,
  checkboxAppliesTo,
  resolveUserPlaceholders,
} from "./dataset-view-modes.utils";
import { DatasetViewMode } from "state-management/models";

describe("dataset view modes utils", () => {
  const user = {
    email: "alice@psi.ch",
    username: "alice",
    accessGroups: ["p1234", "admin"],
  };

  describe("resolveUserPlaceholders", () => {
    it("should replace #user.<path> with the user's profile fields", () => {
      expect(
        resolveUserPlaceholders(
          {
            contactEmail: "#user.email",
            createdBy: "#user.username",
            ownerGroup: { $in: "#user.accessGroups" },
          },
          user,
        ),
      ).toEqual({
        contactEmail: "alice@psi.ch",
        createdBy: "alice",
        ownerGroup: { $in: ["p1234", "admin"] },
      });
    });

    it("should only replace whole string values, never keys or substrings", () => {
      expect(
        resolveUserPlaceholders(
          {
            "#user.email": 1,
            description: "mail #user.email",
          },
          user,
        ),
      ).toEqual({ "#user.email": 1, description: "mail #user.email" });
    });

    it("should leave values with more than a placeholder as they are", () => {
      expect(
        resolveUserPlaceholders(
          {
            a: "#user.email extra",
            b: "#user.email,#user.username",
            c: "#user.accessGroups[0]",
          },
          user,
        ),
      ).toEqual({
        a: "#user.email extra",
        b: "#user.email,#user.username",
        c: "p1234",
      });
    });

    it("should use null, with a warning, without a user or for unknown fields", () => {
      const warnSpy = spyOn(console, "warn");

      expect(
        resolveUserPlaceholders(
          {
            contactEmail: "#user.email",
            ownerGroup: { $in: "#user.accessGroups" },
          },
          null,
        ),
      ).toEqual({
        contactEmail: null,
        ownerGroup: { $in: null },
      });
      expect(resolveUserPlaceholders({ a: "#user.unknown" }, user)).toEqual({
        a: null,
      });
      expect(warnSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe("buildViewModeQuery", () => {
    const viewMode: DatasetViewMode = {
      id: "archivable",
      label: "Archivable",
      where: { "datasetlifecycle.archivable": true },
      checkbox: {
        label: "Only mine",
        where: { ownerGroup: { $in: "#user.accessGroups" } },
      },
    };

    it("should combine the queries under $and when ticked", () => {
      expect(buildViewModeQuery(viewMode, true, user)).toEqual({
        $and: [
          { "datasetlifecycle.archivable": true },
          { ownerGroup: { $in: ["p1234", "admin"] } },
        ],
      });
    });

    it("should use only the view query when not ticked", () => {
      expect(buildViewModeQuery(viewMode, false, user)).toEqual({
        "datasetlifecycle.archivable": true,
      });
    });

    it("should ignore the checked state for views without a checkbox", () => {
      const plain: DatasetViewMode = {
        id: viewMode.id,
        label: viewMode.label,
        where: viewMode.where,
      };
      expect(buildViewModeQuery(plain, true, user)).toEqual({
        "datasetlifecycle.archivable": true,
      });
    });

    it("should resolve placeholders in the view query too", () => {
      expect(
        buildViewModeQuery(
          { id: "mine", label: "Mine", where: { createdBy: "#user.username" } },
          false,
          user,
        ),
      ).toEqual({ createdBy: "alice" });
    });

    it("should return an empty query without a view (implicit All)", () => {
      expect(buildViewModeQuery(undefined, true, user)).toEqual({});
    });
  });

  describe("exemptGroups", () => {
    const viewMode: DatasetViewMode = {
      id: "archivable",
      label: "Archivable",
      where: { "datasetlifecycle.archivable": true },
      checkbox: {
        label: "Only mine",
        where: { ownerGroup: { $in: "#user.accessGroups" } },
        exemptGroups: ["admin"],
      },
    };
    const normalUser = { accessGroups: ["p1234"] };

    it("should not apply the checkbox to users in an exempt group", () => {
      expect(checkboxAppliesTo(viewMode, user)).toBeFalse();
      expect(buildViewModeQuery(viewMode, true, user)).toEqual({
        "datasetlifecycle.archivable": true,
      });
    });

    it("should apply it to other users", () => {
      expect(checkboxAppliesTo(viewMode, normalUser)).toBeTrue();
      expect(buildViewModeQuery(viewMode, true, normalUser)).toEqual({
        $and: [
          { "datasetlifecycle.archivable": true },
          { ownerGroup: { $in: ["p1234"] } },
        ],
      });
    });

    it("should report no checkbox for views without one", () => {
      expect(
        checkboxAppliesTo({ id: "a", label: "A", where: {} }, normalUser),
      ).toBeFalse();
    });
  });
});
