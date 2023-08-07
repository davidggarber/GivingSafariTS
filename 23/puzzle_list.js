var types = {
    word: { icon: 'Word', alt: 'Word puzzle' },
    logic: { icon: 'Logic', alt: 'Logic puzzle' },
    math: { icon: 'Math', alt: 'Math puzzle' },
    rebus: { icon: 'Rebus', alt: 'Rebus puzzle' },
    trivia: { icon: 'Trivia', alt: 'Trivia puzzle' },
    construction: { icon: 'Construction', alt: 'Construction puzzle' },
    meta: { icon: 'Meta', alt: 'Meta-puzzle' },
};
var group = {
    portrait: 'portrait',
    landscape: 'landscape',
    feeder: 'feeder',
    meta: 'meta',
    pending: ''
};

var puzzles = [
    { title: 'Aaaaaaaa!', file: 'Aaaaaaaa', author: 'Jeff Lin', type: types.math, group: group.portrait },
    { title: 'Animal Magnetism', author: 'Dana Young', type: types.logic, group: group.portrait },
    { title: 'At The Waterworks', author: 'Philippe Nicolle', type: types.logic, group: group.portrait },
    { title: 'Chemical Compounds', author: 'Rorke Haining', type: types.word, group: group.portrait },
    { title: 'Computers', author: 'Rorke Haining', type: types.logic, group: group.portrait },
    { title: 'Crop Dusters', author: 'Dana Young', type: types.logic, group: group.portrait },
    { title: 'Elementary Charge', author: 'Dana Young', type: types.rebus, group: group.portrait },
    { title: 'Entomology Lab', author: 'Peter Golde', type: types.word, group: group.portrait },
    { title: 'Genetics Of Humor', author: 'Colin Robertson', type: types.trivia, group: group.portrait },
    { title: 'Test Tubes', author: 'Rorke Haining', type: types.word, group: group.portrait },
    { title: 'Weird Maths', author: 'Martyn Lovell', type: types.logic, group: group.portrait },
    { title: 'Weird, You Nits', file: 'WeirdYouNits', author: 'Martyn Lovell', type: types.rebus, group: group.portrait },
    { title: 'Buried Logic', author: 'Martyn Lovell', type: types.word, group: group.portrait },
    { title: 'Fish Story', author: 'Dana Young', type: types.rebus, group: group.portrait },
    { title: 'Moon', author: 'Rorke Haining', type: types.word, group: group.portrait },
    { title: 'Petri Dish', author: 'Peter Golde', type: types.word, group: group.portrait },
    { title: 'Complex Molecules', author: 'Philippe Nicolle', type: types.word, group: group.pending },
    { title: 'Engineering', author: 'Dana Young', type: types.logic, group: group.portrait },
    { title: 'Zoology', author: 'David Garber', type: types.rebus, group: group.pending },
    { title: 'Evolution', author: 'Rorke Haining', type: types.word, group: group.pending },
    { title: 'Lifecycle', author: 'Rorke Haining', type: types.word, group: group.pending },
    { title: 'Tipping Point', author: 'Ken Pacquer', type: types.math, group: group.pending },
    { title: 'Archaeological Science', author: 'Cele Wolman', type: types.logic, group: group.pending },
    { title: 'Mudoku', author: 'Jeffrey Lin', type: types.logic, group: group.pending },
    { title: 'X-Ray Crystallography', author: 'Colin Robertson', type: types.construction, group: group.pending },
    { title: 'Exoplanets', author: 'Jess McGatha', type: types.logic, group: group.pending },
    { title: 'Mathematics', author: 'David Garber', type: types.word, group: group.pending },
    { title: 'Weird Science', author: 'Martyn Lovell', type: types.meta, group: group.pending },  // meta
];

function puzzleHref(puz) {
    if (puz['file']) {
        return puz['file'] + '.html';
    }
    return puz.title.replaceAll(' ', '') + '.html';
}