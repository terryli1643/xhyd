import request from '../../utils/request';
import qs from 'qs';

export async function fetchCreateComponent(params) {
    return request("/api/component/createComponent", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchUpdateComponent(params) {
    return request("/api/component/updateComponent", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchComponentDetail(params) {
    return request(`/api/component/get?${qs.stringify(params)}`, {});
}