export type LinkDetails = {
  rel: string;  // 'preconnect', 'stylesheet', ...
  href: string;
  type?: string;  // example: 'text/css'
  crossorigin?: string;  // if anything, ''
}

export type PuzzleEventDetails = {
  title: string;
  logo?: string;  // path from root
  icon: string;  // path from root
  puzzleList?: string;
  cssRoot: string;  // path from root
  fontCss: string;  // path from root
  googleFonts?: string;  // comma-delimeted list
  links: LinkDetails[];
  qr_folders?: {};  // folder lookup
  solverSite?: string;  // URL to another website
}

const safariDocsDetails:PuzzleEventDetails = {
  'title': 'Puzzyl Utility Library',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
  'puzzleList': './index.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts.css',
  'googleFonts': 'Caveat',
  'links': []
};

const safariSingleDetails:PuzzleEventDetails = {
  'title': 'Puzzle',
  'logo': './Images/Sample_Logo.png',
  'icon': './Images/Sample_Icon.png',
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
  'logo': './Images/PS21 logo.png',
  'icon': './Images/Beaker_icon.png',
  'puzzleList': './safari.html',
  'cssRoot': '../Css/',
  'fontCss': './Css/Fonts21.css',
  'googleFonts': 'DM+Serif+Display,Abril+Fatface,Caveat',  // no whitespace
  'links': [],
  'qr_folders': {'https://www.puzzyl.net/24/': './Qr/puzzyl/',
                 'file:///D:/git/GivingSafariTS/24/': './Qr/puzzyl/'},
  // 'solverSite': 'https://givingsafari2024.azurewebsites.net/Solver',  // Only during events
}

const safari24Details:PuzzleEventDetails = {
  'title': 'Game Night',
  // 'logo': './Images/PS24 logo.png',
  'icon': '../24/Images/Sample_Icon.png',
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
export function initSafariDetails(safariId:string): PuzzleEventDetails {
  if (!(safariId in pastSafaris)) {
    throw new Error('Unrecognized Safari Event ID: ' + safariId);
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
