import { ENV } from '@/ENV';

export const PlaceHttpPost = async <RequestBodyType, ResponseType>(
	target: string,
	body: RequestBodyType,
): Promise<ResponseType | unknown> => {
	try {
		const res = await fetch(ENV.BACKEND_PLACE_ENDPOINT + target, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const resJSON = (await res.json()) as ResponseType;
		if (ENV.HTTP_POST_LOG) {
			// eslint-disable-next-line no-console
			console.log(resJSON);
		}
		return resJSON;
	} catch (e) {
		if (ENV.HTTP_POST_LOG) {
			// eslint-disable-next-line no-console
			console.error(e);
		}
		return e;
	}
};
