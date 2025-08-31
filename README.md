<p align="center">
  <img align="center" alt="Proton" src="./proton-logo.svg" height="195">
</p>

<p align="center">
  <span style="font-size: 24px;"><b> Proton </b></span><br>
  <span> Proton is an instrumented electron for security testing.</span>
</p>

<hr>

### Run

```
proton --log-dir /path/to/logs --canary proton1337 --canary-only --sink-only --all-debug app.asar
```

+ `--log-dir`: Directory path where instrumentation logs will be written
+ `--canary`: Custom canary string to inject for tracking data flow (e.g., "proton1337")
+ `--canary-only`: Only log when the canary string is detected in the data flow
+ `--sink-only`: Only log sink operations (API calls that could be security-relevant) without sources
+ `--all-debug`: Open all the debug options

### Features

**Main Process**

+ App
  + External Protocols
    + `app.setAsDefaultProtocolClient`
    + `app.on('open-url')`
  + Internal Protocols:
    + `protocol.registerSchemesAsPrivileged(customSchemes)`
    + `protocol.handle(scheme, handler)`
    + `protocol.registerFileProtocol(scheme, handler)`
    + `protocol.registerStringProtocol(scheme, handler)`
    + `protocol.registerBufferProtocol(scheme, handler)`
    + `protocol.registerHttpProtocol(scheme, handler)`
    + `protocol.registerStreamProtocol(scheme, handler)`
    + `protocol.interceptFileProtocol(scheme, handler)`
    + `protocol.interceptHttpProtocol(scheme, handler)`
+ Sinks
  + Electron APIs: 
    + XSS: 
      + `win.executeJavaScript`
      + `contents.executeJavaScriptInIsolatedWorld`
      + `frame.executeJavaScript`
    + Load URL:
      + `[win, contents].loadURL`
      + `[win, contents].loadFile`
    + Shell:
      + `shell.openExternal` 
      + `shell.openPath`
    + Network
      + `net.request`
      + `net.fetch`
  + Node.js APIs:
    + Command Injection: 
      + `child_process.exec*(cmd[, opts])`
      + `child_process.execFile*(file[, args][, opts])`
      + `child_process.spawn*(cmd[, args][, opts])`
      + `child_process.fork(modulePath[, args][, options])`
    + Code Execution: 
      + `eval(code)`
      + `Function(arg1, ..., body)`
      + `vm.runInNewContext(code[, sandbox])`
      + `vm.Script(code)`, `vm.compileFunction(code, ...)`
      + `require(path)`, `import(path)`
      + `Module._compile(code, filename)`
      + `worker_threads.Worker(spec, { eval: true })`
      + `process.dlopen(module, path)`
      + `vm.runInThisContext(code)`
      + `vm.runInContext(code, contextifiedSandbox)`
    + File Operations:
      + `fs.writeFile*`, `fs.appendFile*`, `fs.createWriteStream`
      + `fs.open`, `fs.promises.*`
      + `fs.unlink*`, `fs.rm*`, `fs.rmdir*`, `fs.rename*`
      + `fs.chmod*`, `fs.chown*`, `fs.symlink*`
      + `fs.readFile*`, `fs.createReadStream`, `fs.readdir*`, `fs.stat*`
    + Network Operations:
      + `http.request|get(options|url[, cb])`, `https.request|get(...)`
      + `http2.connect(authority[, options])`, `.request(headers[, opts])`
      + `net.connect|createConnection(port, host[, opts])`
      + `tls.connect(options)`
      + `dgram.createSocket(...).send(buf, port, host, ...)`
      + `dns.resolve*`, `dns.lookup`, `dns.lookupService`
      + `fetch(url, init)`
+ Renderer-related
  + Web Preferences
    + `new BrowserWindow`
    + `new BrowserView`
    + `new WebContentsView`
  + Window Open Handlers
    + WebContents
      + `contents.on('will-frame-navigate')`
      + `contents.on('will-navigate')`
      + `contents.on('will-redirect')`
      + `contents.setWindowOpenHandler`
  + Communication
    + IPC handlers
      + `ipcMain.on`
      + `ipcMain.addListener`
      + `ipcMain.handle`
      + `ipcMain.once` 
    + Message Emitters
      + `contents.sendToFrame`
      + `contents.send`, `frame.send`
      + `contents.postMessage`
      + `new MessageChannelMain().postMessage`
+ General
  + String-related operations
    + `Object.getOwnPropertyNames(String.prototype)`
  + Array-related operations
    + `Object.getOwnPropertyNames(Array.prototype)`
  + URL/URI operations
    + `url` module
      + `url.parse(addr)`
      + other properties read
    + `URL`
      + `new URL(addr)`
      + other properties read