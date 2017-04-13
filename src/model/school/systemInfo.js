import { observable, action } from "mobx";
import { browserHistory } from 'react-router';
import { fetchChangeEmail } from '../../servers/school/systemInfo';
import { message } from 'antd'

class SystemInfoStore{
    @observable btnLoading = false;
    
    @action
    changeAdminEmail = async (payload) => {
        this.btnLoading = true;
        
        const { data } = await fetchChangeEmail(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("修改管理员邮箱成功",2);
            browserHistory.goBack()
        }
    }
}

const systemInfo = new SystemInfoStore();
export default systemInfo
