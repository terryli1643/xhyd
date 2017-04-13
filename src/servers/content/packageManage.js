import request from '../../utils/request';
import qs from 'qs';

export async function fetchCreatePackage(params) {
    return request("/api/course/createPackage", {
        method: 'post',
        body: `packageName=${params.packageName}&courseIds=${params.courseIds}`
    })
}

export async function fetchUpdatePackage(params) {
    return request("/api/course/updatePackage", {
        method: 'post',
        body: `packageId=${params.packageId}&packageName=${params.packageName}&courseIds=${params.courseIds}`
    })
}

export async function fetchPackageDetail(params) {
    return request(`/api/course/getPackageCourse?${qs.stringify(params)}`, {});
}