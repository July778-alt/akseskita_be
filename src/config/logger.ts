import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Custom type definitions for log levels
export type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

// ANSI escape codes for coloring
const COLORS = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  
  INFO: "\x1b[36m",  // Cyan
  WARN: "\x1b[33m",  // Yellow
  ERROR: "\x1b[31m", // Red
  DEBUG: "\x1b[35m", // Magenta
  
  TIMESTAMP: "\x1b[90m", // Gray
};

class Logger {
  private logDir: string;
  private isDevelopment: boolean;

  constructor() {
    // Resolve directories for ES Module environment
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    this.logDir = path.join(currentDir, "../../../logs");
    this.isDevelopment = process.env.NODE_ENV !== "production";

    // Ensure logs directory exists
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, colorEnabled: boolean): string {
    const timestamp = new Date().toISOString();
    
    if (colorEnabled) {
      const levelColor = COLORS[level] || COLORS.RESET;
      return `${COLORS.TIMESTAMP}[${timestamp}]${COLORS.RESET} ${levelColor}${COLORS.BRIGHT}[${level}]${COLORS.RESET} ${message}`;
    }
    
    return `[${timestamp}] [${level}] ${message}`;
  }

  private writeToFile(level: LogLevel, formattedMessage: string) {
    try {
      const logFile = path.join(this.logDir, "app.log");
      fs.appendFileSync(logFile, formattedMessage + "\n", "utf8");

      if (level === "ERROR") {
        const errorLogFile = path.join(this.logDir, "error.log");
        fs.appendFileSync(errorLogFile, formattedMessage + "\n", "utf8");
      }
    } catch (err) {
      console.error("Failed to write log to file:", err);
    }
  }

  private log(level: LogLevel, message: any, ...args: any[]) {
    // Convert object or error to string if necessary
    let stringMessage = typeof message === "string" ? message : JSON.stringify(message, null, 2);
    if (message instanceof Error) {
      stringMessage = message.stack || message.message;
    }

    if (args.length > 0) {
      stringMessage += " " + args.map(arg => 
        typeof arg === "string" ? arg : JSON.stringify(arg, null, 2)
      ).join(" ");
    }

    // Write formatted log to console
    const consoleFormatted = this.formatMessage(level, stringMessage, true);
    
    if (level === "ERROR") {
      console.error(consoleFormatted);
    } else if (level === "WARN") {
      console.warn(consoleFormatted);
    } else {
      console.log(consoleFormatted);
    }

    // Write uncolored log to file
    const fileFormatted = this.formatMessage(level, stringMessage, false);
    this.writeToFile(level, fileFormatted);
  }

  public info(message: any, ...args: any[]) {
    this.log("INFO", message, ...args);
  }

  public warn(message: any, ...args: any[]) {
    this.log("WARN", message, ...args);
  }

  public error(message: any, ...args: any[]) {
    this.log("ERROR", message, ...args);
  }

  public debug(message: any, ...args: any[]) {
    if (this.isDevelopment || process.env.DEBUG) {
      this.log("DEBUG", message, ...args);
    }
  }

  // Stream for integration with HTTP routers like Morgan
  public stream = {
    write: (message: string) => {
      // Morgan adds a newline, so trim it
      this.info(message.trim());
    }
  };
}

export const logger = new Logger();
