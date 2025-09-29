function posterTemplates() {
  var body = document.getElementById('Poster');

  // header template
  var temp = document.createElement('template');
  temp.id = 'poster-header';
  temp.innerHTML = `<div id="header">
          <a href="../gs25/Map25.xhtml"><img class="banner" src="../gs25/Images/GS25_banner.png" /></a>
          <a href="https://aka.ms/givingps"><img class="event-qr" src="QRs/givingps.svg" /></a>
          <div style="margin-left: 2.5in">
            <h1 style="margin-right: 1.25in">Giving Puzzle Safari</h1>  
            <h2>Enjoy puzzles? Words / Logic / Math/ Trivia / More!</h2>
            <h2>Join us at <a href="https://aka.ms/givingps" target="_blank">aka.ms/givingps</a>.
              Donations benefit <a href="https://microsoft.benevity.org/cause/840-912045918" target="_blank">Rainier Scholars</a>.
              <br />Puzzles released Fridays, October 3<sup>rd</sup> / 10<sup>th</sup> / 17<sup>th</sup> / 24<sup>th</sup>.</h2>
          </div>
        </div>`;
  body.appendChild(temp);

  // footer template
  temp = document.createElement('template');
  temp.id = 'poster-footer';
  temp.innerHTML = `<div id="footer">
          <img class="banner" src="../gs25/Images/GS25_banner.png" />
          <div style="margin-right: 2.5in">
            <h1>Think you have a solution?</h1>
            <h2>Submit your guess online: <img class="solve-qr" src="QRs/{solveqr}.svg" /></h2>
          </div>
        </div>
        <div id="hint-link">
          <h3>Need a hint? Email <a href="mailto:givingps@microsoft.com">GivingPS&#x2009;@&#x2009;microsoft.com</a>.</h3>
        </div>`;
  body.appendChild(temp);
}
