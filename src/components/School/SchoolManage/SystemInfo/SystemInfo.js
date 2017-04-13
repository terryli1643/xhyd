import React, { Component } from 'react';
import { browserHistory } from "react-router";
import { Form, Input, Icon, Cascader, Row, Col, Button, message } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class SystemInfo extends Component{
    state = {
        emailDirty: false
    };

    componentDidMount = () => {
        const { getSchoolInfo, isChangeAdmin, location } = this.props;
        if (isChangeAdmin) {
            getSchoolInfo(location.query)
        }
    };

    componentDidUpdate = () => {
        if (this.props.clearStatus) {
            this.props.form.resetFields();
            this.props.changeClearStatus()
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {
                    fourthStep, changeAdminEmail, location, isChangeAdmin,
                    info
                } = this.props;
                if (isChangeAdmin) {
                    if (values.email === info.userEmail) {
                        message.error("修改邮箱与原邮箱一致，请重新检查")
                    } else {
                        changeAdminEmail && changeAdminEmail({
                            ...location.query,
                            email: values.email
                        });
                    }
                } else {
                    fourthStep && fourthStep({
                        email: values.email
                    });
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

    prevStepClick = () => {
        const { prevStep } = this.props;
        prevStep();
    };

    handleEmailBlur = (e) => {
        const value = e.target.value;
        this.setState({ emailDirty: this.state.emailDirty || !!value });
    };

    checkEmail = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('email')) {
            callback('两次邮箱输入不一致，请重新输入');
        } else {
            callback();
        }
    };

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.emailDirty) {
            form.validateFields(['email_again'], { force: true });
        }
        callback();
    };

    renderFooter = () => {
        const { nextStep, btnLoading } = this.props;
        if (nextStep) {
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
                        完成
                    </Button>
                    <Button 
                        type="primary"
                        size="large"
                        loading={btnLoading}
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
                        onClick={this.handleCancel}
                        loading={btnLoading}
                    >
                        取消
                    </Button>
                </div>
            )
        }
    };

    render = () => {
        const { form: { getFieldDecorator }, isChangeAdmin } = this.props;
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
            <Form onSubmit={this.handleSubmit} style={{ maxWidth: 640, margin: "50px auto 0" }}>
                {
                    isChangeAdmin &&  <h2 className="text-center" style={{ marginBottom: 30 }}>请输入新的系统管理员邮箱</h2>
                }
                <FormItem
                    {...formItemLayout}
                    label="管理员邮箱"
                >
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email', message: '请填写正确的邮箱地址'
                            },
                            {
                                required: true, message: '请填写管理员邮箱'
                            },
                            {
                                validator: this.checkConfirm
                            }
                        ]
                    })(
                        <Input placeholder="请输入管理员邮箱" onBlur={this.handleEmailBlur} maxLength="100"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="请再次输入"
                >
                    {getFieldDecorator('email_again', {
                        rules: [
                            {
                                required: true, message: '请再次输入管理员邮箱'
                            },
                            {
                                validator: this.checkEmail
                            }
                        ]
                    })(
                        <Input placeholder="请再次输入管理员邮箱" maxLength="100"/>
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    {
                        this.renderFooter()
                    }
                </FormItem>
            </Form>
        )
    }
}

export default SystemInfo = createForm({})(SystemInfo);