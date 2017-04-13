import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Button, Form, Row, Col, Input } from 'antd';
import "./LoginLayout.less"

const createForm = Form.create;
const FormItem = Form.Item;

export default class LoginLayout extends Component {
    componentDidMount = () => {
        const permission = localStorage.getItem("permissions");
        const permissions = permission === "" || JSON.parse(permission);
        const roleName = localStorage.getItem("roleName");
        const username = localStorage.getItem("username");
        if (permissions && roleName && username) {
            browserHistory.push("/admin/home")
        }
        const { getVerify } = this.props;
        getVerify();
    };

    componentDidUpdate = (preProps) => {
        if (this.props.verifyError !== preProps.verifyError) {
            this.props.form.resetFields(["verifyCode"])
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const { loginPost } = this.props;
                loginPost(values)
            }
        });
    };

    render = () => {
        const { form: { getFieldDecorator }, verify, getVerify, btnLoading } = this.props;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 }
        };
        return (
            <section className={`section`}>
                <Row type="flex" justify="space-around" align="middle" className={`loginModal`}>
                    <Col span={7} className={`login`}>
                        <h2 className={`textCenter`}>西河韵达管理系统</h2>
                        <Form layout="horizontal" onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                            >
                                {
                                    getFieldDecorator('username', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true, message: '请填写用户名'
                                            },
                                            {
                                                min: 3, message: "用户名有效长度为3-40位"
                                            },
                                            {
                                                max: 40, message: "用户名有效长度为3-40位"
                                            }
                                        ]
                                    })(
                                        <Input size="large" maxLength="40" type="text" placeholder="请输入用户名"/>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="密码"
                            >
                                {
                                    getFieldDecorator('pwd', {
                                        initialValue: "",
                                        rules: [
                                            {
                                                required: true, message: '请填写密码'
                                            },
                                            {
                                                min: 7, message: "请输入长度为7-20位的密码"
                                            },
                                            {
                                                max: 20, message: "请输入长度为7-20位的密码"
                                            }
                                        ]
                                    })(
                                        <Input size="large" maxLength="20" type="password" autoComplete="off" placeholder="请输入密码"/>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="验证码"
                            >
                                <Row gutter={8}>
                                    <Col span={16}>
                                        {getFieldDecorator('verifyCode', {
                                            initialValue: "",
                                            rules: [{
                                                required: true, message: '验证码不能为空'
                                            }]
                                        })(
                                            <Input size="large" autoComplete="off" placeholder="请输入验证码"/>
                                        )}
                                    </Col>
                                    <Col span={8}>
                                        <img onClick={getVerify} className={`captcha`} src={verify && ('data:image/png;base64,' + verify)}/>
                                    </Col>
                                </Row>
                            </FormItem>
                            <Col span={13} offset={7} >
                                <Button className="button" loading={btnLoading} size="large" htmlType="submit" type="primary">登录</Button>
                            </Col>
                        </Form>
                    </Col>
                </Row>
                <footer className={`footer`}>
                    当前版本 V1.0,
                    为保证浏览效果，推荐使用Chrome/Firefox/IE10以上版本浏览器浏览
                </footer>
            </section>

        );
    }
}

LoginLayout = createForm()(LoginLayout);
