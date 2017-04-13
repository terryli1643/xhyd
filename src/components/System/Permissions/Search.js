import React, { Component } from 'react';
import { Form, Input, Row, Col, Select, Button, Modal } from 'antd';
import { urlPushQuery } from '../../../utils/util';

const createForm = Form.create;
const FormItem = Form.Item;
const confirm = Modal.confirm;

export default class PermissionsSearch extends Component {
    componentDidMount = () => {
        const { getUserList, location } = this.props;
        //判断是不是返回操作
        if (!!location.query) {
            this.setFields();
        } else {
            this.getList()
        }
    };
    
    getList = () => {
        const { getUserList, location, form: { getFieldsValue } } = this.props;
        getUserList({ ...location.query, ...getFieldsValue() })
    };


    setFields = () => {
        const { form: { setFieldsValue }, location } = this.props;
        setFieldsValue(location.query);
        this.getList();
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                const { location } = this.props;
                urlPushQuery(location.pathname, { page: 1, ...values });
                setTimeout(() => this.getList(),0);
            }
        });
    };

    deleteConfirm = () => {
        const { deleteUser } = this.props;
        confirm({
            title: '确认提示',
            content: '确认删除这些用户？删除后该用户将无法登录管理后台',
            onOk() {
                deleteUser()
            }
        });
    };

    showModal = () => {
        const { showModal } = this.props;
        showModal("addUserInfo");
    };

    render = () => {
        const { form: { getFieldDecorator }, selectedRows } = this.props;

        return (
            <div>
                <Form layout="horizontal" className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                    <Row gutter={16}>
                        <Col sm={6}>
                            <FormItem
                                label="搜索"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                            >
                                {
                                    getFieldDecorator("name", {
                                        initialValue: ""
                                    })(
                                        <Input size="large" placeholder="请输入用户名进行搜索"/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col sm={10}>
                            <Button type="primary" size="large" htmlType="submit" icon="search">搜索</Button>
                        </Col>
                        <Col sm={8} style={{ textAlign: 'right' }}>
                            <Button type="primary" size="large" icon="plus" style={{ marginRight: 15 }} onClick={this.showModal}>新增用户</Button>
                            <Button size="large" icon="delete" disabled={selectedRows.length === 0} onClick={this.deleteConfirm}>删除所选</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

PermissionsSearch = createForm({})(PermissionsSearch);
