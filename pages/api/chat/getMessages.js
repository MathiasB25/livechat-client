import axios from "axios";

export default async function handler(req, res) {
	const { user, config } = req.body;
	try {
		const { data } = await axios(`${process.env.SERVER_URI}/v1/chat/messages/${user}`, config);
		return res.json(data);
	} catch (error) {
		const catchError = new Error(error.response.data.msg)
		return res.status(400).json(catchError.message);
	}
}