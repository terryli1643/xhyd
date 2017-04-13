import React, { Component } from 'react';
import { Modal, Upload, message, Button, Icon } from 'antd';
import { makeUrl } from '../../../../utils/util'

export default class DeviceUpdateModal extends Component{
    state = {
        fileList1: [],
        fileList2: []
    };

    componentDidUpdate = () => {
        const { clearCount, clearStatus } = this.props;
        if (clearStatus) {
            clearCount();
            this.setState({
                fileList1: [],
                fileList2: []
            })
        }
    };

    handleCancel = () => {
        const { hideModal } =this.props;
        hideModal()
    };

    render = () => {
        const self = this;
        const {
            modalType, modalVisible, upDeviceType, changeCount,
            query, getSchoolInfo, changeSnList, secondStep
        } = this.props;
        const fileList = upDeviceType === 1 ? this.state.fileList1 : this.state.fileList2;
        const props = {
            fileList: fileList,
            name: 'multipartFile',
            withCredentials: true,
            action: makeUrl('/api/school/uploadSNCode'),
            data: getSchoolInfo ? {
                ...query,
                deviceType: upDeviceType
            } : {
                deviceType: upDeviceType
            },
            beforeUpload(file){
                const name = file.name;
                const fileType = name.substring(name.lastIndexOf("."),name.length);
                const isExcel = fileType === '.xls' || fileType === ".xlsx";

                if (!isExcel) {
                    message.error("请上传excel文件");
                }
                return isExcel
            },
            onChange(info) {
                let fileList = info.fileList;
                fileList = fileList.slice(-1);
                upDeviceType === 1 ? self.setState({ fileList1: fileList }) :
                    self.setState({ fileList2: fileList });
                if (info.file.status === 'done') {
                    if( info.file.response.code === 0 ) {
                        message.success(`更新成功！成功上传${info.file.response.data.listInfo.totalCount}条数据`,3);
                        changeCount({
                            deviceType: upDeviceType,
                            count: info.file.response.data.listInfo.totalCount
                        });
                        changeSnList({
                            deviceType: upDeviceType,
                            list: info.file.response.data.listItems
                        });
                        secondStep && secondStep(upDeviceType === 1 ? {
                            vrList: info.file.response.data.listItems
                        } : {
                            handleList: info.file.response.data.listItems
                        });
                        self.handleCancel()
                    } else {
                        message.error(`${info.file.response.data[0].errorMsg}`,2);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name}上传失败`);
                }
            }
        };
        return (
            <Modal
                visible={modalVisible && modalType === "deviceUpdateModal"}
                title="更新设备"
                onCancel={this.handleCancel}
                footer={[

                    <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>
                ]}
                maskClosable={false}
            >
                <h3>上传{`${upDeviceType === 1 ? "VR一体机" : "VR控制手柄"}`}设备SN码（置于excel表格第一列）：</h3>
                <div style={{ marginTop: 20 }}>
                    <span>选择文件：</span>
                    <Upload {...props}>
                        <Button>
                            <Icon type="upload" />选择
                        </Button>
                    </Upload>
                </div>
            </Modal>
        )
    }
}