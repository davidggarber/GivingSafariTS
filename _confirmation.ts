import { theBoiler } from "./_boilerplate";
import { getOptionalStyle, isTag, toggleClass } from "./_classUtil";

/**
 * Response codes for different kinds of responses
 */
const ResponseType = {
    Error: 0,
    Correct: 1,  // aka solved
    Confirm: 2,  // confirm an intermediate step
    Hint: 3,     // a wrong guess that deserves a hint
    Unlock: 4,   // offer players a link to a hidden page
    Load: 5,     // load another page in a hidden iframe
//    Save: 6,     // write a key/value directly to storage
};

/**
 * CSS classes for each response type
 */
const ResponseTypeClasses = [
    'rt-error',
    'rt-correct',
    'rt-confirm',
    'rt-hint',
    'rt-unlock',
    'rt-load',
//    'rt-save',
];

/**
 * The generic response for unknown submissions
 */
const no_match_response = "0";

/**
 * Default response text, if the validation block only specifies a type
 */
const default_responses = [
    "Incorrect",    // Error
    "Correct!",     // Correct
    "Confirmed",    // Confirmation
    "Keep going",   // Hint
];

/**
 * img src= URLs for icons to further indicate whether guesses were correct or not
 */
const response_img = [
    "../Css/X.png",         // Error
    "../Css/Check.png",     // Correct
    "../Css/Thumb.png",     // Confirmation
    "../Css/Thinking.png",  // Hint
    "../Css/Unlocked.png",  // Navigate
];

/**
 * This puzzle has a validation block, so there must be either a place for the
 * player to propose an answer, or an automatic extraction for other elements.
 */
export function setupValidation() {
    const buttons = document.getElementsByClassName('validater');
    if (buttons.length > 0) {
        let hist = getHistoryDiv('');
        if (!hist) {
            // Create a standard <div id="guess-log"> to track the all guesses
            const log = document.createElement('div');
            log.id = 'guess-log';
            const div = document.createElement('div');
            div.id = 'guess-history';
            const span = document.createElement('span');
            span.id = 'guess-titlebar';
            span.appendChild(document.createTextNode('Guesses'));
            log.appendChild(span);
            log.appendChild(div);
            document.getElementById('pageBody')?.appendChild(log);
        }
    }
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLElement;
        if (isTag(btn, 'button')) {
            btn.onclick=function(e){clickValidationButton(e)};
        }
    }
}

function getHistoryDiv(id:string): HTMLDivElement {
    return document.getElementById('guess-history') as HTMLDivElement;
}

/**
 * The user has clicked a "Submit" button next to their answer.
 * @param evt The click event on the button
 * The button can have parameters pointing to the extraction.
 */
function clickValidationButton(evt:MouseEvent) {
    const id = getOptionalStyle(evt.target as Element, 'data-extracted-id', 'extracted');
    if (!id) {
        return;
    }
    const ext = document.getElementById(id);
    if (!ext) {
        return;
    }

    const hist = getHistoryDiv(id);

    let value = ext.getAttribute('data-extraction');
    if (!value) {
        if (isTag(ext, 'input')) {
            value = (ext as HTMLInputElement).value;
        }    
    }
    if (value) {
        decodeAndValidate(id, value, hist);
    }
}

/**
 * Validate a user's input against the encoded set of validations
 * @param key the input field that is being validated
 * @param value the user's submission (possibly an aggregation of sub-components)
 * @package hist the container to track the history of guesses
 */
function decodeAndValidate(key: string, value: string, hist:HTMLDivElement) {
    const validation = theBoiler().validation;
    if (validation && key in validation) {
        const obj = validation[key];
        const hash = rot13(value);  // TODO: more complicated hashing
        const block = appendGuess(hist, value);
        if (hash in obj) {
            const encoded = obj[hash];
            // TODO: decode
            const decoded = encoded;
    
            // Guess was expected. It may have multiple responses.
            const multi = decoded.split('|');
            for (let i = 0; i < multi.length; i++) {
                appendResponse(block, multi[i]);
            }
        }
        else {
            // Guess does not match any hashes
            appendResponse(block, no_match_response);
        }
        // TODO: cache guesses. Don't need to cache responses
    }
}

/**
 * Build a guess/response block, initialized with the guess
 * @param hist The container
 * @param guess The user's guess
 * @returns The block, to which responses can be appended
 */
function appendGuess(hist:HTMLDivElement, guess:string): HTMLDivElement {
    const block = document.createElement('div');
    block.classList.add('rt-block');

    // TODO: ask hist for rules abour rendering key
    const div = document.createElement('div');
    div.classList.add('rt-guess');
    div.appendChild(document.createTextNode(guess));

    const now = new Date();
    const time = now.getHours() + ":" 
        + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes() + ":"
        + (now.getSeconds() < 10 ? "0" : "") + now.getSeconds();
    const span = document.createElement('span');
    span.classList.add('rt-time');
    span.appendChild(document.createTextNode(time));
    div.appendChild(span);
    block.appendChild(div);

    hist.insertAdjacentElement('afterbegin', block);

    return block;
}

/**
 * Append a response to a guess block.
 * @param block The div containing the guess, and any other responses to the same guess
 * @param response The response, prefixed with the response type
 * The type is pulled off, and dictates the formatting.
 * Some types have side-effects, in addition to text.
 * If the response is only the type, pre-canned text is used instead.
 */
function appendResponse(block:HTMLDivElement, response:string) {
    const type = parseInt(response[0]);
    response = response.substring(1);
    if (response.length == 0 && type < default_responses.length) {
        response = default_responses[type];
    }
    else {
        response = rot13(response);
    }

    const div = document.createElement('div');
    div.classList.add('response');
    div.classList.add(ResponseTypeClasses[type]);

    if (type == ResponseType.Unlock) {
        // Create a link to a newly unlocked page.
        // The (decrypted) response is either just a URL, 
        // or else URL^Friendly (separated by a caret)
        const caret = response.indexOf('^');
        const friendly = caret < 0 ? response : response.substring(caret + 1);
        if (caret >= 0) {
            response = response.substring(0, caret);
        }
        const parts = response.split('^');  // caret now allowed in a URL
        div.appendChild(document.createTextNode('You have unlocked '));
        const link = document.createElement('a');
        link.href = response;
        link.target = '_blank';
        link.appendChild(document.createTextNode(friendly));
        div.appendChild(link);
    }
    else if (type == ResponseType.Navigate) {
        // Use an iframe to navigate immediately to the response URL.
        // The iframe will be hidden, but any scripts will run immediately.
        const iframe = document.createElement('iframe');
        iframe.src = response;
        div.appendChild(iframe);
    }
    else {
        // The response (which may be canned) is displayed verbatim.
        div.appendChild(document.createTextNode(response));
    }

    if (type < response_img.length) {
        const img = document.createElement('img');
        img.classList.add('rt-img');
        img.src = response_img[type];
        div.appendChild(img);    
    }

    block.appendChild(div);

    if (type == ResponseType.Correct) {
        // Tag this puzzle as solved
        toggleClass(document.getElementsByTagName('body')[0], 'solved', true);
        // TODO: cache that the puzzle is solved, to be indicated in tables of contents
    }
}

/**
 * Rot-13 cipher, maintaining case.
 * Chars other than A-Z are preserved as-is
 * @param source Text to be encoded, or encoded text to be decoded
 */
function rot13(source:string) {
    let rot = '';
    for (var i = 0; i < source.length; i++) {
        const ch = source[i];
        let r = ch;
        if (ch >= 'A' && ch <= 'Z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 52) % 26) + 65);
        }
        else if (ch >= 'a' && ch <= 'z') {
            r = String.fromCharCode(((ch.charCodeAt(0) - 84) % 26) + 97);
        }
        rot += r;
    }
    return rot;
}

/**
 * Calculate the 256-bit (32-byte) SHA hash of any input string
 * @param source An input string
 * @returns A 32-character string
 */
// async function sha256(source) {
//     const sourceBytes = new TextEncoder().encode(source);
//     const digest = await window.crypto.subtle.digest("SHA-256", sourceBytes);
//     const resultBytes = [...new Uint8Array(digest)];
//     return resultBytes.map(x => x.toString(16).padStart(2, '0')).join("");
// }
