import { observable, action } from "mobx";
import ModalStore from "../common/modal";
import { fetchGroupList, createGroup, deleteGroup, updateGroup } from '../../servers/system/userGroup';
import { message } from 'antd';

class UserGroupStore extends ModalStore{
    @observable list;
    @observable page;
    @observable pageSize;
    @observable count;
    @observable loading;
    @observable updateInfo;
    @observable btnLoading;

    constructor(){
        super();
        this.list = [];
        this.page = 1;
        this.pageSize = 10;
        this.count = 0;
        this.loading = false;
        this.updateInfo = {};
        this.btnLoading = false;
    }
    
    @action
    getGroupList = async (payload) => {
        this.loading = true;

        this.page = payload.page || 1;

        const { pageSize, page } = this;

        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };
        
        const { data } = await fetchGroupList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = data.data.source;
            this.count = data.data.totalCount;
        }
    };
    
    @action
    addUserGroup = async (payload) => {
        this.btnLoading = true;

        const { data } = await createGroup(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("增加用户组成功",2);
            this.getGroupList({
                page: this.page
            });
            this.hideModal()
        }
    };
    
    @action
    deleteUserGroup = async (payload) => {
        const { data } = await deleteGroup(payload);

        if (data.code === 0) {
            message.success("删除用户组成功",2);
            this.getGroupList({
                page: this.page
            })
        }
    };
    
    
    @action
    updateUserGroup = async (payload) => {
        this.btnLoading = true;

        const { data } = await updateGroup(payload);

        this.btnLoading = false;
        
        if (data.code === 0) {
            message.success("更新用户组成功",2);
            this.hideModal();
            this.getGroupList({
                page: this.page
            })
        }
    };
    
    @action
    setUpdateInfo = (payload) => {
       this.updateInfo = payload
    }
}

const userGroup = new UserGroupStore();
export default userGroup
