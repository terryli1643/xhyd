import { observable, action } from "mobx";
import { message } from 'antd'
import ModalStore from "../common/modal";
import { fetchUserList, fetchCreateUser, fetchDeleteUser,
    fetchUpdateUser } from '../../servers/system/permissions';
import { fetchGroupList } from '../../servers/system/userGroup';

class PermissionsStore extends ModalStore{
    @observable list;
    @observable page;
    @observable pageSize;
    @observable count;
    @observable loading;
    @observable updateInfo;
    @observable userGroups;
    @observable selectedRows;
    @observable btnLoading;

    constructor(){
        super();
        this.list = [];
        this.page = 1;
        this.pageSize = 10;
        this.count = 0;
        this.loading = false;
        this.updateInfo = {};
        this.userGroups = [];
        this.selectedRows = [];
        this.searchFields = {};
        this.btnLoading = false;
    }

    @action
    getUserList = async (payload) => {
        this.loading = true;

        this.searchFields = payload;

        this.page = payload.page || 1;

        const { pageSize, page } = this;

        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchUserList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = data.data.source;
            this.count = data.data.totalCount;
        }
    };

    @action
    addUser = async (payload) => {
        this.btnLoading = true;

        const { data } = await fetchCreateUser(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            message.success("增加用户成功",2);
            this.getUserList({
                ...this.searchFields,
                page: this.page
            });
            this.hideModal()
        }
    };

    @action
    deleteUser = async (payload) => {
        if (!payload) {
            payload = {
                adminIds: this.selectedRows
            };
        }

        const { data } = await fetchDeleteUser(payload);

        if (data.code === 0) {
            message.success("删除用户成功",2);
            this.getUserList({
                ...this.searchFields,
                page: this.page
            })
        }
    };


    @action
    updateUser = async (payload) => {
        this.btnLoading = true;
        
        const { data } = await fetchUpdateUser(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("更新用户成功",2);
            this.hideModal();
            this.getUserList({
                ...this.searchFields,
                page: this.page
            })
        }
    };

    @action
    setUpdateInfo = (payload) => {
        this.updateInfo = payload
    };
    
    @action
    selectChange = (selectedRows) => {
        this.selectedRows = selectedRows;
    };

    @action
    getUserGroups = async () => {
        const { data } = await fetchGroupList({
            offset:0,
            limit: -1
        });

        if (data.code === 0) {
            this.userGroups = data.data.source;
        }
    }
}

const permissions = new PermissionsStore();
export default permissions
