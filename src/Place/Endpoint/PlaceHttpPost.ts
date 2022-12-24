import { Logger } from '@/Common/Hooks/CHK001Utils';
import { ENV } from '@/ENV';

export const PlaceHttpPost = async <RequestBodyType, ResponseType>(
	target: string,
	body: RequestBodyType,
): Promise<ResponseType> => {
	Logger('PlaceHttpPost', `RequestBody(${target})`, body);
	return fetch(ENV.BACKEND_PLACE_ENDPOINT + target, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	}).then(async (res) => {
		if (!res.ok) {
			return Promise.reject();
		}
		const resJSON = (await res.json()) as ResponseType;
		Logger('PlaceHttpPost', `ResponseBody(${target})`, resJSON);
		return Promise.resolve(resJSON);
	});
};
