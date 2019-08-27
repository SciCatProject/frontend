import { logbooksReducer, formatImageUrls } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as logbooksActions from "../actions/logbooks.actions";
import { LogbookFilters, Logbook } from "../models";
import { APP_DI_CONFIG } from "app-config.module";

describe("LogbooksReducer", () => {
  describe("default", () => {
    it("should return the initial state", () => {
      let filter: LogbookFilters = {
        textSearch: "",
        showBotMessages: true,
        showImages: true,
        showUserMessages: true
      };
      const noopAction = new logbooksActions.UpdateFilterAction(filter);
      const state = logbooksReducer(undefined, noopAction);

      expect(state).toEqual(initialLogbookState);
    });
  });

  describe("FETCH_LOGBOOKS_COMPLETE", () => {
    it("should set logbooks", () => {
      const logbooks = [new Logbook()];
      logbooks.forEach(logbook => {
        logbook.messages = [];
      });
      const action = new logbooksActions.FetchLogbooksCompleteAction(logbooks);
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual(logbooks);
    });
  });

  describe("FETCH_LOGBOOK_COMPLETE", () => {
    it("should set logbook", () => {
      const logbook = new Logbook();
      const action = new logbooksActions.FetchLogbookCompleteAction(logbook);
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbook).toEqual(logbook);
    });
  });

  describe("FETCH_FILTERED_ENTRIES_COMPLETE", () => {
    it("should set logbook", () => {
      const logbook = new Logbook();
      const action = new logbooksActions.FetchFilteredEntriesCompleteAction(
        logbook
      );
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbook).toEqual(logbook);
    });
  });

  describe("UPDATE_FILTER_COMPLETE", () => {
    it("should update the logbook filter", () => {
      const filter: LogbookFilters = {
        textSearch: "",
        showBotMessages: true,
        showUserMessages: true,
        showImages: true
      };
      const action = new logbooksActions.UpdateFilterAction(filter);
      const state = logbooksReducer(initialLogbookState, action);
      expect(state.filters).toEqual(filter);
    });
  });

  describe("#formatImageUrls", () => {
    it("should reformat 'mxc://' urls to 'http(s)://' urls", () => {
      const logbook = new Logbook();
      const message = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.image",
          url: "mxc://"
        }
      };
      logbook.messages = [message];
      formatImageUrls(logbook);

      logbook.messages.forEach(message => {
        expect(message.content.url).toEqual(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
        expect(message.content.info.thumbnail_url).toEqual(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
      });
    });

    it("should do nothing if logbook is undefined", () => {
      const logbook = undefined;
      formatImageUrls(logbook);

      expect(logbook).toBe(undefined);
    });

    it("should do nothing if there are no messages", () => {
      const logbook = new Logbook();
      formatImageUrls(logbook);

      expect(logbook.messages).toBe(undefined);
    });

    it("should do nothing if msgtype is not 'm.image'", () => {
      const logbook = new Logbook();
      const message = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.text",
          url: "mxc://"
        }
      };
      logbook.messages = [message];
      formatImageUrls(logbook);

      logbook.messages.forEach(message => {
        expect(message.content.url).toEqual("mxc://");
        expect(message.content.info.thumbnail_url).toEqual("mxc://");
      });
    });

    it("should only format 'url' if there is no 'thumbnail_url' property", () => {
      const logbook = new Logbook();
      const message = {
        content: {
          info: {},
          msgtype: "m.image",
          url: "mxc://"
        }
      };
      logbook.messages = [message];
      formatImageUrls(logbook);

      logbook.messages.forEach(message => {
        expect(message.content.url).toEqual(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
        expect(message.content.info.thumbnail_url).toBe(undefined);
      });
    });

    it("should only format 'thumbnail_url' if there is no 'url' property", () => {
      const logbook = new Logbook();
      const message = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.image"
        }
      };
      logbook.messages = [message];
      formatImageUrls(logbook);

      logbook.messages.forEach(message => {
        expect(message.content.url).toEqual(undefined);
        expect(message.content.info.thumbnail_url).toBe(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
      });
    });

    it("should do nothing if there are no properties 'thumbnail_url' and 'url'", () => {
      const logbook = new Logbook();
      const message = {
        content: {
          info: {},
          msgtype: "m.image"
        }
      };
      logbook.messages = [message];
      formatImageUrls(logbook);

      logbook.messages.forEach(message => {
        expect(message.content.url).toEqual(undefined);
        expect(message.content.info.thumbnail_url).toBe(undefined);
      });
    });
  });
});
