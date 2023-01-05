import axios from "axios";

export default async function handler(req, res) {
	const { request, config } = req.body;
	try {
        const { data } =  await axios.request({
            method: 'DELETE',
            url: `${process.env.SERVER_URI}/v1/users/friends/requests/${request._id}`,
            headers: {
                'Authorization': config.headers.Authorization
            }
        });
		return res.json(data);
	} catch (error) {
		return res.status(400).json(error);
	}
}