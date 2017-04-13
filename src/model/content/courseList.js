import { observable, action } from "mobx";
import { fetchCourseList } from '../../servers/content/courseList';

class CourseListStore{
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
    getCourseList = async (payload) => {
        this.loading = true;

        this.page = payload.page || 1;

        const { pageSize, page } = this;

        const params = {
            limit: payload.pageSize === 1000000 ? -1 : pageSize,
            offset: (Number(page) - 1) * pageSize
        };

        const { data } = await fetchCourseList({ ...payload, ...params });

        this.loading = false;

        if (data.code === 0) {
            this.list = this.changeData(data.data.source);
            this.count = data.data.totalCount;
        }
    };

    @action
    changeData = (source) => {
        let newArr = [];
        for ( let data of source ) {
            newArr.push({ ...data.subject,...data.course });
        }
        return newArr
    }
}

const courseList = new CourseListStore();
export default courseList
