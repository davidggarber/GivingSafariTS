document.addEventListener('DOMContentLoaded', function() {
  var squares = document.querySelectorAll('.grid-square');
  var puzzleLetters = [];
  puzzleLetters.push("S", "V", "H", "J", "N", "A", "K", "A",
                     "E", "G", "S", "G", "P", "B", "C", "E",
                     "Y", "A", "N", "R", "L", "E", "N", "P",
                     "L", "A", "T", "N", "Y", "Z", "A", "R",
                     "U", "B", "L", "T", "E", "E", "R", "E",
                     "B", "E", "N", "N", "A", "T", "A", "E",
                     "G", "A", "G", "M", "N", "T", "E", "B",
                     "A", "N", "V", "A", "M", "F", "G", "E");
  squares.forEach(function(square, index) {
    // Create a text element
    var text = document.createElement('span');
    text.className = 'grid-text';
    text.textContent = `${puzzleLetters[index]}`;

    // Check if the cell should start with a locked color
    if (square.dataset.locked === 'true') {
      var lockedColor = square.dataset.lockedColor;
      var circle = document.createElement('div');
      circle.className = `circle ${lockedColor}-circle`;
      square.appendChild(circle);
      square.classList.add(`has-${lockedColor}-circle`);
      text.classList.add('underlined-text'); // Add bold class to locked cells
    }

    square.appendChild(text);

    // Update the click event listener
    square.addEventListener('click', function() {
      // Skip the toggle logic if the cell is locked
      if (this.dataset.locked === 'true') return;

      var circle = this.querySelector('.circle');
      if (!circle) {
        // If there is no circle, create a black one
        circle = document.createElement('div');
        circle.className = 'circle black-circle';
        this.appendChild(circle);
        this.classList.add('has-black-circle');
      } else if (circle.classList.contains('black-circle')) {
        // If the circle is black, change it to white
        circle.className = 'circle white-circle';
        this.classList.remove('has-black-circle');
      } else {
        // If the circle is white, remove it
        this.removeChild(circle);
      }
    });
  });
});