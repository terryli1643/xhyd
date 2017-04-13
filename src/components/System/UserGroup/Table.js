import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
import { observable } from "mobx";
import { urlPushQuery } from '../../../utils/util';

const confirm = Modal.confirm;

export default class UserGroupTable extends Component{
    state = {
        selectedRow: []
    };

    componentDidMount = () => {
        this.getList()
    };

    componentDidUpdate = (preProps) => {
        const { list, page, getGroupList } = this.props;
        //  如果page > 1且没有数据时，page就-1在加载数据
        if ( list.length === 0 && list.length !== preProps.list.length && page > 1) {
            urlPushQuery(location.pathname, { page: page-1 });
            getGroupList({ page: page-1 });
        }

        //  清除选中状态
        if (list !== preProps.list) {
            this.setState({
                selectedRow: []
            });
        }
    };

    getList = () => {
        const { getGroupList, location } = this.props;
        getGroupList({ ...location.query })
    };

    handleTableChange = (pagination) => {
        const { getGroupList, location } = this.props;
        urlPushQuery(location.pathname, { page: pagination.current });
        getGroupList({ page: pagination.current })
    };

    deleteConfirm = (id) => {
        const { deleteUserGroup } = this.props;
        const roleIds = id ? [id] : this.state.selectedRow;
        confirm({
            title: '确认提示',
            content: '确认删除此用户组？删除后该用户组的用户将全部无法登录管理后台',
            onOk() {
                deleteUserGroup({
                    roleIds: roleIds
                })
            }
        });
    };

    modalShow = (type, info) => {
        const { showModal, setUpdateInfo } = this.props;
        showModal(type);
        info && setUpdateInfo(info)
    };

    render = () => {
        const { selectedRow } = this.state;
        const { list, page, pageSize, count, loading } = this.props;
        const data = observable(list).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        const rowSelection = {
            selectedRowKeys: this.state.selectedRow,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRow: selectedRowKeys
                })
            },
            getCheckboxProps: record => ({
                disabled: record.roleName === 'admin',    // Column configuration not to be checked
            })
        };
        const columns = [{
            title: '用户组名称',
            dataIndex: 'roleName',
            key: 'roleName',
            width: 350
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => (
                <div>
                    <Button type="primary" style={{ marginRight: 15 }} icon="edit" disabled={record.roleName === "admin"}
                            onClick={() => (this.modalShow("changeUserGroup", record))}>编辑</Button>
                    <Button disabled={record.roleName === "admin"} type="ghost" icon="delete"
                            onClick={() => (this.deleteConfirm(record.roleId))}>删除</Button>
                </div>
            )
        }];
        return (
            <div>
                <div className="ant-advanced-search-form text-right">
                    <Button type="primary" size="large" icon="plus" style={{ marginRight: 15 }} onClick={()=>(this.modalShow("userGroupModal"))}>新增用户组</Button>
                    <Button size="large" icon="delete" disabled={selectedRow.length===0} onClick={()=>(this.deleteConfirm())}>删除所选</Button>
                </div>
                <Table
                    rowSelection={rowSelection}
                    pagination={pagination}
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    onChange={this.handleTableChange}
                    bordered
                    rowKey="roleId"
                />
            </div>
        )
    }
}