function posterTemplates() {
  var body = document.getElementById('Poster');

  // header template
  var temp = document.createElement('template');
  temp.id = 'poster-header';
  temp.innerHTML = `<div id="header">
          <img class="banner" src="../gs25/Images/GS25_banner.png" />
          <img class="event-qr" src="QRs/givingps.svg" />
          <div style="margin-left: 2.5in">
            <h1>Giving Puzzle Safari</h1>  
            <h2>Enjoy puzzles? Words / Logic / Math/ Trivia / More!</h2>
            <h2>Join us at <a href="https://www.puzzyl.net/gs25/Map25.xhtml">aka.ms/givingps</a>.
              Donations benefit <a href="benivty">Rainier Scholars</a>.
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
            <h1>Think you can solve this?</h1>
            <h2>Submit your guess here: <img class="solve-qr" src="QRs/{solveqr}.svg" />
            </h2>
          </div>
        </div>`;
  body.appendChild(temp);
}