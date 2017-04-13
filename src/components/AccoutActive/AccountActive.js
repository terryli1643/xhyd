import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { closeWindows } from '../../utils/util';

const createForm = Form.create;
const FormItem = Form.Item;

class AccountActive extends Component{
    state = {
        emailDirty: false
    };

    componentDidMount = () => {
        const {  checkVerify, location } = this.props;
        checkVerify({
            email: location.query.email,
            verifyCode: location.query.verify
        })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { setUser, location } = this.props;
                setUser({
                    userName: location.query.email,
                    pwd: values.pwd
                });
            }
        });
    };

    handleCancel = () => {
        closeWindows()
    };


    handleEmailBlur = (e) => {
        const value = e.target.value;
        this.setState({ emailDirty: this.state.emailDirty || !!value });
    };

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('pwd')) {
            callback('两次密码输入不一致');
        } else {
            callback();
        }
    };

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value.length < 7) {
            callback(new Error("请输入不少于7位数的密码"))
        }
        if (value && this.state.emailDirty) {
            form.validateFields(['pwd_again'], { force: true });
        }
        callback();
    };

    render = () => {
        const {
            form: { getFieldDecorator }, location, activeStatus, btnLoading, time
        } = this.props;
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
            <div className="layout-top">
                <div className="layout-header">
                    <div className="layout-wrapper">
                        <div className="layout-logo">美行思远VR教育管理中心</div>
                    </div>
                </div>
                <div className="layout-wrapper">
                    <div className="layout-container" style={{ minHeight: 500, marginTop: 50 }}>
                        <div className="mx-layout-500">
                            <div className={`${activeStatus !== 0 && "hidden"}`}>
                                <h1 className="text-center" style={{ margin: "50px 0 30px 0" }}>帐号激活</h1>
                                <Form
                                    onSubmit={this.handleSubmit}
                                >
                                    <FormItem
                                        {...formItemLayout}
                                        label="您的邮箱账号为"
                                    >
                                        <p style={{ fontSize: 14 }}>{location.query.email}</p>
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="请输入您的密码"
                                    >
                                        {getFieldDecorator('pwd', {
                                            rules: [
                                                {
                                                    required: true, message: '请输入您的密码'
                                                },
                                                {
                                                    validator: this.checkConfirm
                                                }
                                            ]
                                        })(
                                            <Input type="password" placeholder="支持大小写字母数字及符号，不少于7位" onBlur={this.handleEmailBlur} maxLength="20"/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="请确认您的密码"
                                    >
                                        {getFieldDecorator('pwd_again', {
                                            rules: [
                                                {
                                                    required: true, message: '请再次输入您的密码'
                                                },
                                                {
                                                    validator: this.checkPassword
                                                }
                                            ]
                                        })(
                                            <Input type="password" placeholder="支持大小写字母数字及符号，不少于7位" maxLength="20"/>
                                        )}
                                    </FormItem>
                                    <FormItem {...tailFormItemLayout}>
                                        <div>
                                            <Button type="primary" loading={btnLoading} htmlType="submit" size="large" style={{ width: 100 }}>保存</Button>
                                            <Button type="default" loading={btnLoading} size="large" style={{ float: "right", width: 100 }} onClick={this.handleCancel}>取消</Button>
                                        </div>
                                    </FormItem>
                                </Form>
                            </div>
                            <div className={`active-success text-center ${activeStatus !== 1 && "hidden"}`} style={{ margin: "100px 0 30px 0" }}>
                                <h2>您的账号已激活成功，请前往本校管理后台登录使用</h2>
                                <h2>
                                    {
                                        time === 0 ? "若页面未关闭请手动关闭" : `此页面将在 ${time}S… 后关闭,`
                                    }
                                </h2>
                            </div>
                            <div className={`active-success text-center ${activeStatus !== 2 && "hidden"}`} style={{ margin: "100px 0 30px 0" }}>
                                <h2>此激活链接已失效，请联系客服人员重新获得激活邮件</h2>
                                <h2>
                                    {
                                        time === 0 ? "若页面未关闭请手动关闭" : `此页面将在 ${time}S… 后关闭,`
                                    }
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="layout-footer">
                    © 2016 IDEALSEE.All rights reserved 蜀 ICP No.12032937-7.
                </div>
            </div>
        )
    }
}

export default AccountActive =  createForm({})(AccountActive)