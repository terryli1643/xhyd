import React, { Component } from 'react';
import { observable } from "mobx";
import { Table, Button } from 'antd';
import { browserHistory } from 'react-router';
import { urlPushQuery } from '../../../utils/util';

const goSchoolManage = (id) => {
    browserHistory.push(`/admin/school/manage?schoolId=${id}`)
};

const columns = [{
    title: '学校名称',
    dataIndex: 'schoolName',
    key: 'schoolName',
    width: 280
}, {
    title: '地区',
    dataIndex: 'cityName',
    key: 'cityName'
}, {
    title: '内容套餐',
    dataIndex: 'packageName',
    key: 'packageName',
    width: 280
},  {
    title: '拥有头显数量',
    dataIndex: 'vrCount',
    key: 'vrCount'
},  {
    title: '对接BD',
    dataIndex: 'bdName',
    key: 'bdName',
    width: 200
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <Button type="primary" onClick={() => (goSchoolManage(record.id))}>管理</Button>
    )
}];

export default class SchoolTable extends Component{
    handleTableChange = (pagination) => {
        const { getSchoolList, location } = this.props;
        urlPushQuery(location.pathname, { ...location.query, page: pagination.current });
        getSchoolList({ ...location.query, page: pagination.current })
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