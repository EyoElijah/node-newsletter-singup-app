const express = require("express");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", async (req, res) => {
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const email = req.body.email;
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};
	const jsonData = JSON.stringify(data);
	const url = `https://us5.api.mailchimp.com/3.0/lists/${process.env.list_id}`;

	const options = {
		method: "POST",
		auth: process.env.api_key,
	};
	const request = https.request(url, options, (response) => {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/failure.html");
		}
		response.on("data", (data) => {
			console.log(JSON.parse(data));
		});
	});
	request.write(jsonData);
	request.end();
});

app.post("/failure", (req, res) => {
	res.redirect("/");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`));
