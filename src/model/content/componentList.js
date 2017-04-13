import { observable, action } from "mobx";
import { fetchComponentList } from '../../servers/content/componentList';

class ComponentListStore{
    @observable list;
    @observable page;
    @observable pageSize;
    @observable count;
    @observable loading;

    constructor(){
        this.list = [];
        this.page = 1;
        this.pageSize = 10;
        this.count = 0;
        this.loading = false;
    }

    @action
    getComponentList = async (payload) => {
        this.loading = true;

        this.page = payload.page || 1;
        this.pageSize = payload.pageSize || 10;

        const { pageSize, page } = this;

        const params = {
            limit: pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchComponentList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = this.changeData(data.data.source);
            this.count = data.data.totalCount;
        }
    };

    @action
    changeData = (list) => {
        let newArr = [];
        list.map((data, index) => {
            newArr.push({
                ...data.fileVo,
                ...data.component
            })
        });
        return newArr
    }
}

const componentList = new ComponentListStore();
export default componentList
