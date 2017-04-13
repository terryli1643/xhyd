import React, { Component } from 'react';
import { browserHistory } from "react-router";
import { Form, Row, Col, Input, Button, Select } from 'antd';
import { urlPushQuery } from '../../../utils/util';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class SchoolListSearch extends Component{
    componentDidMount = () => {
        const { getSchoolCity, location } = this.props;
        getSchoolCity();
        //判断是不是返回操作
        if (!!location.query) {
            this.setFields();
        } else {
            this.getList();
        }
    };

    getList = () => {
        const { getSchoolList, location, form: { getFieldsValue } } = this.props;
        getSchoolList({ ...location.query, ...getFieldsValue() })
    };

    setFields = () => {
        const { form: { setFieldsValue }, location } = this.props;
        setFieldsValue({
            province: location.query.province,
            keyword: location.query.keyword
        });
        this.getList();
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { location } = this.props;
                urlPushQuery(location.pathname, { page: 1, ...values });
                setTimeout(() => this.getList(),0);
            }
        });
    };

    render = () => {
        const { form: { getFieldDecorator }, city  } = this.props;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 19 }
        };

        return (
            <Form
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <Row gutter={40}>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="地区">
                            {getFieldDecorator(`province`, {
                                initialValue: "-1"
                            })(
                                <Select size="large">
                                    <Option value="-1">全部</Option>
                                    {
                                        city.map((data,index) => {
                                            return  (
                                                <Option key={index} value={`${data.proviceId}`}>{data.proviceName}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="搜索">
                            {getFieldDecorator(`keyword`, {
                                initialValue: ""
                            })(
                                <Input placeholder="支持搜索学校名称、套餐、对应BD" size="large"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <Button type="primary" htmlType="submit" size="large">查询</Button>
                    </Col>
                </Row>
            </Form>
        )
    }
}

export default SchoolListSearch = createForm({})(SchoolListSearch);