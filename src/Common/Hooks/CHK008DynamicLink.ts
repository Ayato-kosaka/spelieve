import dynamicLinks from '@react-native-firebase/dynamic-links';
import { ENV } from '@/ENV';

export const buildItineraryPreviewDL = async (itineraryID: string): Promise<string> => {
    const link: string = await dynamicLinks().buildLink({
        link: `${ENV.HOST_NAME_WEB}/Itinerary/TopTab/ItineraryPreview?itineraryID=${itineraryID}`,
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://spelieveuser.page.link', // TODO: 自分たちのインスタ投稿の時のdomainURLと別にしてる!!!
        
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
        // analytics: {
        //     campaign: 'banner',
        // },
    });

    return link;
}