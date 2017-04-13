import { observable, action } from "mobx";
import { fetchProvinces, fetchCities, fetchCounties,
    fetchPositionOption, updateSchool } from '../../servers/school/baseInfo';
import { message } from 'antd';
import { browserHistory } from "react-router";

const changeData = (type, array) => {
    let newValue = [];

    array.map((data, index) => {
        if (type === "provinces") {
            newValue.push(
                {
                    value: data.proviceId,
                    label: data.proviceName,
                    isLeaf: false,
                    type: 1
                }
            )
        } else if (type === "cities") {
            newValue.push(
                {
                    value: data.cityId,
                    label: data.cityName,
                    isLeaf: false,
                    type: 2
                }
            )
        } else {
            newValue.push(
                {
                    value: data.countyId,
                    label: data.countyName,
                    type: 3
                }
            )
        }
    });
    return newValue
};

//组装数据成省市区格式
const changeOption = (data) => {
    let newArrPro = [],
        newArrCities = [],
        newArrCounties = [];

    data.positionProvinceOptions.map((data, index) => {
        newArrPro.push(
            {
                value: data.proviceId,
                label: data.proviceName,
                isLeaf: false,
                type: 1
            }
        )
    });

    data.positionCityOptions.map((data, index) => {
        newArrCities.push(
            {
                value: data.cityId,
                label: data.cityName,
                isLeaf: false,
                type: 2
            }
        )
    });

    data.positionCountyOptions.map((data, index) => {
        newArrCounties.push(
            {
                value: data.countyId,
                label: data.countyName,
                type: 3
            }
        )
    });

    newArrCities.map((data, index) => {
        if (data.cityId === newArrCounties[0].cityId) {
            data.children = newArrCounties
        }
    });

    newArrPro.map((data, index) => {
        if (data.proviceId === newArrCities[0].proviceId) {
            data.children = newArrCities
        }
    });

    return newArrPro
};

class BaseInfoStore{
    @observable provinces;
    @observable cities;
    @observable counties;
    @observable area;
    @observable fetchFlag;
    @observable btnLoading;

    constructor(){
        this.provinces = [];
        this.cities = [];
        this.counties = [];
        this.area = [];
        this.fetchFlag = false;
        this.btnLoading = false;
    }

    @action
    getProvinces = async () => {
        const { data } = await fetchProvinces();
        if (data.code === 0) {
            this.provinces = changeData("provinces",data.data.listItems);
            this.setArea(this.provinces)
        }
    };
    
    @action
    getCities = async (payload) => {
        this.fetchFlag = true;
        const { data } = await fetchCities(payload);
        this.fetchFlag = false;
        if (data.code === 0) {
            this.cities = changeData("cities",data.data.listItems)
        }
    };

    @action
    getCounties = async (payload) => {
        this.fetchFlag = true;
        const { data } = await fetchCounties(payload);
        this.fetchFlag = false;
        if (data.code === 0) {
            this.counties = changeData("counties",data.data.listItems)
        }
    };

    @action
    getPositionOptions = async (paylaod) => {
        const { data } = await fetchPositionOption(paylaod);

        if (data.code === 0) {
            this.setArea(changeOption(data.data))
        }
    };

    @action
    setArea = (area, type) => {
        if (type === "cities") {
            area.children = this.cities;
            area.loading = false;
            this.area = [...this.area, ...area];
        } else if (type === "countries") {
            area.children = this.counties;
            area.loading = false;
            this.area = [...this.area, ...area];
        } else {
            this.area = area
        }
    };
    
    @action
    resetArea = () => {
        this.provinces = [];
        this.cities = [];
        this.counties = [];
    };

    @action
    updateSchool = async (payload) => {
        this.btnLoading = true;
        
        const { data } = await updateSchool(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            message.success("修改学校信息成功",2);
            browserHistory.push(`/admin/school/manage?schoolId=${payload.schoolId}`)
        }
    }
}

const baseInfo = new BaseInfoStore();
export default baseInfo
