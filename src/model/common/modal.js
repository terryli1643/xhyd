import { observable, action } from "mobx";

class ModalStore {
    @observable modalType;
    @observable modalVisible;

    constructor(){
        this.modalType = "";
        this.modalVisible = false
    }

    @action
    showModal = (type) => {
        this.modalType = type;
        this.modalVisible = true
    };

    @action
    hideModal = () => {
        this.modalType = "";
        this.modalVisible = false
    };
}

export default ModalStore
