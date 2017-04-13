import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import { observable } from "mobx";

const columns = [{
    title: '序号',
    dataIndex: 'no',
    key: 'no'
},{
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

export default class PackageConfirmModal extends Component{
    handleCancel = () => {
        const { hideModal } = this.props;
        hideModal()
    };

    render = () => {
        const { modalType, modalVisible, selectedRows, packageName } = this.props;
        const data = observable(selectedRows).slice();
        const pagination = {
            defaultPageSize: 10,
            total: data.length
        };
        return (
            <Modal
                visible={modalVisible && modalType === "packageConfirmModal"}
                title="套餐课程信息"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="2" type="primary" size="large" style={{ width: 100 }} onClick={this.handleCancel}>关闭</Button>
                ]}
                width={650}
                maskClosable={false}
            >
                <p style={{ marginBottom: 10, fontSize: 14 }}>套餐名称： {packageName}</p>
                <p style={{ marginBottom: 10, fontSize: 14 }}>课程数量： {selectedRows.length}</p>
                <p style={{ marginBottom: 10, fontSize: 14 }}>课程详情：</p>
                <Table
                    columns={columns}
                    dataSource={data}
                    bordered
                    size="small"
                    pagination={pagination}
                    rowKey="id" />
            </Modal>
        )
    }
}