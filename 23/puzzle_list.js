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
    science: 'science',
    bus: 'bus',
};
var challenge = {
    cosmos: 'exp-cosmos',
    magic: 'exp-magic',
    cartrip: 'exp-cartrip',
}

var puzzles = [
    { title: 'Aaaaaaaa!', file: 'Aaaaaaaa', thumb: 'Aa', author: 'Jeffrey Lin', type: types.math, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.cartrip] },
    { title: 'Animal Magnetism', thumb: 'Am', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.magic] },
    { title: 'At The Waterworks', thumb: 'Atw', author: 'Philippe Nicolle', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,1] },
    { title: 'Buried Logic', thumb: 'Bl', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,1]  },
    { title: 'Chemical Compounds', thumb: 'Cc', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,3] },
    { title: 'Complex Molecules', thumb: 'Cm', author: 'Philippe Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,2] },
    { title: 'Computers', thumb: 'Comp', author: 'Rorke Haining', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,1] },
    { title: 'Crop Dusters', thumb: 'Cd', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.cartrip] },
    { title: 'Elementary Charge', thumb: 'Ec', author: 'Dana Young', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,4] },
    { title: 'Engineering', thumb: 'Eng', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,5] },
    { title: 'Entomology Lab', thumb: 'El', author: 'Peter Golde', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,4] },
    { title: 'Evolution', thumb: 'Evo', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.cosmos] },
    { title: 'Exoplanets', thumb: 'Exo', author: 'Jess McGatha', type: types.code, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.cosmos] },
    { title: 'Fish Story', thumb: 'Fs', author: 'Dana Young', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,1] },
    { title: 'Genetics Of Humor', thumb: 'Goh', author: 'Colin Robertson', type: types.trivia, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,2] },
    { title: 'Lifecycle', thumb: 'Life', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,3] },
    { title: 'Moon', thumb: 'Moon', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,2] },
    { title: 'Mudoku', thumb: 'Mud', author: 'Jeffrey Lin', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,2] },
    { title: 'Petri Dish', thumb: 'Pd', author: 'Peter Golde', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,3] },
    { title: 'Test Tubes', thumb: 'Tt', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,4] },
    { title: 'Tipping Point', thumb: 'Tp', author: 'Ken Pacquer', type: types.math, group: group.puzzle, orientation: orient.landscape, feeder: [meta.science,3] },
    { title: 'Weird Maths', thumb: 'Wm', author: 'Martyn Lovell', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,4] },
    { title: 'Weird, You Nits', file: 'WeirdYouNits', thumb: 'Wyn', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,5] },
    { title: 'Zoology', thumb: 'Zoo', author: 'David Garber', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [challenge.magic] },
    { title: 'The Magic School Bus', thumb: 'Tmsb', author: 'Philippe Nicolle', type: types.meta, group: group.meta, icon: meta.bus, orientation: orient.portrait },
    { title: 'Weird Science', thumb: 'Ws', author: 'Martyn Lovell', type: types.meta, group: group.meta, icon: meta.science, orientation: orient.portrait },
    { title: 'Cosmos', file: 'Cosmos', thumb: 'Cos', author: 'Rorke Haining', type: types.challenge, group: group.challenge, icon: challenge.cosmos, orientation: orient.portrait },
    { title: 'Car Trip', file: 'CarTrip', thumb: 'Ct', author: 'David Garber', type: types.challenge, group: group.challenge, icon: challenge.ascent, orientation: orient.portrait },
    { title: 'Science or Magic', file: 'ScienceMagic', thumb: 'Sm', author: 'Ken Showman', type: types.challenge, group: group.challenge, icon: challenge.magic, orientation: orient.portrait },
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