import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DeviceInfo from '../../SchoolManage/DeviceInfo/DeviceInfo';
import DeviceSnModal from '../../SchoolManage/DeviceInfo/DeviceSnModal';
import DeviceUpdateModal from '../../SchoolManage/DeviceInfo/DeviceUpdateModal';

@inject('deviceInfo') @observer
export default class SecondStep extends Component{

    render = () => {
        const { 
            step, nextStep, prevStep, clearStep, modalType,
            modalVisible, showModal, hideModal, secondStep,
            clearStatus,
            deviceInfo: { 
                vrCount, handleCount, changeCount, loading,
                upDeviceType, changeUpDeviceType, snDeviceType, 
                changeSnDeviceType, getList, pageChange, resetPage,
                changeSnList, updateHandleStatus, updateVrStatus,
                updateVrList, updateHandleList, clearCount
            }
        } = this.props;
        
        const DeviceInfoProps = {
            nextStep, prevStep, clearStep, showModal,
            vrCount, handleCount, getList, changeUpDeviceType,
            changeSnDeviceType, clearCount
        };
        
        const DeviceSnModalProps = {
            modalType, modalVisible, hideModal, snDeviceType, 
            pageChange, resetPage, loading, updateHandleStatus, 
            updateVrStatus, updateVrList, updateHandleList
        };
        
        const DeviceUpdateModalProps = {
            modalType, modalVisible, hideModal, changeCount,
            upDeviceType, secondStep, changeSnList, clearCount,
            clearStatus
        };
        
        return (
            <div className={`add-step ${step === 2 ? "" : "hidden"}`}>
                <h3 className="text-center">第2步：新增所属设备</h3>
                <DeviceInfo {...DeviceInfoProps} />
                <DeviceSnModal {...DeviceSnModalProps} />
                <DeviceUpdateModal {...DeviceUpdateModalProps} />
            </div>
        )
    }
}