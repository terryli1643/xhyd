require('es6-promise').polyfill();
require('isomorphic-fetch');
import { message } from 'antd'
import { browserHistory } from 'react-router';
import { makeUrl } from './util'

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  let option = {
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    ...options
  };

  if (url === "/api/upload/uploadFileToCloud") {
    delete option.headers
  }

  try {
    const response = await fetch(makeUrl(url), option);

    checkStatus(response);

    const data = await response.json();

    /*  其他错误
    * */
    if (data.code !== 0 && data.code !== 2) {
      message.error(data.errorMessage,2.5);
    }

    /*  没有权限
    * */
    if (data.code === 1) {
      if (data.data[0] === 1) {
        localStorage.setItem("permissions", "");
        localStorage.setItem("username", "");
        localStorage.setItem("roleName", "");
        browserHistory.push("/")
      }

      if (data.data[0] === 2) {
        browserHistory.push("/nopermission")
      }
    }
    
    /*  验证错误
    * */
    if (data.code === 2) {
      message.error(data.data[0].errorMsg,2.5);
    }

    const ret = {
      data
    };

    return ret;

  } catch (err) {
    message.error(err,2)
  }
}