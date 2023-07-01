/**
 * Convert the start tag of some element into entitized and formatted HTML
 */
function friendlyStartTag(elmt) {
  var str = elmt.outerHTML;
  str = str.substr(0, str.length - elmt.tagName.length - elmt.innerHTML.length);
  str = str.replaceAll('<', "&lt;");
  str = str.replaceAll('" ', "&quot;<br>&nbsp;");
  str = str.replaceAll('"', "&quot;");
  return str;
}

/**
 * Copy the value of an attribute into an input field of the same name.
 * @param elmt The element with the attribute
 * @param id Both the name of the attribute and the id of the input
 */
function attr2Input(elmt, id) {
  var val = elmt.getAttributeNS('', id);
  if (!val) {
    val = '';
  }
  document.getElementById(id).value = val;
}

/**
 * Copy the value of an input field into an attribute of the same name.
 * However if the input is blank, remove the attribute entirely.
 * @param elmt The element with the attribute
 * @param id Both the name of the attribute and the id of the input
 */
function input2Attr(elmt, id) {
  var val = document.getElementById(id).value;
  if (val.length == 0) {
    elmt.removeAttributeNS('', id);
  }
  else {
    elmt.setAttributeNS('', id, document.getElementById(id).value);
  }
}

/**
 * Copy the contents of a button into the nearby input field.
 * The destination must be the first input in the current table row.
 * @param btn The button element
 */
function quickBtn(btn) {
  var val = btn.innerText;
  if (val.startsWith('unset')) {
    val = '';
  }
  var tr = btn.parentNode.parentNode;
  var input = tr.getElementsByTagName('input')[0];
  input.value = val;
}

/**
 * Reflect a checkbox to the presence or absence of a CSS class.
 * If checked, add the class. If unchecked, remove the class.
 * @param elmt An element to which the CSS class may be applied
 * @param id Both the name of the class and the id of the checkbox
 * @param cls Optional: When present, the class is differently named than the checkbox id
 */
function check2Class(elmt, id, cls) {
  var chk = document.getElementById(id);
  if (chk.checked) {
    elmt.classList.add(cls || id);
  }
  else {
    elmt.classList.remove(cls || id);
  }
}

/**
 * Reflect the presence of a class onto a checkbox.
 * If present, check the box. If absent, make unchecked.
 * @param elmt An element to which the CSS class may be applied
 * @param id Both the name of the class and the id of the checkbox
 * @param cls Optional: When present, the class is differently named than the checkbox id
 */
function class2Check(elmt, id, cls) {
  var chk = document.getElementById(id);
  chk.checked = elmt.classList.contains(cls || id);
}
