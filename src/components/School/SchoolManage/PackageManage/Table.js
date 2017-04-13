import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { observable } from "mobx";
import { Table, Button, Row } from 'antd';
import { browserHistory } from "react-router";
import './index.less';

const columns = [{
    title: '编号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '课程套餐名',
    dataIndex: 'name',
    key: 'name'
}];

export default class PackageManageTable extends Component{
    componentDidMount = () => {
        /*给列表增加选择文字*/
        const tableDom = findDOMNode(this.refs.packageManageTable);
        tableDom.querySelector(".ant-table-selection-column span").innerText = "选择";
    };

    handleCancel = () => {
        browserHistory.goBack()
    };

    handleCancelStep = () => {
        const { clearStep } = this.props;
        clearStep();
    };

    handleShowConfirm = () => {
        const { showModal, getPackageDetail, selectedRowKey } = this.props;
        getPackageDetail({
            packageId: selectedRowKey[0]
        });
        showModal("packageConfirmModal")
    };

    prevStepClick = () => {
        const { prevStep } = this.props;
        prevStep();
    };

    handleTableChange = (pagination) => {
        const { getInfoPackageList } = this.props;
        getInfoPackageList({ page: pagination.current })
    };

    renderFooter = () => {
        const { clearStep, btnLoading, selectedRowKey } =this.props;
        if (clearStep) {
            return (
                <div>
                    <Button 
                        type="default" 
                        size="large" 
                        style={{ width: 100 }}
                        onClick={this.handleCancelStep}
                        loading={btnLoading}
                    >
                        取消
                    </Button>
                    <Button 
                        type="primary" 
                        size="large"
                        style={{ float: "right", width: 100 }}
                        disabled={selectedRowKey.length === 0}
                        onClick={this.handleShowConfirm}
                        loading={btnLoading}
                    >
                        下一步
                    </Button>
                    <Button 
                        type="primary" 
                        size="large"
                        style={{ float: "right", width: 100, marginRight:15 }} 
                        onClick={this.prevStepClick}
                        loading={btnLoading}
                    >
                        上一步
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button 
                        type="primary" 
                        disabled={selectedRowKey.length === 0}
                        htmlType="submit"
                        size="large" 
                        style={{ width: 100 }}
                        loading={btnLoading}
                        onClick={this.handleShowConfirm}
                    >
                        保存
                    </Button>
                    <Button 
                        type="default"  
                        size="large" 
                        style={{ float: "right", width: 100 }} 
                        onClick={this.handleCancel}
                        loading={btnLoading}
                    >
                        取消
                    </Button>
                </div>
            )
        }
    };
    
    render = () => {
        const { list, page, pageSize, count, loading, saveSelectedKey, selectedRowKey } = this.props;
        const data = observable(list).slice();
        const selectedRowKeyArr = observable(selectedRowKey).slice();
        const pagination = {
            defaultPageSize: pageSize,
            current: Number(page),
            total: count
        };
        const rowSelection = {
            selectedRowKeys: selectedRowKeyArr,
            type: "radio",
            onChange: (selectedRowKeys, selectedRows) => {
                saveSelectedKey(selectedRowKeys, selectedRows)
            }
        };
        return (
            <div>
                <Table
                    style={{ marginTop: 20 }}
                    ref="packageManageTable"
                    pagination={pagination}
                    rowSelection={rowSelection}
                    onChange={this.handleTableChange}
                    columns={columns}
                    dataSource={data}
                    bordered
                    loading={loading}
                    rowKey="id"
                />
                <Row className="package-manage-btn-group">
                    {
                        this.renderFooter()
                    }
                </Row>
            </div>
        )
    };
}