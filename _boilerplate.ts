import { textSetup } from "./_textSetup"
import { hasClass, toggleClass } from "./_classUtil"
import { setupNotes, setupCrossOffs, setupHighlights } from "./_notes"
import { setupDecoderToggle } from "./_decoders"
import { checkLocalStorage, indexAllDragDropFields, indexAllDrawableFields } from "./_storage";
import { preprocessStampObjects } from "./_stampTools";
import { preprocessDragFunctions } from "./_dragDrop";
import { EdgeTypes, preprocessRulerFunctions } from "./_straightEdge";
import { TableDetails, constructTable } from "./_tableBuilder";
import { setupSubways } from "./_subway";
import { setupValidation } from "./_confirmation";
import { expandControlTags } from "./_builder";
import { LinkDetails, getSafariDetails, initSafariDetails } from "./_events";
import { diffSummarys, LayoutSummary, renderDiffs, summarizePageLayout } from "./_testUtils";


/**
 * Cache the URL parameneters as a dictionary.
 * Arguments that don't specify a value receive a default value of true
 */
const urlArgs = {};

/**
 * Cache the original, pre-modified HTML, in case there is an error to point to
 */
export let _rawHtmlSource:string;

/**
 * Scan the url for special arguments.
 */
function debugSetup() {
    var search = window.location.search;
    if (search !== '') {
        search = search.substring(1);  // trim leading ?
        var args = search.split('&');
        for (let i = 0; i < args.length; i++) {
            var toks = args[i].split('=');
            if (toks.length > 1) {
                urlArgs[toks[0].toLowerCase()] = toks[1];
            }
            else {
                urlArgs[toks[0].toLowerCase()] = true;  // e.g. present
            }
        }
    }
    if (urlArgs['body-debug'] != undefined && urlArgs['body-debug'] !== false) {
        toggleClass(document.getElementsByTagName('body')[0], 'debug', true);
    }
    if (urlArgs['compare-layout'] != undefined) {
        linkCss('../Css/TestLayoutDiffs.css');  // TODO: path
    }
}

/**
 * Determines if the caller has specified <i>debug</i> in the URL
 * @returns true if set, unless explictly set to false
 */
export function isDebug() {
    return urlArgs['debug'] != undefined && urlArgs['debug'] !== false;
}

/**
 * Determines if the caller has specified <i>body-debug</i> in the URL,
 * or else if the puzzle explictly has set class='debug' on the body.
 * @returns true if set, unless explictly set to false
 */
export function isBodyDebug() {
    return hasClass(document.getElementsByTagName('body')[0], 'debug');
}

/**
 * Determines if this document is being loaded inside an iframe.
 * While any document could in theory be in an iframe, this library tags such pages with a url argument.
 * @returns true if this page's URL contains an iframe argument (other than false)
 */
export function isIFrame() {
    return urlArgs['iframe'] != undefined && urlArgs['iframe'] !== false;
}

/**
 * Determines if this document's URL was tagged with ?print
 * This is intended to as an alternative way to get a print-look, other than CSS's @media print
 * @returns true if this page's URL contains a print argument (other than false)
 */
export function isPrint() {
    return urlArgs['print'] != undefined && urlArgs['print'] !== false;
}

/**
 * Determines if this document's URL was tagged with ?icon
 * This is intended to as an alternative way to generate icons for each puzzle
 * @returns true if this page's URL contains a print argument (other than false)
 */
export function isIcon() {
    return urlArgs['icon'] != undefined && urlArgs['icon'] !== false;
}

/**
 * Special url arg to override any cached storage. Always restarts.
 * @returns true if this page's URL contains a restart argument (other than =false)
 */
export function isRestart() {
    return urlArgs['restart'] != undefined && urlArgs['restart'] !== false;
}

/**
 * Do we want to skip the UI that offers to reload?
 * @returns 
 */
export function forceReload(): boolean|undefined {
    if (urlArgs['reload'] != undefined) {
        return urlArgs['reload'] !== false;
    }
    return undefined;
}


type AbilityData = {
    notes?: boolean;
    checkMarks?: boolean;
    highlights?: boolean;
    decoder?: boolean;
    decoderMode?: string;
    dragDrop?: boolean;
    stamping?: boolean;
    straightEdge?: boolean;
    wordSearch?: boolean;
    hashiBridge?: boolean;
    subway?: boolean;
}

export type BoilerPlateData = {
    safari?: string;  // key for Safari details
    title?: string;
    qr_base64?: string;
    print_qr?: boolean;
    author?: string;
    copyright?: string;
    type?: string;  // todo: enum
    feeder?: string;
    lang?: string;  // en-us by default
    paperSize?: string;  // letter by default
    orientation?: string;  // portrait by default
    printAsColor?: boolean;  // true=color, false=grayscale, unset=unmentioned
    textInput?: boolean;  // false by default
    abilities?: AbilityData;  // booleans for various UI affordances
    pathToRoot?: string;  // By default, '.'
    validation?: object;  // a dictionary of input fields mapped to dictionaries of encoded inputs and encoded responses
    tableBuilder?: TableDetails;  // Arguments to table-generate the page content
    reactiveBuilder?: boolean;  // invoke the new reactive builder
    builderLookup?: object;  // a dictionary of javascript objects and/or pointers
    postBuild?: () => void;  // invoked after the builder is done
    preSetup?: () => void;
    postSetup?: () => void;
    googleFonts?: string;  // A list of fonts, separated by commas
    onNoteChange?: (inp:HTMLInputElement) => void;
    onInputChange?: (inp:HTMLInputElement) => void;
    onStampChange?: (newTool:string, prevTool:string) => void;
    onStamp?: (stampTarget:HTMLElement) => void;
    onRestore?: () => void;
}

const print_as_color = { id:'printAs', html:"<div style='color:#666;'>Print as <span style='color:#FF0000;'>c</span><span style='color:#538135;'>o</span><span style='color:#00B0F0;'>l</span><span style='color:#806000;'>o</span><span style='color:#7030A0;'>r</span>.</div>" };
const print_as_grayscale = { id:'printAs', text: "<div style='color:#666;'>Print as grayscale</div>"};

/**
 * Do some basic setup before of the page and boilerplate, before building new components
 * @param bp 
 */
function preSetup(bp:BoilerPlateData) {
    _rawHtmlSource = document.documentElement.outerHTML;
    const safariDetails = initSafariDetails(bp.safari);
    debugSetup();
    var bodies = document.getElementsByTagName('BODY');
    if (isIFrame()) {
        bodies[0].classList.add('iframe');
    }
    if (isPrint()) {
        bodies[0].classList.add('print');
    }
    if (isIcon()) {
        bodies[0].classList.add('icon');
    }
    if (bp.pathToRoot) {
        if (safariDetails.logo) { 
            safariDetails.logo = bp.pathToRoot + '/' + safariDetails.logo;
        }
        if (safariDetails.icon) { 
            safariDetails.icon = bp.pathToRoot + '/' + safariDetails.icon;
        }
        if (safariDetails.puzzleList) { 
            safariDetails.puzzleList = bp.pathToRoot + '/' + safariDetails.puzzleList;
        }
    }
}

interface CreateSimpleDivArgs {
    id?: string;
    cls?: string;
    text?: string;  // raw text, which will be entitized
    html?: string;  // html code
}
function createSimpleDiv({id, cls, text, html}: CreateSimpleDivArgs) : HTMLDivElement {
    let div: HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
    if (id !== undefined) {
        div.id = id;
    }
    if (cls !== undefined) {
        div.classList.add(cls);
    }
    if (text !== undefined) {
        div.appendChild(document.createTextNode(text));
    }
    else if (html !== undefined) {
        div.innerHTML = html;
    }
    return div;
}

interface CreateSimpleAArgs {
    id?: string;
    cls?: string;
    friendly: string;
    href: string;
    target?: string;
}
function createSimpleA({id, cls, friendly, href, target}: CreateSimpleAArgs) : HTMLAnchorElement {
    let a: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
    if (id !== undefined) {
        a.id = id;
    }
    if (cls !== undefined) {
        a.classList.add(cls);
    }
    a.innerHTML = friendly;
    a.href = href;
    a.target = target || '_blank';
    return a;
}

/**
 * Map puzzle types to alt text
 */
const iconTypeAltText = {
    'Word': 'Word puzzle',
    'Math': 'Math puzzle',
    'Rebus': 'Rebus puzzle',
    'Code': 'Features encodings',
    'Trivia': 'Trivia puzzle',
    'Meta': 'Meta puzzle',
    'Reassemble': 'Assembly'
}

/**
 * Create an icon appropriate for this puzzle type
 * @param data Base64 image data
 * @returns An img element, with inline base-64 data
 */
function createPrintQrBase64(data:string):HTMLImageElement {
    const qr = document.createElement('img');
    qr.id = 'qr';
    qr.src = 'data:image/png;base64,' + data;
    qr.alt = 'QR code to online page';
    return qr;
}

function getQrPath():string|undefined {
    const safariDetails = getSafariDetails();
    if (safariDetails.qr_folders) {
        const url = window.location.href;
        for (const key of Object.keys(safariDetails.qr_folders)) {
            if (url.indexOf(key) == 0) {
                const folder = safariDetails.qr_folders[key];
                const names = window.location.pathname.split('/');  // trim off path before last slash
                const name = names[names.length - 1].split('.')[0];  // trim off extension
                return folder + '/' + name + '.png';
            }
        }
    }
    return undefined;
}

function createPrintQr():HTMLImageElement|null {
    // Find relevant folder:
    const path = getQrPath();
    if (path) {
        const qr = document.createElement('img');
        qr.id = 'qr';
        qr.src = path;
        qr.alt = 'QR code to online page';
        return qr;
    }
    return null;
}

/**
 * Create an icon appropriate for this puzzle type
 * @param puzzleType the name of the puzzle type
 * @param icon_use the purpose of the icon
 * @returns A div element, to be appended to the pageWithinMargins
 */
function createTypeIcon(puzzleType:string, icon_use:string=''):HTMLDivElement {
    if (!icon_use) {
        icon_use = 'puzzle';
    }
    const iconDiv = document.createElement('div');
    iconDiv.id = 'icons';
    const icon = document.createElement('img');
    icon.id = 'icons-' + iconDiv.childNodes.length;
    icon.src = './Icons/' + puzzleType.toLocaleLowerCase() + '.png';
    icon.alt = iconTypeAltText[puzzleType] || (puzzleType + ' ' + icon_use);
    iconDiv.appendChild(icon);
    return iconDiv;
}

function boilerplate(bp: BoilerPlateData) {
    if (!bp) {
        return;
    }

    preSetup(bp)

    /* A puzzle doc must have this shape:
     *   <html>
     *    <head>
     *     <script>
     *      const boiler = { ... };        // Most fields are optional
     *     </script>
     *    </head>
     *    <body>
     *     <div id='pageBody'>
     *      // All page contents
     *     </div>
     *    </body>
     *   </html>
     *  
     * Several new objects and attibutes are inserted.
     * Some are univeral; some depend on boiler plate data fields.
     *   <html>
     *    <head></head>
     *    <body class='letter portrait'>            // new classes
     *     <div id='page' class='printedPage'>      // new layer
     *      <div id='pageWithinMargins'>            // new layer
     *       <div id='pageBody'>
     *        // All page contents
     *       </div>
     *       <div id='title'>[title]</div>          // new element
     *       <div id='copyright'>[copyright]</div>  // new element
     *       <a id='backlink'>Puzzle List</a>       // new element
     *      </div>
     *     </div>
     *    </body>
     *   </html>
     */

    if (bp.reactiveBuilder) {
        expandControlTags();
    }

    if (bp.tableBuilder) {
        constructTable(bp.tableBuilder);
    }

    const html:HTMLHtmlElement = document.getElementsByTagName('HTML')[0] as HTMLHtmlElement;
    const head:HTMLHeadElement = document.getElementsByTagName('HEAD')[0] as HTMLHeadElement;
    const body:HTMLBodyElement = document.getElementsByTagName('BODY')[0] as HTMLBodyElement;
    const pageBody:HTMLDivElement = document.getElementById('pageBody') as HTMLDivElement;

    if (bp.title) {
        document.title = bp.title;
    }
    
    html.lang = bp.lang || 'en-us';

    const safariDetails = getSafariDetails();
    for (let i = 0; i < safariDetails.links.length; i++) {
        addLink(head, safariDetails.links[i]);
    }

    const viewport = document.createElement('META') as HTMLMetaElement;
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1'
    head.appendChild(viewport);

    if (safariDetails.fontCss) {
        linkCss(safariDetails.fontCss);
    }
    let gFonts = bp.googleFonts;
    if (safariDetails.googleFonts) {
        gFonts = safariDetails.googleFonts + (gFonts ? (',' + gFonts) : '');
    }
    if (gFonts) {
        //<link rel="preconnect" href="https://fonts.googleapis.com">
        const gapis = {
            'rel': 'preconnect',
            'href': 'https://fonts.googleapis.com'
        };
        addLink(head, gapis);
        //<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        const gstatic = {
            'rel': 'preconnect',
            'href': 'https://fonts.gstatic.com',
            'crossorigin': ''
        };
        addLink(head, gstatic);

        const fonts = gFonts.split(',');
        const link = {
            'href': 'https://fonts.googleapis.com/css2?family=' + fonts.join('&family=') + '&display=swap',
            'rel': 'stylesheet'
        }
        addLink(head, link);
    }
    linkCss(safariDetails.cssRoot + 'PageSizes.css');
    linkCss(safariDetails.cssRoot + 'TextInput.css');
    if (!bp.paperSize) {
        bp.paperSize = 'letter';
    }
    if (!bp.orientation) {
        bp.orientation = 'portrait';
    }
    if (bp.paperSize.indexOf('|') > 0) {
        const ps = bp.paperSize.split('|');
        bp.paperSize = isPrint() ? ps[1] : ps[0];
    }
    toggleClass(body, bp.paperSize);
    toggleClass(body, bp.orientation);
    toggleClass(body, '_' + bp.safari);  // So event fonts can trump defaults

    const page: HTMLDivElement = createSimpleDiv({id:'page', cls:'printedPage'});
    const margins: HTMLDivElement = createSimpleDiv({cls:'pageWithinMargins'});
    body.appendChild(page);
    page.appendChild(margins);
    margins.appendChild(pageBody);
    margins.appendChild(createSimpleDiv({cls:'title', text:bp.title}));
    if (bp.copyright || bp.author) {
        margins.appendChild(createSimpleDiv({id:'copyright', text:'© ' + (bp.copyright || '') + ' ' + (bp.author || '')}));
    }
    if (safariDetails.puzzleList) {
        margins.appendChild(createSimpleA({id:'backlink', href:safariDetails.puzzleList, friendly:'Puzzle list'}));
    }
    if (bp.printAsColor !== undefined) {
        margins.appendChild(createSimpleDiv(bp.printAsColor ? print_as_color : print_as_grayscale));
    }

    if (safariDetails.icon) {
        // Set tab icon for safari event
        const tabIcon = document.createElement('link');
        tabIcon.rel = 'shortcut icon';
        tabIcon.type = 'image/png';
        tabIcon.href = safariDetails.icon;
        head.appendChild(tabIcon);
    }

    if (bp.qr_base64) {
        margins.appendChild(createPrintQrBase64(bp.qr_base64, ));
    }
    else if (bp.print_qr) {
        const qrImg = createPrintQr();
        if (qrImg) {
            margins.appendChild(qrImg);
        }
    }

    if (bp.type) {
        margins.appendChild(createTypeIcon(bp.type));
    }
    if (bp.feeder) {
        margins.appendChild(createTypeIcon(bp.feeder, 'feeder'));
    }

    // If the puzzle has a pre-setup method they'd like to run before abilities and contents are processed, do so now
    if (bp.preSetup) {
        bp.preSetup();
    }

    if (bp.textInput) {
        textSetup()
    }
    setupAbilities(head, margins, bp.abilities || {});

    if (bp.validation) {
        linkCss(safariDetails.cssRoot + 'Guesses.css');
        setupValidation();
    }


    if (!isIFrame()) {
        setTimeout(checkLocalStorage, 100);
    }
}

function debugPostSetup() {
    if (urlArgs['scan-layout'] != undefined) {
        const summary = summarizePageLayout();
        const json = JSON.stringify(summary);
        const comment = document.createComment(json);
        document.getRootNode().appendChild(comment);
    }
    if (urlArgs['compare-layout'] != undefined) {
        const after = summarizePageLayout();
        const root = document.getRootNode();
        for (let i = 0; i < root.childNodes.length; i++) {
            if (root.childNodes[i].nodeType == Node.COMMENT_NODE) {
                const comment = root.childNodes[i] as Comment;
                let commentJson = comment.textContent;
                if (commentJson) {
                    commentJson = commentJson.trim();
                    if (commentJson.substring(0, 7) == 'layout=') {
                        const before = JSON.parse(commentJson.substring(7)) as LayoutSummary;
                        const diffs = diffSummarys(before, after);
                        if (diffs.length > 0) {
                            renderDiffs(diffs);                            
                        }        
                        break;
                    }
                }
            }
        }
    }

}

function theHead(): HTMLHeadElement {
    return document.getElementsByTagName('HEAD')[0] as HTMLHeadElement;
}

function baseHref(): string {
    const bases = document.getElementsByTagName('BASE');
    for (let i = 0; i < bases.length; i++) {
        var href = bases[i].getAttribute('href');
        if (href) {
            return relHref(href, document.location.href || '');
        }
    }
    return document.location.href;
}

function relHref(path:string, fromBase?:string): string {
    const paths = path.split('/');
    if (paths[0].length == 0 || paths[0].indexOf(':') >= 0) {
        // Absolute path
        return path;
    }
    if (fromBase === undefined) {
        fromBase = baseHref();
    }
    const bases = fromBase.split('/');
    bases.pop();  // Remove filename at end of base path
    let i = 0;
    for (; i < paths.length; i++) {
        if (paths[i] == '..') {
            if (bases.length == 0 || (bases.length == 1 && bases[0].indexOf(':') > 0)) {
                throw new Error('Relative path beyond base: ' + path);
            }
            bases.pop();
        }
        else if (paths[i] != '.') {
            bases.push(paths[i]);
        }
    }
    return bases.join('/');
}

/**
 * Count-down before we know all delay-linked CSS have been loaded
 */
let cssToLoad = 1;

/**
 * Append any link tag to the header
 * @param head the head tag
 * @param det the attributes of the link tag
 */
export function addLink(head:HTMLHeadElement, det:LinkDetails) {
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(det.href);
    link.rel = det.rel;
    if (det.type) {
        link.type = det.type;
    }
    if (det.crossorigin != undefined) {
        link.crossOrigin = det.crossorigin;
    }
    if (det.rel.toLowerCase() == "stylesheet") {
        link.onload = function(){cssLoaded();};
        cssToLoad++;
    }
    head.appendChild(link);
}

const linkedCss = {};

/**
 * Append a CSS link to the header
 * @param relPath The contents of the link's href
 * @param head the head tag
 */
export function linkCss(relPath:string, head?:HTMLHeadElement) {
    if (relPath in linkedCss) {
        return;  // Don't re-add
    }
    linkedCss[relPath] = true;
    
    head = head || theHead();
    const link = document.createElement('link');
    link.href = relHref(relPath);
    link.rel = "Stylesheet";
    link.type = "text/css";
    link.onload = function(){cssLoaded();};
    cssToLoad++;
    head.appendChild(link);
}

/**
 * Each CSS file that is delay-linked needs time to load.
 * Decrement the count after each one.
 * When complete, call final setup step.
 */
function cssLoaded() {
    if (--cssToLoad == 0) {
        setupAfterCss(theBoiler());
    }
}

/**
 * For each ability set to true in the AbilityData, do appropriate setup,
 * and show an indicator emoji or instruction in the bottom corner.
 * Back-compat: Scan the contents of the <ability> tag for known emoji.
 */
function setupAbilities(head:HTMLHeadElement, margins:HTMLDivElement, data:AbilityData) {
    const safariDetails = getSafariDetails();
    let ability = document.getElementById('ability');
    if (ability != null) {
        const text = ability.innerText;
        if (text.search('✔️') >= 0) {
            data.checkMarks = true;
        }
        if (text.search('💡') >= 0) {
            data.highlights = true;
        }
        if (text.search('👈') >= 0) {
            data.dragDrop = true;
        }
        if (text.search('✒️') >= 0) {
            data.stamping = true;
        }
    }
    else {
        ability = document.createElement('div');
        ability.id = 'ability';
        margins.appendChild(ability);
    }
    let fancy = '';
    let count = 0;
    if (data.checkMarks) {
        setupCrossOffs();
        fancy += '<span id="check-ability" title="Click items to check them off">✔️</span>';
        count++;
    }
    if (data.highlights) {
        let instructions = "Ctrl+click to highlight cells";
        if (theBoiler()?.textInput) {
            instructions = "Type ` or ctrl+click to highlight cells";
        }
        fancy += '<span id="highlight-ability" title="' + instructions + '" style="text-shadow: 0 0 3px black;">💡</span>';
        setupHighlights();
        count++;
    }
    if (data.dragDrop) {
        fancy += '<span id="drag-ability" title="Drag & drop enabled" style="text-shadow: 0 0 3px black;">👈</span>';
        preprocessDragFunctions();
        indexAllDragDropFields();
        linkCss(safariDetails.cssRoot + 'DragDrop.css');
        count++;
    }
    if (data.stamping) {
        preprocessStampObjects();
        indexAllDrawableFields();
        linkCss(safariDetails.cssRoot + 'StampTools.css');
        // No ability icon
    }
    if (data.straightEdge) {
        fancy += '<span id="drag-ability" title="Line-drawing enabled" style="text-shadow: 0 0 3px black;">📐</span>';
        preprocessRulerFunctions(EdgeTypes.straightEdge, false);
        linkCss(safariDetails.cssRoot + 'StraightEdge.css');
        //indexAllVertices();
    }
    if (data.wordSearch) {
        fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">💊</span>';
        preprocessRulerFunctions(EdgeTypes.wordSelect, true);
        linkCss(safariDetails.cssRoot + 'WordSearch.css');
        //indexAllVertices();
    }
    if (data.hashiBridge) {
        // fancy += '<span id="drag-ability" title="word-search enabled" style="text-shadow: 0 0 3px black;">🌉</span>';
        preprocessRulerFunctions(EdgeTypes.hashiBridge, true);
        linkCss(safariDetails.cssRoot + 'HashiBridge.css');
        //indexAllVertices();
    }
    if (data.subway) {
        linkCss(safariDetails.cssRoot + 'Subway.css');
        // Don't setupSubways() until all styles have applied, so CSS-derived locations are final
    }
    if (data.notes) {
        setupNotes(margins);
        // no ability icon
    }
    if (data.decoder) {
        setupDecoderToggle(margins, data.decoderMode);
    }
    ability.innerHTML = fancy;
    ability.style.bottom = data.decoder ? '-32pt' : '-16pt';
    if (count == 2) {
        ability.style.right = '0.1in';
    }

    // Release our lock on css loading
    cssLoaded();
}

/**
 * All delay-linked CSS files are now loaded. Layout should be complete.
 * @param bp The global boilerplate
 */
function setupAfterCss(bp: BoilerPlateData) {
    if (bp.abilities) {
        if (bp.abilities.subway) {
            setupSubways();
        }
    }

    // If the puzzle has a post-setup method they'd like to run after all abilities and contents are processed, do so now
    if (bp.postSetup) {
        bp.postSetup();
    }

    debugPostSetup();
}


declare let boiler: BoilerPlateData | undefined;

/**
 * We forward-declare boiler, which we expect calling pages to define.
 * @returns The page's boiler, if any. Else undefined.
 */
function pageBoiler():BoilerPlateData | undefined {
    if (typeof boiler !== 'undefined') {
        return boiler as BoilerPlateData;
    }
    return undefined;
}

let _boiler: BoilerPlateData = {};

/**
 * Expose the boilerplate as an export
 * Only called by code which is triggered by a boilerplate, so safely not null
 */
export function theBoiler():BoilerPlateData {
    return _boiler;
}

export function testBoilerplate(bp:BoilerPlateData) {
    boilerplate(bp);
}

if (typeof window !== 'undefined') {
    window.onload = function(){boilerplate(pageBoiler()!)};  // error if boiler still undefined
}
