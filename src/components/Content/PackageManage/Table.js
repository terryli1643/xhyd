import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { browserHistory } from 'react-router';
import { observable } from "mobx";

const columns = [{
    title: '课程编号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '课程名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '课程子类',
    dataIndex: 'level2Name',
    key: 'level2Name'
}, {
    title: '课程大类',
    dataIndex: 'level1Name',
    key: 'level1Name'
}, {
    title: '内容类型',
    dataIndex: 'contentType',
    key: 'contentType'
}, {
    title: '课程版本',
    dataIndex: 'version',
    key: 'version'
}];

export default class PackageManageTable extends Component{
    
    render = () => {
        const {
            list, count, loading, saveSelectedRows,
            selectedRowKeys, saveSelectedRowKeys
        } = this.props;
        const data = observable(list).slice();
        const pagination = {
            defaultPageSize: 10,
            total: count
        };
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                saveSelectedRows(selectedRows);
                saveSelectedRowKeys(selectedRowKeys);
            }
        };
        return (
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                rowSelection={rowSelection}
                bordered
                rowKey="id"
            />
        )
    }
}