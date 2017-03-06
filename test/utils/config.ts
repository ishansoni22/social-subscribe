/**
 * Created by bharatm on 06/03/17.
 */

import {repository} from "./repository";
const shortLivedAccessToken = "EAADvbGAQt94BABAH54HKt917Yld9wqTr9JbkEaLc0sMfx7rffi8PkQoTElr8r1SRg363G5lZBjFDEyb" +
    "aQfKjSmiK8rwe1rrugH0bW5vwa4cHZBbsNMxM6OEHeftcKJndFGbmjuUXYs5ElHACo6rPP12YQpOl8ygHN9C6DlZBiRq7Y5EuVsqV1QGTa8ivtUZD";
export const config = {
    uuid: "123456789",
    appId: "263248747214814",
    appSecret: "4454810a488876bc8b716e76f8be8de2",
    callBackURL: "http://localhost:3050",
    graphApiHost: "https://graph.facebook.com",
    repository,
    shortLivedAccessToken,
    socialNetwork: "facebook",
};
