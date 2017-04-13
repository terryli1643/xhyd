import { observable, action } from "mobx";
import ModalStore from "../common/modal";
import { fetchPackageList, fetchPackageListByName } from '../../servers/content/packageList';
import { fetchPackageDetail } from '../../servers/content/packageManage';

class PackageListStore extends ModalStore{
    @observable list;
    @observable page;
    @observable pageSize;
    @observable count;
    @observable loading;
    @observable packageDetail;
    @observable searchFields;
    @observable getDetailLoading;

    constructor(){
        super();
        this.list = [];
        this.page = 1;
        this.pageSize = 10;
        this.count = 0;
        this.loading = false;
        this.getDetailLoading = false;
        this.packageDetail = {
            list: [],
            name: "",
            createTime: ""
        };
        this.searchFields = {}
    }

    @action
    getPackageList = async (payload) => {
        this.loading = true;

        this.page = payload.page || 1;

        const { pageSize, page } = this;

        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchPackageList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = this.changeListData(data.data.source);
            this.count = data.data.totalCount;
        }
    };

    @action
    changeListData = (list) => {
        let newArr = [];
        list.map((data, index) => {
            newArr.push({
                ...data.apackage,
                schoolCount: data.schoolCount
            })
        });
        return newArr
    };

    @action
    getInfoPackageList = async (payload) => {
        if (payload.name === undefined) {
            payload.name = "";
        }

        this.loading = true;

        this.page = payload.page || this.page;

        const { pageSize, page } = this;

        const params = {
            ...this.searchFields,
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchPackageListByName({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = data.data.source;
            this.count = data.data.totalCount;
        }
    };
    
    @action
    saveSearchFields = (payload) => {
        this.searchFields = payload;
        this.page = 1
    };

    @action
    seePackageDetail = (id) => {
        this.showModal("packageListModal");
        this.getPackageDetail({
            packageId: id
        })
    };

    @action
    getPackageDetail = async (payload) => {
        this.packageDetail = {
            list: [],
            name: "",
            createTime: ""
        };

        this.getDetailLoading = true;
        
        const { data } = await fetchPackageDetail(payload);

        this.getDetailLoading = false;

        if (data.code === 0) {
            this.packageDetail = this.changeDetailData(data.data);
        }
    };

    @action
    changeDetailData = (payload) => {
        let newObj = {
            list: []
        };
        newObj.name = payload.pkg.name;
        newObj.createTime = payload.pkg.createTime;
        payload.pageVo.map((data, index) => {
            const { course, subject } = data;
            newObj.list.push({
                no: index+1,
                name: course.name,
                id: course.id,
                level2Name: subject.level2Name,
                level1Name: subject.level1Name,
                contentType: course.contentType,
                version: course.version
            })
        });
        return newObj
    };
    
    @action
    resetPackageList = () => {
        this.searchFields = {};
        this.page = 1;
        this.packageDetail = {
            list: [],
            name: "",
            createTime: ""
        };
        this.hideModal()
    }
}

const packageList = new PackageListStore();
export default packageList
