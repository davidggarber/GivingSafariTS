import { linkCss } from "./_boilerplate";
import { hasClass, isTag, toggleClass } from "./_classUtil";
import { ContextError } from "./_contextError";
import { getSafariDetails } from "./_events";

let scratchPad:HTMLDivElement;
let currentScratchInput:HTMLTextAreaElement|undefined = undefined;

export function setupScratch() {
    const page = (document.getElementById('page')
        || document.getElementsByClassName('printedPage')[0])  as HTMLElement;
    if (!page) {
        return;
    }

    scratchPad = document.createElement('div');
    scratchPad.id = 'scratch-pad';

    scratchPad.onclick = function(e) { scratchClick(e); }
    page.onclick = function(e) { scratchPageClick(e); }

    // const backDiv = document.createElement('div');
    // backDiv.id = 'scratch-background';

    // const transparent = document.createElement('img')

    page.appendChild(scratchPad);

    if (getSafariDetails()) {
        linkCss(getSafariDetails()?.cssRoot + 'ScratchPad.css');
    }
}

function scratchClick(evt:MouseEvent) {
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
    currentScratchInput.style.top = (evt.clientY - spRect.top - 5) + 'px';  
    currentScratchInput.style.width = (spRect.right - evt.clientX) + 'px';  // TODO: utilize right edge of scratch
    disableSpellcheck(currentScratchInput);
    currentScratchInput.title = 'Escape to exit note mode';

    currentScratchInput.onkeyup = function(e) { scratchTyped(e); }

    toggleClass(scratchPad, 'topmost', true);
    scratchPad.appendChild(currentScratchInput);
    currentScratchInput.focus();
}

function scratchPageClick(evt:MouseEvent) {
    if (evt.ctrlKey) {
        const targets = document.elementsFromPoint(evt.clientX, evt.clientY);

        for (let i = 0; i < targets.length; i++) {
            const target = targets[i] as HTMLElement;
            if (hasClass(target as Node, 'scratch-div')) {
                scratchRehydrate(target as HTMLDivElement);
                return;
            }
            if (target.id == 'scratch-pad') {
                scratchClick(evt);
                return;
            }
            if (isTag(target, 'input') || isTag(target, 'textarea')) {
                return;  // Don't steal clicks from inputs
            }
            if (target.id != 'page' && target.onclick) {
                return;  // Don't steal clicks from anything else with a click handler
            }
        }

    }
}

function disableSpellcheck(elmt:Element) {
    elmt.setAttribute('spellCheck', 'false');
    elmt.setAttribute('autoComplete', 'false');
    elmt.setAttribute('autoCorrect', 'false');
    elmt.setAttribute('autoCapitalize', 'false');
}

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
function scratchResize(ta: HTMLTextAreaElement) {
    const lines = 1 + (ta.value || '').split('\n').length;
    ta.setAttributeNS('', 'rows', lines.toString());
}

function scratchFlatten() {
    if (!currentScratchInput) {
        return;
    }
    toggleClass(scratchPad, 'topmost', false);

    const text = currentScratchInput!.value.trimEnd();
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

        const rect = currentScratchInput!.getBoundingClientRect();
        const spRect = scratchPad.getBoundingClientRect();

        div.style.left = currentScratchInput!.style.left;  
        div.style.top = currentScratchInput!.style.top;  
        div.style.maxWidth = currentScratchInput!.style.width;
        div.style.maxHeight = rect.height + 'px';

        currentScratchInput!.parentNode!.append(div);
    }
    currentScratchInput!.parentNode!.removeChild(currentScratchInput!);
    currentScratchInput = undefined;
}

function scratchRehydrate(div:HTMLDivElement) {
    if (!hasClass(div, 'scratch-div')) {
        return;
    }

    const ta = document.createElement('textarea');
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
    ta.value = text;

    const rcSP = scratchPad.getBoundingClientRect();
    const rcD = div.getBoundingClientRect();

    ta.style.left = div.style.left;  
    ta.style.top = div.style.top;  
    ta.style.width = (rcSP.right - rcD.left) + 'px';
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
