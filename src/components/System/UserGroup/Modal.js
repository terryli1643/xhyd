import React, { Component } from 'react';
import { Button, Modal, Form, Input, Checkbox } from 'antd';
import MenuData from '../../../routes/pages/Layout.js/menuData';
import './index.less'

const createForm = Form.create;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const getPermissionsList = ()=> {
    let permissionsList = { "list1": [], "list2": [], "list3": [] };
    MenuData.map(function (mainmenu, index) {
        mainmenu.submenu.map(function (submenu) {
            if (index !== 0) {
                permissionsList[`list${index}`].push(submenu.name)
            }
        })
    });
    return permissionsList
};

const getPermissionsValue = (permissionsName) => {
    let valueList = [];
    MenuData.map(function (mainmenu) {
        mainmenu.submenu.map(function (submenu, index) {
            permissionsName.map(function (permissnameArr) {
                if (permissnameArr === submenu.name){
                    valueList.push(submenu.key)
                }
            })

        })
    });
    return valueList
};

const getPermissionsLabel = (permissions) => {
    let permissionsLabel = { "label1": [], "label2": [], "label3": [] };
    MenuData.map(function (mainmenu, index) {
        mainmenu.submenu.map(function (submenu) {
            if (permissions[submenu.key] && index !== 0) {
                permissionsLabel[`label${index}`].push(submenu.name)
            }
        })
    });
    return permissionsLabel
};

const checkName = (rule, value, callback) => {
    if (!value) {
        callback('用户组名称不能为空')
    } else if(!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
        callback('不允许输入符号');
    } else {
        callback();
    }
};

export default class UserGroupManageModal extends Component {
    state = {
        keyError: false,
        indeterminate1: false,
        checkAll1: false,
        indeterminate2: false,
        checkAll2: false,
        indeterminate3: false,
        checkAll3: false
    };

    //关闭弹窗时清除信息
    componentDidUpdate = (prevProps, prevState) => {
        const { modalVisible, modalType, updateInfo } = this.props;
        if (modalVisible !== prevProps.modalVisible) {
            this.props.form.resetFields();
            this.setState({
                keyError: false,
                indeterminate1: false,
                checkAll1: false,
                indeterminate2: false,
                checkAll2: false,
                indeterminate3: false,
                checkAll3: false
            })
        }

        if (modalVisible && modalType === "changeUserGroup" && modalType !== prevProps.modalType) {
            const { label1, label2, label3 } = getPermissionsLabel(updateInfo.permissions);
            this.props.form.setFieldsValue({
                roleName: updateInfo.roleName,
                key1: label1,
                key2: label2,
                key3: label3
            });
            this.setState({
                indeterminate1: label1.length > 0,
                checkAll1: label1.length === 2,
                indeterminate2: label2.length > 0,
                checkAll2: label2.length === 4,
                indeterminate3: label3.length > 0,
                checkAll3: label3.length === 2
            })
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            this.onCheckAllValidator();
            setTimeout(() => {
                if (!errors) {
                    const { keyError } = this.state;
                    const { addUserGroup, updateUserGroup, modalType, updateInfo } = this.props;
                    if (!keyError) {
                        if (modalType === "userGroupModal"){
                            addUserGroup({
                                roleName: values.roleName,
                                funcKeys: getPermissionsValue(values.key1).concat(getPermissionsValue(values.key2),getPermissionsValue(values.key3))
                            })
                        } else {
                            updateUserGroup({
                                roleId: updateInfo.roleId,
                                roleName: values.roleName,
                                funcKeys: getPermissionsValue(values.key1).concat(getPermissionsValue(values.key2),getPermissionsValue(values.key3))
                            })
                        }
                    }
                }
            },0)
        });

    };

    handleCancel = () => {
        const { hideModal } = this.props;
        hideModal();
    };

    onChange1 = (checkedList) => {
        this.setState({
            indeterminate1: !!checkedList.length && (checkedList.length < getPermissionsList().list1.length),
            checkAll1: checkedList.length === getPermissionsList().list1.length
        });
        this.onCheckAllValidator();
    };

    onCheckAllChange1 = (e) => {
        this.setState({
            indeterminate1: e.target.checked,
            checkAll1: e.target.checked
        });
        this.props.form.setFields({ key1: { value: e.target.checked ? getPermissionsList().list1 : [] } });
        this.onCheckAllValidator();
    };

    onChange2 = (checkedList) => {
        this.setState({
            indeterminate2: !!checkedList.length && (checkedList.length < getPermissionsList().list2.length),
            checkAll2: checkedList.length === getPermissionsList().list2.length
        });
        this.onCheckAllValidator();
    };

    onCheckAllChange2 = (e) => {
        this.setState({
            indeterminate2: e.target.checked,
            checkAll2: e.target.checked
        });
        this.props.form.setFields({ key2: { value: e.target.checked ? getPermissionsList().list2 : [] } });
        this.onCheckAllValidator();
    };

    onChange3 = (checkedList) => {
        this.setState({
            indeterminate3: !!checkedList.length && (checkedList.length < getPermissionsList().list3.length),
            checkAll3: checkedList.length === getPermissionsList().list3.length
        });
        this.onCheckAllValidator();
    };

    onCheckAllChange3 = (e) => {
        this.setState({
            indeterminate3: e.target.checked,
            checkAll3: e.target.checked
        });
        this.props.form.setFields({ key3: { value: e.target.checked ? getPermissionsList().list3 : [] } });
        this.onCheckAllValidator();
    };

    onCheckAllValidator = () => {
        const { form: { getFieldValue } } = this.props;

        setTimeout(() => {
            const key1 = getFieldValue("key1"),
                key2 = getFieldValue("key2"),
                key3 = getFieldValue("key3");
            if ( key1.length === 0 && key2.length === 0 && key3.length === 0) {
                this.setState({
                    keyError: true
                })
            } else{
                this.setState({
                    keyError: false
                })
            }
        },0)
    };


    render = () => {
        const { form: { getFieldDecorator }, modalType, modalVisible, btnLoading } = this.props;
        const { keyError } = this.state;
        const permissions = getPermissionsList();
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        const formItemLayout1 = {
            labelCol: { span: 0 },
            wrapperCol: { span: 18,offset:6 }
        };
        return (
            <div>
                <Modal
                    visible={modalVisible && (modalType === "userGroupModal" || modalType === "changeUserGroup")}
                    title={modalType==="changeUserGroup" ? "用户组编辑" : "用户组设置"}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button  key="submit" loading={btnLoading} size="large" type="primary" htmlType="submit" onClick={this.handleSubmit}>提交</Button>,
                        <Button  key="close" loading={btnLoading} size="large" onClick={this.handleCancel}>取消</Button>
                    ]}
                    maskClosable={false}
                >
                    {
                        <Form layout="horizontal" onSubmit={this.handleSubmit} className="addUserGroup">
                            <FormItem
                                {...formItemLayout}
                                label="用户组名称"
                                required
                            >
                                {getFieldDecorator('roleName', {
                                    initialValue: "",
                                    rules: [{
                                        transform: (value) => {
                                            return value.trim()
                                        }
                                    }, {
                                        validator: checkName
                                    }]
                                })(
                                    <Input autoComplete="off" maxLength="20"/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="权限设置"
                                required
                            >
                                <Checkbox
                                    indeterminate={this.state.indeterminate1}
                                    onChange={this.onCheckAllChange1}
                                    checked={this.state.checkAll1}
                                    className="key1"
                                >
                                    <span className="checkbox-title">学校管理</span>
                                </Checkbox>
                                {getFieldDecorator('key1', {
                                    initialValue: [],
                                    onChange : this.onChange1
                                })(
                                    <CheckboxGroup options={permissions.list1}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout1}
                                label=""
                            >
                                <Checkbox
                                    indeterminate={this.state.indeterminate2}
                                    onChange={this.onCheckAllChange2}
                                    checked={this.state.checkAll2}
                                    className="key1"
                                >
                                    <span className="checkbox-title">内容管理</span>
                                </Checkbox>
                                {getFieldDecorator('key2', {
                                    initialValue: [],
                                    onChange : this.onChange2
                                })(
                                    <CheckboxGroup options={permissions.list2}/>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout1}
                                label=""
                            >
                                <Checkbox
                                    indeterminate={this.state.indeterminate3}
                                    onChange={this.onCheckAllChange3}
                                    checked={this.state.checkAll3}
                                >
                                    <span className="checkbox-title">系统管理</span>
                                </Checkbox>
                                {getFieldDecorator('key3', {
                                    initialValue: [],
                                    onChange : this.onChange3
                                })(
                                    <CheckboxGroup options={permissions.list3}/>
                                )}
                                {
                                    keyError && <span className="error">请至少选择一个权限</span>
                                }
                            </FormItem>
                        </Form>
                    }
                </Modal>
            </div>
        )
    }
}

UserGroupManageModal = createForm({})(UserGroupManageModal);
