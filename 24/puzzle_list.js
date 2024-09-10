var types = {
    word: { icon: 'word', alt: 'Word puzzle' },
    logic: { icon: 'logic', alt: 'Logic puzzle' },
    math: { icon: 'math', alt: 'Math puzzle' },
    rebus: { icon: 'rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'trivia', alt: 'Trivia puzzle' },
    code: { icon: 'code', alt: 'Encoded puzzle' },
    maze: { icon: 'maze', alt: 'Maze puzzle' },
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
    { title: 'A Hotdog is not a Sandwich', thumb: 'hot', author: 'Michael Cohen', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Beef', thumb: 'bee', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'ironChef',number:1}] },
    { title: 'Beyond Seasonable Doubt', thumb: 'bey', author: 'Wendy Stidmon', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Boaty McBoatface', thumb: 'boa', author: 'Martyn Lovell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Breakfast', thumb: 'bre', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Chicken', thumb: 'chi', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'ironChef',number:2}] },
    { title: 'Cultural Cuisine', thumb: 'cul', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'smorgasbord',number:3}] },
    { title: "Ding's Dim Sum", file:'DingsDimSum', thumb: 'din', author: 'Philippe Nicolle', type: types.math, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'toaster',number:2}] },
    { title: 'Dining Philosophers', thumb: 'dph', author: 'Joey Marianer', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Dodecadent Dinner', thumb: 'dod', author: 'David Garber', type: types.math, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Egg', thumb: 'egg', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'ironChef',number:3}] },
    { title: 'Food Trucks', thumb: 'ftr', author: 'Jesse McGatha', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'smorgasbord',number:4}] },
    { title: 'Foodie Games', thumb: 'fga', author: 'Zhenya Ross', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'fridge',number:4}] },
    { title: 'Foodoku', thumb: 'foo', author: 'Jeffrey Lin', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'fridge',number:3}] },
    { title: 'Fridge Raider', thumb: 'fr1', author: 'Jeffrey Lin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'fridge',number:1}] },
    { title: 'Fridge Raider 2', thumb: 'fr2', author: 'Jeffrey Lin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'fridge',number:2}] },
    { title: 'Grandma’s Secret Recipe',file:'GrandmasSecretRecipe', thumb: 'gra', author: 'David Garber', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Greens', thumb: 'gre', author: 'Margaret Shaver', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'toaster',number:3}] },
    { title: 'I Need A Gyro', thumb: 'nee', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'smorgasbord',number:1}] },
    { title: 'LasagneDoku', thumb: 'las', author: 'Martyn Lovell', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Moby Dick’s Drive-In', file:'MobyDicksDriveIn', thumb: 'mob', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Overeating', thumb: 'ove', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Plexiglass Dividers', thumb: 'ple', author: 'Peter Golde', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Snack Time', thumb: 'sna', author: 'Marni Hager', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Spaghetti Code', thumb: 'spa', author: 'Joseph Joy', type: types.maze, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Starters', thumb: 'sta', author: 'Anne Grier', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'toaster',number:4}] },
    { title: "Stewart's Steakhouse", file: "StewartsSteakhouse", thumb: 'ste', author: 'Philippe Nicolle', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'smorgasbord',number:2}] },
    { title: 'Techniques', thumb: 'tec', author: 'Anne Grier', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Title', thumb: 'tit', author: 'Chris Jeuell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Wine', thumb: 'win', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'ironChef',number:4}] },
    { title: '🍽️🎥', file:'EmojiDM', thumb: 'edm', author: 'Morgan Grobin', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:true, feeder: [{meta:'toaster',number:1}] },
    { title: 'Fridge Raider 3', thumb: 'fr3', author: 'Jeffrey Lin', type: types.meta, group: group.meta, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Iron Chef', thumb: 'iro', author: 'Rorke Haining', type: types.meta, group: group.meta, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Smorgasbord', thumb: 'smo', author: 'Rorke Haining', type: types.meta, group: group.meta, orientation: orient.portrait, ir:true, feeder: [] },
    { title: 'Tmmmm Moasty', thumb: 'tmm', author: 'David Garber', type: types.meta, group: group.meta, orientation: orient.portrait, ir:true, feeder: [] },
];

// Pass any url arguments on to the puzzles, plus the event identifier
var _urlEventArguments = window.location.search.indexOf('gs24') > 0 
    ? window.location.search  // no change
    : window.location.search === '' ? '?gs24' 
    : (window.location.search + '&gs24');

// Fill in the puzzle hrefs
for (var puz of puzzles) {
    if (!puz['file']) {
        puz['file'] = puz.title.replaceAll(' ', '');
    }
    puz['href'] = puz['file'] + '.xhtml' + _urlEventArguments;
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