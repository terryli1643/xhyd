import { observable, action } from "mobx";
import { browserHistory } from 'react-router';
import { message } from 'antd';
import { fetchCreateComponent, fetchUpdateComponent,
    fetchComponentDetail } from '../../servers/content/componentManage';

class ComponentManageStore{
    @observable componentDetail;
    @observable btnLoading;
    @observable detailLoading;

    constructor(){
        this.componentDetail = {};
        this.btnLoading = false;
        this.detailLoading = false;
    }

    @action
    createComponent = async (payload) => {
        this.btnLoading = true;

        const { data } = await fetchCreateComponent(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            message.success("新增组件成功",2);
            browserHistory.goBack();
        }
    };
    
    @action
    updateComponent = async (payload) => {
        this.btnLoading = true;
        
        const { data } =await fetchUpdateComponent(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("更新组件成功",2);
            browserHistory.goBack();
        }
    };

    @action
    getComponentDetail = async (payload) => {
        this.detailLoading = true;
        
        const { data } = await fetchComponentDetail(payload);

        this.detailLoading = false;
        
        if (data.code === 0) {
            this.componentDetail = data.data
        }
    }
}

const componentManage = new ComponentManageStore();
export default componentManage
