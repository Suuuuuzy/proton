/**
 * Runaway Electron Logger
 */
import * as log4js from 'log4js';

import * as fs from 'fs';
import * as path from 'path';

let loggerInstance: log4js.Logger | undefined;
let isSetup = false;

function getLogDir (appName?: string): string {
  const args = process.argv;
  const logDirIndex = args.findIndex(arg => arg === '--log-dir');

  if (logDirIndex !== -1 && logDirIndex + 1 < args.length) {
    return args[logDirIndex + 1];
  }

  const finalAppName = appName || 'unknown-app';
  return path.join('/tmp', finalAppName);
}

function setupLogger (appName?: string) {
  if (isSetup && loggerInstance) {
    return loggerInstance; // Return existing logger if already setup
  }

  const logDir = getLogDir(appName);

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  log4js.configure({
    appenders: {
      console: {
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '[%d{ISO8601}] [%p] [RUNAWAY:MAIN] - %m'
        }
      },
      file: {
        type: 'file',
        filename: path.join(logDir, 'main_process.log'),
        maxLogSize: 10485760, // 10MB
        backups: 5,
        compress: true,
        layout: {
          type: 'pattern',
          pattern: '[%d{ISO8601}] [%p] [RUNAWAY:MAIN] - %m'
        }
      }
    },
    categories: {
      default: { appenders: ['console', 'file'], level: 'info' }
    }
  });

  loggerInstance = log4js.getLogger('runaway');
  isSetup = true;

  loggerInstance.info('Logger initialized');
  loggerInstance.info(`Log directory: ${logDir}`);

  return loggerInstance;
}

function getLogger (): log4js.Logger {
  if (!loggerInstance) {
    return setupLogger();
  }
  return loggerInstance;
}

export { setupLogger, getLogDir, getLogger };

export const logger = {
  info: (msg: string) => getLogger().info(msg),
  warn: (msg: string) => getLogger().warn(msg),
  error: (msg: string) => getLogger().error(msg),
  debug: (msg: string) => getLogger().debug(msg)
};
