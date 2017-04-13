import { observable, action } from "mobx";
import { fetchSchoolInfo, fetchResendEmail } from '../../servers/school/schoolInfo';
import { message } from 'antd';

class SchoolInfoStore{
    @observable info;
    @observable infoLoading;
    @observable btnLoading;

    constructor(){
        this.info = {};
        this.infoLoading = false;
        this.btnLoading = false;
    }

    @action
    getSchoolInfo = async (payload) => {
        this.info = {};
        this.infoLoading = true;

        const { data } = await fetchSchoolInfo(payload);

        this.infoLoading = false;

        if (data.code === 0) {
            this.info = data.data
        }
    };
    
    @action
    resendEmail = async (payload) => {
        this.btnLoading = true;
        
        const { data } = await fetchResendEmail(payload);
        
        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("重发邮件成功",2)
        }
    }
}

const schoolInfo = new SchoolInfoStore();
export default schoolInfo
