import { observable, action } from "mobx";

class SheetList {
    @observable number;

    constructor () {
        this.number = '';
    }
}

export default SheetList
