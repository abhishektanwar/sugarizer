// vim:fileencoding=utf-8
(function(external_namespace) {
"use strict;"
var rs_version = "0.7.16";
var rs_commit_sha = "ac12d7e202b2816c5596d6e0ad9774cd41017d3c";

// Embedded modules {{{

// End embedded modules }}}

/* vim:fileencoding=utf-8
 * 
 * Copyright (C) 2016 Kovid Goyal <kovid at kovidgoyal.net>
 *
 * Distributed under terms of the BSD license
 */

var namespace = {}, jsSHA = {};

var write_cache = {};

var builtin_modules = {
    'crypto' : {
        'createHash': function create_hash() {
            var ans = new jsSHA.jsSHA('SHA-1', 'TEXT');
            ans.digest = function hex_digest() { return ans.getHash('HEX'); };
            return ans;
        },
    },

    'vm': {
        'createContext': function create_context(ctx) {
            var iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            var win = iframe.contentWindow;
            if(!ctx) ctx = {};
            if (!ctx.sha1sum) ctx.sha1sum = sha1sum;
            if (!ctx.require) ctx.require = require;
            Object.keys(ctx).forEach(function(k) { win[k] = ctx[k]; });
            return win;
        },

        'runInContext': function run_in_context(code, ctx) {
            return ctx.eval(code);
        },

        'runInThisContext': eval,
    },
    'path': {
        'join': function path_join() { return Array.prototype.slice.call(arguments).join('/'); },
        'dirname': function path_dirname(path) {
            return path.split('/').slice(0, -1).join('/');
        },
    },
    'inspect': function inspect(x) { return x.toString(); },

    'fs': {
        'readFileSync': function readfile(name) {
            var data = namespace.file_data[name];
            if (data) return data;
            data = write_cache[name];
            if (data) return data;
            var err = Error();
            err.code = 'ENOENT';
            throw err;
        },

        'writeFileSync': function writefile(name, data) {
            write_cache[name] = data;
        },

    },
};

function require(name) {
    return builtin_modules[name] || {};
}

// Embedded sha1 implementation {{{
(function() {
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2015
 Distributed under the BSD License
 See http://caligatio.github.io/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(E){function t(e,a,c){var g=0,b=[],d=0,f,k,l,h,m,w,n,q=!1,r=!1,p=[],t=[],v,u=!1;c=c||{};f=c.encoding||"UTF8";v=c.numRounds||1;l=y(a,f);if(v!==parseInt(v,10)||1>v)throw Error("numRounds must a integer >= 1");if("SHA-1"===e)m=512,w=z,n=F,h=160;else throw Error("Chosen SHA variant is not supported");k=x(e);this.setHMACKey=function(a,b,d){var c;if(!0===r)throw Error("HMAC key already set");if(!0===q)throw Error("Cannot set HMAC key after finalizing hash");if(!0===u)throw Error("Cannot set HMAC key after calling update");
f=(d||{}).encoding||"UTF8";b=y(b,f)(a);a=b.binLen;b=b.value;c=m>>>3;d=c/4-1;if(c<a/8){for(b=n(b,a,0,x(e));b.length<=d;)b.push(0);b[d]&=4294967040}else if(c>a/8){for(;b.length<=d;)b.push(0);b[d]&=4294967040}for(a=0;a<=d;a+=1)p[a]=b[a]^909522486,t[a]=b[a]^1549556828;k=w(p,k);g=m;r=!0};this.update=function(a){var e,c,f,h=0,n=m>>>5;e=l(a,b,d);a=e.binLen;c=e.value;e=a>>>5;for(f=0;f<e;f+=n)h+m<=a&&(k=w(c.slice(f,f+n),k),h+=m);g+=h;b=c.slice(h>>>5);d=a%m;u=!0};this.getHash=function(a,c){var f,l,m;if(!0===
r)throw Error("Cannot call getHash after setting HMAC key");m=A(c);switch(a){case "HEX":f=function(a){return B(a,m)};break;case "B64":f=function(a){return C(a,m)};break;case "BYTES":f=D;break;default:throw Error("format must be HEX, B64, or BYTES");}if(!1===q)for(k=n(b,d,g,k),l=1;l<v;l+=1)k=n(k,h,0,x(e));q=!0;return f(k)};this.getHMAC=function(a,c){var f,l,p;if(!1===r)throw Error("Cannot call getHMAC without first setting HMAC key");p=A(c);switch(a){case "HEX":f=function(a){return B(a,p)};break;case "B64":f=
function(a){return C(a,p)};break;case "BYTES":f=D;break;default:throw Error("outputFormat must be HEX, B64, or BYTES");}!1===q&&(l=n(b,d,g,k),k=w(t,x(e)),k=n(l,h,m,k));q=!0;return f(k)}}function G(e,a,c){var g=e.length,b,d,f,k,l;a=a||[0];c=c||0;l=c>>>3;if(0!==g%2)throw Error("String of HEX type must be in byte increments");for(b=0;b<g;b+=2){d=parseInt(e.substr(b,2),16);if(isNaN(d))throw Error("String of HEX type contains invalid characters");k=(b>>>1)+l;for(f=k>>>2;a.length<=f;)a.push(0);a[f]|=d<<
8*(3-k%4)}return{value:a,binLen:4*g+c}}function H(e,a,c){var g=[],b,d,f,k,g=a||[0];c=c||0;d=c>>>3;for(b=0;b<e.length;b+=1)a=e.charCodeAt(b),k=b+d,f=k>>>2,g.length<=f&&g.push(0),g[f]|=a<<8*(3-k%4);return{value:g,binLen:8*e.length+c}}function I(e,a,c){var g=[],b=0,d,f,k,l,h,m,g=a||[0];c=c||0;a=c>>>3;if(-1===e.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");f=e.indexOf("=");e=e.replace(/\=/g,"");if(-1!==f&&f<e.length)throw Error("Invalid '=' found in base-64 string");
for(f=0;f<e.length;f+=4){h=e.substr(f,4);for(k=l=0;k<h.length;k+=1)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[k]),l|=d<<18-6*k;for(k=0;k<h.length-1;k+=1){m=b+a;for(d=m>>>2;g.length<=d;)g.push(0);g[d]|=(l>>>16-8*k&255)<<8*(3-m%4);b+=1}}return{value:g,binLen:8*b+c}}function B(e,a){var c="",g=4*e.length,b,d;for(b=0;b<g;b+=1)d=e[b>>>2]>>>8*(3-b%4),c+="0123456789abcdef".charAt(d>>>4&15)+"0123456789abcdef".charAt(d&15);return a.outputUpper?c.toUpperCase():c}function C(e,
a){var c="",g=4*e.length,b,d,f;for(b=0;b<g;b+=3)for(f=b+1>>>2,d=e.length<=f?0:e[f],f=b+2>>>2,f=e.length<=f?0:e[f],f=(e[b>>>2]>>>8*(3-b%4)&255)<<16|(d>>>8*(3-(b+1)%4)&255)<<8|f>>>8*(3-(b+2)%4)&255,d=0;4>d;d+=1)8*b+6*d<=32*e.length?c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(f>>>6*(3-d)&63):c+=a.b64Pad;return c}function D(e){var a="",c=4*e.length,g,b;for(g=0;g<c;g+=1)b=e[g>>>2]>>>8*(3-g%4)&255,a+=String.fromCharCode(b);return a}function A(e){var a={outputUpper:!1,b64Pad:"="};
e=e||{};a.outputUpper=e.outputUpper||!1;!0===e.hasOwnProperty("b64Pad")&&(a.b64Pad=e.b64Pad);if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function y(e,a){var c;switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(e){case "HEX":c=G;break;case "TEXT":c=function(e,b,d){var f=[],c=[],l=0,h,m,p,
n,q,f=b||[0];b=d||0;p=b>>>3;if("UTF8"===a)for(h=0;h<e.length;h+=1)for(d=e.charCodeAt(h),c=[],128>d?c.push(d):2048>d?(c.push(192|d>>>6),c.push(128|d&63)):55296>d||57344<=d?c.push(224|d>>>12,128|d>>>6&63,128|d&63):(h+=1,d=65536+((d&1023)<<10|e.charCodeAt(h)&1023),c.push(240|d>>>18,128|d>>>12&63,128|d>>>6&63,128|d&63)),m=0;m<c.length;m+=1){q=l+p;for(n=q>>>2;f.length<=n;)f.push(0);f[n]|=c[m]<<8*(3-q%4);l+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(h=0;h<e.length;h+=1){d=e.charCodeAt(h);"UTF16LE"===a&&
(m=d&255,d=m<<8|d>>>8);q=l+p;for(n=q>>>2;f.length<=n;)f.push(0);f[n]|=d<<8*(2-q%4);l+=2}return{value:f,binLen:8*l+b}};break;case "B64":c=I;break;case "BYTES":c=H;break;default:throw Error("format must be HEX, TEXT, B64, or BYTES");}return c}function r(e,a){return e<<a|e>>>32-a}function p(e,a){var c=(e&65535)+(a&65535);return((e>>>16)+(a>>>16)+(c>>>16)&65535)<<16|c&65535}function u(e,a,c,g,b){var d=(e&65535)+(a&65535)+(c&65535)+(g&65535)+(b&65535);return((e>>>16)+(a>>>16)+(c>>>16)+(g>>>16)+(b>>>16)+
(d>>>16)&65535)<<16|d&65535}function x(e){if("SHA-1"===e)e=[1732584193,4023233417,2562383102,271733878,3285377520];else throw Error("No SHA variants supported");return e}function z(e,a){var c=[],g,b,d,f,k,l,h;g=a[0];b=a[1];d=a[2];f=a[3];k=a[4];for(h=0;80>h;h+=1)c[h]=16>h?e[h]:r(c[h-3]^c[h-8]^c[h-14]^c[h-16],1),l=20>h?u(r(g,5),b&d^~b&f,k,1518500249,c[h]):40>h?u(r(g,5),b^d^f,k,1859775393,c[h]):60>h?u(r(g,5),b&d^b&f^d&f,k,2400959708,c[h]):u(r(g,5),b^d^f,k,3395469782,c[h]),k=f,f=d,d=r(b,30),b=g,g=l;a[0]=
p(g,a[0]);a[1]=p(b,a[1]);a[2]=p(d,a[2]);a[3]=p(f,a[3]);a[4]=p(k,a[4]);return a}function F(e,a,c,g){var b;for(b=(a+65>>>9<<4)+15;e.length<=b;)e.push(0);e[a>>>5]|=128<<24-a%32;e[b]=a+c;c=e.length;for(a=0;a<c;a+=16)g=z(e.slice(a,a+16),g);return g}"function"===typeof define&&define.amd?define(function(){return t}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=t:exports=t:E.jsSHA=t})(this);
}).call(jsSHA);
// End embedded sha1 implementation }}}

var exports = namespace;
/* 
 * Copyright (C) 2015 Kovid Goyal <kovid at kovidgoyal.net>
 *
 * Distributed under terms of the BSD license
 */

var vm = require('vm');
var native_require = require;

function normalize_array(parts, allowAboveRoot) {
  var res = [];
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];

    // ignore empty parts
    if (!p || p === '.')
      continue;

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop();
      } else if (allowAboveRoot) {
        res.push('..');
      }
    } else {
      res.push(p);
    }
  }

  return res;
}

function normalize(path) {
    var is_abs = path && path[0] === '/';
    var trailing_slash = path && path[path.length - 1] === '/';
    path = normalize_array(path.split('/'), !is_abs).join('/');

    if (!path && !is_abs) {
        path = '.';
    }
    if (path && trailing_slash) {
        path += '/';
    }

    return (is_abs ? '/' : '') + path;
}

function dirname(path) {
    var idx = path.lastIndexOf('/');
    if (idx != -1) path = path.slice(0, idx);
    else path = '';
    return path;
}

function basename(path) {
    var idx = path.lastIndexOf('/');
    if (idx != -1) path = path.slice(idx + 1);
    return path;
}

var cache = {};

function load(filepath) {
    var cached = cache[filepath];
    if (cached) return cached.exports;
    var module = {'id':filepath, 'exports':{}};
    cache[filepath] = module;

    var content = data[filepath];
    if (Array.isArray(content)) content = data[content[0]];
    if (!content) throw 'Failed to load: ' + JSON.stringify(filepath);

    if (filepath.slice(-5) == '.json') { module.exports = JSON.parse(content); return module.exports; }

    var base = dirname(filepath);
    function mrequire(x) {
        return vrequire(x, base);
    }
    content = content.replace(/^\#\!.*/, '');
    var wrapped = '(function(exports, require, module, __filename, __dirname, create_rapydscript_compiler) { ';
    wrapped += content + '\n;})';
    try {
        vm.runInThisContext(wrapped, {'filename': filepath})(module.exports, mrequire, module, filepath, dirname(filepath), create_compiler);
    } catch (e) {
        console.error(e);
        delete cache[filepath];
        throw e;
    }
    return module.exports;
}

function has(x, y) { return Object.prototype.hasOwnProperty.call(x, y); }

function try_files(candidate) {
    if (has(data, candidate)) return candidate;
    if (has(data, candidate + '.js')) return candidate + '.js';
    if (has(data, candidate + '.json')) return candidate + '.json';
    return null;
}

function find_in_modules_dir(name, base) {
    var candidate = normalize(base + (base ? '/':'') + 'node_modules/' + name);
    var q = try_files(candidate);
    if (q) return q;

    var pj = candidate + '/package.json';
    if (has(data, pj)) {
        var ans = normalize(candidate + '/' + JSON.parse(data[pj]).main);
        if (has(data, ans)) return ans;
    }
    var index = candidate + '/index.js';
    if (has(data, index)) return index;

    var p = dirname(base);
    if (p) return find_in_modules_dir(name, p);
    return null;
}

function find_module(name, base) {
    if (name[0] == '/') throw 'Cannot find absolute module: ' + name;
    if (name.slice(0, 2) == './' || name.slice(0, 3) == '../') {
        var candidate = normalize((base ? base + '/' : base) + name);
        return try_files(candidate);
    }
    var q = try_files(name);
    if (q) return q;
    return find_in_modules_dir(name, base);
}

function vrequire(name, base) {
    var exports = {};
    var modpath = '';
    base = base || '';
    // console.log('vrequire', name, base);
    if (!name) throw new Error('Cannot load a module from an empty name');

    modpath = find_module(name, base);
    if (!modpath && name && './'.indexOf(name[0]) === -1) {
            try {
                return native_require(name);
            } catch (e) {}
        }

    if (!modpath) throw new Error("Failed to find module: " + JSON.stringify(name) + " with base: " + JSON.stringify(base));
    return load(modpath);
}

var UglifyJS = null, regenerator = null;
var crypto = null, fs = require('fs');

function uglify(x) {
    if (!UglifyJS) UglifyJS = vrequire("uglify-js");
    ans = UglifyJS.minify(x);
    if (ans.error) throw ans.error;
    return ans.code;
}

function regenerate(code, beautify) {
    var orig = fs.readFileSync;
    fs.readFileSync = function(name) { 
        if (!has(data, name)) {
            throw {message: "Failed to readfile from data: " + name};
        }
        return data[name]; 
    };
    if (!regenerator) regenerator = vrequire('regenerator');
    var ans;
    if (code) {
        try {
            ans = regenerator.compile(code).code;
        } catch (e) {
            console.error('regenerator failed for code: ' + code + 'with error stack:\n' + e.stack);
            throw e;
        }
        if (!beautify) ans = uglify(ans);
    } else {
        // Return the runtime
        ans = regenerator.compile('', {includeRuntime:true}).code;
        ans = ans.slice(ans.indexOf('!'), ans.lastIndexOf(')(')) + ')';
        if (!beautify) ans = uglify(ans+'();').slice(0, -3);
    }
    fs.readFileSync = orig;
    return ans;
}

if (typeof this != 'object' || typeof this.sha1sum !== 'function') {
    var sha1sum = function (data) { 
        if (!crypto) crypto = require('crypto');
        var h = crypto.createHash('sha1');
        h.update(data);
        return h.digest('hex');
    };
} else var sha1sum = this.sha1sum;

function create_compiler() {
    var compilerjs = data['compiler.js'];
    var module = {'id':'compiler', 'exports':{}};
    var wrapped = '(function(module, exports, readfile, writefile, sha1sum, regenerate) {' + data['compiler.js'] + ';\n})';
    vm.runInThisContext(wrapped, {'filename': 'compiler.js'})(module, module.exports, fs.readFileSync, fs.writeFileSync, sha1sum, regenerate);
    return module.exports;
}

var RapydScript = null;

function compile(code, filename, options) {
    if (!RapydScript) RapydScript = create_compiler();
    options = options || {};
    var ast = RapydScript.parse(code, {
        filename: filename || '<eval>',
        basedir: options.basedir || dirname(filename || ''),
        libdir: options.libdir,
    });
    var out_ops = {
        beautify: (options.beautify === undefined ? true : options.beautify),
        private_scope: !options.bare,
        omit_baselib: !!options.omit_baselib,
        js_version: options.js_version || 5,
    };
    if (!out_ops.omit_baselib) out_ops.baselib_plain = data['baselib-plain-' + (out_ops.beautify ? 'pretty' : 'ugly') + '.js'];
    var out = new RapydScript.OutputStream(out_ops);
    ast.print(out);
    return out.get();
}

function create_embedded_compiler(runjs) {
    var c = vrequire('tools/embedded_compiler.js');
    return c(create_compiler(), data['baselib-plain-pretty.js'], runjs);
}

function web_repl() {
    var repl = vrequire('tools/web_repl.js');
    return repl(create_compiler(), data['baselib-plain-pretty.js']);
}

function init_repl(options) {
    var repl = vrequire('tools/repl.js');
    options.baselib = data['baselib-plain-pretty.js'];
    return repl(options);
}

function gettext_parse(catalog, code, filename) {
    g = vrequire('tools/gettext.js');
    g.gettext(catalog, code, filename);
}

function gettext_output(catalog, options, write) {
    g = vrequire('tools/gettext.js');
    g.write_output(catalog, options, write);
}

function msgfmt(data, options) {
    m = vrequire('tools/msgfmt.js');
    return m.build(data, options);
}

function completer(compiler, options) {
    m = vrequire('tools/completer.js');
    return m(compiler, options);
}

if (typeof exports === 'object') {
    exports.compile = compile;
    exports.create_embedded_compiler = create_embedded_compiler;
    exports.web_repl = web_repl;
    exports.init_repl = init_repl;
    exports.gettext_parse = gettext_parse;
    exports.gettext_output = gettext_output;
    exports.msgfmt = msgfmt;
    exports.rs_version = rs_version;
    exports.file_data = data;
    exports.completer = completer;
    if (typeof rs_commit_sha === 'string') exports.rs_commit_sha = rs_commit_sha;
}
external_namespace.RapydScript = namespace;
})(this)