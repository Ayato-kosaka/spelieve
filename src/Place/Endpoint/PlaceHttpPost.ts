import { ENV } from '@/ENV';

export const PlaceHttpPost = async <RequestBodyType, ResponseType>(
	target: string,
	body: RequestBodyType,
): Promise<ResponseType> =>
	new Promise<ResponseType>(async (resolve, reject) => {
		const res = (await fetch(ENV.BACKEND_PLACE_ENDPOINT + target, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		}).catch((e) => {
			reject(e);
		})) as Response;
		if (!res.ok) {
			reject();
		}
		const resJSON = (await res.json().catch((e) => {
			reject(e);
		})) as ResponseType;
		if (ENV.HTTP_POST_LOG) {
			// eslint-disable-next-line no-console
			console.log(resJSON);
		}
		resolve(resJSON);
	});
