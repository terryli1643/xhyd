import React, { Component } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { browserHistory } from 'react-router';
import { observable } from "mobx";
import { urlPushQuery } from '../../../utils/util';
import moment from 'moment';
import { changeComponentType, changeComponentApkType } from '../../../utils/changeData';

const handleClickManage = (id) => {
    browserHistory.push(`/admin/content/component/update?id=${id}`)
};

const columns = [{
    title: '组件类型',
    dataIndex: 'format',
    key: 'format',
    render: (text, record) => (
        changeComponentType(record.format)
    )
}, {
    title: '支持课程类型',
    dataIndex: 'apkType',
    key: 'apkType',
    render: (text, record) => (
        changeComponentApkType(record.apkType)
    )
}, {
    title: '备注名',
    dataIndex: 'nickName',
    key: 'nickName'
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '版本号',
    dataIndex: 'versionName',
    key: 'versionName'
}, {
    title: '最近更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (text, record) => (
        moment(record.updateTime).format('YYYY/MM/DD HH:mm:ss')
    )
}, {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    render: (text, record) => (
        (record.size / 1024 / 1024).toFixed(1) + "MB"
    )
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <Button type="primary" onClick={() => (handleClickManage(record.id))}>更新</Button>
    )
}];

export default class ComponentListTable extends Component{
    componentDidMount = () => {
        const { getComponentList, location } = this.props;
        const params = location.query || {} ;
        getComponentList(params)
    };

    handleTableChange = (pagination) => {
        const { getComponentList, location } = this.props;
        urlPushQuery(location.pathname, { page: pagination.current });
        getComponentList({ page: pagination.current })
    };

    handleAdd = () => {
        browserHistory.push("/admin/content/component/add")
    };

    render = () => {
        const { list, page, pageSize, count, loading } = this.props;
        const data = observable(list).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        return (
            <div>
                <div className="ant-advanced-search-form text-right">
                    <Button
                        type="primary"
                        onClick={this.handleAdd}
                        size="large"
                        icon="plus"
                    >
                        新增组件
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                    bordered
                    rowKey="id"
                />
            </div>
        )
    }
}