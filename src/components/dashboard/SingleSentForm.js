import React, { Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

class SingleSentForm extends Component {
    state = {
        confirmDirty: false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }
    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields([ 'confirm' ], { force: true });
        }
        callback();
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 14,
                    offset: 6,
                },
            },
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select className="icp-selector">
                <Option value="86">+86</Option>
            </Select>
        );
        return (
            <Form onSubmit={this.handleSubmit}>
                <h2>发件人信息</h2>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [ {
                            required: true, message: '请输入姓名！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="电话"
                    hasFeedback
                >
                    {getFieldDecorator('mobile', {
                        rules: [ {
                            required: true, message: '请输入电话！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="单位"
                    hasFeedback
                >
                    {getFieldDecorator('company', {
                        rules: [ {
                            required: true, message: '请输入单位！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="地址"
                    hasFeedback
                >
                    {getFieldDecorator('address', {
                        rules: [ { required: true, message: '请输入地址', whitespace: true } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <h2>收件人信息</h2>
                <FormItem
                    {...formItemLayout}
                    label="姓名"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [ {
                            required: true, message: '请输入姓名！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="电话"
                    hasFeedback
                >
                    {getFieldDecorator('mobile', {
                        rules: [ {
                            required: true, message: '请输入电话！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="单位"
                    hasFeedback
                >
                    {getFieldDecorator('company', {
                        rules: [ {
                            required: true, message: '请输入单位！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="地址"
                    hasFeedback
                >
                    {getFieldDecorator('address', {
                        rules: [ { required: true, message: '请输入地址', whitespace: true } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <h2>商品信息</h2>
                <FormItem
                    {...formItemLayout}
                    label="物品名称"
                    hasFeedback
                >
                    {getFieldDecorator('productName', {
                        rules: [ {
                            required: true, message: '请输入物品名称！',
                        } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="物品数量"
                    hasFeedback
                >
                    {getFieldDecorator('productQuantity', {
                        rules: [ { required: true, message: '请输入物品数量', whitespace: true } ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" size="large">提交</Button>
                </FormItem>
            </Form>
        );
    }
}
const WrappedSingleSentForm = Form.create()(SingleSentForm);
export default WrappedSingleSentForm;