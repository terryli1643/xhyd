import request from '../../utils/request';
import qs from 'qs';

export async function fetchVerifyCode(params) {
    return request(`/api/account/verifyCode?${qs.stringify(params)}`, {});
}

export async function fetchLogin(params) {
    return request("/api/account/login", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchLoginOut() {
    return request(`/api/account/logout`, {});
}