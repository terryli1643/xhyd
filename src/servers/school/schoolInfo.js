import request from '../../utils/request';
import qs from 'qs';

export async function fetchSchoolInfo(params) {
    return request(`/api/school/info?${qs.stringify(params)}`, {});
}

export async function fetchResendEmail(params) {
    return request("/api/account/resentEmail", {
        method: 'post',
        body: qs.stringify(params)
    })
}