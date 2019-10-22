import { logbooksReducer, formatImageUrls } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as fromActions from "../actions/logbooks.actions";
import { LogbookFilters, Logbook } from "../models";
import { APP_DI_CONFIG } from "app-config.module";

describe("LogbooksReducer", () => {
  describe("on fetchLogbooksComplete", () => {
    it("should set logbooks", () => {
      const logbooks = [new Logbook()];
      const firstTestMessage = { content: "First message" };
      const secondTestMessage = { content: "Second message" };
      logbooks.forEach(logbook => {
        logbook.messages = [firstTestMessage, secondTestMessage];
      });
      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual(logbooks);
      state.logbooks.forEach(logbook => {
        expect(logbook.messages[0]).toEqual(secondTestMessage);
        expect(logbook.messages[1]).toEqual(firstTestMessage);
      });
    });

    it("should set logbooks even if the logbooks array is empty", () => {
      const logbooks = [];
      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual([]);
    });
  });

  describe("on fetchLogbookCompleteAction", () => {
    it("should set currentLogbook", () => {
      const logbook = new Logbook();
      const action = fromActions.fetchLogbookCompleteAction({ logbook });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toEqual(logbook);
    });
  });

  describe("on fetchFilteredEntriesCompleteAction", () => {
    it("should set currentLogbook", () => {
      const logbook = new Logbook();
      const action = fromActions.fetchFilteredEntriesCompleteAction({
        logbook
      });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toEqual(logbook);
    });
  });

  describe("on setFilterAction", () => {
    it("should update the logbook filter", () => {
      const filters: LogbookFilters = {
        textSearch: "",
        showBotMessages: true,
        showUserMessages: true,
        showImages: true
      };

      const action = fromActions.setFilterAction({ filters });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters).toEqual(filters);
    });
  });

  describe("#formatImageUrls", () => {
    it("should reformat 'mxc://' urls to 'http(s)://' urls", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.image",
          url: "mxc://"
        }
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach(message => {
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
      const formattedLogbook = formatImageUrls(logbook);

      expect(formattedLogbook).toBe(undefined);
    });

    it("should do nothing if there are no messages", () => {
      const logbook = new Logbook();
      const formattedLogbook = formatImageUrls(logbook);

      expect(formattedLogbook.messages).toBe(undefined);
    });

    it("should do nothing if msgtype is not 'm.image'", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.text",
          url: "mxc://"
        }
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach(message => {
        expect(message.content.url).toEqual("mxc://");
        expect(message.content.info.thumbnail_url).toEqual("mxc://");
      });
    });

    it("should only format 'url' if there is no 'thumbnail_url' property", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {},
          msgtype: "m.image",
          url: "mxc://"
        }
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach(message => {
        expect(message.content.url).toEqual(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
        expect(message.content.info.thumbnail_url).toBe(undefined);
      });
    });

    it("should only format 'thumbnail_url' if there is no 'url' property", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {
            thumbnail_url: "mxc://"
          },
          msgtype: "m.image"
        }
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach(message => {
        expect(message.content.url).toEqual(undefined);
        expect(message.content.info.thumbnail_url).toBe(
          APP_DI_CONFIG.synapseBaseUrl + "/_matrix/media/r0/download/"
        );
      });
    });

    it("should do nothing if there are no properties 'thumbnail_url' and 'url'", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {},
          msgtype: "m.image"
        }
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach(message => {
        expect(message.content.url).toEqual(undefined);
        expect(message.content.info.thumbnail_url).toBe(undefined);
      });
    });
  });
});
