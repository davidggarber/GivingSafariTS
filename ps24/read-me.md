# Site conventions

Place puzzles at the root. All lower case.<br>
If you have addition assets, such as images, sound, css, or js, please create a subdirectory for those.<br>
**Please DO NOT upload any large files** not needed for final puzzle render, as they can block deployment.

## Shared resources
In the 24 directory:
* favicon.png -- This will be updated when we get a good event icon.
* Fonts24.css -- Some handy fonts. Notably Goblin One, for titles.

In the Kit directory:
* kit.js -- is a copy of the puzzyl.net puzzle layout library. I will copy it update it regularly.

In the Css directory:
* These are Css files that are expected by kit.js

## New puzzles
If you want to build with the puzzyl.net kit, index.html is a good blank template.
If not, please at least include these in your header:
```
<html>
  <head>
    <meta charset="UTF-8">
    <title>your title here</title>
    <link rel="shortcut icon" type="image/png" href="24/favicon.png">
  </head>
  ...
```

If you intend to use the Goblin One font, you'll also need:
```
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Goblin+One&amp;display=swap">
```

## Testing
This is a static web site. There is no server component.<br>
To test files locally, view file://enlistment-folder/your-puzzle.html in a browser.