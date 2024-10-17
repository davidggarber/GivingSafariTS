# Embedding answer validation into puzzles

In the script block of the page, add a "validation" field, with a relatively complicated object structure.
For example:
> const boiler = {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;...<br>
  &nbsp;&nbsp;&nbsp;&nbsp;"validation" : {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"extracted" : {<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Correct" : "1",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Confirm" : "2Yes 'confirm' is present",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Partial" : "3Keep going",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Unlock" : "4path/to/file.htm^title",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Load" : "5path/to/url",<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Show" : "6elmt_id^class"<br>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
  &nbsp;&nbsp;&nbsp;&nbsp;}<br>
  };

Most of the fields are optional. And must are also ROT-encoded (so they don't look like this example).  
It is generally easier to create one using the [validation-generator page](../Samples/Validate.html).

## Guesses area

Any page that contains a "validation" object will automatically get a guesses area below the main puzzle page (but not printed).  
Any guesses the player submits are recorded here, along with the responses.  
Furthermore, if the correct answer is guessed, the entire puzzle's background will turn green.

## Identify the field to be validated

The top-level field of the "validation" object is the ID of the element containing the text to validate. In this example, "_extracted_".  
Usually an input field, but it can also be a container of input fields, which will then be concatenated.  
In the unusual case where multiple submittable inputs are present on the page, each can have their own block.

## List potential submissions

These are case-, whitespace-, and punctuation-insensitive.  
List each as its own attribute within the identity object. The text must be [ROT-13 encoded](https://www.decrypt.fun/RotCipher.html).  
The value of each attribute must start with a digit, indicating the consequences of the user submitting that value.
1. Correct answers. This puzzle will be marked as SOLVED.
2. Correct elements within the puzzle, when such confirmation is desirable.
3. Partial/intermediate answers, where the player is on the right path, and needs to do an additional step.
4. Tell the player that their answer has unlocked some other puzzle or piece.
5. Silently loads a script in an iframe, generally to implement the above-mentioned unlocking.
6. Causes an on-page element of this page to become visible or otherwise change appearance.

Codes 1-4 will give the player feedback. Each has a default message, but the puzzle can prescribe a custom message in the text after the code.  
Codes 5 & 6 have silent side-effects. No message. Those side effects require arguments that must be listed after the code.  
All text after the code must also be [ROT-13 encoded](https://www.decrypt.fun/RotCipher.html).  
Code | Default message | Customization format | Customization effect
-----|-----------------|----------------------|----------------------
1 | Correct! | Free-form text | Replaces default message
2 | Confirmed | Free-form text | Replaces default message
3 | Keep going | Free-form text | Replaces default message
4 | You have unlocked \___ | URL^Friendly | \___ replaced with link, optionally with friendly name
5 | _no message_ | URL | That URL is loaded immediately, in an iframe
6 | _no message_ | ID^classes | The element with that ID gets those classes applied<br>Or if no classes specified, display is changed to _block_, presumably from _none_

A single submission string can be associate with multiple effects. Usually #1 and some group of #4-6.  
Combine these into a single value, separated by the vertical |.

## Examples

`"validation":{"final-answer":{"NCCYR":"1"}}`
* The input field's ID is "_final-answer_"
* The correct answer (code=1) is _APPLE_, which has been written in ROT-13.

`"validation":{"final-answer":{"NCCYR":"1|6tbyq-fgne"}}`
* Same as above, but in addition to being the correct answer to the puzzle...
* _APPLE_ will also cause a page element with ID=_gold-star_ to show. (_tbyq-fgne_ is ROT-13 for _gold-star_)

`"validation":{"final-answer":{"LRYYBJSEHVG":"3","ONANAN":"1Oenib!"}}`
* _YELLOW FRUIT_ is an intermediate answer (code=3). Note: spaces don't matter (_LRYYBJSEHVG_ == _YELLOWFRUIT_)
* _BANANA_ is the final answer (code=1). And for some reason, rather than the message "Correct!", this will instead say "Bravo!" (_Oenib!_ in ROT-13)

`"validation":{"input1":{"NCCYR":"2"},"input2":{"ONANAN":"2"}}`
* Two fields have field-level confirmation (code=2).
* Input1's correct value is _APPLE_.
* Input2's correct value is _BANANA_.
* Neither is the final puzzle answer (code=1).

`"validation":{"final-answer":{"NCCYR":"1|4zrgn-cvrpr-1.ugzy^cvrpr1|5zrgn-cvrpr.ugzy"}}`
* _APPLE_ has three different side-effects...
* Tells the player "Correct!" (code=1), and marks the puzzle as solved.
* Tells the player "You have unlocked _piece1_" (code=4). _piece1_ is a link, pointing at "meta-piece-1.html".
* Loads _meta-piece-1.html_ in a hidden iframe, causing scripts to run that inject that piece's information into its associated meta puzzle.

# Submit button

The page needs a submit button. Presumably, next to the input or extracted text fields.  
Optionally, the submit button can be hidden until a valid submission is present.

For a free-form input field:
> `<div class="no-print">`<br>
> &nbsp;&nbsp;&nbsp;&nbsp;`Answer:<br><input id="final-answer" type="text"></input>`<br>
> &nbsp;&nbsp;&nbsp;&nbsp;`<button class="validater" id="submit-answer" data-extracted-id="final-answer">Submit</button>`<br>
> `</div>`
* The containing \<div> has class="no-print", because this field should be left off when printed.
* The input is called '_final-answer_', corresponding to the validation identities in many of the above examples.
* The submit button's class is "_validater_", which automatically hooks it up to the validation mechanism.
* _data-extracted-id="final-answer"_ means that the button will be hidden until the user types something in that input.

To submit text that is extracted from other puzzle elements:
> `<div id="extract-and-submit">`<br>
> &nbsp;&nbsp;&nbsp;&nbsp;`<span id="extracted" data-number-pattern="15" data-show-ready="submit-extracted"></span>`<br>
> &nbsp;&nbsp;&nbsp;&nbsp;`<button class="validater" id="submit-extracted" data-extracted-id="extracted">Submit</button>`<br>
> `</div>`
* The containing div does not need no-print, because it's input is supposed to be printed. The submit button won't be.
* The "extracted" span will contain 15 inputs (generated by the pattern).<br>By defining the parent span as the extraction, those will be concatenated into the submission.
* The button and extraction are hooked together in both directions (_data-show-ready_ on the latter, and _data-extracted-id_ on the former), to cause button to only appear when a full 15-letter extraction is present.

# Validation generator

It's a pain to get all of the fields exactly right. Better to use the [validation generator page](../Samples/Validate.html).

1. Specify the name of the input field or extraction parent.  
2. Fill in the possible guesses, and select the response type.
3. If appropriate, add custom response text, according to the rules for each response type.
4. If a single answer has multiple responses, list them consecutively.
5. If additional fields have separately validation, check "New field" for the first such field.<br>There is no UI to name the additional fields, so this tool names them name2, name3, etc.<br>Because the names are not ROT-encoded, this is easy to edit manually later.
6. See the resulting JSON object in the blue box labeled _Copy this into your boilerplate_.
7. ___Copy that JSON exactly into your puzzle's boiler object.___
8. If you want to come back later, to edit a puzzle's validation, first paste its validation block into the green "_Import JSON_" box.<br>Paste exactly the same range as you copy/pasted in step 7. It should start with `"validation":` and end with two `}}`.
9. Test each answer in the "_Try it!_" area at the bottom of the page, and see the responses in the _Guesses_ area below.
