import { observable, action } from "mobx";
import ModalStore from "../common/modal";
import { fetchCreatePackage, fetchPackageDetail, fetchUpdatePackage } from '../../servers/content/packageManage';
import { browserHistory } from 'react-router';
import { message } from 'antd';

class PackageMangeStore extends ModalStore{
    @observable selectedRows;
    @observable selectedRowKeys;
    @observable packageName;
    @observable btnLoading;
    @observable detailLoading;

    constructor(){
        super();
        this.selectedRows = [];
        this.selectedRowKeys = [];
        this.packageName = "";
        this.btnLoading = false;
        this.detailLoading = false;
    }
    
    @action
    createPackage = async () => {
        this.btnLoading = true;
        
        const payload = {
            packageName: this.packageName,
            courseIds: this.selectedRowKeys
        };

        const { data } = await fetchCreatePackage(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("课程创建成功",2);
            browserHistory.goBack()
        }
    };
    
    @action
    saveSelectedRows = (payload) => {
        this.selectedRows = this.changeRowsData(payload)
    };
    
    @action
    changeRowsData = (payload) => {
        let newArr = [];
        payload.map((data, index)=>{
            newArr.push({
                ...data,
                no: index+1
            })
        });
        return newArr
    };

    @action
    saveSelectedRowKeys = (payload) => {
        this.selectedRowKeys = payload
    };
    
    @action
    savePackageName = (name) => {
        this.packageName = name
    };

    @action
    getPackageDetail = async (payload) => {
        this.selectedRows = [];
        this.selectedRowKeys = [];
        this.detailLoading = true;
        
        const { data } = await fetchPackageDetail(payload);

        this.detailLoading = false;

        if (data.code === 0) {
            this.selectedRows = this.changeDetailData(data.data).dataArr;
            this.selectedRowKeys = this.changeDetailData(data.data).keyArr;
        }
    };

    @action
    changeDetailData = (payload) => {
        let dataArr = [], keyArr = [];
        this.packageName = payload.pkg.name;
        payload.pageVo.map((data, index) => {
            const { course, subject } = data;
            dataArr.push({
                no: index+1,
                name: course.name,
                id: course.id,
                level2Name: subject.level2Name,
                level1Name: subject.level1Name,
                contentType: course.contentType,
                version: course.version
            });
            keyArr.push(course.id)
        });
        return {
            dataArr,keyArr
        }
    };
    
    @action
    updatePackage = async (payload) => {
        this.btnLoading = true;
        
        const params = {
            ...payload,
            packageName: this.packageName,
            courseIds: this.selectedRowKeys
        };
        
        const { data } = await fetchUpdatePackage(params);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("更新套餐成功",2);
            browserHistory.goBack()
        }
    };

    @action
    resetPackageManage = () => {
        this.selectedRows = [];
        this.selectedRowKeys = [];
        this.packageName = "";
        this.hideModal()
    }
}

const packageManage = new PackageMangeStore();
export default packageManage
