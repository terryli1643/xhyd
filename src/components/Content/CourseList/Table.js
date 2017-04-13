import React, { Component } from 'react';
import { observable } from "mobx";
import moment from 'moment';
import { Table, Button } from 'antd';
import { browserHistory } from 'react-router';
import { urlPushQuery } from '../../../utils/util';

const updateHandleClick = (id) => {
    browserHistory.push(`/admin/content/course/update?courseId=${id}`)
};

const columns = [{
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
}, {
    title: '最近更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: (text, record) => (
        moment(record.updateTime).format('YYYY/MM/DD')
    )
},{
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <Button type="primary" onClick={() => (updateHandleClick(record.id))}>更新</Button>
    )
}];

export default class ContentListTable extends Component{
    handleTableChange = (pagination) => {
        const { getCourseList, location } = this.props;
        urlPushQuery(location.pathname, { ...location.query, page: pagination.current });
        getCourseList({ ...location.query, page: pagination.current })
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