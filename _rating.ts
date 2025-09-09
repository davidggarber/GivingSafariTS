import { theBoiler } from "./_boilerplate";
import { findParentOfClass, getOptionalStyle, hasClass, toggleClass } from "./_classUtil";
import { getSafariDetails, RatingDetails } from "./_events";
import { getLogin } from "./_storage";


/**
 * Create the Rating UI that lives above the top of the page (screen only).
 * @param fun If true, add the "fun" scale.
 * @param difficulty If true, add the "difficulty" scale.
 * @param feedback If true, add a button to provide verbatim feedback.
 */
export function createRatingUI(details:RatingDetails, margins:HTMLDivElement) {
  const context = getRatingContext();
  if (!context || !context.puzzleName) {
    return;  // Ratings UI is only for puzzles
  }

  const div = document.createElement('div');
  div.id = "__puzzle_rating_ui";

  div.appendChild(createRatingLabel("Rate this puzzle!"));

  if (details.fun) {
    div.appendChild(createRatingScale('Fun:', 'fun', 'star', 5));
  }

  if (details.difficulty) {
    div.appendChild(createRatingScale('Difficulty:', 'difficulty', 'diff', 5));
  }

  if (details.feedback) {
    div.appendChild(createFeedbackButton());
  }

  const body = document.getElementsByTagName('body')[0];
  body.appendChild(div);
}

function createRatingLabel(text:string):HTMLSpanElement {
  const span = document.createElement('span');
  toggleClass(span, 'rating-label', true);
  span.textContent = text;
  return span;
}

function createRatingScale(label:string, scale:string, img:string, max:number):HTMLSpanElement {
  const span = document.createElement('span');
  toggleClass(span, 'rating-group', true);
  span.appendChild(createRatingLabel(label));

  for (let i = 1; i <= max; i++) {
    const star = document.createElement('img');
    star.src = '../Images/Stars/' + img + '-' + i + '.png';
    toggleClass(star, 'rating-star', true);
    star.setAttribute('data-rating-scale', scale);
    star.setAttribute('data-rating-value', i.toString());
    star.onclick = () => { setRating(star); }
    span.appendChild(star);
  }
  return span;
}

function createFeedbackButton():HTMLSpanElement {
    const span = document.createElement('span');
    toggleClass(span, 'rating-label', true);
    const button = document.createElement('button');
    button.textContent = "Give Feedback";
    toggleClass(button, 'rating-feedback-button', true);
    button.onclick = () => { provideFeedback(button); }
    span.appendChild(button);
    return span;
}


/**
 * Callback when the user clicks one of the rating stars.
 * @param img Which image - could be from either group.
 */
function setRating(img: HTMLElement) {
  const group = findParentOfClass(img, "rating-group");
  const others = group!.getElementsByClassName('rating-star');
  let unset = hasClass(img, 'selected');
  let changed = false;
  for (let i = others.length - 1; i >= 0; i--) {
    if (hasClass(others[i], 'selected')) {
      changed = true;
    }
    toggleClass(others[i], 'selected', false);
  }

  const scale = getOptionalStyle(img, 'data-rating-scale');
  let val = parseInt(getOptionalStyle(img, 'data-rating-value') || "0");

  if (!unset) {
    toggleClass(img, 'selected', true);
  }
  else {
    val = 0;
  }

}

/**
 * Solicit verbatim feedback, and pass it along to the server.
 * @param button The button the user clicked.
 */
function provideFeedback(button:HTMLButtonElement) {
  const feedback = prompt("Feedback will be forwarded to this puzzle's authors.")
  // Show UI on the feedback button that the message was received.
  toggleClass(button, 'sent', !!feedback);
}


type RatingContext = {
  puzzleName?: string;  // Which puzzle is this?
  event?: string;  // Which event
  progress?: number;  // How far has this puzzle been filled in?
  user?: string;  // user's ID
  scale?: string;  // Which rating scale
  value?: number;  // Rating 1-5, or 0 if no rating
  change?: boolean;  // Is this a change from a different recent rating?
}

/**
 * When recording ratings, the context is important.
 * Not just which puzzle, in which event. Also, how much progress has the player made, at the time of the rating?
 */
function getRatingContext(): RatingContext|null {
  const boiler = theBoiler();
  if (!boiler) {
    return null;
  }
  if (!boiler.author) {
    return null;  // Pages without authors are generally not interesting for ratings
  }

  const safari = getSafariDetails();
  const login = safari ? getLogin(safari.title) : null;
  const player = login ? (login.player + (login.team ? (' @ ' + login.team) : '')) : null;

  const context: RatingContext = {
    puzzleName: boiler.title,
    event: safari?.title,
    progress: 0,  // TBD
    user: player || undefined,
    change: false
  };

  return context;
}