import axios from "axios";
import formidable from "formidable";
import fs from 'fs';

export const config = {
	api: {
	  bodyParser: false
	}
};
  
const post = async (req, res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, async function (err, fields, files) {
		await saveFile(files.file);
		const { data } = await axios.request({
			method: 'POST',
			url: `${process.env.SERVER_URI}/v1/users/profile`,
			headers: {
				'Authorization': req.headers.authorization
			},
			data: {
				url: `users/profile/${files.file.originalFilename}`
			}
		})
		fs.unlink(`./public/users/profile/${files.file.originalFilename}`, function() {
            console.log('Streaming file removed');
        });
		return res.status(200).json(data);
	});
};
  
const saveFile = async (file) => {
	const data = fs.readFileSync(file.filepath);
	fs.writeFileSync(`./public/users/profile/${file.originalFilename}`, data);
	await fs.unlinkSync(file.filepath);
	return;
};
  
export default (req, res) => {
	req.method === "POST"
	  ? post(req, res)
	  : req.method === "PUT"
	  ? console.log("PUT")
	  : req.method === "DELETE"
	  ? console.log("DELETE")
	  : req.method === "GET"
	  ? console.log("GET")
	  : res.status(404).send("");
};
  