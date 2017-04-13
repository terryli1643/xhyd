import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Form, Row, Col, Input, Button, Icon, Select, Spin } from 'antd';
import PackageManageTable from './Table';

const handleCancel = () => {
    browserHistory.goBack()
};

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class PackageManageForm extends Component {
    state = {
        searchFields: {}
    };
    
    componentDidMount = () => {
        const { getPackageDetail, location, isUpdate, resetPackageManage } = this.props;
        resetPackageManage();
        if (isUpdate) {
            getPackageDetail(location.query)
        }
        this.getList({})
    };

    componentDidUpdate = (preProps) => {
        if (preProps.packageName !== this.props.packageName) {
            this.props.form.setFieldsValue({
                name: this.props.packageName
            })
        }
    };

    getList = (payload) => {
        const { getCourseList } = this.props;
        getCourseList({ ...payload, pageSize: 1000000 })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { createPackage, updatePackage, isUpdate, location: { query } } = this.props;
                if (isUpdate) {
                    updatePackage(query)
                } else {
                    createPackage();
                }
            }
        });
    };

    handleSearch = (e) => {
        e.preventDefault();
        const { form: { getFieldValue } } = this.props;
        const values = {
            contentType: getFieldValue("contentType"),
            subject: getFieldValue('subject')
        };
        this.setState({
            searchFields: values
        });
        this.getList(values)
    };

    handleSeeCourse = () => {
        const { showModal } = this.props;
        showModal("packageConfirmModal")
    };

    handleNameChange = (e) => {
        const { savePackageName } = this.props;
        savePackageName(e.target.value)
    };

    render = () => {
        const { form: { getFieldDecorator }, list,
            page, pageSize, count, loading, getCourseList,
            selectedRows, saveSelectedRows, selectedRowKeys, 
            saveSelectedRowKeys, packageName, btnLoading,
            detailLoading
        } = this.props;
        const { searchFields } = this.state;
        const PackageManageTableProps = {
            list, page, pageSize, count, loading, getCourseList,
            searchFields, selectedRows, saveSelectedRows, selectedRowKeys,
            saveSelectedRowKeys
        };
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 5 }
        };
        const formItemLayoutSearch = {
            labelCol: { span: 14 },
            wrapperCol: { span: 10 }
        };
        return (
            <Spin tip="Loading..." spinning={detailLoading}>
                <Form
                    onSubmit={this.handleSubmit}
                >
                    <Row>
                        <FormItem {...formItemLayout} label="套餐名称">
                            {getFieldDecorator(`name`, {
                                initialValue: "",
                                rules: [
                                    {
                                        transform: (value) => {
                                            return value.trim()
                                        }
                                    },
                                    {
                                        required: true, message: '请输入套餐名称'
                                    },
                                    {
                                        max: 30, message: '套餐名称不能超过30个字符'
                                    }
                                ]
                            })(
                                <Input size="large" maxLength="30" onChange={this.handleNameChange}/>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="已选课程">
                            <Button size="large" type="primary" icon="search" disabled={selectedRows.length === 0} onClick={this.handleSeeCourse}>查看已选{selectedRows.length}项课程</Button>
                        </FormItem>
                    </Row>
                    <p style={{ fontSize: 14, marginLeft: 70, marginBottom: 5 }}>添加课程内容:</p>
                    <div className="ant-advanced-search-form" style={{ padding: "24px 28px" }}>
                        <Row>
                            <Col span={6}>
                                <FormItem {...formItemLayoutSearch} label="内容类型">
                                    {getFieldDecorator(`contentType`, {
                                        initialValue: ""
                                    })(
                                        <Select size="large">
                                            <Option value="">全部</Option>
                                            <Option value="全景图">全景图</Option>
                                            <Option value="实验课">实验课</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem {...formItemLayoutSearch} label="课程大类">
                                    {getFieldDecorator(`subject`, {
                                        initialValue: null
                                    })(
                                        <Select size="large">
                                            <Option value={null}>全部</Option>
                                            <Option value="1">传统文化</Option>
                                            <Option value="2">科学教育</Option>
                                            <Option value="3">安全教育</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span="12" style={{ textAlign: "right" }}>
                                <Button type="primary" size="large" onClick={this.handleSearch}>查询</Button>
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <PackageManageTable {...PackageManageTableProps} />
                    </Row>
                    <Row className="text-center" style={{ marginTop: 20 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{ marginRight: 80, width: 100 }}
                            onClick={this.handleSubmit}
                            disabled={!packageName || selectedRowKeys.length === 0}
                            loading={btnLoading}
                        >
                            确定
                        </Button>
                        <Button size="large" loading={btnLoading} style={{ width: 100 }} onClick={handleCancel}>取消</Button>
                    </Row>
                </Form>
            </Spin>
        )
    }
}

export default PackageManageForm = createForm({})(PackageManageForm)