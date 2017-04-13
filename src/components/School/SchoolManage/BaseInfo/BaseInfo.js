import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { browserHistory } from "react-router";
import { observable } from "mobx";
import { Form, Input, Icon, Cascader, Row, Col, Button, Spin } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

const checkPhone = (rule, value, callback) => {
    const phone = value ? value.valueOf() : "";
    if ( !(/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/.test(phone)) && phone !== "" ) {
        callback(new Error('请填写正确的联系号码'));
    } else {
        callback();
    }
};

const checkArea = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请选择所属地区'));
    } else if (value.length !== 3) {
        callback(new Error('请选择完整的省市区'));
    }　else {
        callback();
    }
};

class BaseInfo extends Component{
    componentDidMount = () =>　{
        const { 
            getProvinces, info, getSchoolInfo, getPositionOptions,
            location
        } = this.props;
        if (location) {
            getSchoolInfo && getSchoolInfo(location.query);
            getPositionOptions && getPositionOptions(location.query);
        }
        if (info === undefined) {
            getProvinces();
        }
    };

    componentDidUpdate = (nextProps, nextState) => {
        if (this.props.info !== nextProps.info) {
            this.setFields()
        }
        
        if (this.props.clearStatus) {
            this.props.form.resetFields();
            this.props.resetArea()
        }
    };

    setFields = () => {
        const { info } = this.props;
        this.props.form.setFieldsValue({
            schoolName: info.schoolName,
            area: [info.provinceId, info.cityId, info.countyId],
            contactName: info.contactPerson,
            contactPhoneNumber: info.contactPhone,
            pBDName: info.bd
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { firstStep, updateSchool, location } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.county = values.area[2];
                if (firstStep) {
                    const fieldsNode = findDOMNode(this.refs.createSchoolForm);
                    const fields = fieldsNode.querySelector(".ant-cascader-picker-label").innerText;
                    values.fields = fields.split("/").join("");
                    firstStep(values);
                } else {
                    updateSchool({
                        ...values,
                        schoolId: location.query.schoolId
                    })
                }
            }
        });
    };

    handleCancel = () => {
        browserHistory.goBack()
    };

    handleCancelStep = () => {
        const { clearStep } = this.props;
        clearStep();
    };

    renderFooter = () => {
        const { firstStep, btnLoading } = this.props;
        if (firstStep) {
            return (
                <div>
                    <Button 
                        type="default" 
                        size="large"
                        loading={btnLoading}
                        style={{ width: 100 }}
                        onClick={this.handleCancelStep}
                    >
                        取消
                    </Button>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large" 
                        loading={btnLoading}
                        style={{ float: "right", width: 100 }}
                    >
                        下一步
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button 
                        type="primary"
                        onClick={this.handleSubmit}
                        size="large" 
                        style={{ width: 100 }}
                        loading={btnLoading}
                    >
                        保存
                    </Button>
                    <Button 
                        type="default" 
                        size="large" 
                        style={{ float: "right", width: 100 }}
                        loading={btnLoading}
                        onClick={this.handleCancel}
                    >
                        取消
                    </Button>
                </div>
            )
        }
    };

    onChange = (value, selectedOptions) => {
        const { getCities, getCounties } = this.props;
        const { length } = value;
        if (length === 1) {
            getCities({
                provinceId: value[length-1]
            })
        } else if (length === 2) {
            getCounties({
                cityId: value[length-1]
            })
        }
        this.loadData(selectedOptions)
    };

    loadData = (selectedOptions) => {
        const { setArea } = this.props;
        let timer = "";
        //定时器为了解决异步获取数据问题
        timer = setInterval(()=>{
            const { fetchFlag } = this.props;
            if (!fetchFlag) {
                const targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;
                if (targetOption.type === 1) {
                    setArea(targetOption, "cities");
                } else {
                    setArea(targetOption, "countries");
                }

                clearInterval(timer)
            }
        },100);
    };

    render = () => {
        const { form: { getFieldDecorator }, area, infoLoading } = this.props;
        const areaArr = observable(area).slice();
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span: 14,
                offset: 6
            }
        };
        return (
            <Spin tip="Loading..." spinning={infoLoading} >
                <Form
                    onSubmit={this.handleSubmit}
                    style={{ maxWidth: 640, margin: "50px auto 0" }}
                    ref="createSchoolForm"
                >
                    <FormItem
                        {...formItemLayout}
                        label="学校名称"
                    >
                        {getFieldDecorator('schoolName', {
                            initialValue: "",
                            rules: [
                                {
                                    transform: (value) => {
                                        return value.trim()
                                    }
                                },
                                {
                                    required: true, message: '请填写学校名称'
                                }
                            ]
                        })(
                            <Input placeholder="请输入学校名称" maxLength="50"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="所属地区"
                        required
                    >
                        {getFieldDecorator('area',  {
                            rules: [
                                {
                                    validator: checkArea
                                }
                            ]
                        })(
                            <Cascader
                                options={areaArr}
                                onChange={this.onChange}
                                loadData={this.loadData}
                                placeholder="请选择所属地区"
                                allowClear={false}
                                changeOnSelect
                            />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="学校联系人"
                    >
                        {getFieldDecorator('contactName', {
                            initialValue: ""
                        })(
                            <Input placeholder="请输入学校联系人姓名" maxLength="50"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="联系电话"
                    >
                        {getFieldDecorator('contactPhoneNumber', {
                            initialValue: "",
                            rules: [{
                                validator: checkPhone
                            }]
                        })(
                            <Input placeholder="请输入学校联系电话" maxLength="20"/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="对接BD"
                    >
                        {getFieldDecorator('pBDName', {
                            initialValue: ""
                        })(
                            <Input placeholder="请输入公司内BD姓名" maxLength="50"/>
                        )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        {
                            this.renderFooter()
                        }
                    </FormItem>
                </Form>
            </Spin>
        )
    }
}

export default BaseInfo = createForm({})(BaseInfo);