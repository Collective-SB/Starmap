<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username, repo_name, twitter_handle, email, project_title, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<p align="center">
  <a href="https://github.com/Collective-SB/Starmap/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Collective-SB/Starmap.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Collective-SB/Starmap/network/members">
    <img src="https://img.shields.io/github/forks/Collective-SB/Starmap.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Collective-SB/Starmap/stargazers">
    <img src="https://img.shields.io/github/stars/Collective-SB/Starmap.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Collective-SB/Starmap/issues">
    <img src="https://img.shields.io/github/issues/Collective-SB/Starmap.svg?style=for-the-badge">
  </a>
  <a href="https://github.com/Collective-SB/Starmap/blob/master/LICENSE.txt">
    <img src="https://img.shields.io/github/license/Collective-SB/Starmap.svg?style=for-the-badge">
  </a>
</p>
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url] -->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/Collective-SB/Starmap">
    <img src="readme-assets/ISAN.svg" alt="Logo" width="500" height="120">
  </a>

  <!--<h3 align="center">ISAN Starmap</h3>-->

  <p align="center">
    A 3D public map for the game Starbase. 
    <br>Additionally includes support for creating private maps
    <br />
    <br>
    <a href="https://github.com/Collective-SB/Starmap/blob/master/public/isan.pdf" target="_blank"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://isan.to" target="_blank">View Project</a>
    ·
    <a href="https://discord.gg/VnU8apR" target="_blank">Report Bug</a>
    ·
    <a href="#" target="_blank">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Project Overview
[![Product Name Screen Shot][product-screenshot]](https://isan.to)

ISAN Starmap is a navigation system developed for the purpose storing and calculating system coordinates around the Starbase solar system.
<br>

_For a more descriptive explanation about the ISAN Starmap please read the: 
[ISAN Documentation](https://github.com/Collective-SB/Starmap/blob/master/public/isan.pdf)_


### Built With
<strong><a href="#" target="_blank">Starmap API</a> | <a href="https://expressjs.com/" target="_blank">Express</a> | <a href="https://www.w3schools.com/" target="_blank">HTML/CSS</a> | <a href="https://jquery.com" target="_blank">JQuerry</a> | <a href="https://threejs.org/" target="_blank">ThreeJS</a> | <a href="https://www.adobe.com/nz/products/xd.html" target="_blank">AdobeXD</a></strong>

<!-- GETTING STARTED -->
## Getting Started

To play around with a local copy of <strong>`ISAN Starmap`</strong> run these following steps.

### Prerequisites

Ensure you have nodejs installed on your computer (can check by running the command `node -v`). If you don't then go to https://nodejs.org/en/ and follow the instructions.
<br>


### Installation

1. Clone the repo using the command:
   ```sh
   git clone https://github.com/Collective-SB/Starmap
   ```
2. In the new directory <strong>`/Starmap`</strong> run the command:
   ```sh
   npm install
   ```
3. Create a new file called <strong>`.env`</strong> (in the same directory). 
   <br>
   Copy this into that file and save:
      ```js
      PORT=80
      ```
4. Create a new file called <strong>`env.js`</strong>, place this file in the <strong>`public\js`</strong> folder. 
<br>The content of the file should be:
   ```js
   export const ENV_FROM_ENVJS = "remoteDev";
   export const AUTH_REDIR_FROM_ENVJS = "local";
   ```
5. Start the server by running:
   ```sh
   node index.js
   ```
6. Finally to test that it is working, In your browser type in: <strong>`http:\\localhost\`</strong> and you should now see the ISAN Starmap loading.





<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/Collective-SB/Starmap/issues) for a list of proposed features (and known issues).






<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
ISAN Starpmap Team Members:
* <strong>Strikeeaglechase:</strong> Lead JS Developer [[Github](https://github.com/Strikeeaglechase)]
* <strong>VolcanoCookies:</strong> JS Developer [[Github](https://github.com/VolcanoCookies)]
* <strong>AlexAndHisScripts:</strong>  Early Front End [[Github](https://github.com/AlexAndHisScripts)]
* <strong>IHaveNoLife:</strong> JS Developer [[Github]()]
* <strong>Timothy Howard:</strong> UI/UX Developer [[Github](https://github.com/timhow38) | [Linkedin](https://www.linkedin.com/in/timhow20/)]
* <strong>MuNk:</strong> Extensive API Testing [[Github]()]



<details>
  <summary><p style="display: inline-block">Thanks to the old Starmap team for the insparation:</p></summary>
  <ol>
    <li>
    <strong>Peter Shepherd:</strong> JS Developer [<a href="https://www.linkedin.com/in/peter-shepherd-a912a8201/" target="_blank">Linkedin</a>]
    </li>
    <li>
    <strong>Maximilian Lambert:</strong> JS Developer [<a href="https://www.linkedin.com/in/maximilian-lambert-00423b192/" target="_blank">Linkedin</a>]
    </li>
    <li>
    <strong>Timothy Howard:</strong> UI/UX Developer [<a href="https://www.linkedin.com/in/timhow20/ " target="_blank">Linkedin</a> | <a href="https://github.com/timhow38" target="_blank">Github</a>]
    </li>
  </ol>
</details>

<!-- LICENSE -->
## License

ISAN Starmap is an open source client built on top of
the <strong>`Starmap API`</strong> made to allow storage of ISAN locations
<strong>`Copyright (C) 2020 Strikeeaglechase`</strong>

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



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Collective-SB/Starmap.svg?style=for-the-badge
[contributors-url]: https://github.com/Collective-SB/Starmap/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Collective-SB/Starmap.svg?style=for-the-badge
[forks-url]: https://github.com/Collective-SB/Starmap/network/members
[stars-shield]: https://img.shields.io/github/stars/Collective-SB/Starmap.svg?style=for-the-badge
[stars-url]: https://github.com/Collective-SB/Starmap/stargazers
[issues-shield]: https://img.shields.io/github/issues/Collective-SB/Starmap.svg?style=for-the-badge
[issues-url]: https://github.com/Collective-SB/Starmap/issues
[license-shield]: https://img.shields.io/github/license/Collective-SB/Starmap.svg?style=for-the-badge
[license-url]: https://github.com/Collective-SB/Starmap/blob/master/LICENSE.txt
[product-screenshot]: readme-assets/header-picture.png
[product-screenshot02]: readme-assets/ISAN.svg
