import React, { Component } from 'react';
import { observable } from "mobx";
import { Table, Button } from 'antd';
import { browserHistory } from 'react-router';
import { urlPushQuery } from '../../utils/util';

import './Table.less'

const updateHandleClick = (id) => {
    browserHistory.push(`/admin/content/course/update?courseId=${id}`)
};

const columns = [ {
    title: '发件人姓名',
    dataIndex: 'sentName',
    key: 'sentName'
}, {
    title: '发件人电话',
    dataIndex: 'sentMobile',
    key: 'sentMobile'
}, {
    title: '收件人姓名',
    dataIndex: 'recipientName',
    key: 'recipientName'
}, {
    title: '收件人电话',
    dataIndex: 'recipientMobile',
    key: 'recipientMobile'
}, {
    title: '快递单号',
    dataIndex: 'trackingNumber',
    key: 'trackingNumber'
}, {
    title: '刷单件',
    dataIndex: 'type',
    key: 'type'
}, {
    title: '订单号',
    dataIndex: 'orderNumber',
    key: 'orderNumber'
}, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <Button type="primary" onClick={() => (updateHandleClick(record.id))}>修改</Button>
    )
} ];

const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        id: i,
        sentName: '张三',
        sentMobile: '18113031111',
        recipientName: '李四',
        recipientMobile: '18113031111',
        recipientAddr: '四川省成都市高新区天府大道天府软件园C区',
        trackingNumber: '738216432949326829',
        type: '普通件',
        orderNumber: '8095742801',
        content: '苹果电脑 mac book pro',
        endTime: '2017-04-18'
    });
}

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
};

export default class ContentListTable extends Component {
    state = {
        selectedRowKeys: [],  // Check here to configure the default column
        loading: false,
    };
    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    handleTableChange = (pagination) => {
        const { getCourseList, location } = this.props;
        urlPushQuery(location.pathname, { ...location.query, page: pagination.current });
        getCourseList({ ...location.query, page: pagination.current })
    };

    render = () => {
        const { list, page, pageSize, count } = this.props;
        // const data = observable(list).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <div>
                <div style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={this.start}
                            disabled={!hasSelected} loading={loading}
                    >打印</Button>
                    <span
                        style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length} 条` : ''}</span>
                </div>
                <Table
                    columns={columns}
                    expandedRowRender={record => <p>{record.recipientAddr}<br />{record.content}<br />{record.endTime}
                    </p>}
                    dataSource={data}
                    pagination={pagination}
                    loading={loading}
                    onChange={this.handleTableChange}
                    bordered
                    rowSelection={rowSelection}
                    rowKey="id"
                />
            </div>

        )
    }
}