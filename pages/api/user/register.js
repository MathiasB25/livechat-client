import axios from "axios";

export default async function handler(req, res) {
	const { username, email, password } = req.body;
	try {
		const { data } = await axios.post(`${process.env.SERVER_URI}/v1/users`, { username, email, password });
		return res.json(data);
	} catch (error) {
		const catchError = new Error(error.response.data.msg)
		return res.status(400).json({msg: catchError.message});
	}
}