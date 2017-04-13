import React, { Component } from 'react';
import { Row, Col, Button } from 'antd';
import './../index.less';

export default class AddHome extends Component{
    componentDidMount = () => {
        const { clearStep } = this.props;
        clearStep();
    };

    handlerClick = () => {
        const { nextStep } = this.props;
        nextStep();
    };

    render = ()=> {
        const { step } = this.props;
        return (
            <div className={`add-school-home-layout ${step === 0 ? "" : "hidden"}`}>
                <p>新增一所学校时，完整流程如下</p>
                <Row gutter={30}>
                    <Col span="5">
                        <div className="label">第1步</div>
                    </Col>
                    <Col span="19">
                        <div className="content">新增学校：在系统内新增一所学校</div>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span="5">
                        <div className="label">第2步</div>
                    </Col>
                    <Col span="19">
                        <div className="content">添加所属设备：为这所学校添加所属的VR设备</div>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span="5">
                        <div className="label">第3步</div>
                    </Col>
                    <Col span="19">
                        <div className="content">配置所属内容：为这所学校添加相应的内容套餐</div>
                    </Col>
                </Row>
                <Row gutter={30}>
                    <Col span="5">
                        <div className="label">第4步</div>
                    </Col>
                    <Col span="19">
                        <div className="content">添加管理员：为这所学校增加初始的超级管理员，学校管理员由该校超级管理员负责管理</div>
                    </Col>
                </Row>
                <div className="btn-group">
                    <Button size="large" type="primary" icon="plus" onClick={this.handlerClick}>开始新增学校</Button>
                </div>
            </div>
        )
    }
}