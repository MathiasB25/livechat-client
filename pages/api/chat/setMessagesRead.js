import axios from "axios";

export default async function handler(req, res) {
	const { chatId, config } = req.body;
	try {
        await axios.request({
            method: 'POST',
            url: `${process.env.SERVER_URI}/v1/chat/messages/read`,
            headers: {
                'Authorization': config.headers.Authorization
            },
            data: { chatId },
        });
		return res.json({ msg: 'ok' });
	} catch (error) {
        console.log(error)
		const resError = new Error(error.response.data.msg)
		return res.status(400).json({ msg: resError.message });
	}
}