import { observable, action } from "mobx";
import { browserHistory } from "react-router";
import { message } from "antd";
import ModalStore from "../common/modal";
import { confirmCreateSchool, fetchCheckSchoolName, fetchCheckEmail } from '../../servers/school/addSchool';


class AddSchoolStore extends ModalStore{
    @observable step;
    @observable deviceType;
    @observable info;
    @observable btnLoading;
    @observable clearStatus;
    @observable infoLoading;

    constructor(){
        super();
        this.step = 0;
        this.deviceType = 1;
        this.info = {};
        this.btnLoading = false;
        this.clearStatus = false;
        this.infoLoading = false
    }

    @action
    firstStep = async (payload) => {
        this.btnLoading = true;

        const { data } = await fetchCheckSchoolName(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            this.info = { ...this.info, ...payload };
            this.step++
        }
    };

    @action
    secondStep = (payload) => {
        this.info = { ...this.info, ...payload };
    };

    @action
    thirdStep = (payload) => {
        this.info = { ...this.info, ...payload };
        this.hideModal();
        this.step++;
    };

    @action
    fourthStep = async (payload) => {
        this.btnLoading = true;

        const { data } = await fetchCheckEmail(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            this.info = { ...this.info, ...payload };
            this.step++
        }
    };

    @action
    confirmAddSchool = async () => {
        this.btnLoading = true;

        const { info } = this;

        const payload = {
            schoolName: info.schoolName,
            contactName: info.contactName,
            contactPhoneNumber: info.contactPhoneNumber,
            county: info.county,
            pBDName: info.pBDName,
            vrList: info.vrList,
            handleList: info.handleList,
            packageId: info.packageId,
            email: info.email
        };

        const { data } = await confirmCreateSchool(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            message.success(`学校已添加成功，请提醒该校管理员使用`,2);
            browserHistory.push("/admin/school/list")
        }
    };

    @action
    nextStep = () => {
        this.step++
    };

    @action
    prevStep = () => {
        this.step--
    };

    @action
    clearStep = () => {
        this.step = 0;
        this.clearStatus = true;
    };
    
    @action
    goFirstStep = () => {
        this.step = 1;
    };
    
    @action
    changeClearStatus = () => {
        this.clearStatus = false;
    }
}

const addSchool = new AddSchoolStore();
export default addSchool
