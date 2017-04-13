import React, { Component } from 'react';
import BaseInfo from '../../SchoolManage/BaseInfo/BaseInfo';

export default class FirstStep extends Component{
    render = () => {
        const { step, firstStep, clearStep, getProvinces, getCities, btnLoading,
            getCounties, provinces, cities, counties, area, setArea, fetchFlag,
            clearStatus, resetArea, infoLoading
        } =this.props;
        const BaseInfoProps = {
            firstStep, clearStep, getProvinces, getCities,
            getCounties, provinces, cities, counties, area,
            setArea, fetchFlag, btnLoading, clearStatus, resetArea,
            infoLoading
        };
        return (
            <div className={`add-step ${step === 1 ? "" : "hidden"}`}>
                <h3 className="text-center">第1步：新增学校</h3>
                <BaseInfo {...BaseInfoProps} />
            </div>
        )
    }
}