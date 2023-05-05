
var Speex = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (typeof __filename !== 'undefined') _scriptDir = _scriptDir || __filename;
  return (
function(Speex) {
  Speex = Speex || {};



// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Speex != 'undefined' ? Speex : {};

// See https://caniuse.com/mdn-javascript_builtins_object_assign

// Set up the promise that indicates the Module is initialized
var readyPromiseResolve, readyPromiseReject;
Module['ready'] = new Promise(function(resolve, reject) {
  readyPromiseResolve = resolve;
  readyPromiseReject = reject;
});

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)
// {{PRE_JSES}}

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = Object.assign({}, Module);

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = typeof window == 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts == 'function';
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = typeof process == 'object' && typeof process.versions == 'object' && typeof process.versions.node == 'string';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

// Normally we don't log exceptions but instead let them bubble out the top
// level where the embedding environment (e.g. the browser) can handle
// them.
// However under v8 and node we sometimes exit the process direcly in which case
// its up to use us to log the exception before exiting.
// If we fix https://github.com/emscripten-core/emscripten/issues/15080
// this may no longer be needed under node.
function logExceptionOnExit(e) {
  if (e instanceof ExitStatus) return;
  let toLog = e;
  err('exiting due to exception: ' + toLog);
}

var fs;
var nodePath;
var requireNodeFS;

if (ENVIRONMENT_IS_NODE) {
  if (ENVIRONMENT_IS_WORKER) {
    scriptDirectory = require('path').dirname(scriptDirectory) + '/';
  } else {
    scriptDirectory = __dirname + '/';
  }

// include: node_shell_read.js


requireNodeFS = () => {
  // Use nodePath as the indicator for these not being initialized,
  // since in some environments a global fs may have already been
  // created.
  if (!nodePath) {
    fs = require('fs');
    nodePath = require('path');
  }
};

read_ = function shell_read(filename, binary) {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    return binary ? ret : ret.toString();
  }
  requireNodeFS();
  filename = nodePath['normalize'](filename);
  return fs.readFileSync(filename, binary ? undefined : 'utf8');
};

readBinary = (filename) => {
  var ret = read_(filename, true);
  if (!ret.buffer) {
    ret = new Uint8Array(ret);
  }
  return ret;
};

readAsync = (filename, onload, onerror) => {
  var ret = tryParseAsDataURI(filename);
  if (ret) {
    onload(ret);
  }
  requireNodeFS();
  filename = nodePath['normalize'](filename);
  fs.readFile(filename, function(err, data) {
    if (err) onerror(err);
    else onload(data.buffer);
  });
};

// end include: node_shell_read.js
  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  // MODULARIZE will export the module in the proper place outside, we don't need to export here

  quit_ = (status, toThrow) => {
    if (keepRuntimeAlive()) {
      process['exitCode'] = status;
      throw toThrow;
    }
    logExceptionOnExit(toThrow);
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (typeof document != 'undefined' && document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // When MODULARIZE, this JS may be executed later, after document.currentScript
  // is gone, so we saved it, and we use it here instead of any other info.
  if (_scriptDir) {
    scriptDirectory = _scriptDir;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  // If scriptDirectory contains a query (starting with ?) or a fragment (starting with #),
  // they are removed because they could contain a slash.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }

  // Differentiate the Web Worker from the Node Worker case, as reading must
  // be done differently.
  {
// include: web_or_worker_shell_read.js


  read_ = (url) => {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  }

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = (url, onload, onerror) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = () => {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  }

// end include: web_or_worker_shell_read.js
  }

  setWindowTitle = (title) => document.title = title;
} else
{
}

var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
Object.assign(Module, moduleOverrides);
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.

if (Module['arguments']) arguments_ = Module['arguments'];

if (Module['thisProgram']) thisProgram = Module['thisProgram'];

if (Module['quit']) quit_ = Module['quit'];

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message




var STACK_ALIGN = 16;
var POINTER_SIZE = 4;

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length - 1] === '*') {
        return POINTER_SIZE;
      } else if (type[0] === 'i') {
        const bits = Number(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}

// include: runtime_functions.js


// Wraps a JS function as a wasm function with a given signature.
function convertJsFunctionToWasm(func, sig) {

  // If the type reflection proposal is available, use the new
  // "WebAssembly.Function" constructor.
  // Otherwise, construct a minimal wasm module importing the JS function and
  // re-exporting it.
  if (typeof WebAssembly.Function == "function") {
    var typeNames = {
      'i': 'i32',
      'j': 'i64',
      'f': 'f32',
      'd': 'f64'
    };
    var type = {
      parameters: [],
      results: sig[0] == 'v' ? [] : [typeNames[sig[0]]]
    };
    for (var i = 1; i < sig.length; ++i) {
      type.parameters.push(typeNames[sig[i]]);
    }
    return new WebAssembly.Function(type, func);
  }

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    'e': {
      'f': func
    }
  });
  var wrappedFunc = instance.exports['f'];
  return wrappedFunc;
}

var freeTableIndexes = [];

// Weak map of functions in the table to their indexes, created on first use.
var functionsInTableMap;

function getEmptyTableSlot() {
  // Reuse a free index if there is one, otherwise grow.
  if (freeTableIndexes.length) {
    return freeTableIndexes.pop();
  }
  // Grow the table
  try {
    wasmTable.grow(1);
  } catch (err) {
    if (!(err instanceof RangeError)) {
      throw err;
    }
    throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
  }
  return wasmTable.length - 1;
}

function updateTableMap(offset, count) {
  for (var i = offset; i < offset + count; i++) {
    var item = getWasmTableEntry(i);
    // Ignore null values.
    if (item) {
      functionsInTableMap.set(item, i);
    }
  }
}

/**
 * Add a function to the table.
 * 'sig' parameter is required if the function being added is a JS function.
 * @param {string=} sig
 */
function addFunction(func, sig) {

  // Check if the function is already in the table, to ensure each function
  // gets a unique index. First, create the map if this is the first use.
  if (!functionsInTableMap) {
    functionsInTableMap = new WeakMap();
    updateTableMap(0, wasmTable.length);
  }
  if (functionsInTableMap.has(func)) {
    return functionsInTableMap.get(func);
  }

  // It's not in the table, add it now.

  var ret = getEmptyTableSlot();

  // Set the new value.
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    setWasmTableEntry(ret, func);
  } catch (err) {
    if (!(err instanceof TypeError)) {
      throw err;
    }
    var wrapped = convertJsFunctionToWasm(func, sig);
    setWasmTableEntry(ret, wrapped);
  }

  functionsInTableMap.set(func, ret);

  return ret;
}

function removeFunction(index) {
  functionsInTableMap.delete(getWasmTableEntry(index));
  freeTableIndexes.push(index);
}

// end include: runtime_functions.js
// include: runtime_debug.js


// end include: runtime_debug.js
var tempRet0 = 0;
var setTempRet0 = (value) => { tempRet0 = value; };
var getTempRet0 = () => tempRet0;



// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
var noExitRuntime = Module['noExitRuntime'] || true;

if (typeof WebAssembly != 'object') {
  abort('no native wasm support detected');
}

// include: runtime_safe_heap.js


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @param {number} ptr
    @param {number} value
    @param {string} type
    @param {number|boolean=} noSafe */
function setValue(ptr, value, type = 'i8', noSafe) {
  if (type.charAt(type.length-1) === '*') type = 'i32';
    switch (type) {
      case 'i1': HEAP8[((ptr)>>0)] = value; break;
      case 'i8': HEAP8[((ptr)>>0)] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math.abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math.min((+(Math.floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math.ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)] = tempI64[0],HEAP32[(((ptr)+(4))>>2)] = tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @param {number} ptr
    @param {string} type
    @param {number|boolean=} noSafe */
function getValue(ptr, type = 'i8', noSafe) {
  if (type.charAt(type.length-1) === '*') type = 'i32';
    switch (type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return Number(HEAPF64[((ptr)>>3)]);
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}

// end include: runtime_safe_heap.js
// Wasm globals

var wasmMemory;

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    // This build was created without ASSERTIONS defined.  `assert()` should not
    // ever be called in this configuration but in case there are callers in
    // the wild leave this simple abort() implemenation here for now.
    abort(text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  return func;
}

// C calling interface.
/** @param {string|null=} returnType
    @param {Array=} argTypes
    @param {Arguments|Array=} args
    @param {Object=} opts */
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);
  function onDone(ret) {
    if (stack !== 0) stackRestore(stack);
    return convertReturnValue(ret);
  }

  ret = onDone(ret);
  return ret;
}

/** @param {string=} returnType
    @param {Array=} argTypes
    @param {Object=} opts */
function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = argTypes.every(function(type){ return type === 'number'});
  var numericRet = returnType !== 'string';
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

// include: runtime_legacy.js


var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call

/**
 * allocate(): This function is no longer used by emscripten but is kept around to avoid
 *             breaking external users.
 *             You should normally not use allocate(), and instead allocate
 *             memory using _malloc()/stackAlloc(), initialize it with
 *             setValue(), and so forth.
 * @param {(Uint8Array|Array<number>)} slab: An array of data.
 * @param {number=} allocator : How to allocate memory, see ALLOC_*
 */
function allocate(slab, allocator) {
  var ret;

  if (allocator == ALLOC_STACK) {
    ret = stackAlloc(slab.length);
  } else {
    ret = _malloc(slab.length);
  }

  if (!slab.subarray && !slab.slice) {
    slab = new Uint8Array(slab);
  }
  HEAPU8.set(slab, ret);
  return ret;
}

// end include: runtime_legacy.js
// include: runtime_strings.js


// runtime_strings.js: Strings related runtime functions that are part of both MINIMAL_RUNTIME and regular runtime.

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heap, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(heap.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = heap[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = heap[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = heap[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  ;
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   heap: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}

// end include: runtime_strings.js
// include: runtime_strings_extra.js


// runtime_strings_extra.js: Strings related runtime functions that are available only in regular runtime.

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder != 'undefined' ? new TextDecoder('utf-16le') : undefined;

function UTF16ToString(ptr, maxBytesToRead) {
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  var maxIdx = idx + maxBytesToRead / 2;
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var str = '';

    // If maxBytesToRead is not passed explicitly, it will be undefined, and the for-loop's condition
    // will always evaluate to true. The loop is then terminated on the first null char.
    for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) break;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }

    return str;
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)] = codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr, maxBytesToRead) {
  var i = 0;

  var str = '';
  // If maxBytesToRead is not passed explicitly, it will be undefined, and this
  // will always evaluate to true. This saves on code size.
  while (!(i >= maxBytesToRead / 4)) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0) break;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
  return str;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)] = codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)] = 0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated
    @param {boolean=} dontAddNull */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}

/** @param {boolean=} dontAddNull */
function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[((buffer++)>>0)] = str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)] = 0;
}

// end include: runtime_strings_extra.js
// Memory management

var HEAP,
/** @type {!ArrayBuffer} */
  buffer,
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var TOTAL_STACK = 5242880;

var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 20971520;

// include: runtime_init_table.js
// In regular non-RELOCATABLE mode the table is exported
// from the wasm module and this will be assigned once
// the exports are available.
var wasmTable;

// end include: runtime_init_table.js
// include: runtime_stack_check.js


// end include: runtime_stack_check.js
// include: runtime_assertions.js


// end include: runtime_assertions.js
var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;
var runtimeKeepaliveCounter = 0;

function keepRuntimeAlive() {
  return noExitRuntime || runtimeKeepaliveCounter > 0;
}

function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;

  
  callRuntimeCallbacks(__ATINIT__);
}

function exitRuntime() {
  runtimeExited = true;
}

function postRun() {

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

// include: runtime_math.js


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

// end include: runtime_math.js
// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data

/** @param {string|number=} what */
function abort(what) {
  {
    if (Module['onAbort']) {
      Module['onAbort'](what);
    }
  }

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what += '. Build with -s ASSERTIONS=1 for more info.';

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // defintion for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.

  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// {{MEM_INITIALIZER}}

// include: memoryprofiler.js


// end include: memoryprofiler.js
// include: URIUtils.js


// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  // Prefix of data URIs emitted by SINGLE_FILE and related options.
  return filename.startsWith(dataURIPrefix);
}

// Indicates whether filename is delivered via file protocol (as opposed to http/https)
function isFileURI(filename) {
  return filename.startsWith('file://');
}

// end include: URIUtils.js
var wasmBinaryFile;
  wasmBinaryFile = 'data:application/octet-stream;base64,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';
  if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile);
  }

function getBinary(file) {
  try {
    if (file == wasmBinaryFile && wasmBinary) {
      return new Uint8Array(wasmBinary);
    }
    var binary = tryParseAsDataURI(file);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(file);
    } else {
      throw "both async and sync fetching of the wasm failed";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // If we don't have the binary yet, try to to load it asynchronously.
  // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
  // See https://github.com/github/fetch/pull/92#issuecomment-140665932
  // Cordova or Electron apps are typically loaded from a file:// url.
  // So use fetch if it is available and the url is not a file, otherwise fall back to XHR.
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
    if (typeof fetch == 'function'
    ) {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        if (!response['ok']) {
          throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
        }
        return response['arrayBuffer']();
      }).catch(function () {
          return getBinary(wasmBinaryFile);
      });
    }
  }

  // Otherwise, getBinary should be able to get it synchronously
  return Promise.resolve().then(function() { return getBinary(wasmBinaryFile); });
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_snapshot_preview1': asmLibraryArg,
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    var exports = instance.exports;

    Module['asm'] = exports;

    wasmMemory = Module['asm']['memory'];
    updateGlobalBufferAndViews(wasmMemory.buffer);

    wasmTable = Module['asm']['__indirect_function_table'];

    addOnInit(Module['asm']['__wasm_call_ctors']);

    removeRunDependency('wasm-instantiate');
  }
  // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');

  // Prefer streaming instantiation if available.
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(result['instance']);
  }

  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(function (instance) {
      return instance;
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);

      abort(reason);
    });
  }

  function instantiateAsync() {
    if (!wasmBinary &&
        typeof WebAssembly.instantiateStreaming == 'function' &&
        !isDataURI(wasmBinaryFile) &&
        typeof fetch == 'function') {
      return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
        // Suppress closure warning here since the upstream definition for
        // instantiateStreaming only allows Promise<Repsponse> rather than
        // an actual Response.
        // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure is fixed.
        /** @suppress {checkTypes} */
        var result = WebAssembly.instantiateStreaming(response, info);

        return result.then(
          receiveInstantiationResult,
          function(reason) {
            // We expect the most common failure cause to be a bad MIME type for the binary,
            // in which case falling back to ArrayBuffer instantiation should work.
            err('wasm streaming compile failed: ' + reason);
            err('falling back to ArrayBuffer instantiation');
            return instantiateArrayBuffer(receiveInstantiationResult);
          });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  // If instantiation fails, reject the module ready promise.
  instantiateAsync().catch(readyPromiseReject);
  return {}; // no exports yet; we'll fill them in later
}

// Globals used by JS i64 conversions (see makeSetValue)
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = {
  
};






  function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == 'function') {
          callback(Module); // Pass the module as the first argument.
          continue;
        }
        var func = callback.func;
        if (typeof func == 'number') {
          if (callback.arg === undefined) {
            getWasmTableEntry(func)();
          } else {
            getWasmTableEntry(func)(callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }

  function withStackSave(f) {
      var stack = stackSave();
      var ret = f();
      stackRestore(stack);
      return ret;
    }
  function demangle(func) {
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  var wasmTableMirror = [];
  function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }

  function handleException(e) {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      quit_(1, e);
    }

  function jsStackTrace() {
      var error = new Error();
      if (!error.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error();
        } catch(e) {
          error = e;
        }
        if (!error.stack) {
          return '(no stack trace available)';
        }
      }
      return error.stack.toString();
    }

  function setWasmTableEntry(idx, func) {
      wasmTable.set(idx, func);
      wasmTableMirror[idx] = func;
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }

  function _emscripten_get_heap_max() {
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      return 2147483648;
    }
  
  function emscripten_realloc_buffer(size) {
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16); // .grow() takes a delta compared to the previous size
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1 /*success*/;
      } catch(e) {
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      // With pthreads, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = _emscripten_get_heap_max();
      if (requestedSize > maxHeapSize) {
        return false;
      }
  
      let alignUp = (x, multiple) => x + (multiple - x % multiple) % multiple;
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
  
          return true;
        }
      }
      return false;
    }
var ASSERTIONS = false;



/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {string} input The string to decode.
 */
var decodeBase64 = typeof atob == 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE == 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf['buffer'], buf['byteOffset'], buf['byteLength']);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


var asmLibraryArg = {
  "emscripten_memcpy_big": _emscripten_memcpy_big,
  "emscripten_resize_heap": _emscripten_resize_heap
};
var asm = createWasm();
/** @type {function(...*):?} */
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
  return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _speex_resampler_init = Module["_speex_resampler_init"] = function() {
  return (_speex_resampler_init = Module["_speex_resampler_init"] = Module["asm"]["speex_resampler_init"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _speex_resampler_destroy = Module["_speex_resampler_destroy"] = function() {
  return (_speex_resampler_destroy = Module["_speex_resampler_destroy"] = Module["asm"]["speex_resampler_destroy"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _free = Module["_free"] = function() {
  return (_free = Module["_free"] = Module["asm"]["free"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _speex_resampler_process_interleaved_int = Module["_speex_resampler_process_interleaved_int"] = function() {
  return (_speex_resampler_process_interleaved_int = Module["_speex_resampler_process_interleaved_int"] = Module["asm"]["speex_resampler_process_interleaved_int"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _speex_resampler_get_rate = Module["_speex_resampler_get_rate"] = function() {
  return (_speex_resampler_get_rate = Module["_speex_resampler_get_rate"] = Module["asm"]["speex_resampler_get_rate"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _speex_resampler_strerror = Module["_speex_resampler_strerror"] = function() {
  return (_speex_resampler_strerror = Module["_speex_resampler_strerror"] = Module["asm"]["speex_resampler_strerror"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var ___errno_location = Module["___errno_location"] = function() {
  return (___errno_location = Module["___errno_location"] = Module["asm"]["__errno_location"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var _malloc = Module["_malloc"] = function() {
  return (_malloc = Module["_malloc"] = Module["asm"]["malloc"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackSave = Module["stackSave"] = function() {
  return (stackSave = Module["stackSave"] = Module["asm"]["stackSave"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackRestore = Module["stackRestore"] = function() {
  return (stackRestore = Module["stackRestore"] = Module["asm"]["stackRestore"]).apply(null, arguments);
};

/** @type {function(...*):?} */
var stackAlloc = Module["stackAlloc"] = function() {
  return (stackAlloc = Module["stackAlloc"] = Module["asm"]["stackAlloc"]).apply(null, arguments);
};





// === Auto-generated postamble setup entry stuff ===

Module["setValue"] = setValue;
Module["getValue"] = getValue;
Module["AsciiToString"] = AsciiToString;

var calledRun;

/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};

/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve(Module);
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}
Module['run'] = run;

/** @param {boolean|number=} implicit */
function exit(status, implicit) {
  EXITSTATUS = status;

  if (keepRuntimeAlive()) {
  } else {
    exitRuntime();
  }

  procExit(status);
}

function procExit(code) {
  EXITSTATUS = code;
  if (!keepRuntimeAlive()) {
    if (Module['onExit']) Module['onExit'](code);
    ABORT = true;
  }
  quit_(code, new ExitStatus(code));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

run();







  return Speex.ready
}
);
})();
export default Speex;