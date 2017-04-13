import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Form, Row, Col, Input, InputNumber, Button, Icon, Select, Upload, message, Spin } from 'antd';
import FileUpload from '../../Common/FileUpload/FileUpload';
import { observable } from "mobx";

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

class CourseManage extends Component{
    state = {
        selectType: "全景图",
        selectBigCourse: 1,
        selectSubCourse: 101,
        vrFile: {},
        webFile: {},
        videoFile: {},
        apkFile: {},
        imgFileId: "",
        vrDefaultFileName: "",
        webDefaultFileName: "",
        videoDefaultFileName: "",
        apkDefaultFileName: ""
    };

    componentDidMount = () => {
        const {
            getSubject, isUpdate, getCourseDetail, location,
            saveCourseInfo, changeImgSrc
        } = this.props;
        saveCourseInfo({});
        changeImgSrc("");
        getSubject();
        isUpdate && getCourseDetail(location.query)
    };

    componentDidUpdate = (preProps) => {
        const { saveCourseInfo, changeImgSrc } = this.props;
        if (this.props.courseDetail !== preProps.courseDetail) {
            this.setFields()
        }
        if (this.props.isUpdate !== preProps.isUpdate) {
            this.props.form.resetFields();
            saveCourseInfo({});
            changeImgSrc("");
            this.setState({
                selectType: "全景图",
                selectBigCourse: 1,
                selectSubCourse: 101,
                vrFile: {},
                webFile: {},
                videoFile: {},
                apkFile: {},
                imgFileId: ""
            })
        }
    };

    setFields = () => {
        const {
            courseDetail: {
                course, cover, videoFile, vrApkFile, vrAssetFile,
                webFile
            },
            changeImgSrc
        } = this.props;
        changeImgSrc(cover.url);
        const subStr = course.subject.toString();
        const subLen = subStr.length;
        this.setState({
            selectBigCourse: subStr.substr(0,1),
            selectSubCourse: subStr.substr(0,3),
            imgFileId: course.cover,
            vrFile: {
                name: vrAssetFile ? vrAssetFile.fileName : "",
                fileId: course.vrAsset || ""
            },
            webFile: {
                name: webFile ? webFile.fileName : "",
                fileId: course.webFile || ""
            },
            videoFile: {
                name: videoFile ? videoFile.fileName : "",
                fileId: course.video || ""
            },
            apkFile: {
                name: vrApkFile ? vrApkFile.fileName : "",
                fileId: course.vrApk || ""
            },
            vrDefaultFileName: vrAssetFile ? vrAssetFile.fileName : "",
            webDefaultFileName: webFile ? webFile.fileName : "",
            videoDefaultFileName: videoFile ? videoFile.fileName : "",
            apkDefaultFileName: vrApkFile ? vrApkFile.fileName : ""
        });
        this.props.form.setFieldsValue({
            courseName: course.name,
            courseCode: course.code,
            contentType: course.contentType,
            courseVersion: (Number(course.version)+0.1).toFixed(1),
            bigCourse: subStr.substr(0,1),
            subCourse: subStr.substr(0,3)
        });
        this.setState({
            selectType: course.contentType
        });
        if (subLen === 5) {
            // setTimeout解决更新不设置值的问题
            setTimeout( ()=> {
                this.props.form.setFieldsValue({
                    courseTheme: subStr
                })
            },0)
        }
    };

    handleCancel = () => {
        browserHistory.goBack()
    };

    handleAdd = (e) => {
        const { showModal } = this.props;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { vrFile, webFile, videoFile, apkFile, imgFileId, selectType } = this.state;
                const { saveCourseInfo } = this.props;
                if (selectType === "全景图") {
                    if ( !vrFile.fileId || !webFile.fileId || !imgFileId ) {
                        message.error("请上传相关文件信息!");
                        return false
                    }
                } else {
                    if ( !apkFile.fileId || !videoFile.fileId || !imgFileId ) {
                        message.error("请上传相关文件信息!");
                        return false
                    }
                }
                saveCourseInfo({
                    ...values,
                    vrFile, webFile, videoFile, apkFile, imgFileId
                });
                showModal("courseConfirmModal")
            }
        });
    };

    typeHandleChange = (value) => {
        this.setState({
            selectType: value
        })
    };

    handleBigCourse = () => {
        setTimeout(()=>{
            const bigCourseVal = this.props.form.getFieldValue("bigCourse");
            this.setState({
                selectBigCourse: bigCourseVal,
                selectSubCourse: 101
            });
            this.props.form.setFieldsValue({
                subCourse: bigCourseVal+"01"
            })
        }, 0)
    };

    handleSubCourse = () => {
        setTimeout(()=>{
            const bigCourseVal = this.props.form.getFieldValue("bigCourse");
            const subCourseVal = this.props.form.getFieldValue("subCourse");
            this.setState({
                selectBigCourse: bigCourseVal,
                selectSubCourse: subCourseVal
            });
            this.props.form.setFieldsValue({
                courseTheme: subCourseVal+"01"
            })
        }, 0)
    };

    render = () => {
        const self = this;
        const {
            selectType, selectBigCourse, selectSubCourse, vrDefaultFileName,
            webDefaultFileName, videoDefaultFileName, apkDefaultFileName
        } = this.state;
        const {
            form: { getFieldDecorator }, isUpdate, changeImgSrc, imgUploadSrc,
            subject, location, courseLoading
        } = this.props;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 13 }
        };
        const formItemLayoutSel = {
            labelCol: { span: 12 },
            wrapperCol: { span: 12 }
        };
        const bigCourseIndex = selectBigCourse-1,
            subCourseIndex = selectSubCourse.toString().charAt(selectSubCourse.toString().length-1)-1;
        //  web课程资源
        const webProps = {
            refDom: "uploadWeb",
            btnName: "选择上传",
            location: location,
            defaultFile: isUpdate ? webDefaultFileName : "",
            beforeUpload: (file, filest) => {
                const { form: { getFieldValue } } = self.props;
                const { name } = file;
                const isZip = name.substring(name.lastIndexOf("."),name.length) === '.zip';
                const isSameCode = Number(name.substring(0,name.indexOf("."))) === getFieldValue("courseCode");
                if (!isZip) {
                    message.error('请上传zip文件');
                    return isZip
                }
                if (!isSameCode) {
                    message.error('请上传和课程编号一样名字的文字');
                    return isSameCode
                }
                self.setState({
                    webFile: {
                        ...this.state.webFile,
                        fileId: null,
                        name: name
                    }
                });
                return true
            },
            uploadSuccess: (res) => {
                self.setState({
                    webFile: {
                        ...this.state.webFile,
                        fileId: res.data.FileId
                    }
                });
            }
        };
        //  VR课程资源
        const vrProps = {
            refDom: "uploadVr",
            btnName: "选择上传",
            location: location,
            defaultFile: isUpdate ? vrDefaultFileName : "",
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isAsset = name.substring(name.lastIndexOf("."),name.length) === '.asset';
                if (!isAsset) {
                    message.error('请上传asset文件');
                }
                self.setState({
                    vrFile: {
                        ...this.state.vrFile,
                        fileId: null,
                        name: name
                    }
                });
                return isAsset
            },
            uploadSuccess: (res) => {
                self.setState({
                    vrFile: {
                        ...this.state.vrFile,
                        fileId: res.data.FileId
                    }
                });
            }
        };
        //  课程封面
        const imgProps = {
            type: "img",
            refDom: "uploadImg",
            btnName: "",
            imgSrc: imgUploadSrc,
            location: location,
            beforeUpload: (file, filest, uploadFun) => {
                const { name, size } = file;
                const isPng = name.substring(name.lastIndexOf("."),name.length).toLowerCase() === '.png';
                if (!isPng) {
                    message.error('请选择png格式图片');
                    return isPng
                }
                const isLt2M = size / 1024 / 1024 < 10;
                if (!isLt2M) {
                    message.error('图片大小不能超过10M');
                    return isLt2M
                }

                const isRightImg = () => {
                    let reader = new FileReader() ;
                    reader.readAsDataURL(file) ;
                    reader.onload = function(theFile){
                        let image = new Image();
                        image.src = theFile.target.result;
                        image.onload = function() {
                            if (this.width !== 180 && this.height !== 180) {
                                message.error('请上传尺寸为180*180的图片');
                            } else {
                                changeImgSrc(theFile.target.result);
                                self.setState({
                                    imgFileId: null
                                });
                                uploadFun && uploadFun();
                            }
                        };
                    };
                };

                isRightImg()
            },
            uploadSuccess: (res) => {
                self.setState({
                    imgFileId: res.data.FileId
                })
            }
        };
        //  视频资源
        const videoProps = {
            refDom: "uploadVideo",
            btnName: "选择上传",
            location: location,
            defaultFile: isUpdate ? videoDefaultFileName : "",
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isMp4 = name.substring(name.lastIndexOf("."),name.length) === '.mp4';
                if (!isMp4) {
                    message.error('请上传mp4格式视频');
                }
                self.setState({
                    videoFile: {
                        ...this.state.videoFile,
                        fileId: null,
                        name: name
                    }
                });
                return isMp4
            },
            uploadSuccess: (res) => {
                self.setState({
                    videoFile: {
                        ...this.state.videoFile,
                        fileId: res.data.FileId
                    }
                });
            }
        };
        //  apk资源
        const apkProps = {
            refDom: "uploadApk",
            btnName: "选择上传",
            location: location,
            uploadTo: "server",
            defaultFile: isUpdate ? apkDefaultFileName : "",
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isApk = name.substring(name.lastIndexOf("."),name.length) === '.apk';
                if (!isApk) {
                    message.error('请上传apk文件');
                }
                self.setState({
                    apkFile: {
                        ...this.state.apkFile,
                        fileId: null,
                        name: name
                    }
                });
                return isApk
            },
            uploadSuccess: (res) => {
                self.setState({
                    apkFile: {
                        ...this.state.apkFile,
                        fileId: res.data.id
                    }
                });
            }
        };
        
        return (
            <Spin tip="Loading..." spinning={courseLoading}>
                <Form
                    onSubmit={this.handleAdd}
                    style={{ width: 700, margin: "auto" }}
                    className="course-manage"
                >
                    <Row className="position-relative">
                        <FormItem {...formItemLayout} label="课程名称">
                            <Col span="16">
                                {getFieldDecorator(`courseName`, {
                                    initialValue: "",
                                    rules: [
                                        {
                                            transform: (value) => {
                                                return value.trim()
                                            }
                                        },
                                        {
                                            required: true, message: '请输入课程名称'
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入课程名称" size="large" maxLength="30"/>
                                )}
                            </Col>
                            <Col span="7" offset="1">
                                <p>不超过30个字符</p>
                            </Col>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="课程编号" required>
                            {getFieldDecorator(`courseCode`, {
                                initialValue: "",
                                rules: [
                                    {
                                        required: true, message: '请输入课程编号'
                                    }
                                ]
                            })(
                                <InputNumber min={0} size="large" disabled={isUpdate}/>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="课程大类">
                            {getFieldDecorator(`bigCourse`, {
                                initialValue: "1"
                            })(
                                <Select size="large" disabled={isUpdate} onSelect={this.handleBigCourse}>
                                    {
                                        subject.length > 0 ? subject.map(function (data, index) {
                                            return <Option key={index} value={`${data.id}`}>{data.name}</Option>
                                        }) : null
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <Col span="8" offset="3">
                            <FormItem {...formItemLayoutSel} label="课程子类">
                                {getFieldDecorator(`subCourse`, {
                                    initialValue: `101`
                                })(
                                    <Select size="large" disabled={isUpdate} onSelect={this.handleSubCourse}>
                                        {
                                            subject.length > 0 ? subject[bigCourseIndex].subSubjects.map((data, index) => {
                                                return <Option key={index} value={`${data.id}`}>{data.name}</Option>
                                            }) : null
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        {
                            subject.length > 0 && subject[bigCourseIndex].subSubjects[subCourseIndex].subSubjects.length > 0 && (
                                <Col span="8">
                                    <FormItem {...formItemLayoutSel} label="所属主题">
                                        {getFieldDecorator(`courseTheme`, {
                                            initialValue: `${subject.length > 0 && subject[bigCourseIndex].subSubjects[subCourseIndex].subSubjects[0].id}`
                                        })(
                                            <Select size="large" disabled={isUpdate}>
                                                {
                                                    subject.length > 0 ? subject[bigCourseIndex].subSubjects[subCourseIndex].subSubjects.map((data, index) => {
                                                        return <Option key={index} value={`${data.id}`}>{data.name}</Option>
                                                    }) : null
                                                }
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            )
                        }
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="内容类型">
                            {getFieldDecorator(`contentType`, {
                                initialValue: "全景图"
                            })(
                                <Select size="large" onSelect={this.typeHandleChange} disabled={isUpdate}>
                                    <Option value="全景图">全景图</Option>
                                    <Option value="实验课">实验课</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="课程版本">
                            <Col span="4">
                                {getFieldDecorator(`courseVersion`, {
                                    initialValue: "1.0"
                                })(
                                    <Input size="large" disabled={true}/>
                                )}
                            </Col>
                        </FormItem>
                    </Row>
                    <Row>
                        <FormItem {...formItemLayout} label="教师端课程封面" required={!isUpdate}>
                            <Col span="10">
                                <FileUpload {...imgProps} />
                            </Col>
                            <Col span="14">
                                <p style={{ marginTop: 60 }}>PNG格式，180*180,大小不超过10MB</p>
                            </Col>
                        </FormItem>
                    </Row>
                    <div className={`${selectType !== "全景图" && 'hidden'}`}>
                        <Row>
                            <FormItem {...formItemLayout} label="VR端课程资源" required={!isUpdate}>
                                <FileUpload {...vrProps}/>
                                <p className="tip">上传指定格式asset包</p>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...formItemLayout} label="WEB端课程资源" required={!isUpdate}>
                                <FileUpload {...webProps}/>
                                <p className="tip">上传指定格式zip包</p>
                            </FormItem>
                        </Row>
                    </div>
                    <div className={`${selectType !== "实验课" && 'hidden'}`}>
                        <Row>
                            <FormItem {...formItemLayout} label="教师端展示视频" required={!isUpdate}>
                                <FileUpload {...videoProps} />
                                <p className="tip">MP4格式，大小建议不超过1G</p>
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...formItemLayout} label="VR学生端课程APK" required={!isUpdate}>
                                <FileUpload {...apkProps} />
                            </FormItem>
                        </Row>
                    </div>
                    <Row className="text-center" style={{ borderTop: "1px solid #ddd", paddingTop: 15 }}>
                        <Button type="primary" htmlType="submit" size="large" style={{ width:100, marginRight: 60 }}>
                            {
                                isUpdate ? "更新" : "添加"
                            }
                        </Button>
                        <Button size="large" onClick={this.handleCancel} style={{ width:100 }}>取消</Button>
                    </Row>
                </Form>
            </Spin>
        )
    }
}

export default CourseManage = createForm({})(CourseManage);