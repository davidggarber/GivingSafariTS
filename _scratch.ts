import { linkCss } from "./_boilerplate";
import { hasClass, isTag, toggleClass } from "./_classUtil";
import { getSafariDetails } from "./_events";
import { saveScratches } from "./_storage";

let scratchPad:HTMLDivElement|undefined = undefined;
let currentScratchInput:HTMLTextAreaElement|undefined = undefined;

/**
 * Setup a scratch pad that is the same size as the page.
 */
export function setupScratch() {
    const page = (document.getElementById('page')
        || document.getElementsByClassName('printedPage')[0])  as HTMLElement;
    if (!page) {
        return;
    }

    scratchPad = document.createElement('div');
    scratchPad.id = 'scratch-pad';

    scratchPad.addEventListener('click', function (e) { scratchPadClick(e); } );
    page.addEventListener('click', function (e) { scratchPageClick(e); } );
    window.addEventListener('blur', function (e) { scratchFlatten(); } );

    page.appendChild(scratchPad);

    if (getSafariDetails()) {
        linkCss(getSafariDetails()?.cssRoot + 'ScratchPad.css');
    }
}

/**
 * Click on the scratch pad (which is normally in the background).
 * If ctrl+click, start a new note.
 * Otherwise, flatten the current note.
 * @param evt 
 * @returns 
 */
function scratchClick(evt:MouseEvent) {
    if (!scratchPad) { return; }

    if (currentScratchInput && currentScratchInput !== evt.target) {
        scratchFlatten();
    }

    if (evt.target && hasClass(evt.target as Node, 'scratch-div')) {
        scratchRehydrate(evt.target as HTMLDivElement);
        return;
    }
   
    if (!evt.ctrlKey) {
        // One way to leave scratch mode is to click away
        return;
    }

    const spRect = scratchPad.getBoundingClientRect();

    currentScratchInput = document.createElement('textarea');

    // Position the new textarea where its first character would be at the click point
    currentScratchInput.style.left = (evt.clientX - spRect.left - 5) + 'px';  
    currentScratchInput.style.top = (evt.clientY - spRect.top - 10) + 'px';  
    currentScratchInput.style.width = Math.min(spRect.right - evt.clientX, spRect.width / 3) + 'px';
    disableSpellcheck(currentScratchInput);
    currentScratchInput.title = 'Escape to exit note mode';

    currentScratchInput.onkeyup = function(e) { scratchTyped(e); }

    toggleClass(scratchPad, 'topmost', true);
    scratchPad.appendChild(currentScratchInput);
    currentScratchInput.focus();
}

function scratchPadClick(evt:MouseEvent) {
    if (!evt.ctrlKey) {
        if (evt.target != currentScratchInput) {
            scratchFlatten();
        }
    }
}

/**
 * Callback when the top-level page is clicked.
 * If it's a ctrl+click, try to create a scratch note at that point.
 * @param evt The mouse event
 */
function scratchPageClick(evt:MouseEvent) {
    if (evt.ctrlKey) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);
        let underScratch = false;

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i] as HTMLElement;
            if (hasClass(target as Node, 'scratch-div')) {
                scratchRehydrate(target as HTMLDivElement);
                return;
            }
            if (target.id === 'scratch-pad') {
                underScratch = true;
                continue;
            }
            if (isTag(target, 'a')) {
                if (underScratch) {
                    // The scratch pad is covering a link. Invoke it.
                    target.click();
                    return;
                }
            }

            if (isTag(target, ['input', 'textarea', 'select', 'a'])) {
                return;  // Don't steal clicks from form fields or links
            }
            if (hasClass(target, 'cross-off')) {
                continue;  // checkmarks react to click, not ctrl+click
            }
            if (target.id != 'page' && target.onclick) {
                return;  // Don't steal clicks from anything else with a click handler
            }
        }

        // We haven't deferred to other controls, so invoke scratch notes
        scratchClick(evt);

    }
}

/**
 * Disable all squigglies from the note surface. They are distracting.
 * @param elmt A newly created TextArea
 */
function disableSpellcheck(elmt:Element) {
    elmt.setAttribute('spellCheck', 'false');
    elmt.setAttribute('autoComplete', 'false');
    elmt.setAttribute('autoCorrect', 'false');
    elmt.setAttribute('autoCapitalize', 'false');
}

/**
 * Callback when the user types in the active textarea.
 * Ensures that the textarea stays correctly sized.
 * Exits scratch mode on Escape.
 * @param evt The keyboard event
 */
function scratchTyped(evt:KeyboardEvent) {
    if (!evt.target) {
        return;  // WTF?
    }
    if (evt.code == 'Escape') {
        scratchFlatten();
        return;
    }

    scratchResize(evt.target as HTMLTextAreaElement);
}

/**
 * Ensure that the active textarea is big enough for all its rows of text
 * @param ta The active textarea
 */
function scratchResize(ta: HTMLTextAreaElement) {
    const lines = 1 + (ta.value || '').split('\n').length;
    ta.setAttributeNS('', 'rows', lines.toString());
}

/**
 * Convert the active textarea to a flattened div
 * The textarea will be removed, and the new div added to the scratchPad.
 */
function scratchFlatten() {
    if (!scratchPad || !currentScratchInput) { return; }

    toggleClass(scratchPad, 'topmost', false);

    const text = currentScratchInput!.value.trimEnd();
    if (text) {
        const rect = currentScratchInput!.getBoundingClientRect();
        scratchCreate(parseInt(currentScratchInput!.style.left), 
            parseInt(currentScratchInput!.style.top),
            parseInt(currentScratchInput!.style.width), 
            rect.height,
            text
        );
    }
    currentScratchInput!.parentNode!.removeChild(currentScratchInput!);
    currentScratchInput = undefined;

    saveScratches(scratchPad);
}

/**
 * Convert the <div> HTML contents to text appropriate for a textarea or storage
 * @param div A flattened scratch note
 * @returns A string of lines of notes with \n line breaks
 */
export function textFromScratchDiv(div:HTMLDivElement):string {
    let text = '';
    for (let i = 0; i < div.childNodes.length; i++) {
        const child = div.childNodes[i];
        if (child.nodeType == Node.TEXT_NODE) {
            text += (child as Text).textContent;
        }
        else if (child.nodeType == Node.ELEMENT_NODE && isTag(child as Element, 'br')) {
            text += '\n';
        }
        else {
            console.log('Unexpected contents of a scratch-div: ' + child);
        }
    }
    return text;
}

/**
 * Convert a flattened div back to a textarea in the same location
 * @param div A flattened div, which will be removed, and replaced
 */
function scratchRehydrate(div:HTMLDivElement) {
    if (!scratchPad || !hasClass(div, 'scratch-div')) {
        return;
    }

    const ta = document.createElement('textarea');
    ta.value = textFromScratchDiv(div);
    ta.addEventListener('blur', function (e) { scratchFlatten(); } );

    const rcSP = scratchPad.getBoundingClientRect();
    const rcD = div.getBoundingClientRect();

    ta.style.left = div.style.left;  
    ta.style.top = div.style.top;  
    ta.style.width = Math.min(rcSP.width / 3, rcSP.right - rcD.left) + 'px';
    disableSpellcheck(ta);
    ta.title = 'Escape to exit note mode';

    scratchResize(ta);
    ta.onkeyup = function(e) { scratchTyped(e); }

    toggleClass(scratchPad, 'topmost', true);

    div.parentNode!.append(ta);
    div.parentNode!.removeChild(div);
    currentScratchInput = ta;
    ta.focus();
}

/**
 * Wipe away all scratches
 */
export function scratchClear() {
    if (!scratchPad) { return; }

    if (currentScratchInput) {
        currentScratchInput.parentNode!.removeChild(currentScratchInput);
        currentScratchInput = undefined;
    }
    const divs = scratchPad.getElementsByClassName('scratch-div');
    for (let i = divs.length - 1; i >= 0; i--) {
        scratchPad.removeChild(divs[i]);
    }
}

/**
 * Create a scratch div
 * @param x The client-x of the div
 * @param y The client-y of the div
 * @param width The (max) width of the div
 * @param height The (max) height of the div
 * @param text The text contents, as they would come from a textarea, with \n
 */
export function scratchCreate(x:number, y:number, width:number, height:number, text:string) {
    if (!scratchPad) { return; }

    if (text) {
        const div = document.createElement('div');
        toggleClass(div, 'scratch-div', true);

        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (i > 0) {
                div.appendChild(document.createElement('br'));
            }
            div.appendChild(document.createTextNode(lines[i]));
        }

        div.style.left = x + 'px';
        div.style.top = y + 'px';
        div.style.maxWidth = width + 'px';
        div.style.maxHeight = height + 'px';

        scratchPad.append(div);
    }
}