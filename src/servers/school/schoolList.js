import request from '../../utils/request';
import qs from 'qs';

export async function fetchSchoolList(params) {
    params.t = new Date().getTime();
    return request(`/api/school/search?${qs.stringify(params)}`, {});
}

export async function fetchSchoolCity(params) {
    return request(`/api/school/querySchoolCities?${qs.stringify(params)}`, {});
}