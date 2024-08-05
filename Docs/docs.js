function selectCode(code, evt) {
  var sel = window.getSelection();
  if (sel.anchorNode == code.firstChild) {
    var range = new Range();
    range.setStart(code.firstChild, 0);
    range.setEnd(code.firstChild, code.innerText.length);
    sel.empty();
    sel.addRange(range);
  }
}

function selectCodeBlock(code, evt) {
  if (evt.detail == 3) {
    var sel = window.getSelection();
    var range = new Range();
    range.setStart(code.firstChild, 0);
    range.setEnd(code, code.childNodes.length);
    sel.empty();
    sel.addRange(range);
  }
}

function toggleCss(cls) {
  toggleClass(document.getElementsByTagName('body')[0], cls);
}