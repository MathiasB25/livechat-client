import axios from "axios";

export default async function handler(req, res) {
	const { email } = req.body;
	try {
		const { data } = await axios.post(`${process.env.SERVER_URI}/v1/users/reset-password`, { email });
		return res.json(data);
	} catch (error) {
		return res.status(400).json(error);
	}
}