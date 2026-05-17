import { EventEmitter } from "events";

class AppEventEmitter extends EventEmitter {}

export const appEvents = new AppEventEmitter();

export const EVENTS = {
  REPORT: {
    CREATED: "report:created",
    STATUS_UPDATED: "report:status_updated",
    COMMENT_ADDED: "report:comment_added",
  },
  USER: {
    REGISTERED: "user:registered",
    LOGGED_IN: "user:logged_in",
  },
  NOTIFICATION: {
    SENT: "notification:sent",
  }
};
