import { logbooksReducer, formatImageUrls } from "./logbooks.reducer";
import { initialLogbookState } from "../state/logbooks.store";
import * as fromActions from "../actions/logbooks.actions";
import { Logbook, LogbookFilters } from "../models";
import { APP_DI_CONFIG } from "app-config.module";

describe("LogbooksReducer", () => {
  describe("on fetchLogbooksComplete", () => {
    it("should set logbooks", () => {
      const firstTestMessage = { content: "First message" };
      const secondTestMessage = { content: "Second message" };
      const logbooks = [
        new Logbook({
          roomId: "testId",
          name: "testName",
          messages: [firstTestMessage, secondTestMessage],
        }),
      ];

      const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.logbooks).toEqual(logbooks);
      state.logbooks.forEach((logbook) => {
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

  describe("on fetchLogbookFailedAction", () => {
    it("should clear currentLogbook", () => {
      const action = fromActions.fetchLogbookFailedAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toBeNull();
    });
  });

  describe("on clearLogbookAction", () => {
    it("should clear currentLogbook", () => {
      const action = fromActions.clearLogbookAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.currentLogbook).toBeNull();
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.totalCount).toEqual(count);
    });
  });

  describe("on prefillFiltersAction", () => {
    it("should set filters and set hasPrefilledFilters to true", () => {
      const values: Partial<LogbookFilters> = {
        textSearch: "test",
      };
      const action = fromActions.prefillFiltersAction({ values });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.textSearch).toEqual(values.textSearch);
      expect(state.hasPrefilledFilters).toEqual(true);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set textSearch filter and set skip filter to 0", () => {
      const textSearch = "test";
      const action = fromActions.setTextFilterAction({ textSearch });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.textSearch).toEqual(textSearch);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on setDisplayFiltersAction", () => {
    it("should set showBotMessages, showImages and showUserMessages filters, and set skip filter to 0", () => {
      const showBotMessages = true;
      const showImages = true;
      const showUserMessages = false;
      const action = fromActions.setDisplayFiltersAction({
        showBotMessages,
        showImages,
        showUserMessages,
      });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.showBotMessages).toEqual(showBotMessages);
      expect(state.filters.showImages).toEqual(showImages);
      expect(state.filters.showUserMessages).toEqual(showUserMessages);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.skip).toEqual(skip);
      expect(state.filters.limit).toEqual(limit);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField filter and set skip filter to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + ":" + direction;
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = logbooksReducer(initialLogbookState, action);

      expect(state.filters.sortField).toEqual(sortField);
      expect(state.filters.skip).toEqual(0);
    });
  });

  describe("#formatImageUrls", () => {
    it("should reformat 'mxc://' urls to 'http(s)://' urls", () => {
      const logbook = new Logbook();
      const inputMessage = {
        content: {
          info: {
            thumbnail_url: "mxc://",
          },
          msgtype: "m.image",
          url: "mxc://",
        },
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach((message) => {
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
            thumbnail_url: "mxc://",
          },
          msgtype: "m.text",
          url: "mxc://",
        },
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach((message) => {
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
          url: "mxc://",
        },
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach((message) => {
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
            thumbnail_url: "mxc://",
          },
          msgtype: "m.image",
        },
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach((message) => {
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
          msgtype: "m.image",
        },
      };
      logbook.messages = [inputMessage];
      const formattedLogbook = formatImageUrls(logbook);

      formattedLogbook.messages.forEach((message) => {
        expect(message.content.url).toEqual(undefined);
        expect(message.content.info.thumbnail_url).toBe(undefined);
      });
    });
  });

  describe("on clearLogbooksStateAction", () => {
    it("should set logbook state to initialLogbookState", () => {
      const action = fromActions.clearLogbooksStateAction();
      const state = logbooksReducer(initialLogbookState, action);

      expect(state).toEqual(initialLogbookState);
    });
  });
});
