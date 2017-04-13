import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import { observable } from "mobx";
import moment from 'moment';

const columns = [{
    title: '序号',
    dataIndex: 'no',
    key: 'no'
}, {
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

export default class PackageMangeConfirmModal extends Component{
    handleCancel = () => {
        const { hideModal } =this.props;
        hideModal()
    };

    handleOk = () => {
        const { thirdStep, changePackage, location, selectedRowKey, selectedRows } =this.props;
        if (changePackage) {
            changePackage({
                ...location.query,
                packageId: selectedRowKey
            })
        } else {
            thirdStep({
                packageId: selectedRowKey,
                packageName: selectedRows[0].name
            })
        }
    };

    render = () => {
        const { modalType, modalVisible, btnLoading, packageDetail, getDetailLoading } =this.props;
        const data = observable(packageDetail.list).slice();
        const pagination = {
            defaultPageSize: 10,
            total: data.length
        };
        return (
            <Modal
                visible={modalVisible && modalType === "packageConfirmModal"}
                title="课程套餐确认"
                onCancel={this.handleCancel}
                footer={[
                    <Button key="1" type="primary" loading={btnLoading} htmlType="submit" size="large" style={{ width: 100 }} onClick={this.handleOk}>确认无误</Button>,
                    <Button key="2" type="default" loading={btnLoading} size="large" style={{ width: 100 }} onClick={this.handleCancel}>返回修改</Button>]}
                width={800}
                maskClosable={false}
            >
                <div className="confirm-word">
                    <p>请再次核对所选套餐是否正确</p>
                    <p><span>套餐名称:</span><span>{packageDetail.name}</span></p>
                    <p><span>创建时间:</span><span>{packageDetail.createTime ? moment(packageDetail.createTime).format('YYYY/MM/DD') : ""}</span></p>
                    <h3>包含课程内容：</h3>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    size="small"
                    bordered
                    style={{ marginTop: 10 }}
                    pagination={pagination}
                    rowKey="id"
                    loading={getDetailLoading}
                />
            </Modal>
        )
    }
}