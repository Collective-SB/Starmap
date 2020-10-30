# Starmap

A 3D public map for the game Starbase. Additionally includes support for creating private maps

### Installing

1. Ensure you have nodejs installed on your computer (can check by running the command `node -v`). If you don't then go to https://nodejs.org/en/ and follow the instructions
2. Clone the repo using the command `git clone https://github.com/Collective-SB/Starmap`
3. Install repo
   a) In the new directory (called Starmap) run the command `npm i`
   b) Create a new file called `.env` (in the same directory). Copy this into that file and save: `PORT=80`
   c) Create a new file called `env.js`, place this file in the `public\js` folder. The content of the file should be:

```js
export const ENV_FROM_ENVJS = "remoteDev";
export const AUTH_REDIR_FROM_ENVJS = "local";
```

4. Start the server by running `node index.js`
5. Test that it is working. In your browser if you go to http:\\localhost\ you should see Starmap

### Coding Style

Primarially pep8 using es6 syntax

## Built With

-  Starmap API
-  Express
-  HTML/CSS
-  JQuerry
-  ThreeJS

## Authors

Strikeeaglechase - Lead developer
Volcano - Help with some of the early frontend.
MuNk - Extensive testing of the API, and ensuring it is secure (R.I.P. Boatlon).
IHaveNoLife - Improvments to the UI

## License

Starmap is an open source client built on top of
the Starmap API made to allow storage of ISAN locations
Copyright (C) 2020 Strikeeaglechase

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, orany
later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

## Acknowledgments

Thanks to the old Starmap team for the insparation
