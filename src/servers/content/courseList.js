import request from '../../utils/request';
import qs from 'qs';

export async function fetchCourseList(params) {
    params.t = new Date().getTime();
    return request(`/api/course/searchCourses?${qs.stringify(params)}`, {});
}