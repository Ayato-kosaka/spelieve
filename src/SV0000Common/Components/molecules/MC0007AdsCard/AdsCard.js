import { useEffect } from 'react';

export const MC0007AdsCard = () => {
    useEffect(() => {
        if (window.adsbygoogle && process.env.NODE_ENV !== "development") {
            window.adsbygoogle.push({});
        }
    }, [])

    return (
        <ins className="adsbygoogle"
            style={{ "display": "block" }}
            data-ad-client={process.env.REACT_APP_GOOGLE_AD_CLIENT}
            data-ad-slot={process.env.REACT_APP_GOOGLE_AD_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
    );
}
export default MC0007AdsCard