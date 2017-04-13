import { observable, action } from "mobx";
import { fetchVerifyCode, fetchLogin, fetchLoginOut } from '../../servers/login/login';
import { browserHistory } from 'react-router';
import { message } from "antd"

class LoginStore{
    @observable verify;
    @observable btnLoading;
    @observable verifyError;

    constructor(){
        this.verify = "";
        this.btnLoading = false;
        this.verifyError = false
    }

    @action
    getVerify = async () => {
        const { data } = await fetchVerifyCode();
        if (data.code === 0) {
            this.verify = data.data
        }
    };

    @action
    loginPost = async (payload) => {
        this.btnLoading = true;
        
        const { data } = await fetchLogin(payload);

        this.btnLoading =false;
        
        if (data.code === 0) {
            localStorage.setItem("permissions", JSON.stringify(data.data.permissions));
            localStorage.setItem("username", data.data.admin.userName);
            localStorage.setItem("roleName", data.data.role.roleName);
            browserHistory.push("/admin/home")
        } else {
            this.verifyError = !this.verifyError;
            this.getVerify()
        }
    };
    
    @action
    loginOut = async () => {
        this.btnLoading = true;
        
        const { data } = await fetchLoginOut();

        this.btnLoading = false;
        
        if (data.code === 0) {
            localStorage.setItem("permissions", "");
            localStorage.setItem("username", "");
            localStorage.setItem("roleName", "");
            browserHistory.push("/")
        }
    }
}

const login = new LoginStore();
export default login
