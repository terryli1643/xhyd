import { observable, action } from "mobx";
import { browserHistory } from 'react-router';
import { fetchCheckVerify, fetchSetUser } from '../../servers/activeAccount/activeAccount';
import { closeWindows } from '../../utils/util';

class ActiveAccountStore{
    @observable activeStatus;
    @observable btnLoading;
    @observable time;

    constructor () {
        this.activeStatus = "";
        this.btnLoading = false;
        this.time = 10;
    }

    @action
    checkVerify = async (payload) => {
        const { data } = await fetchCheckVerify(payload);
        
        if (data.code === 0) {
            if (!data.data) {
                this.activeStatus = 2;
                this.changeTime();
                setTimeout(function () {
                    closeWindows()
                },10000)
            } else {
                this.activeStatus = 0;
            }
        }

    };
    
    @action
    setUser = async (payload) => {
        this.btnLoading = true;

        const { data } = await fetchSetUser(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            this.activeStatus = 1;
            this.changeTime();
            setTimeout(function () {
                closeWindows()
            },10000)
        }
    };

    @action
    changeTime = () => {
        let timer = "";
        timer = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
                clearInterval(timer)
            }
        }, 1000)
    }
}

const activeAccount = new ActiveAccountStore();
export default activeAccount
