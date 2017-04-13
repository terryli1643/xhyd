import React, { Component } from 'react';
import moment from 'moment';
import { Form, Row, Col, Input, Button, Icon, DatePicker } from 'antd';
import { browserHistory } from 'react-router';
import { urlPushQuery } from '../../../utils/util';

const createForm = Form.create;
const FormItem = Form.Item;

const checkTime = (rule, value, callback) => {
    const date = value ? value.valueOf() : "";
    if (date && date > Date.now()) {
        callback(new Error('请选择正确日期哟!'));
    } else {
        callback();
    }
};

class PackageListSearch extends Component{
    componentDidMount = () => {
        const { location } = this.props;
        //判断是不是返回操作
        if (!!location.query) {
            this.setFields();
        } else {
            this.getList();
        }
    };

    getList = () => {
        const { getPackageList, location, form: { getFieldsValue } } = this.props;
        let searchField = getFieldsValue();
        if (searchField.keyword === undefined) {
            searchField.keyword = ""
        }
        searchField = {
            ...searchField,
            createDateFrom: searchField.createDateFrom === null ? null : searchField.createDateFrom.format("YYYY-MM-DD"),
            createDateTo: searchField.createDateTo === null ? null : searchField.createDateTo.format("YYYY-MM-DD")
        };
        getPackageList({ ...location.query, ...searchField })
    };

    setFields = () => {
        const { form: { setFieldsValue }, location: { query } } = this.props;
        setFieldsValue({
            createDateFrom: query.createDateFrom ? moment(query.createDateFrom) : null,
            createDateTo: query.createDateTo? moment(query.createDateTo) : null,
            keyword: query.keyword
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
                    createDateFrom: values.createDateFrom === null ? null : values.createDateFrom.format("YYYY-MM-DD"),
                    createDateTo: values.createDateTo === null ? null : values.createDateTo.format("YYYY-MM-DD")
                };
                urlPushQuery(location.pathname, { page: 1, ...payload });
                setTimeout(() => this.getList(),0);
            }
        });
    };

    disabledStartDate = (startValue) => {
        const { form: { getFieldValue } } =  this.props;
        if (!startValue || !getFieldValue("createDateTo")) {
            return false;
        }
        return startValue.valueOf() >= getFieldValue("createDateTo").valueOf();
    };

    disabledEndDate = (endValue) => {
        const { form: { getFieldValue } } =  this.props;
        if (!endValue || !getFieldValue("createDateFrom")) {
            return false;
        }
        return endValue.valueOf() <= getFieldValue("createDateFrom").valueOf();
    };

    render = () => {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
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
                <Row gutter={40}>
                    <Col span={8}>
                        <Col span="14">
                            <FormItem
                                label="创建时间"
                                {...DatePickLayout}
                            >
                                {
                                    getFieldDecorator("createDateFrom", {
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
                        <Col span="3">
                            <p className="ant-form-split">-</p>
                        </Col>
                        <Col span="7">
                            <FormItem>
                                {
                                    getFieldDecorator("createDateTo", {
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
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="搜索">
                            {getFieldDecorator(`keyword`, {
                                initialValue: ""
                            })(
                                <Input placeholder="请输入套餐名称或创建人姓名进行搜索" size="large"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8} >
                        <Button type="primary" htmlType="submit" size="large">查询</Button>
                        <Button type="primary" size="large" style={{ float: 'right' }} icon="plus"
                                onClick={ () => {
                                    browserHistory.push("/admin/content/course_package/add")
                                } }>新增套餐
                        </Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default PackageListSearch = createForm({})(PackageListSearch);