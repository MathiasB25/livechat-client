import axios from "axios";

export default async function handler(req, res) {
	const { chat, config } = req.body;
	try {
        const { data } =  await axios.request({
            method: 'DELETE',
            url: `${process.env.SERVER_URI}/v1/chat/messages`,
            headers: {
                'Authorization': config.headers.Authorization
            },
            data: {
                _id: chat.message._id
            }
        });
		return res.status(200).json(data);
	} catch (error) {
		const resError = new Error(error.response.data.msg)
		return res.status(400).json({ msg: resError.message });
	}
}