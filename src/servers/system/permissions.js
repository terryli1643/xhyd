import request from '../../utils/request';
import qs from 'qs';

export async function fetchUserList(params) {
    params.t = new Date().getTime();
    return request(`/api/account/searchAdmins?${qs.stringify(params)}`, {});
}

export async function fetchCreateUser(params) {
    return request("/api/account/createAdmin", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchDeleteUser(params) {
    return request("/api/account/deleteAdmins", {
        method: 'post',
        body: `adminIds=${params.adminIds}`
    })
}

export async function fetchUpdateUser(params) {
    return request("/api/account/updateAdmin", {
        method: 'post',
        body: qs.stringify(params)
    })
}