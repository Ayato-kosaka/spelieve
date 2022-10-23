import { ENV } from '@/ENV';

export const PlaceHttpPost = async <T, U>(target: string, body: T): Promise<U | unknown> => {
	try {
		const res = await fetch(ENV.BACKEND_PLACE_ENDPOINT + target, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const resJSON: U = (await res.json()) as U;
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
