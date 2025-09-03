/**
 * Runaway instrumentation hooks for the Electron app.
 */
const { app, protocol, BrowserWindow } = require('electron');

const { logger } = require('./runaway-electron/logger');

// ==========================================
// Hooks on electron.app
// - app.setAsDefaultProtocolClient
// - app.on
// ==========================================

// Hook app.setAsDefaultProtocolClient
const _setAsDefaultProtocolClient = app.setAsDefaultProtocolClient;
app.setAsDefaultProtocolClient = (...args) => {
  logger.info(`[app.setAsDefaultProtocolClient] Setting default protocol client: ${args.join(', ')}`);
  return _setAsDefaultProtocolClient.apply(app, args);
};

// Hook app.on to intercept 'open-url' events
const _appOn = app.on.bind(app);
app.on = (event: any, listener: any) => {
  if (event === 'open-url') {
    logger.info('[app.on] Registering \'open-url\' event handler');
    return _appOn(event, (evt: any, url: string) => {
      logger.info(`[app.on('open-url')] Received URL: ${url}`);
      return listener(evt, url);
    });
  }
  return _appOn(event, listener);
};

// ==========================================
// Hooks on electron.protocol
// - protocol.registerSchemesAsPrivileged
// - protocol.handle
// - protocol.registerFileProtocol
// - protocol.registerStringProtocol
// - protocol.registerBufferProtocol
// - protocol.registerHttpProtocol
// ==========================================

// Hook protocol.registerSchemesAsPrivileged
const _registerSchemesAsPrivileged = protocol.registerSchemesAsPrivileged.bind(protocol);
protocol.registerSchemesAsPrivileged = (customSchemes: any) => {
  const schemes = customSchemes.map((scheme: any) => scheme.scheme).join(', ');
  logger.info(`[protocol.registerSchemesAsPrivileged] Registering privileged schemes: ${schemes}`);
  return _registerSchemesAsPrivileged(customSchemes);
};

// Hook protocol.handle
const _protocolHandle = protocol.handle.bind(protocol);
protocol.handle = (scheme: string, handler: any) => {
  logger.info(`[protocol.handle] Registering handler for scheme: ${scheme}`);
  return _protocolHandle(scheme, (request: any) => {
    logger.info(`[protocol.handle('${scheme}')] Handling request: ${request.url}`);
    return handler(request);
  });
};

// Hook protocol.registerFileProtocol
const _registerFileProtocol = protocol.registerFileProtocol.bind(protocol);
protocol.registerFileProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.registerFileProtocol] Registering file protocol for scheme: ${scheme}`);
  return _registerFileProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.registerFileProtocol('${scheme}')] Handling request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.registerStringProtocol
const _registerStringProtocol = protocol.registerStringProtocol.bind(protocol);
protocol.registerStringProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.registerStringProtocol] Registering string protocol for scheme: ${scheme}`);
  return _registerStringProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.registerStringProtocol('${scheme}')] Handling request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.registerBufferProtocol
const _registerBufferProtocol = protocol.registerBufferProtocol.bind(protocol);
protocol.registerBufferProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.registerBufferProtocol] Registering buffer protocol for scheme: ${scheme}`);
  return _registerBufferProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.registerBufferProtocol('${scheme}')] Handling request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.registerHttpProtocol
const _registerHttpProtocol = protocol.registerHttpProtocol.bind(protocol);
protocol.registerHttpProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.registerHttpProtocol] Registering HTTP protocol for scheme: ${scheme}`);
  return _registerHttpProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.registerHttpProtocol('${scheme}')] Handling request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.registerStreamProtocol
const _registerStreamProtocol = protocol.registerStreamProtocol.bind(protocol);
protocol.registerStreamProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.registerStreamProtocol] Registering stream protocol for scheme: ${scheme}`);
  return _registerStreamProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.registerStreamProtocol('${scheme}')] Handling request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.interceptFileProtocol
const _interceptFileProtocol = protocol.interceptFileProtocol.bind(protocol);
protocol.interceptFileProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.interceptFileProtocol] Intercepting file protocol for scheme: ${scheme}`);
  return _interceptFileProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.interceptFileProtocol('${scheme}')] Intercepting request: ${request.url}`);
    return handler(request, callback);
  });
};

// Hook protocol.interceptHttpProtocol
const _interceptHttpProtocol = protocol.interceptHttpProtocol.bind(protocol);
protocol.interceptHttpProtocol = (scheme: string, handler: any) => {
  logger.info(`[protocol.interceptHttpProtocol] Intercepting HTTP protocol for scheme: ${scheme}`);
  return _interceptHttpProtocol(scheme, (request: any, callback: any) => {
    logger.info(`[protocol.interceptHttpProtocol('${scheme}')] Intercepting request: ${request.url}`);
    return handler(request, callback);
  });
};

// ==========================================
// Hooks on electron.BrowserWindow
// - BrowserWindow constructor
// - BrowserWindow.loadURL
// - BrowserWindow.loadFile
// ==========================================

// Store the original BrowserWindow constructor
const _BrowserWindow = BrowserWindow;

// Hook BrowserWindow constructor
function BrowserWindowProxy (...args: any[]) {
  logger.info(`[BrowserWindow] Creating new BrowserWindow with options: ${JSON.stringify(args[0] || {})}`);

  // Create the actual BrowserWindow instance
  const window = new _BrowserWindow(...args);

  // Hook loadURL method for this instance
  const _loadURL = window.loadURL.bind(window);
  window.loadURL = (...args: any[]) => {
    logger.info(`[BrowserWindow.loadURL] Loading URL: ${args[0]}`);
    if (args[1]) {
      logger.info(`[BrowserWindow.loadURL] Load options: ${JSON.stringify(args[1])}`);
    }
    return (_loadURL as any)(...args);
  };

  // Hook loadFile method for this instance
  const _loadFile = window.loadFile.bind(window);
  window.loadFile = (...args: any[]) => {
    logger.info(`[BrowserWindow.loadFile] Loading file: ${args[0]}`);
    if (args[1]) {
      logger.info(`[BrowserWindow.loadFile] Load options: ${JSON.stringify(args[1])}`);
    }
    return (_loadFile as any)(...args);
  };

  return window;
}

// Copy static methods and properties from original BrowserWindow
Object.setPrototypeOf(BrowserWindowProxy, _BrowserWindow);
Object.setPrototypeOf(BrowserWindowProxy.prototype, _BrowserWindow.prototype);

// Copy static methods, getters, setters, and properties
const staticDescriptors = Object.getOwnPropertyDescriptors(_BrowserWindow);
for (const [key, descriptor] of Object.entries(staticDescriptors)) {
  if (key !== 'length' && key !== 'name' && key !== 'prototype' && key !== 'constructor') {
    try {
      Object.defineProperty(BrowserWindowProxy, key, descriptor);
    } catch {
      // Fallback for non-configurable properties
      try {
        (BrowserWindowProxy as any)[key] = (_BrowserWindow as any)[key];
      } catch (fallbackError) {
        // Some properties might be truly non-writable, skip them
        logger.debug(`[BrowserWindow] Could not copy property ${key}: ${fallbackError}`);
      }
    }
  }
}

// Ensure the proxy has the same name and toString behavior
Object.defineProperty(BrowserWindowProxy, 'name', {
  value: 'BrowserWindow',
  configurable: true
});

BrowserWindowProxy.toString = function () {
  return _BrowserWindow.toString();
};

// Replace the original BrowserWindow in the electron module
Object.defineProperty(require('electron'), 'BrowserWindow', {
  value: BrowserWindowProxy,
  writable: true,
  enumerable: true,
  configurable: true
});
