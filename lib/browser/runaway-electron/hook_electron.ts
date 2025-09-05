/**
 * Runaway instrumentation hooks for the Electron app.
 */
// eslint-disable-next-line no-restricted-imports
import { hookMethod, hookConstructor } from './hook_base';

const { app, protocol, BrowserWindow, shell, net, BrowserView, WebContentsView, ipcMain, MessageChannelMain } = require('electron');

const { logger } = require('./logger');

// ==========================================
// Hooks on electron.app
// - app.setAsDefaultProtocolClient
// - app.on
// ==========================================

// Hook app.setAsDefaultProtocolClient
hookMethod(app, 'setAsDefaultProtocolClient', {
  before (args) {
    logger.info(`[app.setAsDefaultProtocolClient] Setting default protocol client: ${args.join(', ')}`);
  }
});

// Hook app.on to intercept 'open-url' events
hookMethod(app, 'on', {
  replace (args, original) {
    const [event, listener] = args;
    if (event === 'open-url') {
      logger.info('[app.on] Registering \'open-url\' event handler');
      return original.call(this, event, (evt: any, url: string) => {
        logger.info(`[app.on('open-url')] Received URL: ${url}`);
        return listener(evt, url);
      });
    }
    return original.apply(this, args);
  }
});

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
hookMethod(protocol, 'registerSchemesAsPrivileged', {
  before (args) {
    const [customSchemes] = args;
    const schemes = customSchemes.map((scheme: any) => scheme.scheme).join(', ');
    logger.info(`[protocol.registerSchemesAsPrivileged] Registering privileged schemes: ${schemes}`);
  }
});

// Hook protocol.handle
hookMethod(protocol, 'handle', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.handle] Registering handler for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any) => {
      logger.info(`[protocol.handle('${scheme}')] Handling request: ${request.url}`);
      return handler(request);
    });
  }
});

// Hook protocol.registerFileProtocol
hookMethod(protocol, 'registerFileProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.registerFileProtocol] Registering file protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.registerFileProtocol('${scheme}')] Handling request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.registerStringProtocol
hookMethod(protocol, 'registerStringProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.registerStringProtocol] Registering string protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.registerStringProtocol('${scheme}')] Handling request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.registerBufferProtocol
hookMethod(protocol, 'registerBufferProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.registerBufferProtocol] Registering buffer protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.registerBufferProtocol('${scheme}')] Handling request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.registerHttpProtocol
hookMethod(protocol, 'registerHttpProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.registerHttpProtocol] Registering HTTP protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.registerHttpProtocol('${scheme}')] Handling request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.registerStreamProtocol
hookMethod(protocol, 'registerStreamProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.registerStreamProtocol] Registering stream protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.registerStreamProtocol('${scheme}')] Handling request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.interceptFileProtocol
hookMethod(protocol, 'interceptFileProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.interceptFileProtocol] Intercepting file protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.interceptFileProtocol('${scheme}')] Intercepting request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// Hook protocol.interceptHttpProtocol
hookMethod(protocol, 'interceptHttpProtocol', {
  before (args) {
    const [scheme] = args;
    logger.info(`[protocol.interceptHttpProtocol] Intercepting HTTP protocol for scheme: ${scheme}`);
  },
  replace (args, original) {
    const [scheme, handler] = args;
    return original.call(this, scheme, (request: any, callback: any) => {
      logger.info(`[protocol.interceptHttpProtocol('${scheme}')] Intercepting request: ${request.url}`);
      return handler(request, callback);
    });
  }
});

// ==========================================
// Hooks on electron.BrowserWindow
// - BrowserWindow constructor
// - BrowserWindow.loadURL
// - BrowserWindow.loadFile
// ==========================================

// Hook BrowserWindow constructor
hookConstructor(BrowserWindow, {
  before (args) {
    const [options] = args;
    logger.info(`[BrowserWindow constructor] Creating new BrowserWindow with options: ${JSON.stringify(options, null, 2)}`);
  }
});

// Hook BrowserWindow.prototype.loadURL
hookMethod(BrowserWindow.prototype, 'loadURL', {
  before (args) {
    const [url, options] = args;
    logger.info(`[BrowserWindow.loadURL] Loading URL: ${url}${options ? ` with options: ${JSON.stringify(options)}` : ''}`);
  }
});

// Hook BrowserWindow.prototype.loadFile
hookMethod(BrowserWindow.prototype, 'loadFile', {
  before (args) {
    const [filePath, options] = args;
    logger.info(`[BrowserWindow.loadFile] Loading file: ${filePath}${options ? ` with options: ${JSON.stringify(options)}` : ''}`);
  }
});

// ==========================================
// Hooks on electron.shell
// - shell.openExternal
// - shell.openPath
// ==========================================

// Hook shell.openExternal
hookMethod(shell, 'openExternal', {
  before (args) {
    const [url, options] = args;
    logger.info(`[shell.openExternal] Opening external URL: ${url}${options ? ` with options: ${JSON.stringify(options)}` : ''}`);
  }
});

// Hook shell.openPath
hookMethod(shell, 'openPath', {
  before (args) {
    const [path] = args;
    logger.info(`[shell.openPath] Opening path: ${path}`);
  }
});

// ==========================================
// Hooks on electron.net
// - net.request
// - net.fetch
// ==========================================

// Hook net.request
hookMethod(net, 'request', {
  before (args) {
    const [options] = args;
    const url = typeof options === 'string' ? options : options?.url || 'unknown';
    const method = typeof options === 'object' ? options?.method || 'GET' : 'GET';
    logger.info(`[net.request] Creating request: ${method} ${url}`);
    if (typeof options === 'object' && options !== null) {
      logger.info(`[net.request] Request options: ${JSON.stringify(options, null, 2)}`);
    }
  }
});

// Hook net.fetch
hookMethod(net, 'fetch', {
  before (args) {
    const [input, init] = args;
    const url = typeof input === 'string' ? input : input?.url || 'unknown';
    const method = init?.method || 'GET';
    logger.info(`[net.fetch] Fetching: ${method} ${url}`);
    if (init) {
      logger.info(`[net.fetch] Fetch options: ${JSON.stringify(init, null, 2)}`);
    }
  }
});

// ==========================================
// Hooks on electron.browserWindow.webContents
// - browserWindow.webContents.executeJavaScript
// - browserWindow.webContents.executeJavaScriptInIsolatedWorld
// - browserWindow.webContents.loadURL
// - browserWindow.webContents.loadFile
// - browserWindow.webContents.setWindowOpenHandler
// - browserWindow.webContents.on('will-frame-navigate')
// - browserWindow.webContents.on('will-navigate')
// - browserWindow.webContents.on('will-redirect')
// ==========================================

// Get the WebContents class using the same method as Electron's web-contents.ts
const binding = process._linkedBinding('electron_browser_web_contents');
const { WebContents } = binding as { WebContents: any };

// Only hook if WebContents class is available
if (WebContents && typeof WebContents === 'function' && WebContents.prototype) {
  // Hook WebContents.prototype.executeJavaScript
  hookMethod(WebContents.prototype, 'executeJavaScript', {
    before (args) {
      const [code, userGesture] = args;
      const truncatedCode = code.length > 100 ? code.substring(0, 100) + '...' : code;
      logger.info(`[webContents.executeJavaScript] Executing JavaScript${userGesture ? ' (user gesture)' : ''}: ${truncatedCode}`);
    }
  });

  // Hook WebContents.prototype.executeJavaScriptInIsolatedWorld
  hookMethod(WebContents.prototype, 'executeJavaScriptInIsolatedWorld', {
    before (args) {
      const [worldId, scripts, userGesture] = args;
      const scriptSummary = Array.isArray(scripts)
        ? `${scripts.length} script(s)`
        : typeof scripts === 'object'
          ? JSON.stringify(scripts).substring(0, 100) + '...'
          : String(scripts).substring(0, 100) + '...';
      logger.info(`[webContents.executeJavaScriptInIsolatedWorld] Executing in world ${worldId}${userGesture ? ' (user gesture)' : ''}: ${scriptSummary}`);
    }
  });

  // Hook WebContents.prototype.loadURL
  hookMethod(WebContents.prototype, 'loadURL', {
    before (args) {
      const [url, options] = args;
      logger.info(`[webContents.loadURL] Loading URL: ${url}${options ? ` with options: ${JSON.stringify(options)}` : ''}`);
    }
  });

  // Hook WebContents.prototype.loadFile
  hookMethod(WebContents.prototype, 'loadFile', {
    before (args) {
      const [filePath, options] = args;
      logger.info(`[webContents.loadFile] Loading file: ${filePath}${options ? ` with options: ${JSON.stringify(options)}` : ''}`);
    }
  });

  // Hook WebContents.prototype.on for navigation events
  hookMethod(WebContents.prototype, 'on', {
    replace (args, original) {
      const [event, listener] = args;

      // Hook specific navigation events
      if (event === 'will-frame-navigate') {
        logger.info('[webContents.on] Registering \'will-frame-navigate\' event handler');
        return original.call(this, event, (evt: any, url: string, isMainFrame: boolean) => {
          logger.info(`[webContents.on('will-frame-navigate')] Frame navigation to: ${url} (main frame: ${isMainFrame})`);
          return listener(evt, url, isMainFrame);
        });
      } else if (event === 'will-navigate') {
        logger.info('[webContents.on] Registering \'will-navigate\' event handler');
        return original.call(this, event, (evt: any, url: string) => {
          logger.info(`[webContents.on('will-navigate')] Navigation to: ${url}`);
          return listener(evt, url);
        });
      } else if (event === 'will-redirect') {
        logger.info('[webContents.on] Registering \'will-redirect\' event handler');
        return original.call(this, event, (evt: any, url: string) => {
          logger.info(`[webContents.on('will-redirect')] Redirect to: ${url}`);
          return listener(evt, url);
        });
      }

      // For other events, just call the original
      return original.apply(this, args);
    }
  });

  // Hook WebContents.prototype.setWindowOpenHandler
  hookMethod(WebContents.prototype, 'setWindowOpenHandler', {
    before (args) {
      const [handler] = args;
      logger.info(`[webContents.setWindowOpenHandler] Setting window open handler: ${typeof handler}`);
    },
    replace (args, original) {
      const [handler] = args;

      // Wrap the handler to log when it's called
      const wrappedHandler = (details: any) => {
        logger.info(`[webContents.setWindowOpenHandler] Window open requested: ${details.url} (frameName: ${details.frameName || 'none'}, features: ${details.features || 'none'})`);

        // Call the original handler
        const result = handler(details);

        if (result && typeof result === 'object') {
          logger.info(`[webContents.setWindowOpenHandler] Handler result: action=${result.action}, overrideBrowserWindowOptions=${!!result.overrideBrowserWindowOptions}`);
        } else {
          logger.info(`[webContents.setWindowOpenHandler] Handler result: ${result}`);
        }

        return result;
      };

      return original.call(this, wrappedHandler);
    }
  });
}

// ==========================================
// Hooks on electron.browserWindow.webContents.webFrameMain
// - browserWindow.webContents.webFrameMain.executeJavaScript
// ==========================================

// Get the WebFrameMain class using the same method as Electron's web-frame-main.ts
const webFrameMainBinding = process._linkedBinding('electron_browser_web_frame_main');
const { WebFrameMain } = webFrameMainBinding;

// Only hook if WebFrameMain constructor is available
if (WebFrameMain && typeof WebFrameMain === 'function' && WebFrameMain.prototype) {
  // Hook WebFrameMain.prototype.executeJavaScript
  hookMethod(WebFrameMain.prototype, 'executeJavaScript', {
    before (args) {
      const [code, userGesture] = args;
      const truncatedCode = code.length > 100 ? code.substring(0, 100) + '...' : code;
      logger.info(`[webFrameMain.executeJavaScript] Executing JavaScript in main frame${userGesture ? ' (user gesture)' : ''}: ${truncatedCode}`);
    }
  });
}

// ==========================================
// Hooks on electron.BrowserView
// - BrowserView constructor
// ==========================================

// Hook BrowserView constructor
hookConstructor(BrowserView, {
  before (args) {
    const [options] = args;
    logger.info(`[BrowserView constructor] Creating new BrowserView with options: ${JSON.stringify(options, null, 2)}`);
  }
});

// ==========================================
// Hooks on electron.WebContentsView
// - WebContentsView constructor
// ==========================================

// Hook WebContentsView constructor
hookConstructor(WebContentsView, {
  before (args) {
    const [options] = args;
    logger.info(`[WebContentsView constructor] Creating new WebContentsView with options: ${JSON.stringify(options, null, 2)}`);
  }
});

// ==========================================
// Hooks on electron.ipcMain (IPC Handlers)
// - ipcMain.on
// - ipcMain.addListener
// - ipcMain.handle
// - ipcMain.once
// ==========================================

// Hook ipcMain.on
hookMethod(ipcMain, 'on', {
  before (args) {
    const [channel] = args;
    logger.info(`[ipcMain.on] Registering IPC handler for channel: ${channel}`);
  },
  replace (args, original) {
    const [channel, listener] = args;

    // Wrap the listener to log when it's called
    const wrappedListener = (event: any, ...args: any[]) => {
      logger.info(`[ipcMain.on('${channel}')] IPC message received with ${args.length} args: ${JSON.stringify(args).substring(0, 200)}...`);

      try {
        return listener(event, ...args);
      } catch (error) {
        logger.error(`[ipcMain.on('${channel}')] Handler error:`, error);
        throw error;
      }
    };

    return original.call(this, channel, wrappedListener);
  }
});

// Hook ipcMain.addListener (alias for 'on')
hookMethod(ipcMain, 'addListener', {
  before (args) {
    const [channel] = args;
    logger.info(`[ipcMain.addListener] Adding IPC listener for channel: ${channel}`);
  },
  replace (args, original) {
    const [channel, listener] = args;

    const wrappedListener = (event: any, ...args: any[]) => {
      logger.info(`[ipcMain.addListener('${channel}')] IPC message received with ${args.length} args: ${JSON.stringify(args).substring(0, 200)}...`);

      try {
        return listener(event, ...args);
      } catch (error) {
        logger.error(`[ipcMain.addListener('${channel}')] Handler error:`, error);
        throw error;
      }
    };

    return original.call(this, channel, wrappedListener);
  }
});

// Hook ipcMain.handle
hookMethod(ipcMain, 'handle', {
  before (args) {
    const [channel] = args;
    logger.info(`[ipcMain.handle] Registering IPC handler for channel: ${channel}`);
  },
  replace (args, original) {
    const [channel, listener] = args;

    const wrappedListener = async (event: any, ...args: any[]) => {
      logger.info(`[ipcMain.handle('${channel}')] IPC invoke received with ${args.length} args: ${JSON.stringify(args).substring(0, 200)}...`);

      try {
        const result = await listener(event, ...args);
        logger.info(`[ipcMain.handle('${channel}')] Handler completed successfully`);
        return result;
      } catch (error) {
        logger.error(`[ipcMain.handle('${channel}')] Handler error:`, error);
        throw error;
      }
    };

    return original.call(this, channel, wrappedListener);
  }
});

// Hook ipcMain.once
hookMethod(ipcMain, 'once', {
  before (args) {
    const [channel] = args;
    logger.info(`[ipcMain.once] Registering one-time IPC handler for channel: ${channel}`);
  },
  replace (args, original) {
    const [channel, listener] = args;

    const wrappedListener = (event: any, ...args: any[]) => {
      logger.info(`[ipcMain.once('${channel}')] IPC message received (one-time) with ${args.length} args: ${JSON.stringify(args).substring(0, 200)}...`);

      try {
        return listener(event, ...args);
      } catch (error) {
        logger.error(`[ipcMain.once('${channel}')] Handler error:`, error);
        throw error;
      }
    };

    return original.call(this, channel, wrappedListener);
  }
});

// ==========================================
// Hooks on Message Emitters
// ==========================================

// Hook WebContents message emitters only if constructor is available
if (WebContents && typeof WebContents === 'function' && WebContents.prototype) {
  // Hook WebContents.prototype.sendToFrame
  hookMethod(WebContents.prototype, 'sendToFrame', {
    before (args) {
      const [frameId, channel, ...data] = args;
      logger.info(`[webContents.sendToFrame] Sending to frame ${frameId} channel: ${channel} with ${data.length} args: ${JSON.stringify(data).substring(0, 200)}...`);
    }
  });

  // Hook WebContents.prototype.send
  hookMethod(WebContents.prototype, 'send', {
    before (args) {
      const [channel, ...data] = args;
      logger.info(`[webContents.send] Sending to channel: ${channel} with ${data.length} args: ${JSON.stringify(data).substring(0, 200)}...`);
    }
  });

  // Hook WebContents.prototype._sendInternal
  hookMethod(WebContents.prototype, '_sendInternal', {
    before (args) {
      const [channel, ...data] = args;
      logger.info(`[webContents._sendInternal] Internal send to channel: ${channel} with ${data.length} args: ${JSON.stringify(data).substring(0, 200)}...`);
    }
  });

  // Hook WebContents.prototype.postMessage
  hookMethod(WebContents.prototype, 'postMessage', {
    before (args) {
      const [message, targetOrigin, transfer] = args;
      logger.info(`[webContents.postMessage] Posting message: ${JSON.stringify(message).substring(0, 200)}... to origin: ${targetOrigin} transfer: ${transfer ? transfer.length : 0} objects`);
    }
  });
}

// Hook WebFrameMain message emitters only if constructor is available
if (WebFrameMain && typeof WebFrameMain === 'function' && WebFrameMain.prototype) {
  // Hook WebFrameMain.prototype.send
  hookMethod(WebFrameMain.prototype, 'send', {
    before (args) {
      const [channel, ...data] = args;
      logger.info(`[webFrameMain.send] Sending to channel: ${channel} with ${data.length} args: ${JSON.stringify(data).substring(0, 200)}...`);
    }
  });

  // Hook WebFrameMain.prototype._sendInternal
  hookMethod(WebFrameMain.prototype, '_sendInternal', {
    before (args) {
      const [channel, ...data] = args;
      logger.info(`[webFrameMain._sendInternal] Internal frame send to channel: ${channel} with ${data.length} args: ${JSON.stringify(data).substring(0, 200)}...`);
    }
  });
}

// Hook MessageChannelMain constructor and postMessage
hookConstructor(MessageChannelMain, {
  after (instance) {
    logger.info('[MessageChannelMain constructor] New MessageChannelMain created');

    // Hook the postMessage method on the ports
    if (instance.port1 && instance.port1.postMessage) {
      const originalPort1PostMessage = instance.port1.postMessage.bind(instance.port1);
      instance.port1.postMessage = function (message: any, transfer?: any[]) {
        logger.info(`[MessageChannelMain.port1.postMessage] Posting message: ${JSON.stringify(message).substring(0, 200)}... transfer: ${transfer ? transfer.length : 0} objects`);
        return originalPort1PostMessage(message, transfer);
      };
    }

    if (instance.port2 && instance.port2.postMessage) {
      const originalPort2PostMessage = instance.port2.postMessage.bind(instance.port2);
      instance.port2.postMessage = function (message: any, transfer?: any[]) {
        logger.info(`[MessageChannelMain.port2.postMessage] Posting message: ${JSON.stringify(message).substring(0, 200)}... transfer: ${transfer ? transfer.length : 0} objects`);
        return originalPort2PostMessage(message, transfer);
      };
    }
  }
});
