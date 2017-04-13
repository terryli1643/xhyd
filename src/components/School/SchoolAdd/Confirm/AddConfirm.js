import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import SchoolManageInfo from '../../SchoolManage/List/InfoList';

@inject('deviceInfo') @observer
export default class AddConfirm extends Component{
    render = () => {
        const { 
            step, goFirstStep, info, confirmAddSchool, btnLoading,
            infoLoading,
            deviceInfo: { vrCount, handleCount }
        } = this.props;
        const SchoolManageInfoProps = {
            goFirstStep, info, vrCount, handleCount, confirmAddSchool,
            btnLoading, infoLoading
        };
        return (
            <div className={`add-step ${step === 5 ? "" : "hidden"}`}>
                <h2 className="text-center">完成添加</h2>
                <p className="text-center">请再次确认相关信息是否正确</p>
                <SchoolManageInfo {...SchoolManageInfoProps} />
            </div>
        )
    }
}