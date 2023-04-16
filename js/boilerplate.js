"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isIFrame = exports.isDebug = void 0;
var textSetup_1 = require("./textSetup");
function createSimpleDiv(_a) {
    var id = _a.id, cls = _a.cls, html = _a.html;
    var div = document.createElement('div');
    if (id !== undefined) {
        div.id = id;
    }
    if (cls !== undefined) {
        div.classList.add(cls);
    }
    if (html !== undefined) {
        div.innerHTML = html;
    }
    return div;
}
function createSimpleA(_a) {
    var id = _a.id, cls = _a.cls, friendly = _a.friendly, href = _a.href, target = _a.target;
    var a = document.createElement('a');
    if (id !== undefined) {
        a.id = id;
    }
    if (cls !== undefined) {
        a.classList.add(cls);
    }
    a.innerHTML = friendly;
    a.href = href;
    a.target = target !== null ? target : '_blank';
    return a;
}
function boilerplate(bp) {
    if (bp === null) {
        return;
    }
    var body = document.getElementsByTagName('body')[0];
    var pageBody = document.getElementById('pageBody');
    document.title = bp['title'];
    body.classList.add(bp['paperSize'] === null ? 'letter' : bp['paperSize']);
    body.classList.add(bp['orientation'] === null ? 'portrait' : bp['orientation']);
    var page = createSimpleDiv({ id: 'page', cls: 'printedPage' });
    var margins = createSimpleDiv({ cls: 'pageWithinMargins' });
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({ cls: 'title', html: bp['title'] }));
    margins.appendChild(createSimpleDiv({ id: 'copyright', html: '&copy; ' + bp['copyright'] + ' ' + bp['author'] }));
    margins.appendChild(createSimpleA({ id: 'backlink', href: 'safari.html', friendly: 'Puzzle list' }));
    if (bp['notes']) {
        margins.appendChild(createSimpleA({ id: 'notes-toggle', href: 'safari.html', friendly: 'Show Notes' }));
    }
    if (bp['decoder']) {
        margins.appendChild(createSimpleA({ id: 'decoder-toggle', href: 'https://ambitious-cliff-0dbb54410.azurestaticapps.net/Decoders/', friendly: 'Show Decoders' }));
    }
    preSetup();
    if (bp['textInput']) {
        (0, textSetup_1.textSetup)();
    }
    //setTimeout(checkLocalStorage, 100);
}
var urlArgs = {};
function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1); // trim leading ?
        var args = search.split('&');
        for (var i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true; // e.g. present
            }
        }
    }
}
function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}
exports.isDebug = isDebug;
function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}
exports.isIFrame = isIFrame;
function preSetup() {
    debugSetup();
    if (isIFrame()) {
        var bodies = document.getElementsByTagName('body');
        bodies[0].classList.add('iframe');
    }
}
window.onload = function () { boilerplate(boiler); };
//# sourceMappingURL=boilerplate.js.map