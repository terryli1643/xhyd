import React, { Component } from 'react';
import { observable } from "mobx";
import { Modal, Table } from 'antd';
import { changeDeviceType } from '../../../../utils/changeData';

const columns = [{
    title: '编号',
    dataIndex: 'no',
    key: 'no'
}, {
    title: '设备内型',
    dataIndex: 'deviceType',
    key: 'deviceType',
    render: (text, record) => (
        changeDeviceType(record.deviceType)
    )
}, {
    title: 'SN码',
    dataIndex: 'sn',
    key: 'sn'
}];

export default class DeviceSnModal extends Component{
    handleCancel = () => {
        const { hideModal, resetPage } =this.props;
        hideModal();
        resetPage()
    };

    handleTableChange = (pagination) => {
        const { pageChange, query } = this.props;
        pageChange(query && query.schoolId ? {
            ...query,
            page: pagination.current
        } : {
            page: pagination.current
        })
    };

    render = () => {
        const {
            modalType, modalVisible, snDeviceType, loading, 
            updateVrList, updateHandleList, updateVrStatus, 
            updateHandleStatus, snData
        } = this.props;
        let snList = [], pagination = {}, changeProps = {};
        if ( snDeviceType === 1 && (updateVrStatus || snData === undefined) ) {
            snList = updateVrList
        } else if (snDeviceType === 2 && (updateHandleStatus || snData === undefined)) {
            snList = updateHandleList
        } else {
            snList = snData.list
        }

        if ( (snDeviceType === 1 && updateVrStatus) ||
            (snDeviceType === 2 && updateHandleStatus) || snData === undefined) {
            pagination = {
                defaultPageSize: 10,
                total: snList.length
            };
        } else {
            pagination = {
                defaultPageSize: snData.pageSize,
                current: Number(snData.page),
                total: snData.count
            };
            changeProps = {
                onChange : this.handleTableChange
            }
        }
        const data = observable(snList).slice();
        return (
            <Modal
                visible={modalVisible && modalType==="deviceSnModal"}
                title="查看设备"
                onCancel={this.handleCancel}
                footer={[]}
                width={600}
                maskClosable={false}
            >
                <p>共有{snList.length}台设备</p>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="middle"
                    bordered
                    loading={loading}
                    pagination={pagination}
                    style={{ marginTop: 20, marginBottom: 30 }}
                    rowKey="no"
                    {...changeProps}
                />
            </Modal>
        )
    }
}