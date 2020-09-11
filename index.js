const express = require("express");
require("dotenv").config();
const app = express();
app.get("/favicon.ico", (req, res) => {
	res.sendFile("./public/favicon.ico", {
		root: __dirname,
	});
});

app.get(["/:pointId", "/"], (req, res) => {
	res.sendFile("./public/index.html", {
		root: __dirname,
	});
});
app.use(express.static("public"));
const httpsServer = app.listen(process.env.PORT, () =>
	console.log(`Front end server up on port ${process.env.PORT}!`)
);
