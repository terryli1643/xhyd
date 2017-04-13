import request from '../../utils/request';
import qs from 'qs';

export async function fetchProvinces(params) {
    return request(`/api/school/getProvinces?${qs.stringify(params)}`, {});
}

export async function fetchCities(params) {
    return request(`/api/school/getCities?${qs.stringify(params)}`, {});
}

export async function fetchCounties(params) {
    return request(`/api/school/getCounties?${qs.stringify(params)}`, {});
}

export async function fetchPositionOption(params) {
    return request(`/api/school/getPositionOptions?${qs.stringify(params)}`, {});
}

export async function updateSchool(params) {
    return request("/api/school/updateSchool", {
        method: 'post',
        body: qs.stringify(params)
    })
}