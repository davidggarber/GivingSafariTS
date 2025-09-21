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

    { round: 2, title: 'Active Lifestyle', thumb: 'act', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 1, title: 'America The Beautiful', thumb: 'ame', author: 'Chris Jeuell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 2, title: 'Autumn', thumb: 'aut', author: 'Rorke Haining', type: types.search, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'anthem',number:2}] },
    { round: 1, title: 'Biomes Of The World', thumb: 'bio', author: 'Zhenya Ross', type: types.search, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 3, title: 'Cartography', thumb: 'car', author: 'Jake Lui', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 2, title: 'Disney And The Great Outdoors', thumb: 'dis', author: 'Chris Jeuell', type: types.code, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 1, title: 'Down Under', thumb: 'dun', author: 'Wei-Hwa Huang', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 3, title: 'Down, Across, And All Around', file: 'DownAcrossAndAllAround', thumb: 'dac', author: 'Wei-Hwa Huang', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 4, title: 'Fences', thumb: 'fen', author: 'Martyn Lovell', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'coastal',number:0}] },
    { round: 3, title: 'Gardens', thumb: 'gar', author: 'David Garber', type: types.logic, group: group.puzzle, orientation: orient.landscape, ir:false, feeder: [] },
    { round: 3, title: 'Grab Crass In The Great Doubt Oars', thumb: 'gra', author: 'Chris Jeuell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 1, title: 'Hippocampus', thumb: 'hip', author: 'Joe Tomkinson', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 3, title: 'Jokes Around The Campfire', thumb: 'jok', author: 'Phil Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 3, title: 'K2', thumb: 'k2', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 1, title: 'Networked Hints', thumb: 'net', author: 'Phil Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 4, title: 'Outdoor Action!', file: 'OutdoorAction', thumb: 'out', author: 'Martyn Lovell', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'coastal',number:1}] },
    { round: 1, title: 'Posters', thumb: 'pos', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 2, title: 'Rushmore', thumb: 'rus', author: 'David Garber', type: types.trivia, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 4, title: 'Shouldn’t That Rhyme?', file: 'ShouldntThatRhyme', thumb: 'sho', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'coastal',number:2}] },
    { round: 3, title: 'Signposts', thumb: 'sig', author: 'Tim Hannifin', type: types.word, group: group.puzzle, orientation: orient.landscape, ir:false, feeder: [] },
    { round: 1, title: 'Ski Resort', thumb: 'ski', author: 'Joey Marianer', type: types.jigsaw, group: group.puzzle, orientation: orient.landscape, ir:false, feeder: [] },
    { round: 4, title: 'Slow Down!', file:'SlowDown', thumb: 'slo', author: 'Chris Jeuell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 2, title: 'Spring', thumb: 'spr', author: 'Rorke Haining', type: types.code, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'anthem',number:0}] },
    { round: 2, title: 'Summer', thumb: 'sum', author: 'Rorke Haining', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'anthem',number:1}] },
    { round: 4, title: 'The Hunt', thumb: 'hun', author: 'Joey Marianer', type: types.search, group: group.puzzle, orientation: orient.landscape, ir:false, feeder: [] },
    { round: 4, title: 'There’s Air in the Something Tonight', file: 'TheresAir', thumb: 'air', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'coastal',number:3}] },
    // { round: 4, title: 'Traveling Salesman', thumb: 'tra', author: 'David Garber', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 1, title: 'Up For Air', thumb: 'upf', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.landscape, ir:false, feeder: [] },
    { round: 4, title: 'Waterfalls', thumb: 'wat', author: 'David Garber', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    { round: 2, title: 'Winter', thumb: 'win', author: 'Rorke Haining', type: types.code, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [{meta:'anthem',number:3}] },

    // { round: 4, title: 'Feel The Nature', thumb: 'fee', author: 'Kensi Hartman', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 4, title: 'Outlines', thumb: 'oli', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 4, title: 'Parking Places', thumb: 'par', author: 'Peter Golde', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 4, title: 'Tire Change', thumb: 'tir', author: 'Ryan Berry', type: types.word, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 4, title: 'PBN1: Hot Summer Day', thumb: 'pbn', author: 'Jeffrey Lin', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },
    // { round: 4, title: 'Up to the Campgrounds', thumb: 'cam', author: 'Wei-Hwa Huang', type: types.logic, group: group.puzzle, orientation: orient.portrait, ir:false, feeder: [] },

    { round: 2, title: 'Annual Anthem', thumb: 'ann', author: 'Rorke Haining', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'anthem', forget: 'AA_Forget.xhtml' },
    { round: 4, title: 'Coastal Erosion', thumb: 'coa', author: 'Martyn Lovell', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'coastal', forget: 'CE_Forget.xhtml' },
    // { round: 4, title: 'Up and Down Mount Everest', thumb: 'mte', author: 'Wei-Hwa Huang', type: types.meta, group: group.meta, orientation: orient.portrait, ir:false, metaInfo: 'everest' },            
];

var rounds = [
    { filename: 'Map25', release: '10/1/2025' },
    { filename: 'Trails', release: '10/7/2025' },
    { filename: 'Creeks', release: '10/14/2025' },
    { filename: 'Ranges', release: '10/21/2025' },
    { filename: 'Bridge', release: '10/28/2025' },
];

var metas = {
    anthem: {
        title: 'Annual Anthem',
        store: 'AnnualAnthemMeta',
        count: 4,
        icon: 'Icons/anthem.png',
    },
    coastal: {
        title: 'Coastal Erosion',
        store: 'CoastalErosionMeta',
        count: 4,
        icon: 'Icons/coastal.png',
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
    : window.location.search === '' ? '?gs25'
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