import React,  { Component } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

export default class AdminManageModal extends Component {
    componentDidUpdate = (prevProps, prevState) => {
        const { modalVisible, modalType, updateInfo, getUserGroups, userGroups } = this.props;

        //请求用户组
        if (modalType !== prevProps.modalType) {
            this.props.form.resetFields();
            getUserGroups()
        }

        if (modalVisible && modalType === "changeUserInfo" && modalType !== prevProps.modalType) {
            let roleId = "";
            userGroups.map((data, index) => {
                if (updateInfo.roleId === data.roleId) {
                    roleId = updateInfo.roleId
                }
            });
            this.props.form.setFieldsValue({
                name: updateInfo.userName,
                pwd: updateInfo.pwd,
                comments: updateInfo.comments,
                roleId: `${roleId}`
            });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const { modalType, addUser, updateUser, updateInfo } = this.props;
                if (modalType ==="addUserInfo") {
                    addUser(values)
                } else {
                    updateUser({
                        ...values,
                        userId: updateInfo.userId
                    })
                }
            }
        });
    };

    handleCancel = () => {
        const { hideModal } = this.props;
        hideModal();
    };

    render = () => {
        const { form: { getFieldDecorator }, modalType, modalVisible, userGroups ,btnLoading } = this.props;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };

        return (
            <div>
                <Modal
                    visible={modalVisible && (modalType ==="addUserInfo" || modalType === "changeUserInfo")}
                    title={modalType === "addUserInfo" ? "增加管理员" : "编辑管理员"}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button  key="submit" loading={btnLoading} size="large" type="primary" htmlType="submit" onClick={this.handleSubmit}>确认</Button>,
                        <Button  key="close" loading={btnLoading} size="large" onClick={this.handleCancel}>取消</Button>
                    ]}
                    maskClosable={false}
                >
                    {
                        <Form layout="horizontal" onSubmit={this.handleSubmit}>
                            <FormItem
                                {...formItemLayout}
                                label="用户名"
                                required
                            >
                                {getFieldDecorator('name', {
                                    initialValue: "",
                                    rules: [{
                                        transform: (value) => {
                                            return value.trim()
                                        }
                                    }, {
                                        required: true, message: '用户名不能为空'
                                    }, {
                                        min: 3, message: "用户名不少于3位"
                                    }, {
                                        max: 40, message: "用户名不超过40位"
                                    }]
                                })(
                                    <Input autoComplete="off" maxLength="40" placeholder="请输入用户名"/>
                                )}
                            </FormItem>
                            <input type="text" style={{ opacity:0,position:"absolute" }} tabIndex="-1"/>
                            <FormItem
                                {...formItemLayout}
                                label="登录密码"
                            >
                                {getFieldDecorator('pwd', (modalType === "addUserInfo") ? {
                                    initialValue: "",
                                    rules: [{
                                        required: true, message: '登录密码不能为空'
                                    }, {
                                        min: 7, message: "用户密码不少于7位"
                                    }]
                                } : {
                                    initialValue: "",
                                    rules: [ {
                                        min: 7, message: "用户密码不少于7位"
                                    }]
                                })(
                                    <Input type="password" autoComplete="off" placeholder="请输入登录密码"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="备注："
                            >
                                {getFieldDecorator('comments',{
                                    initialValue: ""
                                })(
                                    <Input maxLength="50" placeholder="请输入备注"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="用户组："
                            >
                                {getFieldDecorator('roleId',{
                                    initialValue: "",
                                    rules: [{
                                        required: true, message: '用户组不能为空'
                                    }]
                                })(
                                    <Select>
                                        {
                                            userGroups.map((data, index)=>{
                                               return <Option key={index} value={`${data.roleId}`}>{data.roleName}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
}

AdminManageModal = createForm({})(AdminManageModal);