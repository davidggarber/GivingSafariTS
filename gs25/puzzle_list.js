var types = {
    word: { icon: 'word', alt: 'Word puzzle' },
    logic: { icon: 'logic', alt: 'Logic puzzle' },
    math: { icon: 'math', alt: 'Math puzzle' },
    rebus: { icon: 'rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'trivia', alt: 'Trivia puzzle' },
    search: { icon: 'search', alt: 'Word search puzzle' },
    code: { icon: 'code', alt: 'Encoded puzzle' },
    maze: { icon: 'maze', alt: 'Maze puzzle' },
    jigsaw: { icon: 'jigsaw', alt: 'Jigsaw puzzle' },
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

    { title: 'Active Lifestyle', thumb: 'act', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'America the Beautiful', thumb: 'ame', author: 'Chris Jeuell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Biomes of the World', thumb: 'bio', author: 'Zhenya Ross', type: types.search, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: 'Cartography', thumb: 'car', author: 'Jake Lui', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Disney and the Great Outdoors', thumb: 'dis', author: 'Chris Jeuell', type: types.code, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Down Under', thumb: 'dun', author: 'Wei-Hwa Huang', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Down, Across, and All Around', file: 'DownAcrossandAllAround', thumb: 'dac', author: 'Wei-Hwa Huang', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Fences', thumb: 'fen', author: 'Martyn Lovell', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Grab Crass In The Great Doubt Oars', thumb: 'gra', author: 'Chris Jeuell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Hippocampus', thumb: 'hip', author: 'Joe Tomkinson', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Jokes Around the Campfire', thumb: 'jok', author: 'Phil Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: 'K2', thumb: 'k2', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Networked Hints', thumb: 'net', author: 'Phil Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Outdoor Action!', file: 'OutdoorAction', thumb: 'out', author: 'Martyn Lovell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Posters', thumb: 'pos', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Rushmore', thumb: 'rus', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Shouldn’t That Rhyme?', file: 'ShouldntThatRhyme', thumb: 'sho', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Signposts', thumb: 'sig', author: 'Tim Hannifin', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Ski Resort', thumb: 'ski', author: 'Joey Marianer', type: types.jigsaw, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Slow Down!', file:'SlowDown', thumb: 'slo', author: 'Chris Jeuell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'The Hunt', thumb: 'hun', author: 'Joey Marianer', type: types.search, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'There’s Air in the Something Tonight', file: 'TheresAir', thumb: 'air', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { title: 'Up For Air', thumb: 'upf', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: '', thumb: 'tbd', author: 'TBD', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: '', thumb: 'tbd', author: 'TBD', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: '', thumb: 'tbd', author: 'TBD', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { title: '', thumb: 'tbd', author: 'TBD', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },

    // { title: 'Annual Anthem', thumb: 'ann', author: 'Rorke Haining', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'anthem' },
    // { title: 'Coastal Erosion', thumb: 'coa', author: 'Martyn Lovell', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'erosion' },
    // { title: 'Up and Down Mount Everest', thumb: 'mte', author: 'Wei-Hwa Huang', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'everest' },            
];

var metas = {
    anthem: {
        title: 'Annual Anthem',
        store: 'AnnualAnthemMeta',
        count: 4,
        icon: 'Icons/anthem.png',
    },
    erosion: {
        title: 'Coastal Erosion',
        store: 'CoastalErosionMeta',
        count: 4,
        icon: 'Icons/erosion.png',
    },
    everest: {
        title: 'Up and Down Mount Everest',
        store: 'UpAndDownMountEverestMeta',
        count: 4,
        icon: 'Icons/everest.png',
    },
   
}

// Pass any url arguments on to the puzzles, plus the event identifier
//  - ps22 event is for single-player puzzling.
//  - gs25 event is an event, with teams and a leaderboard.
var _urlEventArguments = (window.location.search.indexOf('gs25') > 0 || window.location.search.indexOf('ps22') > 0)
    ? window.location.search  // no change
    : window.location.search === '' ? '?ps22'
    : (window.location.search + '&gs25');

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