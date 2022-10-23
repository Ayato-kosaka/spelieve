import { ENV } from '@/ENV';

export const PlaceHttpPost = async <T, U>(target: string, body: T): Promise<U | unknown> => {
	try {
		const res = await fetch(ENV.PLACE_ENDPOINT + target, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});
		const resJSON: U = (await res.json()) as U;
		if (ENV.HTTP_POST_LOG) {
			/* eslint no-console: 0 */
			console.log(resJSON);
		}
		return resJSON;
	} catch (e) {
		if (ENV.HTTP_POST_LOG) {
			/* eslint no-console: 0 */
			console.error(e);
		}
		return e;
	}
};
