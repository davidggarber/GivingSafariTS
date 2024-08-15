var types = {
    word: { icon: 'word', alt: 'Word puzzle' },
    logic: { icon: 'logic', alt: 'Logic puzzle' },
    math: { icon: 'math', alt: 'Math puzzle' },
    rebus: { icon: 'rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'trivia', alt: 'Trivia puzzle' },
    code: { icon: 'code', alt: 'Encoded puzzle' },
    construction: { icon: 'construction', alt: 'Construction puzzle' },
    meta: { icon: 'meta', alt: 'Meta-puzzle' },
    challenge: { icon: 'experiment', alt: 'Challenge' },
};
var group = {
    puzzle: 'puzzle',
    challenge: 'challenge',
    feeder: 'feeder',
    meta: 'meta',
    pending: '',
    cut: undefined
};
var orient = {
    portrait: 'portrait',
    landscape: 'landscape',
};
var meta = {
};
var challenge = {
}

var puzzles = [
    { title: 'Beef', thumb: '', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Chicken', thumb: '', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Egg', thumb: '', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Wine', thumb: '', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Dodecadent Dinner', thumb: '', author: 'David Garber', type: types.math, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Grandma’s Secret Recipe',file:'GrandmasSecretRecipe', thumb: '', author: 'David Garber', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    // { title: 'Leftovers', thumb: '', author: 'David Garber', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Moby Dick’s Drive-In', file:'MobyDicksDriveIn', thumb: '', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Foodoku', thumb: '', author: 'Wendy Stidmon & Jeffrey Lin', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Boaty McBoatface', thumb: '', author: 'Martyn Lovell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Cultural Cuisine', thumb: '', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Fridge Raider', thumb: '', author: 'Jeffrey Lin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Fridge Raider 2', thumb: '', author: 'Jeffrey Lin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: 'Food Trucks', thumb: '', author: 'Jesse McGatha', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [] },
    { title: '🍽️🎥', file:'EmojiDM', thumb: '', author: 'Morgan Grobin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [] },
];

function puzzleFile(puz) {
    if (puz['file']) {
        return puz['file'];
    }
    return puz.title.replaceAll(' ', '');
}

function puzzleHref(puz) {
    return puzzleFile(puz) + '.html';
}

// Fill in the puzzle hrefs
for (var puz of puzzles) {
    puz['href'] = puzzleHref(puz);
}

var first_puzzle_solve_id_ = 500;
var first_meta_solve_id_ = first_puzzle_solve_id_ - 2;
var first_challenge_solve_id_ = first_puzzle_solve_id_ - 5;
function puzzleSolveId(puz) {
    // Each group is in a separate id range
    var id = puz.group == group.puzzle ? first_puzzle_solve_id_ 
        : puz.group == group.meta ? first_meta_solve_id_ : first_challenge_solve_id_;
    for (var i = 0; i < puzzles.length; i++) {
        if (puzzles[i].group != puz.group) {
            continue;
        }
        if (puz == puzzles[i]) {
            return id;
        }
        id++;
    }
    return -1;
}