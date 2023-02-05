import axios from "axios";

export default async function handler(req, res) {
	const { message, toChat, reply, config } = req.body;
	try {
        const { data } =  await axios.request({
            method: 'POST',
            url: `${process.env.SERVER_URI}/v1/chat/messages`,
            headers: {
                'Authorization': config.headers.Authorization
            },
            data: {
                message, 
                toChat,
                reply
            },
        });
		return res.json(data);
	} catch (error) {
        console.log(error.response.data.msg)
		const resError = new Error(error.response.data.msg)
		return res.status(400).json({ msg: resError.message });
	}
}