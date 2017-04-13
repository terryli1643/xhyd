import { browserHistory } from "react-router";
import { observable, action } from "mobx";
import { message } from 'antd';
import ModalStore from "../common/modal";
import { fetchSnCode, fetchSaveUpdateSnCode } from '../../servers/school/deviceInfo';

class DeviceInfoStore extends ModalStore{
    @observable upDeviceType;
    @observable snDeviceType;
    @observable vrCount;
    @observable handleCount;
    @observable snData;
    @observable loading;
    @observable updateVrStatus;
    @observable updateHandleStatus;
    @observable updateVrList;
    @observable updateHandleList;
    @observable saveVrList;
    @observable saveHandleList;

    constructor(){
        super();
        this.upDeviceType = 1;
        this.vrCount = 0;
        this.handleCount = 0;
        this.loading = false;
        this.snData = {
            list: [],
            pageSize: 10,
            page: 1,
            count: 0
        };
        this.updateVrStatus = false;
        this.updateHandleStatus = false;
        this.snDeviceType = 1;
        this.updateVrList = [];
        this.updateHandleList = [];
        this.saveVrList = [];
        this.saveHandleList = [];
    }

    //　改变设备更新类型
    @action
    changeUpDeviceType = (type) => {
        this.upDeviceType = type
    };

    //　改变sn查询设备类型
    @action
    changeSnDeviceType = (type) => {
        this.snDeviceType = type
    };

    //　改变设备数量
    @action
    changeCount = (payload) => {
        if (payload.deviceType === 1) {
            this.changeUpdateStatus(1, true);
            this.vrCount = payload.count
        } else {
            this.changeUpdateStatus(2, true);
            this.handleCount = payload.count
        }
    };

    @action
    changeSnList = (payload) => {
        if (payload.deviceType === 1) {
            this.saveVrList = payload.list;
            this.updateVrList = this.changeSnUpdateData({ list: payload.list, deviceType: payload.deviceType })
        } else {
            this.saveHandleList = payload.list;
            this.updateHandleList = this.changeSnUpdateData({ list: payload.list, deviceType: payload.deviceType })
        }
    };

    @action
    changeSnUpdateData = (payload) => {
        let newDataArr = [];
        payload.list.map((data, index) => {
            newDataArr.push({
                no: index+1,
                deviceType: payload.deviceType,
                sn: data
            })
        });
        return newDataArr
    };

    //  清除数量
    @action
    clearCount = () => {
        this.vrCount = 0;
        this.handleCount = 0;
        this.updateVrList = [];
        this.updateHandleList = [];
        this.saveVrList = [];
        this.saveHandleList = [];
    };

    //　获取sn更新列表信息
    @action
    getUpdateList = async (payload) => {
        const { pageSize, page } = this.snData;
        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };
        this.loading = true;
        const { data } = await fetchSnCode({ ...params, ...payload });
        this.loading = false;
        if (data.code === 0) {
            this.snData = {
                ...this.snData,
                list: data.data.source ? this.changeSnData(data.data.source) : [],
                count: data.data.totalCount
            };
        }
    };

    //　分页改变
    @action
    pageChange = (payload) => {
        this.snData.page = payload.page;
        payload.schoolId ?
            this.getUpdateList({
                deviceType: this.snDeviceType,
                schoolId: payload.schoolId
            }) :
            this.getList({
                deviceType: this.snDeviceType
            })
    };

    @action
    resetPage = () => {
        this.snData.page = 1;
    };

    //　返回的数据增加编号字段
    @action
    changeSnData = (data) => {
        const { pageSize, page } = this.snData;
        let newData = [];
        for (let i = 0, length = data.length; i < length; i++) {
            newData.push({
                no: (Number(page) - 1) * pageSize + i + 1,
                deviceType: data[i].deviceType,
                sn: data[i].sn
            })
        }
        return newData
    };

    //  改变更新时设备的更新状态
    @action
    changeUpdateStatus = (type, status) => {
        if (type === 1) {
            this.updateVrStatus = status;
        } else {
            this.updateHandleStatus = status;
        }
    };

    //  保存更新操作
    @action
    saveUpdateSnCode = async (payload) => {
        const { data } = await fetchSaveUpdateSnCode({
            ...payload,
            vrList: this.saveVrList,
            handleList: this.saveHandleList
        });

        if (data.code === 0) {
            message.success("更新设备信息成功",2);
            browserHistory.goBack();
        }
    }
}

const deviceInfo = new DeviceInfoStore();
export default deviceInfo
