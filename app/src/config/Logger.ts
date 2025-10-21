import { createLogger, format, transports } from "winston";

class Logger {
  private static instance: Logger;
  private readonly logger: any;

  private constructor() {
    const { combine, printf } = format;
    const formatRecord = printf(({ level, message }) => {
      return `${level}: ${message}`;
    });
    this.logger = createLogger({
      format: combine(formatRecord),
      transports: [new transports.Console()],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}

const logger = Logger.getInstance();
export default logger;
