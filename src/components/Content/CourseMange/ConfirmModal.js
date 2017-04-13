import React, { Component } from 'react';
import { Modal, Table, Button } from 'antd';
import './index.less'

const columns = [{
    title: 'name',
    dataIndex: 'name',
    width: 200
}, {
    title: 'value',
    dataIndex: 'value'
}];

const imgColumns = [{
    title: 'name',
    dataIndex: 'name',
    width: 200
}, {
    title: 'value',
    dataIndex: 'value',
    render: (text, record) => (
        <img src={record.value} width="80" />
    )
}];

const getBigCourseName = (subject, id) => {
    for (let value of subject) {
        if (value.id === Number(id)) {
            return value.name
        }
    }
};

const getSubCourseName = (subject, id) => {
    for (let bigCourse of subject) {
        for (let subCourse of bigCourse.subSubjects) {
            if (subCourse.id === Number(id)) {
                return subCourse.name
            }
        }
    }
};

const getCourseTheme = (subject, id) => {
    for (let bigCourse of subject) {
        for (let subCourse of bigCourse.subSubjects) {
            for (let courseTheme of subCourse.subSubjects) {
                if (courseTheme.id === Number(id)) {
                    return courseTheme.name
                }
            }
        }
    }
};

export default class CourseConfirmModal extends Component{
    handleCancel = () => {
        const { hideModal } = this.props;
        hideModal()
    };

    handleOk = () => {
        const { createCourse, updateCourse, isUpdate, location } = this.props;
        if (isUpdate) {
            updateCourse(location.query)
        } else {
            createCourse()
        }
    };

    render = () => {
        const {
            modalType, modalVisible, btnLoading, courseInfo, subject,
            imgUploadSrc, isUpdate
        } = this.props;
        const data = [{
            key: "1",
            name: "课程名称",
            value: courseInfo.courseName
        }, {
            key: "2",
            name: "课程编号",
            value: courseInfo.courseCode
        }, {
            key: "3",
            name: "课程大类",
            value: courseInfo && getBigCourseName(subject, courseInfo.bigCourse)
        }, {
            key: "4",
            name: "课程子类",
            value: courseInfo && getSubCourseName(subject, courseInfo.subCourse)
        }, {
            key: "5",
            name: "所属主题",
            value: courseInfo.courseTheme ? getCourseTheme(subject, courseInfo.courseTheme) : "/"
        }, {
            key: "6",
            name: "内容类型",
            value: courseInfo.contentType === "全景图" ? "全景图" : "实验课"
        }, {
            key: "7",
            name: "课程版本",
            value: courseInfo.courseVersion
        }];
        const imgData = [{
            key: "8",
            name: "课程封面图",
            value: imgUploadSrc
        }];
        //  全景图
        let data1 = [];

        if (courseInfo.vrFile && courseInfo.vrFile.name) {
            data1.push({
                key: "9",
                name: "VR学生端课程资源",
                value: courseInfo.vrFile && courseInfo.vrFile.name
            })
        }
        if (courseInfo.webFile && courseInfo.webFile.name) {
            data1.push({
                key: "10",
                name: "WEB端课程资源",
                value: courseInfo.webFile && courseInfo.webFile.name
            })
        }
        //  实验课
        let data2 = [];

        if (courseInfo.videoFile && courseInfo.videoFile.name) {
            data2.push({
                key: "9",
                name: "教师端视频",
                value: courseInfo.videoFile && courseInfo.videoFile.name
            })
        }
        if (courseInfo.apkFile && courseInfo.apkFile.name) {
            data2.push({
                key: "10",
                name: "VR学生端课程APK",
                value: courseInfo.apkFile && courseInfo.apkFile.name
            })
        }
        const dataSource = courseInfo.contentType === "全景图" ? data1 : data2;
        const showTable = (courseInfo.vrFile && courseInfo.vrFile.name) || (courseInfo.webFile && courseInfo.webFile.name) ||
            (courseInfo.videoFile && courseInfo.videoFile.name) || (courseInfo.apkFile && courseInfo.apkFile.name);
        return (
            <Modal
                visible={modalVisible && modalType === "courseConfirmModal"}
                title={isUpdate ? "课程更新确认" : "课程信息确认"}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="1" loading={btnLoading} type="primary" htmlType="submit" size="large" style={{ width: 100 }} onClick={this.handleOk}>确认无误</Button>,
                    <Button key="2" loading={btnLoading} type="default" size="large" style={{ width: 100 }} onClick={this.handleCancel}>返回修改</Button>
                ]}
                width={600}
                maskClosable={false}
            >
                <div className="confirm-word">
                    <p>请再次核对课程相关信息是否正确</p>
                </div>
                <Table className={`course-confirm-table`} columns={columns} dataSource={data} bordered size="small" showHeader={false} pagination={false} />
                <Table className={`img-table ${!imgUploadSrc && "hidden"}`} columns={imgColumns} dataSource={imgData} bordered size="small" showHeader={false} pagination={false} />
                <Table className={`second-table ${!showTable && "hidden"}`} columns={columns} dataSource={dataSource} bordered size="small" showHeader={false} pagination={false} />
            </Modal>
        )
    }
}