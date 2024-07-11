import { linkCss } from "./_boilerplate";
import { getSafariDetails } from "./_events";

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

const builtInTemplates = {
  paintByNumbers: paintByNumbersTemplate,
  paintByColorNumbers: paintByColorNumbersTemplate,
  classStampPalette: classStampPaletteTemplate,
  classStampNoTools: classStampNoToolsTemplate,
}

/**
 * Match a template name to a built-in template object
 * @param tempId The ID
 * @returns A template element (not part of the document), or undefined if unrecognized.
 */
export function builtInTemplate(tempId:string) :HTMLTemplateElement|undefined {
  if (tempId in builtInTemplates) {
    return builtInTemplates[tempId]();
  }
};

/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByNumbersTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'paintByNumbers';
  temp.innerHTML = 
  `<table_ class="paint-by-numbers stampable-container stamp-drag bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
    <thead_>
      <tr_ class="pbn-col-headers">
        <th_ class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br>(aka paint-by-numbers).<br>
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br>
              <img src="../Images/Intro/pbn.png">
            </a>
          </span>
        </th_>
        <for each="col" in="colGroups">
          <td_ id="colHeader-{col#}" class="pbn-col-header">
            <for each="group" in="col"><span class="pbn-col-group" onclick="togglePbnClue(this)">{.group}</span></for>
          </td_>
        </for>
        <th_ class="pbn-row-footer pbn-corner">&nbsp;</th_>
      </tr_>
    </thead_>
    <for each="row" in="rowGroups">
      <tr_ class="pbn-row">
        <td_ id="rowHeader-{row#}" class="pbn-row-header">
          &hairsp; <for each="group" in="row"><span class="pbn-row-group" onclick="togglePbnClue(this)">{.group}</span> </for>&hairsp;
        </td_>
        <for each="col" in="colGroups">
          <td_ id="{row#}_{col#}" class="pbn-cell stampable">&times;</td_>
        </for>
        <td_ class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></td_>
      </tr_>
    </for>
    <tfoot_>
      <tr_ class="pbn-col-footer">
        <th_ class="pbn-corner">&nbsp;</th_>
        <for each="col" in="colGroups">
          <td_ class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></td_>
        </for>
        <th_ class="pbn-corner-validation">
          ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ
          <br>←&nbsp;validation</th_>
      </tr_>
    </tfoot_>
  </table_>`;
  return temp;
}

/**
 * Create a standard pant-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 */
function paintByColorNumbersTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'paintByNumbers';
  temp.innerHTML = 
  `<table_ class="paint-by-numbers stampable-container stamp-drag pbn-two-color {styles?}" data-col-context="{cols$}" data-row-context="{rows$}" data-stamp-list="{stamplist$}">
    <thead_>
      <tr_ class="pbn-col-headers">
        <th_ class="pbn-corner">
          <span class="pbn-instructions">
            This is a nonogram<br>(aka paint-by-numbers).<br>
            For instructions, see 
            <a href="https://help.puzzyl.net/PBN" target="_blank">
              https://help.puzzyl.net/PBN<br>
              <img src="https://help.puzzyl.net/pbn.png">
            </a>
          </span>
        </th_>
        <for each="col" in="colGroups">
          <td_ id="colHeader-{col#}" class="pbn-col-header">
            <for each="colorGroup" in="col"><for key="color" in="colorGroup"><for each="group" in="color!"><span class="pbn-col-group pbn-color-{color}" onclick="togglePbnClue(this)">{.group}</span></for></for></for>
          </td_>
        </for>
        <if test="validate?" ne="false">
          <th_ class="pbn-row-footer pbn-corner">&nbsp;</th_>
        </if>
      </tr_>
    </thead_>
      <for each="row" in="rowGroups">
        <tr_ class="pbn-row">
          <td_ id="rowHeader-{row#}" class="pbn-row-header">
            &hairsp; 
            <for each="colorGroup" in="row"><for key="color" in="colorGroup">
              <for each="group" in="color!"><span class="pbn-row-group pbn-color-{color}" onclick="togglePbnClue(this)">{.group}</span> </for>
            &hairsp;</for></for>
          </td_>
          <for each="col" in="colGroups">
          <td_ id="{row#}_{col#}" class="pbn-cell stampable">{blank?}</td_>
        </for>
        <if test="validate?" ne="false">
          <td_ class="pbn-row-footer"><span id="rowSummary-{row#}" class="pbn-row-validation"></span></td_>
        </if>
      </tr_>
    </for>
    <if test="validate?" ne="false">
      <tfoot_>
        <tr_ class="pbn-col-footer">
          <th_ class="pbn-corner">&nbsp;</th_>
          <for each="col" in="colGroups">
            <td_ class="pbn-col-footer"><span id="colSummary-{col#}" class="pbn-col-validation"></span></td_>
          </for>
          <th_ class="pbn-corner-validation">
            ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ&nbsp;&nbsp;&nbsp;&nbsp;ꜛ
            <br>←&nbsp;validation</th_>
        </tr_>
      </tfoot_>
    </if>
  </table_>`;
  return temp;
}

/**
 * Create a standard paint-by-numbers template element.
 * Also load the accompanying CSS file.
 * @returns The template.
 * @remarks This template takes the following arguments:
 *   size: Optional descriptor of stamp toolbar button size.
 *         Choices are "medium" and "small". The default is large.
 *   erase: the tool id of the eraser
 *   tools: A list of objects, each of which contain:
 *     id: the name of the stamp.
 *     next: Optional id of the next stamp, for rotational clicking.
 *           If absent, clicking on pre-stamped cells does nothing differnt.
 *     modifier: Optional shift state for clicks. 
 *               Choices are "ctrl", "alt", "shift".
 *     img: The image source path to the button.
 *     label: Optional text to render below the toolbar button
 * @remarks Invoking this stamping template also loads the PaintByNumbers.css
 * Top candidates of styles to override include:
 *   stampLabel: to change or suppress the display of the label.
 *   stampMod: to change of suppress the modifier as a simple label.
 */
function classStampPaletteTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'classStampPalette';
  temp.innerHTML = 
  `<div id="stampPalette" data-tool-count="3" data-tool-erase="{erase}">
    <for each="tool" in="tools">
      <div id={tool.id} class="stampTool {size?}" data-stamp-id="{tool.id}" data-style="{tool.id}" data-click-modifier="{tool.modifier?}" title="{tool.modifier?} + draw" data-next-stamp-id="{tool.next}">
        <div class="roundTool {tool.id}-button">
          <span id="{tool.id}-icon" class="stampIcon"><img src_="{tool.img}"></span>
          <span id="{tool.id}-label" class="stampLabel">{tool.label?}</span>
          <span id="{tool.id}-mod" class="stampMod">{tool.modifier?}+click</span>
        </div>
      </div>
    </for>
  </div>`;
  return temp;
}

function classStampNoToolsTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'PaintByNumbers.css');

  const temp = document.createElement('template');
  temp.id = 'classStampPalette';
  temp.innerHTML = 
  `<div id="stampPalette" class="hidden" data-tool-erase="{erase}">
    <for each="tool" in="tools">
      <div class="stampTool" data-stamp-id="{tool.id}" data-next-stamp-id="{tool.next}">
      </div>
    </for>
  </div>`;
  return temp;
}

function stampPaletteTemplate() :HTMLTemplateElement {
  linkCss(getSafariDetails().cssRoot + 'StampTools.css');

  const temp = document.createElement('template');
  temp.innerHTML = 
  `<table_ class="paint-by-numbers bolden_5 bolden_10" data-col-context="{cols$}" data-row-context="{rows$}">
  </table_>`;
  return temp;
}

var pbnStampTools = [
  {id:'stampPaint', modifier:'ctrl', label:'Paint', img:'../Images/Stamps/brushH.png', next:'stampBlank'},
  {id:'stampBlank', modifier:'shift', label:'Blank', img:'../Images/Stamps/blankH.png', next:'stampErase'},
  {id:'stampErase', modifier:'alt', label:'Erase', img:'../Images/Stamps/eraserH.png', next:'stampPaint'},
];
