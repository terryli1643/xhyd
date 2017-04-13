import request from '../../utils/request';
import qs from 'qs';

export async function fetchSubjects(params) {
    return request(`/api/course/getSubjectList?${qs.stringify(params)}`, {});
}

export async function fetchApplyUpload() {
    return request(`/api/upload/applyUpload`, {});
}

export async function fetchCreateCourse(params) {
    return request("/api/course/createCourse", {
        method: 'post',
        body: qs.stringify(params)
    })
}

export async function fetchCourseDetail(params) {
    params.t = new Date().getTime();
    return request(`/api/course/getCourse?${qs.stringify(params)}`, {});
}

export async function fetchUpdateCourse(params) {
    return request("/api/course/updateCourse", {
        method: 'post',
        body: qs.stringify(params)
    })
}