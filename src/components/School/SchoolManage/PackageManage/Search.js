import React, { Component } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

class PackageManageSearch extends Component{
    componentDidMount = () => {
        const {
            resetPackageList, resetPackageInfo, getPackageId,
            location
        } = this.props;
        if (location && location.query && location.query.schoolId) {
            getPackageId && getPackageId(location.query)
        }
        resetPackageList && resetPackageList();
        resetPackageInfo && resetPackageInfo();
        this.getList();
    };

    componentDidUpdate = () => {
        const { resetPackageList, resetPackageInfo, clearStatus } = this.props;
        if (clearStatus) {
            this.props.form.resetFields();
            resetPackageList();
            resetPackageInfo();
        }
    };

    getList = () => {
        const { getInfoPackageList } = this.props;
        getInfoPackageList({})
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            const { saveSearchFields } = this.props;
            saveSearchFields(values);
            this.getList();
        });
    };

    render = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 }
        };

        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={20}>
                    <Col span={12}>
                        <FormItem {...formItemLayout} label="选择套餐">
                            {getFieldDecorator(`name`, {
                                initialValue: ""
                            })(
                                <Input placeholder="输入课程套餐名搜索" size="large"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <Button type="primary" htmlType="submit" size="large">搜索</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default PackageManageSearch = createForm({})(PackageManageSearch);