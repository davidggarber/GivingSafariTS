// Hidden answers:
// 1. Add this into the HTML <body>. (Yes, in <body>):
//    <script src="Kit/HiddenAnswers.js"></script>
// 2. Add into <style>: 
//    .hidden-answer {
//     display: none;
//    } 
// 3. Add in lines: 
//    <button class="reveal-button">Show answer</button>
//    <div class="hidden-answer">Answer goes here</div>



// Get all the buttons on the page

const revealButtons = document.querySelectorAll('.reveal-button');

// Add click event listeners to each button
revealButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Find the hidden answer associated with this button
        const hiddenAnswer = button.nextElementSibling;
       // Toggle the visibility of the hidden answer
        if (hiddenAnswer.style.display === 'none' || hiddenAnswer.style.display === '') {
            hiddenAnswer.style.display = 'block';
            button.textContent = 'Hide answer';
        } else {
            hiddenAnswer.style.display = 'none';
            button.textContent = 'Show answer';
        }
    });
});