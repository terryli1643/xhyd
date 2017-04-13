import request from '../../utils/request';
import qs from 'qs';

export async function fetchChangePackage(params) {
    return request("/api/school/changePackage", {
        method: 'post',
        body: qs.stringify(params)
    })
}