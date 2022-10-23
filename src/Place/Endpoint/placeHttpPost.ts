import { ENV } from "@/ENV";

export const placeHttpPost = async<T>(target: string, body: T): Promise<void> => {
  try {
    let res = await fetch(ENV.PLACE_ENDPOINT + target, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    res = await res.json();
    if(ENV.HTTP_POST_LOG){
      console.log(res);
    }
  } catch (e) {
    if(ENV.HTTP_POST_LOG){
      console.error(e);
    }
  }
}