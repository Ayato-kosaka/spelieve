import { ENV } from '@/ENV';

export const PlaceHttpPost = async <RequestBodyType, ResponseType>(
	target: string,
	body: RequestBodyType,
): Promise<ResponseType> =>
	fetch(ENV.BACKEND_PLACE_ENDPOINT + target, {
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
		if (ENV.HTTP_POST_LOG) {
			// eslint-disable-next-line no-console
			console.log('debug', 'PlaceHttpPost', target, resJSON);
		}
		return Promise.resolve(resJSON);
	});
