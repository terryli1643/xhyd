import { fetchApplyUpload } from '../servers/content/courseManage';
import Base64 from './base64';
import { message } from "antd"

export const applyUpload = async (func, self, md5, uploadSuccess, stateThis, refDom) => {
    try {
        const { data } = await fetchApplyUpload();

        if (data.code === 0) {
            const client = new OSS.Wrapper({
                region: data.data.region,
                accessKeyId: data.data.accessKeyId,
                accessKeySecret: data.data.accessKeySecret,
                bucket: data.data.bucket,
                endpoint: data.data.endpoint
            });
            const funData = {
                client: client,
                _this : self,
                callback: data.data.callback,
                md5: md5,
                uploadSuccess: uploadSuccess,
                stateThis: stateThis,
                refDom: refDom,
                userDir: data.data.userDir
            };
            return func(funData)
        }
    } catch (err) {
        message.error("上传出错请重新上传");
        self.value = null;
        stateThis.setState({
            error: true
        });
    }

};

export const uploadFile = async function (data) {
    let checkpoint;
    const file = data._this.files[0];

    if (localStorage.getItem(data.refDom) === data.md5) {
        const cpt = localStorage.getItem(`${data.refDom}cpt`);
        if (cpt) {
            checkpoint = cpt && JSON.parse(cpt);
            checkpoint.file = file
        }
    } else {
        localStorage.setItem(data.refDom,data.md5);
    }

    for (let i = 0; i < 3; i++) {
        try {
            const res = await data.client.multipartUpload(`${data.userDir}/${file.name}`, file, {
                checkpoint: checkpoint,
                progress: function* (percentage, cpt) {
                    if (localStorage.getItem(data.refDom) === data.md5) {
                        data.stateThis.setState({
                            percent: Math.floor(percentage * 100)
                        });
                        localStorage.setItem(`${data.refDom}cpt`,JSON.stringify(cpt));
                        checkpoint = cpt;
                    }
                },
                "headers": {
                    "x-oss-callback": data.callback,
                    "x-oss-callback-var": new Base64().encode(JSON.stringify({ "x:md5": data.md5 }))
                }
            });
            localStorage.setItem(`${data.refDom}cpt`,"");
            if (localStorage.getItem(data.refDom) === data.md5) {
                data.uploadSuccess && data.uploadSuccess(res);
            }
            break;
        } catch (err) {
            if (err.status === 404) {
                localStorage.setItem(`${data.refDom}cpt`,"");
                checkpoint = null;
            }
            if (i === 2) {
                message.error("上传出错请重新上传");
                data.stateThis.setState({
                    error: true
                });
                data._this.value = null;
            }
        }
    }
};
