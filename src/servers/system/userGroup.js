import request from '../../utils/request';
import qs from 'qs';

export async function fetchGroupList(params) {
    params.t = new Date().getTime();
    return request(`/api/account/getRoles?${qs.stringify(params)}`, {});
}

export async function createGroup(params) {
    return request("/api/account/createRole", {
        method: 'post',
        body: `roleName=${params.roleName}&funcKeys=${params.funcKeys}`
    })
}

export async function deleteGroup(params) {
    return request("/api/account/deleteRoles", {
        method: 'post',
        body: `roleIds=${params.roleIds}`
    })
}

export async function updateGroup(params) {
    return request("/api/account/updateRole", {
        method: 'post',
        body: `roleId=${params.roleId}&roleName=${params.roleName}&funcKeys=${params.funcKeys}`
    })
}