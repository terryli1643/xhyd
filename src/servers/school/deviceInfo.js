import request from '../../utils/request';
import qs from 'qs';

export async function fetchSnCode(params) {
    return request(`/api/school/querySNCode?${qs.stringify(params)}`, {});
}

export async function fetchSaveUpdateSnCode(params) {
    return request("/api/school/updateSNCode", {
        method: 'post',
        body: `schoolId=${params.schoolId}&vrList=${params.vrList}&handleList=${params.handleList}`
    })
}






















