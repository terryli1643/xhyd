import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Icon, Spin } from 'antd';
import { Link, browserHistory } from "react-router";

const columns4 = [{
    title: 'name1',
    dataIndex: 'name1'
}, {
    title: 'value1',
    dataIndex: 'value1',
    width: 250
}, {
    title: 'name2',
    dataIndex: 'name2'
}, {
    title: 'value2',
    dataIndex: 'value2',
    width: 250
}];

export default class SchoolManageInfo extends Component{
    componentDidMount = () => {
        const {
            getSchoolInfo, location
        } = this.props;
        if (location) {
            getSchoolInfo && getSchoolInfo(location.query)
        }
    };

    handelClick = ()=> {
        browserHistory.goBack()
    };

    handelCancel = () => {
        const { goFirstStep } = this.props;
        goFirstStep()
    };
    
    handelResendEmail = () => {
        const { schoolId, resendEmail } = this.props;
        resendEmail({
            schoolId
        })
    };

    renderFooter = () => {
        const { goFirstStep, confirmAddSchool, btnLoading } = this.props;
        if (goFirstStep) {
            return (
                <Col span="24" className="text-center">
                    <Button
                        type="primary"
                        size="large"
                        loading={btnLoading}
                        onClick={confirmAddSchool}
                        style={{ marginRight: 50 }}
                    >
                        确认添加
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        loading={btnLoading}
                        onClick={this.handelCancel}
                    >
                        返回修改
                    </Button>
                </Col>
            )
        } else {
            return (
                <Col span="24">
                    <Button type="primary" size="large" onClick={this.handelClick}>
                        <Icon type="left" />返回学校列表
                    </Button>
                </Col>
            )
        }
    };

    render = () => {
        const { goFirstStep, info, vrCount, handleCount, schoolId, infoLoading, btnLoading } = this.props;
        const columns2 = [{
            title: 'name',
            dataIndex: 'name'
        }, {
            title: 'value',
            dataIndex: 'value',
            width: 230,
            render: (record, text) => (
                record === "待激活" || record === "已激活" ?
                    <div>{record}
                        <Button loading={btnLoading} style={{ marginLeft: 10 }} onClick={() => this.handelResendEmail()} type="primary">重发激活邮件</Button>
                    </div>
                    : record
            )
        }];
        const baseData = [
            {
                key: '1',
                name1: '学校名称',
                value1: info.schoolName,
                name2: "所处地区",
                value2: goFirstStep ? info.fields : info.position
            }, {
                key: '2',
                name1: '联系人',
                value1: goFirstStep ? info.contactName : info.contactPerson,
                name2: "联系电话",
                value2: goFirstStep ? info.contactPhoneNumber : info.contactPhone
            }, {
                key: '3',
                name1: '对接BD',
                value1: goFirstStep ? info.pBDName : info.bd,
                name2: "/",
                value2: "/"
            }
        ];
        const deviceInfo = [
            {
                key: '1',
                name: 'VR一体机数量',
                value: goFirstStep ? vrCount : info.vrCount
            }, {
                key: '2',
                name: 'VR手柄数量',
                value: goFirstStep ? handleCount : info.handleCount
            }
        ];
        const courseInfo = [
            {
                key: '1',
                name: '课程套餐名称',
                value: info.packageName
            }
        ];
        const systemInfo = goFirstStep ? [
            {
                key: '1',
                name: '系统管理员邮箱',
                value: info.email
            }
        ] : [
            {
                key: '1',
                name: '系统管理员邮箱',
                value: info.userEmail
            }, {
                key: '2',
                name: '状态',
                value: info.userAccountStatus
            }
        ];

        return (
            <div style={{ width: 700, margin: "30px auto 0" }}>
                <Spin tip="Loading..." spinning={infoLoading}>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span="24">
                            <Card title="基础信息" extra={goFirstStep || <Link to={`/admin/school/change/base_info?schoolId=${schoolId}`}>修改</Link>}>
                                <Table className="info-table" columns={columns4} dataSource={baseData} showHeader={false} bordered pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span="24">
                            <Card title="设备信息" extra={goFirstStep || <Link to={`/admin/school/change/device_info?schoolId=${schoolId}`}>修改</Link>}>
                                <Table style={{ width : 370 }} className="info-table" columns={columns2} dataSource={deviceInfo} showHeader={false} bordered pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 10 }}>
                        <Col span="24">
                            <Card title="课程信息" extra={goFirstStep || <Link to={`/admin/school/change/course_info?schoolId=${schoolId}`}>修改</Link>}>
                                <Table style={{ width : 370 }} className="info-table" columns={columns2} dataSource={courseInfo} showHeader={false} bordered pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 20 }}>
                        <Col span="24">
                            <Card title="系统信息" extra={goFirstStep || <Link to={`/admin/school/change/system_info?schoolId=${schoolId}`}>修改</Link>}>
                                <Table style={{ width : 370 }} className="info-table" columns={columns2} dataSource={systemInfo} showHeader={false} bordered pagination={false} />
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        {
                            this.renderFooter()
                        }
                    </Row>
                </Spin>
            </div>
        )
    }
}