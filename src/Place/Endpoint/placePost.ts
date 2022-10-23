export const placePost = async<T>(target: string, body: T): Promise<void> => {
  try {
    let res = await fetch('https://postman-echo.com/post', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    res = await res.json();
    console.log(res)
  } catch (e) {
    console.error(e);
  }
}