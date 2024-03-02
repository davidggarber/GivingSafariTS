import { linkCss } from "./_boilerplate";

/**
 * Find a template that matches an ID.
 * Could be on the local page, or a built-in one
 * @param tempId The ID of the template (must be valid)
 * @returns An HTMLTemplateElement, or throws
 */
export function getTemplate(tempId:string) :HTMLTemplateElement {
  if (tempId) {
    let elmt = document.getElementById(tempId);
    if (elmt) {
      return elmt as HTMLTemplateElement;
    }
    const template = builtInTemplate(tempId);
    if (template) {
      return template;
    }
  }
  throw new Error('Unresolved template ID: ' + tempId);
}

/**
 * Match a template name to a built-in template object
 * @param tempId The ID
 * @returns A template element (not part of the document), or undefined if unrecognized.
 */
export function builtInTemplate(tempId:string) :HTMLTemplateElement|undefined {
  if (tempId == 'paintByNumbers') {
    return paintByNumbersTemplate();
  }
};

/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByNumbersTemplate() :HTMLTemplateElement {
  linkCss('../Css/PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'paintByNumbers';
  temp.innerHTML = 
  '<table_ class="paint-by-numbers bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">' +
    '<thead_>' +
      '<tr_ class="pbn-col-headers">' +
        '<th_ class="pbn-corner">&nbsp;</th_>' +
        '<for each="col" in="colGroups">' +
          '<td_ class="pbn-col-header">' +
            '<for each="group" in="col"><span class="pbn-col-group">{.group}</span></for>' +
          '</td_>' +
        '</for>' +
      '</tr_>' +
    '</thead_>' +
    '<for each="row" in="rowGroups">' +
      '<tr_ class="pbn-row">' +
        '<td_ class="pbn-row-header">' +
          '<for each="group" in="row"><span class="pbn-row-group">{.group}</span></for>' +
        '</td_>' +
        '<for each="col" in="colGroups">' +
          '<td_ id="{row#}_{col#}" class="pbn-cell stampable">&times;</td_>' +
        '</for>' +
        '<td_ class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></td_>' +
      '</tr_>' +
    '</for>' +
    '<tfoot_>' +
      '<tr_ class="pbn-col-footer">' +
        '<th_ class="pbn-corner">&nbsp;</th_>' +
        '<for each="col" in="colGroups">' +
          '<td_ class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></td_>' +
        '</for>' +
      '</tr_>' +
    '</tfoot_>' +
  '</table_>';
  return temp;
}