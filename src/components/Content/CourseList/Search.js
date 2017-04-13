import React, { Component } from 'react';
import { Form, Row, Col, Input, Button, Icon, Select, DatePicker } from 'antd';
import moment from 'moment';
import { urlPushQuery } from '../../../utils/util';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

const checkTime = (rule, value, callback) => {
    const date = value ? value.valueOf() : "";
    if (date && date > Date.now()) {
        callback(new Error('请选择正确日期哟!'));
    } else {
        callback();
    }
};

class ContentListSearch extends Component{
    componentDidMount = () => {
        const { getCourseList, location } = this.props;
        //判断是不是返回操作
        if (!!location.query) {
            this.setFields();
        } else {
            this.getList();
        }
    };

    getList = () => {
        const { getCourseList, location, form: { getFieldsValue } } = this.props;
        let searchField = getFieldsValue();
        if (searchField.name === undefined) {
            searchField.name = ""
        }
        searchField = {
            ...searchField,
            timeFrom: searchField.timeFrom === null ? null : searchField.timeFrom.format("YYYY-MM-DD"),
            timeTo: searchField.timeTo === null ? null : searchField.timeTo.format("YYYY-MM-DD")
        };
        getCourseList({ ...location.query, ...searchField })
    };

    setFields = () => {
        const { form: { setFieldsValue }, location: { query } } = this.props;
        setFieldsValue({
            contentType: query.contentType || "",
            subject: query.subject || null,
            timeFrom: query.timeFrom ? moment(query.timeFrom) : null,
            timeTo: query.timeTo? moment(query.timeTo) : null,
            name: query.name
        });
        this.getList();
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { location } = this.props;
                const payload = {
                    ...values,
                    timeFrom: values.timeFrom === null ? null : values.timeFrom.format("YYYY-MM-DD"),
                    timeTo: values.timeTo === null ? null : values.timeTo.format("YYYY-MM-DD")
                };
                urlPushQuery(location.pathname, { page: 1, ...payload });
                setTimeout(() => this.getList(),0)
            }
        });
    };

    disabledStartDate = (startValue) => {
        const { form: { getFieldValue } } =  this.props;
        if (!startValue || !getFieldValue("timeTo")) {
            return false;
        }
        return startValue.valueOf() >= getFieldValue("timeTo").valueOf();
    };

    disabledEndDate = (endValue) => {
        const { form: { getFieldValue } } =  this.props;
        if (!endValue || !getFieldValue("timeFrom")) {
            return false;
        }
        return endValue.valueOf() <= getFieldValue("timeFrom").valueOf();
    };

    render = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        const formItemLayoutLast = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };
        const DatePickLayout = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={30}>
                    <Col span={4}>
                        <FormItem {...formItemLayout} label="内容类型">
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
                    <Col span={4}>
                        <FormItem {...formItemLayout} label="课程大类">
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
                    <Col span={8}>
                        <Col span="15">
                            <FormItem
                                label="最近更新时间"
                                {...DatePickLayout}
                            >
                                {
                                    getFieldDecorator("timeFrom", {
                                        initialValue: null,
                                        rules: [{
                                            validator: checkTime
                                        }]
                                    })(
                                        <DatePicker size="large" disabledDate={this.disabledStartDate}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span="2">
                            <p className="ant-form-split">-</p>
                        </Col>
                        <Col span="7">
                            <FormItem>
                                {
                                    getFieldDecorator("timeTo", {
                                        initialValue: null,
                                        rules: [{
                                            validator: checkTime
                                        }]
                                    })(
                                        <DatePicker size="large" disabledDate={this.disabledEndDate}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Col>
                    <Col span={6}>
                        <FormItem {...formItemLayoutLast} label="内容名称">
                            {getFieldDecorator(`name`, {
                                initialValue: ""
                            })(
                                <Input placeholder="请输入课程内容名称进行搜索" size="large"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={2} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" size="large">查询</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default ContentListSearch = createForm({})(ContentListSearch);