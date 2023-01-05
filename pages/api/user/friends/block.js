import axios from "axios";

export default async function handler(req, res) {
	const { userId, config } = req.body;
	try {
        const { data } =  await axios.request({
            method: 'PUT',
            url: `${process.env.SERVER_URI}/v1/users/friends/block`,
            headers: {
                'Authorization': config.headers.Authorization
            },
            data: {
                userId
            },
        });
		return res.json(data);
	} catch (error) {
		const resError = new Error(error.response.data.msg)
		return res.status(400).json({ msg: resError.message });
	}
}