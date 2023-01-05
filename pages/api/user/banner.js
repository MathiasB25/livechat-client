import axios from "axios";

export default async function handler(req, res) {
	const { color, config } = req.body;
	try {
        const { data } =  await axios.request({
            method: 'POST',
            url: `${process.env.SERVER_URI}/v1/users/banner`,
            headers: {
                'Authorization': config.headers.Authorization
            },
            data: {
                color
            },
        });
		return res.json(data);
	} catch (error) {
		const resError = new Error(error.response.data.msg)
		return res.status(400).json({ msg: resError.message });
	}
}