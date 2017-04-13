import React, { Component } from 'react';
import { observable } from "mobx";
import { Table, Button, Popconfirm } from 'antd';
import { browserHistory, Link } from 'react-router';
import { urlPushQuery } from '../../../utils/util';
import moment from 'moment';

export default class PackageListTable extends Component{
    handleTableChange = (pagination) => {
        const { getPackageList, location } = this.props;
        urlPushQuery(location.pathname, { ...location.query, page: pagination.current });
        getPackageList({ ...location.query, page: pagination.current })
    };

    render = () => {
        const { list, page, pageSize, count, loading, seePackageDetail } = this.props;
        const data = observable(list).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        const columns = [{
            title: '套餐名称',
            dataIndex: 'name',
            key: 'name',
            width: 280
        }, {
            title: '关联学校数',
            dataIndex: 'schoolCount',
            key: 'schoolCount',
            render: (text, record) => (
                <a href={`/admin/school/list?keyword=${record.name}&packageId=${record.id}`} target="_blank">{record.schoolCount}</a>
            )
        }, {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record) => (
                moment(record.createTime).format('YYYY/MM/DD')
            )
        }, {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator'
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Button 
                        type="primary" 
                        style={{ marginRight:15 }} onClick={() => (seePackageDetail(record.id))}>查看</Button>
                    <Button onClick={ () => { 
                browserHistory.push(`/admin/content/course_package/update?packageId=${record.id}`)
            } }>编辑</Button>
                </div>
            )
        }];
        return (
            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={this.handleTableChange}
                bordered
                rowKey="id"
            />
        )
    }
}