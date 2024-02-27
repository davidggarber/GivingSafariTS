var mechs = {
    word: { icon: 'word', alt: 'Word puzzle' },
    logic: { icon: 'logic', alt: 'Logic puzzle' },
    math: { icon: 'math', alt: 'Math puzzle' },
    rebus: { icon: 'rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'trivia', alt: 'Trivia puzzle' },
    maze: { icon: 'maze', alt: 'Maze puzzle' },
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
    pending: '',   // a planned puzzle without a backing file, yet
    cut: undefined // a puzzle to exclude from players' puzzle lists
};
var orient = {
    portrait: 'portrait',
    landscape: 'landscape',
};
var meta = {
    tbd: null,
};

/**
 * Schema:
 *   title: friendly name
 *   file: actual filename (optional if same as title)
 *   safari: which event was the puzzle originally created for?
 *   thumb: filename (in Thumbs folder) of thumbnail
 *   author: name of puzzle author
 *   mech: what puzzle mechanism (should be one of the mechs, above)
 *   group: what scoring group (should be one of the groups, above)
 *   orient: the puzzle orientation
 *   feeder: does this puzzle advertise that it unlocks a feeder to another puzzle?
 */
var puzzles = [
    { title: 'Mandatory Meeting', safari: '16', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Planet of the Apes', safari: '18', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Detour', safari: '19', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'John Deere', safari: '19', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Pavement', safari: '19', author: 'David Garber', mech: mechs.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Zoology', safari: '20', author: 'David Garber', mech: mechs.rebus, group: group.puzzle, orientation: orient.portrait },
    { title: 'Radio Waves', safari: '20', author: 'David Garber', mech: mechs.meta, group: group.meta, icon: meta.radio, orientation: orient.portrait },
    // { title: 'Leftovers', safari: '21', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Grandma’s Secret Recipe', file:'GrandmasSecretRecipe', safari: '21', author: 'David Garber', mech: mechs.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Moby Dick’s Drive-In', file:'MobyDicksDriveIn', safari: '21', author: 'David Garber', mech: mechs.trivia, group: group.puzzle, orientation: orient.portrait },
    { title: 'Wild Game', safari: '21', author: 'David Garber', mech: mechs.word, group: group.puzzle, orientation: orient.portrait },
    // { title: 'Royal Fork', safari: '21', author: 'David Garber', mech: mechs.maze, group: group.puzzle, orientation: orient.portrait },
    // { title: 'Tmmmm Moasty', safari: '21', author: 'David Garber', mech: mechs.trivia, group: group.puzzle, orientation: orient.portrait },
    { title: 'Dodecadent Dinner', safari: '21', author: 'David Garber', mech: mechs.math, group: group.puzzle, orientation: orient.portrait },
];

/**
 * Get the relative path to a puzzle file
 * @param {*} puz a puzzle object, from the puzzles collection
 * @returns A base filename. No path or extension.
 */
function puzzleFile(puz) {
    if (puz['file']) {
        return puz['file'];
    }
    // TODO: remove all punctuation too
    return puz.title.replaceAll(' ', '');
}

/**
 * Get the relative path to a puzzle file
 * @param {*} puz a puzzle object, from the puzzles collection
 * @returns A base filename and extension. No path.
 */
function puzzleHref(puz) {
    return puzzleFile(puz) + '.html';
}

/**
 * The IDs from the most recent upload to Peter's solver tool
 */
var first_puzzle_solve_id_ = 500;
var first_meta_solve_id_ = first_puzzle_solve_id_ - 2;
var first_challenge_solve_id_ = first_puzzle_solve_id_ - 5;
/**
 * The ID of a puzzle in Peter's solver tool
 * @param {*} puz a puzzle object, from the puzzles collection
 * @returns A number
 */
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