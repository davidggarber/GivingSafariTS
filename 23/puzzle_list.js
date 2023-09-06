var types = {
    word: { icon: 'word', alt: 'Word puzzle' },
    logic: { icon: 'logic', alt: 'Logic puzzle' },
    math: { icon: 'math', alt: 'Math puzzle' },
    rebus: { icon: 'rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'trivia', alt: 'Trivia puzzle' },
    code: { icon: 'code', alt: 'Encoded puzzle' },
    construction: { icon: 'construction', alt: 'Construction puzzle' },
    meta: { icon: 'meta', alt: 'Meta-puzzle' },
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
}

var puzzles = [
    { title: 'Aaaaaaaa!', file: 'Aaaaaaaa', thumb: 'Aa', author: 'Jeffrey Lin', type: types.math, group: group.puzzle, orientation: orient.portrait },
    { title: 'Animal Magnetism', thumb: 'Am', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'At The Waterworks', thumb: 'Atw', author: 'Philippe Nicolle', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,1] },
    { title: 'Buried Logic', thumb: 'Bl', author: 'Martyn Lovell', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,1]  },
    { title: 'Chemical Compounds', thumb: 'Cc', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Complex Molecules', thumb: 'Cm', author: 'Philippe Nicolle', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,2] },
    { title: 'Computers', thumb: 'Comp', author: 'Rorke Haining', type: types.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Crop Dusters', thumb: 'Cd', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Elementary Charge', thumb: 'Ec', author: 'Dana Young', type: types.rebus, group: group.puzzle, orientation: orient.portrait },
    { title: 'Engineering', thumb: 'Eng', author: 'Dana Young', type: types.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Entomology Lab', thumb: 'El', author: 'Peter Golde', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Evolution', thumb: 'Evo', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Exoplanets', thumb: 'Exo', author: 'Jess McGatha', type: types.code, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,4] },
    { title: 'Fish Story', thumb: 'Fs', author: 'Dana Young', type: types.rebus, group: group.puzzle, orientation: orient.portrait },
    { title: 'Genetics Of Humor', thumb: 'Goh', author: 'Colin Robertson', type: types.trivia, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,2] },
    { title: 'Lifecycle', thumb: 'Life', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait, feeder: [meta.bus,3] },
    { title: 'Moon', thumb: 'Moon', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Mudoku', thumb: 'Mud', author: 'Jeffrey Lin', type: types.logic, group: group.puzzle, orientation: orient.portrait },
    { title: 'Petri Dish', thumb: 'Pd', author: 'Peter Golde', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Test Tubes', thumb: 'Tt', author: 'Rorke Haining', type: types.word, group: group.puzzle, orientation: orient.portrait },
    { title: 'Tipping Point', thumb: 'Tp', author: 'Ken Pacquer', type: types.math, group: group.puzzle, orientation: orient.landscape, feeder: [meta.science,3] },
    { title: 'Weird Maths', thumb: 'Wm', author: 'Martyn Lovell', type: types.logic, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,4] },
    { title: 'Weird, You Nits', file: 'WeirdYouNits', thumb: 'Wyn', author: 'Martyn Lovell', type: types.rebus, group: group.puzzle, orientation: orient.portrait, feeder: [meta.science,5] },
    { title: 'Zoology', thumb: 'Zoo', author: 'David Garber', type: types.rebus, group: group.puzzle, orientation: orient.portrait },
    { title: 'The Magic School Bus', thumb: 'Tmsb', author: 'Philippe Nicolle', type: types.meta, group: group.meta, icon: meta.bus, orientation: orient.portrait },
    { title: 'Weird Science', thumb: 'Ws', author: 'Martyn Lovell', type: types.meta, group: group.meta, icon: meta.science, orientation: orient.portrait },
    { title: 'Archaeological Science', thumb: 'As', author: 'Cele Wolman', type: types.logic, group: group.cut },
    { title: 'X-Ray Crystallography', thumb: 'Xrc', author: 'Colin Robertson', type: types.construction, group: group.cut },
    { title: 'Mathematics', thumb: 'Math', author: 'David Garber', type: types.word, group: group.cut },
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