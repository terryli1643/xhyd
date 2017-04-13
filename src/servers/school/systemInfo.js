import request from '../../utils/request';
import qs from 'qs';

export async function fetchChangeEmail(params) {
    return request("/api/account/changeUserEmail", {
        method: 'post',
        body: qs.stringify(params)
    })
}