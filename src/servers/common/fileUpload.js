import request from '../../utils/request';

export async function fetchUploadFile(params) {
    return request("/api/upload/uploadFileToCloud", {
        method: 'post',
        body: params
    })
}