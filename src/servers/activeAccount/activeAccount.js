import request from '../../utils/request';
import qs from 'qs';

export async function fetchCheckVerify(params) {
    return request("/api/account/verifyEmail", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchSetUser(params) {
    return request("/api/account/setUserPassword", {
        method: 'post',
        body: qs.stringify(params)
    })
}