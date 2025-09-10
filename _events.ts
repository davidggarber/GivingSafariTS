import { BoilerPlateData, urlArgExists } from "./_boilerplate";

export type LinkDetails = {
  rel: string;  // 'preconnect', 'stylesheet', ...
  href: string;
  type?: string;  // example: 'text/css'
  crossorigin?: string;  // if anything, ''
}

// Any relative paths should be relative to the calling puzzle page's folder
export type PuzzleEventDetails = {
  title?: string;  // The event title (or sub-title, after "Safari ##")
  logo?: string;  // The event's banner logo - large scale
  icon?: string;  // The favicon for all puzzles of this event
  iconRoot?: string  // Folder for other icons - notably puzzle types, feeders, etc.
  puzzleList?: string;  // The URL of the index page for this event. A back-pointer from each puzzle
  puzzleListName?: string;
  cssRoot: string;  // Folder for CSS files for generic puzzle layout. Often shared across events.
  fontCss?: string;  // Specific font stylesheet for this event
  googleFonts?: string;  // comma-delimeted list of font names to load with Google APIs
  links: LinkDetails[];  // A list of additional link tags to add to every puzzle
  qr_folders?: {};  // Folder for any QR codes
  solverSite?: string;  // URL to a separate solver website, where players can enter answers
  backLinks?: object;  // key: URL trigger -> puzzleListBackLink
  validation?: boolean|string;  // whether to allow local validation
  eventSync?: string;  // When present, this identifies the database event group
  ratings?: RatingDetails;  // When present, show the rating UI on every puzzle
}

export type RatingDetails = {
  fun: boolean,
  difficulty: boolean,
  feedback: boolean
}

const defaultRatingDetails: RatingDetails = {
  fun: true,
  difficulty: true,
  feedback: true
};

type puzzleListBackLink = {
  href: string;  // relative path
  friendly?: string;
}


const noEventDetails:PuzzleEventDetails = {
  'cssRoot': '../Css/',
  'links': []
};

const safariDocsDetails:PuzzleEventDetails = {
  'title': 'Puzzyl Utility Library',
  'logo': '../Docs/Images/logo.jpg',
  'icon': '../Docs/Images/monster-book-icon.png',
  'iconRoot': '../24/Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../Docs/Css/Fonts.css',
  'googleFonts': 'Caveat Inconsolata',
  'links': [],
  'backLinks': { '': { href:'../Docs/index.xhtml', friendly:'Documentation'}},
};

const safariAdminDetails:PuzzleEventDetails = {
  'title': 'Admin Tools',
  'logo': '../DGG/Images/octopus_watermark.png',
  'icon': '../DGG/Images/octopus_icon.png',
  'cssRoot': '../Css/',
  'links': [],
  'backLinks': { '': { href:'./Admin.xhtml', friendly:'Admin'}},
}

const safariSingleDetails:PuzzleEventDetails = {
  'title': 'Puzzle',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': [
//        { rel:'preconnect', href:'https://fonts.googleapis.com' },
//        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
  ]
}

const safariSampleDetails:PuzzleEventDetails = {
  'title': 'Puzzle Safari',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': [],
  'backLinks': { '': { href:'./index.html'}},
}

const safari19Details:PuzzleEventDetails = {
  'title': 'Under Construction',
  'logo': './Images/PS19 sign.png',
  'icon': './Images/PS19 icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts19.css',
  'googleFonts': 'Overpass,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
  //                'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
  'backLinks': { 'ps19': { href:'./safari.html'}},
}

const safari20Details:PuzzleEventDetails = {
  'title': 'Safari Labs',
  'logo': './Images/PS20 logo.png',
  'icon': './Images/Beaker_icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts20.css',
  'googleFonts': 'Architects+Daughter,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
  'backLinks': { 'gs23': { href:'./safari.html'}},
}

const safari21Details:PuzzleEventDetails = {
  'title': 'Epicurious Enigmas',
  'logo': './Images/PS24_banner.png',  // PS21 logo.png',
  'icon': './Images/Plate_icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  'backLinks': { 'ps21': { href:'./Menu.xhtml'}},
  'validation': true,
}

const giving24Details:PuzzleEventDetails = {
  'title': 'Epicurious Enigmas',
  'logo': './Images/GS24_banner.png',  // PS21 logo.png',
  'icon': './Images/Plate_icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
  'backLinks': { 'gs24': { href:'./Menu.xhtml'}, 'ps21': { href:'./Menu.xhtml'}},
  'validation': true,
  eventSync: 'GivingSafari24',
}

const giving25Details:PuzzleEventDetails = {
  'title': 'The Great Outdoors',
  'logo': './Images/GS25_banner.png',
  'icon': './Images/gs25_favicon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../gs25/Css/Fonts22.css',
  'googleFonts': 'DM+Serif+Display,National+Park,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/gs25/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/gs25/': './Qr/puzzyl/'},
  'backLinks': { 'gs25': { href:'./Map.xhtml'}, 'ps22': { href:'./Map.xhtml'}},
  'validation': true,
  eventSync: 'GivingSafari25',
  ratings: defaultRatingDetails,
}

const safari22Details:PuzzleEventDetails = {
  'title': 'The Great Outdoors',
  'logo': './Images/PS22_banner.png',
  'icon': './Images/ps22_favicon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../gs25/Css/Fonts22.css',
  'googleFonts': 'DM+Serif+Display,National+Park,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/gs25/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/gs25/': './Qr/puzzyl/'},
  'backLinks': { 'gs25': { href:'./Map.xhtml'}, 'ps22': { href:'./Map.xhtml'}},
  'validation': true,
  // no eventSync == no login
  ratings: defaultRatingDetails,
}

const ps21Mini:PuzzleEventDetails = {
  'title': 'Epicurious Enigmas',
  'logo': './Images/GS24_banner.png',  // PS21 logo.png',
  'icon': './Images/Plate_icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'backLinks': { '': { href:'./MiniMenu.xhtml'}},
  'validation': true,
  eventSync: 'ps21Mini',
}

const safari23Details:PuzzleEventDetails = {
  'title': 'Bad Idea',
  // 'logo': './23/Images/PS23 logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'cssRoot': './Css/',
  'fontCss': './Css/Fonts23.css',
  'googleFonts': 'Goblin+One,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
              //    'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2026.azurewebsites.net/Solver',  // Only during events
  'backLinks': { 'ps23':{ href:'./ideas.html'}, 'gs26':{ href:'./safari.html'} },
}

const safari24Details:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': './Images/PS24 logo.png',
  'icon': './Images/ps24_favicon.png',
  'iconRoot': './Icons/',
  'cssRoot': './Css/',
  'fontCss': './Css/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
              //    'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
  'backLinks': { 'ps24':{ href:'./indexx.html'}, 'gs27':{ href:'./safari.html'} },
}

const safari25Details:PuzzleEventDetails = {
  'title': 'Hip To Be Square',
  // 'logo': './Images/PS25_banner.png',
  'icon': './Images/ps25_favicon.png',
  // 'iconRoot': './Icons/',
  'cssRoot': './Css/',
  'fontCss': './Css/Fonts25.css',
  'googleFonts': 'Nova+Square,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/ps25/': './Qr/puzzyl/',
  //                'file:///D:/git/GivingSafariTS/ps25/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
  // 'backLinks': { 'ps25': { href:'./Menu.xhtml'}},
  'validation': false,
  // eventSync: 'GivingSafari25',
}

const safariDggDetails:PuzzleEventDetails = {
  'title': 'David’s Puzzles',
  'logo': './Images/octopus_watermark.png',
  'icon': './Images/octopus_icon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat,Righteous,Cormorant+Upright',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/Dgg/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/Dgg/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
  'backLinks': { '':{ href:'./indexx.html'} },
}


// Event for the PuzzylSafariTeam branch
const puzzylSafariTeamDetails:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': './Images/Sample_Logo.png',
  'icon': '24/favicon.png',
  'iconRoot': './Icons/',
  'cssRoot': 'Css/',
  'fontCss': '24/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',
  'links': [
//        { rel:'preconnect', href:'https://fonts.googleapis.com' },
//        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
  ]
}

const dnancXmasDetails:PuzzleEventDetails = {
  'title': 'DNANC X-Mas',
  'icon': './Images/favicon.png',
  'iconRoot': './Icons/',
  'cssRoot': '../Css/',
  'fontCss': '../DnancXmas/Css/Fonts24.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  'backLinks': { '': { href:'./index.xhtml'}},
  'validation': true,
}

const pastSafaris = {
  'Docs': safariDocsDetails,
  'Admin': safariAdminDetails,
  'Sample': safariSampleDetails,
  'Single': safariSingleDetails,
  '20': safari20Details,
  '21': safari21Details,
  'ps19': safari19Details,
  'ps20': safari20Details,
  'ps21': safari21Details,
  'ps22': safari22Details,
  'ps23': safari23Details,
  'ps24': safari24Details,
  'ps25': safari25Details,
  'Dgg': safariDggDetails,
  '24': safari24Details,
  'gs24': giving24Details,
  'gs25': giving25Details,
  'fr21': ps21Mini,
  'ic21': ps21Mini,
  'sb21': ps21Mini,
  'tm21': ps21Mini,
  'team': puzzylSafariTeamDetails,
  'xmas': dnancXmasDetails,
}

const puzzleSafari19 = ['ps19'];  //,'gs22'
const givingSafari24 = ['gs24','21','ps21'];
const puzzleSafari22 = ['gs25','ps22'];
const puzzleSafari24 = ['ps24'];  //,'gs27'
const puzzleSafari25 = ['ps25'];  //,'gs28'
const puzzleSafari21Minis = ['ic21','sb21','tm21','fr21'];
const allSafari21 = ['gs24','21','ps21','ic21','sb21','tm21','fr21'];

let safariDetails:PuzzleEventDetails;

/**
* Initialize a global reference to Safari event details.
* Pages can support multiple events, in which case the URL needs to have an arg picking one.
* Finding a match in boiler.safaris takes precedence over boiler.safari, which is the backup.
* If that a urlArg match is found, boiler.safari will be updated, to remove the ambiguity.
*/
export function initSafariDetails(boiler?:BoilerPlateData): PuzzleEventDetails {
  if (boiler?.safaris) {
    for (var i = 0; i < boiler.safaris.length; i++) {
      if (urlArgExists(boiler.safaris[i])) {
        boiler.safari = boiler.safaris[i];
        break;
      }
    }
  }
  if (!boiler?.safari) {
    return safariDetails = noEventDetails;
  }
  if (!(boiler.safari in pastSafaris)) {
    const err = new Error('Unrecognized Safari Event ID: ' + boiler.safari);
    console.error(err);
    return safariDetails = noEventDetails;
  }

  // Mirror final safari name to lookup, as it is often used in link URLs
  if (boiler.lookup) {
    boiler.lookup['_safari'] = boiler.safari;
  }

  safariDetails = pastSafaris[boiler.safari];
  return safariDetails;
}

/**
* Return the details of this puzzle event
*/
export function getSafariDetails(): PuzzleEventDetails {
  return safariDetails;
}

/**
 * Create a backlink to the puzzle list.
 * Might be subject to prerequisites
 * @returns 
 */
export function backlinkFromUrl(): HTMLElement|undefined {
  if (!safariDetails || !safariDetails.backLinks) {
    return undefined;
  }
  // Check if any of the prerequisite triggers are present
  const keys = Object.keys(safariDetails.backLinks);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key && urlArgExists(key)) {
      return createBacklink(safariDetails.backLinks[key]);
    }
  }
  if ('' in safariDetails.backLinks) {
    // Some events don't need a trigger
    return createBacklink(safariDetails.backLinks[''] as puzzleListBackLink);
  }
  return undefined;
}

/**
 * Create an <a href> to the backlink puzzle list.
 * @param backlink object with an href, and optionally also friendly text
 * @returns An anchor element
 */
function createBacklink(backlink:puzzleListBackLink): HTMLAnchorElement {
  let a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
  a.id = 'backlink';
  const text = backlink['friendly'] || 'Puzzle list';
  a.innerText = text;
  a.href = backlink.href + window.location.search;
  a.target = '_blank';
  return a;
}

/**
 * According to event rules, should we enable local validation
 * @returns 
 */
export function enableValidation():boolean {
  if (safariDetails.validation === true) {
    return true;
  }
  else if (safariDetails.validation === false || safariDetails.validation === undefined) {
    return false;
  }
  return urlArgExists(safariDetails.validation);
}

/**
 * Lookup a safari by any of three keys:
 * - event key, as used in URL args
 * - event title
 * - event sync key
 * @param name 
 * @returns 
 */
export function lookupSafari(name:string):PuzzleEventDetails | null {
  if (name in pastSafaris) {
    return pastSafaris[name];
  }
  var list = Object.values(pastSafaris);
  for (var i = 0; i < list.length; i++) {
    var safari = list[i];
    if (safari.title == name || safari.eventSync == name)
      return safari;
  }
  return null;
}