import React, { Component } from 'react';
import { browserHistory } from "react-router";
import { Card, Col, Row, Button } from 'antd';
import "./index.less";

export default class DeviceInfo extends Component{
    componentDidMount = () => {
        const { clearCount, getSchoolInfo, changeUpdateStatus, query } = this.props;
        if (query) {
            getSchoolInfo && getSchoolInfo(query);
            changeUpdateStatus && changeUpdateStatus(1, false);
            changeUpdateStatus && changeUpdateStatus(2, false);
        } else {
            clearCount && clearCount()
        }
    };

    handleCancel = () => {
        browserHistory.goBack()
    };

    handleCancelStep = () => {
        const { clearStep } = this.props;
        clearStep();
    };

    nextStepClick = () => {
        const { nextStep } = this.props;
        nextStep()
    };

    prevStepClick = () => {
        const { prevStep } = this.props;
        prevStep();
    };

    openModal = (modalType, deviceType) => {
        const { showModal, changeUpDeviceType, changeSnDeviceType, 
            getUpdateList, query, updateVrStatus, updateHandleStatus,
        } = this.props;
        showModal(modalType);
        if (modalType === "deviceUpdateModal") {
            changeUpDeviceType(deviceType);
        } else if (query && query.schoolId) {
            changeSnDeviceType(deviceType);
            if ( (deviceType === 1 && !updateVrStatus)
                    || (deviceType === 2 && !updateHandleStatus) ) {
                getUpdateList({
                    ...query,
                    deviceType: deviceType
                })
            }
        } else {
            changeSnDeviceType(deviceType);
        }
    };

    handleSave = () => {
        const { saveUpdateSnCode, query } = this.props;
        saveUpdateSnCode({
            ...query
        })
    };
    
    renderFooter = () => {
        const { nextStep, vrCount, handleCount, updateVrStatus, updateHandleStatus } = this.props;
        if (nextStep) {
            return (
                <div>
                    <Button
                        type="default"
                        size="large"
                        style={{ width: 100 }}
                        onClick={this.handleCancelStep}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        style={{ float: "right", width: 100 }}
                        disabled={ vrCount === 0 || handleCount === 0}
                        onClick={this.nextStepClick}
                    >
                        下一步
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        style={{ float: "right", width: 100, marginRight:15 }}
                        onClick={this.prevStepClick}
                    >
                        上一步
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button
                        type="primary"
                        disabled={!updateVrStatus && !updateHandleStatus}
                        size="large"
                        style={{ width: 100 }}
                        onClick={this.handleSave}
                    >
                        保存
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        style={{ float: "right", width: 100 }}
                        onClick={this.handleCancel}
                    >
                        取消
                    </Button>
                </div>
            )
        }
    };

    render = () => {
        const { vrCount , handleCount, info, updateVrStatus, updateHandleStatus } = this.props;
        return (
            <div className="device-layout">
                <Card title="VR一体机">
                    <Row className="device-row">
                        <Col span="8">
                            <h3 className="device-col1">当前拥有设备数：</h3>
                        </Col>
                        <Col span="16">
                            <p className="device-col2">{info && !updateVrStatus ? info.vrCount : vrCount}台</p>
                        </Col>
                    </Row>
                    <Row className="device-row">
                        <Col span="8">
                            <h3 className="device-col1">更新学校所属设备：</h3>
                        </Col>
                        <Col span="16">
                            <Button type="primary" size="large" onClick={() => this.openModal("deviceUpdateModal", 1)}>更新设备</Button>
                        </Col>
                        <Col span="24">
                            <p className="desc">说明：每次更新都需上传全部设备的SN码，只有在这里被添加后，相应设备才能使用该校课程</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <h3 className="device-col1">查看现有设备SN码：</h3>
                        </Col>
                        <Col span="16">
                            <Button type="primary" size="large" onClick={() => this.openModal("deviceSnModal", 1)}>查看SN码</Button>
                        </Col>
                    </Row>
                </Card>
                <Card title="VR控制手柄">
                    <Row className="device-row">
                        <Col span="8">
                            <h3 className="device-col1">当前拥有设备数：</h3>
                        </Col>
                        <Col span="16">
                            <p className="device-col2">{info && !updateHandleStatus ? info.handleCount : handleCount}台</p>
                        </Col>
                    </Row>
                    <Row className="device-row">
                        <Col span="8">
                            <h3 className="device-col1">更新学校所属设备：</h3>
                        </Col>
                        <Col span="16">
                            <Button type="primary" size="large" onClick={() => this.openModal("deviceUpdateModal", 2)}>更新设备</Button>
                        </Col>
                        <Col span="24">
                            <p className="desc">说明：每次更新都需上传全部设备的SN码，只有在这里被添加后，相应设备才能被监控和管理</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <h3 className="device-col1">查看现有设备SN码：</h3>
                        </Col>
                        <Col span="16">
                            <Button type="primary" size="large" onClick={() => this.openModal("deviceSnModal", 2)}>查看SN码</Button>
                        </Col>
                    </Row>
                </Card>
                <div className="btn-group">
                    {
                        this.renderFooter()
                    }
                </div>
            </div>
        )
    }
}