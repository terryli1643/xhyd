import { browserHistory } from "react-router";
import qs from 'qs';

export function urlPushQuery(pathname, params) {
    browserHistory.push(`${pathname}?${qs.stringify(params)}`)
}

//关闭浏览器窗口
export function closeWindows() {
    const browserName = navigator.appName;
    const browserVer = parseInt(navigator.appVersion);

    if(browserName === "Microsoft Internet Explorer"){
        const ie7 = (document.all && !window.opera && window.XMLHttpRequest) ? true : false;
        if (ie7) {
            //This method is required to close a window without any prompt for IE7 & greater versions.
            window.open('','_parent','');
            window.close();
        } else {
            //This method is required to close a window without any prompt for IE6
            this.focus();
            self.opener = this;
            self.close();
        }
    }else{
        //For NON-IE Browsers except Firefox which doesnt support Auto Close
        try{
            this.focus();
            self.opener = this;
            self.close();
        } catch(e){

        }
        try{
            window.open('','_self','');
            window.close();
        } catch(e){

        }
    }
}

/*  URL转换
 * */
export const makeUrl = (url) => {
    if (process.env.NODE_ENV === "dev") {
        return url
    } else {
        return `https://eapitest.idealens.com:82${url}`
    }
};