import request from '../../utils/request';
import qs from 'qs';

export async function fetchPackageList(params) {
    params.t = new Date().getTime();
    return request(`/api/course/searchPackage?${qs.stringify(params)}`, {});
}

export async function fetchPackageListByName(params) {
    params.t = new Date().getTime();
    return request(`/api/course/searchPackageByName?${qs.stringify(params)}`, {});
}