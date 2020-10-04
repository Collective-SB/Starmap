const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
require("dotenv").config();
const app = express();
const POINT_INFO_API = "https://api-beta.isan.to/front/getPointInfo/";
// const POINT_INFO_API = "http://localhost:8000/front/getPointInfo/"
const IMGS = {
	ship: "https://cdn.discordapp.com/attachments/762209257738207252/762209368925929472/ship.png",
	ore: "https://cdn.discordapp.com/attachments/762209257738207252/762209362332090378/ore.png",
	station: "https://cdn.discordapp.com/attachments/762209257738207252/762209374071947284/station.png",
	other: "https://cdn.discordapp.com/attachments/762209257738207252/762209367386488852/random-done.png",
	ico: "https://cdn.discordapp.com/attachments/762209257738207252/762219304694972447/eh5Artboard_1.png",
};
app.get("/favicon.ico", (req, res) => {
	res.sendFile("./public/favicon.ico", {
		root: __dirname,
	});
});

app.get(["/:pointId", "/"], async (req, res) => {
	const URL = req.protocol + "://" + req.get("host") + req.originalUrl;
	let openGraphStyles = `
		<meta property="og:image:type" content="image/png" />
		<meta property="og:image:width" content="128" />
		<meta property="og:image:height" content="128" />
		<meta property="og:site_name" content="Starmap" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="${URL}" />
	`;
	const defaultSiteTags = `
		<meta property="og:description" content="A dynamic live time map for Starbase\nCreated by Strikeeaglechase" />
		<meta property="og:image" content="${IMGS.ico}" />
	`;
	if (req.params.pointId) {
		const apiRes = await fetch(POINT_INFO_API + req.params.pointId, {
			method: "GET",
		});
		if (apiRes.status == 200) {
			const data = await apiRes.json();
			openGraphStyles += `
				<meta property="og:title" content="${data.name}" />
				<meta property="og:description" content="Point created by ${data.owner}" />
				<meta property="og:image" content="${IMGS[data.type]}" />
			`;
		} else {
			openGraphStyles += defaultSiteTags;
		}
	} else {
		openGraphStyles += defaultSiteTags;
	}
	let file = fs.readFileSync("./public/index.html", "utf8");
	file = file.replace("%OGP%", openGraphStyles);
	res.send(file);
	// res.sendFile("./public/index.html", {
	// 	root: __dirname,
	// });
});
app.use(express.static("public"));
const httpsServer = app.listen(process.env.PORT, () =>
	console.log(`Front end server up on port ${process.env.PORT}!`)
);