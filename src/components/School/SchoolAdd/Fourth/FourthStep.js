import React, { Component } from 'react';
import SystemInfo from '../../SchoolManage/SystemInfo/SystemInfo';

export default class FourthStep extends Component{
    render = () => {
        const { 
            step, nextStep, prevStep, clearStep, fourthStep,
            btnLoading, clearStatus, changeClearStatus 
        } = this.props;
        const SystemInfoProps = {
            nextStep, prevStep, clearStep, fourthStep, btnLoading,
            clearStatus, changeClearStatus
        };
        return (
            <div className={`add-step ${step === 4 ? "" : "hidden"}`}>
                <h3 className="text-center">第4步：新增系统管理员<span>系统管理员通过邮箱激活即可使用</span></h3>
                <SystemInfo {...SystemInfoProps} />
            </div>
        )
    }
}