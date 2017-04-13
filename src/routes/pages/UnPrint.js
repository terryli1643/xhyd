import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import ContentListSearch from '../../components/Content/CourseList/Search';
import ContentListTable from '../../components/Content/CourseList/Table';
import "./css.less"

@inject('courseList') @observer
export default class UnPrint extends Component {

    render = () => {
        const {
            courseList: { getCourseList, list, page, pageSize,
                count, loading }, location
        } = this.props;
        const ContentListSearchProps = {
            getCourseList, location, page
        };
        const ContentListTableProps = {
            getCourseList, list, page, pageSize, count,
            loading, location
        };
        return (
            <div>
                <h2>未打查询</h2>
                <ContentListSearch {...ContentListSearchProps} />
                <ContentListTable {...ContentListTableProps} />
            </div>
        )
    }
}