import { observable, action } from "mobx";
import { fetchSchoolList } from '../../servers/school/schoolList';
import { fetchProvinces } from '../../servers/school/baseInfo';

class SchoolListStore{
    @observable list;
    @observable page;
    @observable pageSize;
    @observable count;
    @observable loading;
    @observable city;

    constructor(){
        this.list = [];
        this.page = 1;
        this.pageSize = 10;
        this.count = 0;
        this.loading = false;
        this.city = [];
    }

    @action
    getSchoolList = async (payload) => {
        this.loading = true;

        this.page = payload.page || 1;

        const { pageSize, page } = this;

        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchSchoolList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = data.data.source;
            this.count = data.data.totalCount;
        }
    };

    @action
    getSchoolCity = async () => {
        const { data } = await fetchProvinces();

        if (data.code === 0) {
            this.city = data.data.listItems;
        }
    };
}

const schoolList = new SchoolListStore();
export default schoolList
