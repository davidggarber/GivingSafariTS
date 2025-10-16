function posterTemplates() {
  var body = document.getElementById('Poster');

  // header template
  var temp = document.createElement('template');
  temp.id = 'posterHeader';
  temp.innerHTML = 
      `<div id="poster-header" style="color:{color};">
        <div id="tiap">
          THIS IS A PUZZLE.
        </div>
        <div id="cysi">
          CAN YOU SOLVE IT?
        </div>
      </div>`;
  body.appendChild(temp);

  // footer template
  temp = document.createElement('template');
  temp.id = 'posterFooter';
  temp.innerHTML = 
      `<div id="poster-footer" style="color:{color};">
        <table>
          <tr>
            <td id="solve-it">
              SOLVE IT
              <br/>
              <a href="{qr}.xhtml">
                <img class="qr-code" src="QRs/{qr}.svg"/>
              </a>
            </td>
            <td style="width:20%;">
              <img id="logo" src="Images/gs25_logo.png" />
            </td>
            <td id="do-more">
              DO MORE
              <br/>
              <a href="https://aka.ms/givingps">
                <img class="qr-code" src="QRs/givingps.svg"/>
              </a>
            </td>
          </tr>  
        </table>
        <img id="ms-give" src="Images/ms-give.png" />
      </div>`;
  body.appendChild(temp);
}
