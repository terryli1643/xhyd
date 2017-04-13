import request from '../../utils/request';
import qs from 'qs';

export async function fetchComponentList(params) {
    params.t = new Date().getTime();
    return request(`/api/component/getComponents?${qs.stringify(params)}`, {});
}