import axios from "axios";

export default async function handler(req, res) {
	const { token } = req.body;
	try {
		const { data } = await axios(`${process.env.SERVER_URI}/v1/users/confirm/${token}`);
		return res.json(data);
	} catch (error) {
		console.log(error)
		return res.status(400).json(error);
	}
}