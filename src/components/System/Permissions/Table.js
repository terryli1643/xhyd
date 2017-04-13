import React, { Component } from 'react';
import { Table, Button, Input, Modal } from 'antd';
import { observable } from "mobx";
import moment from 'moment';
import { urlPushQuery } from '../../../utils/util';

const confirm = Modal.confirm;

export default class PermissionsTable extends Component {
    componentDidMount = () => {
        const { getUserGroups } = this.props;
        getUserGroups();
    };

    componentDidUpdate = (preProps) => {
        const { list, page, getUserList, location } = this.props;
        //  如果page > 1且没有数据时，page就-1在加载数据
        if ( list.length === 0 && list.length !== preProps.list.length && page > 1) {
            urlPushQuery(location.pathname, { ...location.query, page: page-1 });
            getUserList({ page: page-1 });
        }

        //  清除选中状态
        if (list !== preProps.list) {
            this.setState({
                selectedRow: []
            });
        }
    };

    deleteConfirm = (userId) => {
        const { deleteUser } = this.props;
        confirm({
            title: '确认提示',
            content: '确认删除此用户？删除后该用户将无法登录管理后台',
            onOk() {
                deleteUser({
                    adminIds : [userId]
                })
            }
        });
    };

    handleTableChange = (pagination) => {
        const { getUserList, location, selectChange } = this.props;
        urlPushQuery(location.pathname, { ...location.query, page: pagination.current });
        getUserList({ ...location.query, page: pagination.current });
        selectChange([]);
    };

    showModal = (info) => {
        const { showModal, setUpdateInfo } = this.props;
        showModal("changeUserInfo");
        setUpdateInfo(info)
    };

    render = () => {
        const { list, page, pageSize, count, loading, userGroups, 
            selectChange, selectedRows } = this.props;
        const data = observable(list).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        const rowSelection = {
            selectedRowKeys: selectedRows,
            onChange: (selectedRowKeys, selectedRows) => {
                selectChange(selectedRowKeys);
            },
            getCheckboxProps: record => ({
                disabled: record.userName === 'admin'    // Column configuration not to be checked
            })
        };
        const columns = [{
            title: '用户名',
            dataIndex: 'userName',
            key: 'userName',
            width: 220
        }, {
            title: '备注',
            dataIndex: 'comments',
            key: 'comments',
            width: 150
        }, {
            title: '用户组',
            dataIndex: 'roleId',
            key: 'roleId',
            render: (text, record) => (
                userGroups.map((data, index)=>{
                    if (record.roleId === data.roleId) {
                        return data.roleName
                    }
                })
            )
        }, {
            title: '创建时间',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (text, record) => (
                moment(record.createDate).format('YYYY/MM/DD HH:mm:ss')
            )
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Button disabled={record.userName === "admin"} type="primary" style={{ marginRight: 15 }} icon="edit" onClick={() => (this.showModal(record))}>编辑</Button>
                    <Button disabled={record.userName === "admin"} type="ghost" icon="delete" onClick={() => (this.deleteConfirm(record.userId))}>删除</Button>
                </div>
            )
        }];

        return (
            <div>
                <Table
                    rowSelection={rowSelection}
                    pagination={pagination}
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    onChange={this.handleTableChange}
                    bordered
                    rowKey="userId"
                />
            </div>
        )
    }
}
