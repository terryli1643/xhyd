import { observable, action } from "mobx";
import { fetchChangePackage } from '../../servers/school/packageInfo';
import { fetchSchoolInfo } from '../../servers/school/schoolInfo';
import { message } from 'antd';
import { browserHistory } from 'react-router';

class PackageInfoStore{
    @observable packageInfo;
    @observable btnLoading;
    @observable selectedRowKey;
    @observable selectedRows;

    constructor(){
        this.packageInfo = {};
        this.btnLoading = false;
        this.selectedRowKey = [];
        this.selectedRows = [];
    }

    /*  修改学校套餐
    * */
    @action
    changePackage = async (payload) => {
        this.btnLoading = true;

        const params = {
            ...payload,
            packageId: this.selectedRowKey[0]
        };
        
        const { data } = await fetchChangePackage(params);

        this.btnLoading = false;

        if (data.code === 0) {
            message.success("修改学校套餐成功",2);
            browserHistory.goBack()
        }
    };
    
    /*  改变选中的key值
    * */
    @action
    saveSelectedKey = (selectedRowKey, selectedRows) => {
        this.selectedRowKey = selectedRowKey;
        this.selectedRows = selectedRows;
    };
    
    @action
    resetPackageInfo = () => {
        this.packageInfo = {};
        this.selectedRowKey = [];
    };

    @action
    getPackageId = async (payload) => {
        const { data } = await fetchSchoolInfo(payload);

        if (data.code === 0) {
            this.selectedRowKey = [data.data.packageId]
        }
    }
}

const packageInfo = new PackageInfoStore();
export default packageInfo
