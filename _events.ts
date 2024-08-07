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
  cssRoot: string;  // Folder for CSS files for generic puzzle layout. Often shared across events.
  fontCss?: string;  // Specific font stylesheet for this event
  googleFonts?: string;  // comma-delimeted list of font names to load with Google APIs
  links: LinkDetails[];  // A list of additional link tags to add to every puzzle
  qr_folders?: {};  // Folder for any QR codes
  solverSite?: string;  // URL to a separate solver website, where players can enter answers
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
  'puzzleList': '../Docs/index.html',
  'cssRoot': '../Css/',
  'fontCss': '../Docs/Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': []
};

const safariSingleDetails:PuzzleEventDetails = {
  'title': 'Puzzle',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'iconRoot': './Icons/',
  'puzzleList': '',
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
  'puzzleList': './index.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': []
}

const safari20Details:PuzzleEventDetails = {
  'title': 'Safari Labs',
  'logo': './Images/PS20 logo.png',
  'icon': './Images/Beaker_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './safari.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts20.css',
  'googleFonts': 'Architects+Daughter,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/23/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/23/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
}

const safari21Details:PuzzleEventDetails = {
  'title': 'Safari Labs',
  'logo': './Images/GS24_banner.png',  // PS21 logo.png',
  'icon': './Images/Plate_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './menuu.html',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
}

const safari24Details:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': '../24/Images/PS24 logo.png',
  'icon': '../24/Images/Sample_Icon.png',
  'iconRoot': '../24/Icons/',
  // 'puzzleList': './safari.html',
  'cssRoot': '../Css/',
  'fontCss': '../24/Css/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',  // no whitespace
  'links': [],
  // 'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
              //    'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
}

const safariDggDetails:PuzzleEventDetails = {
  'title': 'David’s Puzzles',
  'logo': './Images/octopus_watermark.png',
  'icon': './Images/octopus_icon.png',
  'iconRoot': './Icons/',
  'puzzleList': './indexx.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat,Righteous,Cormorant+Upright',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/Dgg/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/Dgg/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2023.azurewebsites.net/Solver',  // Only during events
}

// Event for the PuzzylSafariTeam branch
const puzzylSafariTeamDetails:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': './Images/Sample_Logo.png',
  'icon': '24/favicon.png',
  'iconRoot': './Icons/',
  'puzzleList': '',
  'cssRoot': 'Css/',
  'fontCss': '24/Fonts24.css',
  'googleFonts': 'Goblin+One,Caveat',
  'links': [
//        { rel:'preconnect', href:'https://fonts.googleapis.com' },
//        { rel:'preconnect', href:'https://fonts.gstatic.com', crossorigin:'' },
  ]
}

const pastSafaris = {
  'Docs': safariDocsDetails,
  'Sample': safariSampleDetails,
  'Single': safariSingleDetails,
  '20': safari20Details,
  '21': safari21Details,
  'Dgg': safariDggDetails,
  '24': safari24Details,
  'gs24': safari21Details,
  'team': puzzylSafariTeamDetails,
}

let safariDetails:PuzzleEventDetails;

/**
* Initialize a global reference to Safari event details
*/
export function initSafariDetails(safariId?:string): PuzzleEventDetails {
  if (!safariId) {
    return safariDetails = noEventDetails;
  }
  if (!(safariId in pastSafaris)) {
    const err = new Error('Unrecognized Safari Event ID: ' + safariId);
    console.error(err);
    return safariDetails = noEventDetails;
  }
  safariDetails = pastSafaris[safariId];
  return safariDetails;
}

/**
* Return the details of this puzzle event
*/
export function getSafariDetails(): PuzzleEventDetails {
  return safariDetails;
}
