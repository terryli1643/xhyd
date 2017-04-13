import request from '../../utils/request';
import qs from 'qs';

export async function confirmCreateSchool(params) {
    return request("/api/school/createSchool", {
        method: 'post',
        body: `schoolName=${params.schoolName}&contactName=${params.contactName}`+
        `&contactPhoneNumber=${params.contactPhoneNumber}&county=${params.county}`+
        `&pBDName=${params.pBDName}&vrList=${params.vrList}&handleList=${params.handleList}`+
        `&packageId=${params.packageId}&email=${params.email}`
    })
}

export async function fetchCheckSchoolName(params) {
    return request(`/api/school/checkSchoolName?${qs.stringify(params)}`, {});
}

export async function fetchCheckEmail(params) {
    return request(`/api/school/checkEmail?${qs.stringify(params)}`, {});
}