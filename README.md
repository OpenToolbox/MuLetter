#µLetter

**µLetter** or **MuLetter** is a desktop mass mailer.


## Dependencies

To run MuLetter in development you need to install **Node.js** and **npm** : https://nodejs.org.


## Installation

    $ git clone https://github.com/opentoolbox/muletter.git
    $ cd muletter
    $ npm install

## Run MuLetter

    $ npm start

## Bundle from ./src to ./app 

    $ npm run bundle

Or

	$ npm run bundle:watch


## Build MuLetter

To build mountale with [electron-builder](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) you need to [install required system packages](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build).

    $ npm run minify
    $ npm run pack
    $ npm run dist
