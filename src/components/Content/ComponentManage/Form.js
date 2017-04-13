import React, { Component } from 'react';
import { Form, Row, Col, Button, Icon, Input, message, Select, Spin } from 'antd';
import { browserHistory } from 'react-router';
import FileUpload from '../../Common/FileUpload/FileUpload';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

const changeType = (type) => {
    if (type === 1) {
        return "rom"
    } else if (type === 3) {
        return "war"
    } else if (type === 4) {
        return "teacherApk"
    } else {
        return "apk"
    }
};

class ComponentManage extends Component{
    state = {
        apkFile: {},
        romFile: {},
        warFile: {},
        teacherApkFile: {},
        selectedKey: "apk",
        apk: {},
        rom: {},
        war: {},
        teacherApk: {},
        apkNickName: "",
        romNickName: "",
        warNickName: "",
        teacherApkName: ""
    };

    componentDidMount = () => {
        const { isUpdate, getComponentDetail, location } = this.props;
        if (isUpdate) {
            getComponentDetail({
                id: location.query.id
            })
        }
    };

    componentDidUpdate = (preProps) => {
        if (this.props.componentDetail !== preProps.componentDetail ) {
            this.setFields()
        }
    };

    setFields = () => {
        const {
            componentDetail: {
                format, apkType, nickName, name, versionName, fileID
            } } = this.props;
        this.setState({
            selectedKey: changeType(format)
        });
        this.props.form.setFieldsValue({
            type: changeType(format),
            apkType: `${apkType}`
        });
        if (format === 1) {
            this.setState({
                romNickName: nickName,
                rom: {
                    name: name,
                    version: versionName
                },
                romFile: {
                    fileId: fileID
                }
            });
            this.props.form.setFieldsValue({
                romNickName: nickName
            });
        } else if (format === 3) {
            this.setState({
                warNickName: nickName,
                war: {
                    name: name,
                    version: versionName
                },
                warFile: {
                    fileId: fileID
                }
            });
            this.props.form.setFieldsValue({
                warNickName: nickName
            });
        } else if (format === 4) {
            this.setState({
                teacherApkName: nickName,
                teacherApk: {
                    name: name,
                    version: versionName
                },
                teacherApkFile: {
                    fileId: fileID
                }
            });
            this.props.form.setFieldsValue({
                teacherApkNickName: nickName
            });
        } else {
            this.setState({
                apkNickName: nickName,
                apk: {
                    name: name,
                    version: versionName
                },
                apkFile: {
                    fileId: fileID
                }
            });
            this.props.form.setFieldsValue({
                apkNickName: nickName
            });
        }
    };

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
                if(!err) {
                    const {
                        apkFile, romFile, warFile, teacherApkFile,
                        apk, rom, war, teacherApk, selectedKey
                    } = this.state;
                    const { isUpdate, createComponent, updateComponent, location } = this.props;
                    let params = {};
                    if (selectedKey === "apk" ) {
                        params.format = 2;
                        params.name = apk.name;
                        params.apkType = values.apkType;
                        params.fileId = apkFile.fileId;
                        params.nickName = values.apkNickName;
                    }

                    if (selectedKey === "rom") {
                        params.format = 1;
                        params.name = rom.name;
                        params.fileId = romFile.fileId;
                        params.nickName = values.romNickName;
                    }

                    if (selectedKey === "war") {
                        params.format = 3;
                        params.name = war.name;
                        params.fileId = warFile.fileId;
                        params.nickName = values.warNickName;
                    }

                    if (selectedKey === "teacherApk") {
                        params.format = 4;
                        params.name = teacherApk.name;
                        params.fileId = teacherApkFile.fileId;
                        params.nickName = values.teacherApkNickName;
                    }

                    if (isUpdate) {
                        updateComponent({
                            ...params,
                            id: location.query.id
                        })
                    } else {
                        createComponent(params)
                    }
                }
            }
        );
    };

    handleTypeChange = (value) => {
        this.setState({
            selectedKey: value
        })
    };

    handleNickNameChange1 = (e) => {
        this.setState({
            apkNickName: e.target.value
        })
    };

    handleNickNameChange2 = (e) => {
        this.setState({
            romNickName: e.target.value
        })
    };

    handleNickNameChange3 = (e) => {
        this.setState({
            warNickName: e.target.value
        })
    };

    handleNickNameChange4 = (e) => {
        this.setState({
            teacherApkName: e.target.value
        })
    };

    setUpdate = () => {
        const { componentDetail } = this.props;
        return Number(componentDetail.versionName) + 1
    };
    
    render = () => {
        const {
            form: { getFieldDecorator }, location, isUpdate,
            btnLoading, detailLoading
        } = this.props;
        const { selectedKey, apkNickName, romNickName, warNickName, teacherApkName } = this.state;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 }
        };
        /*  APK上传
         * */
        const apkProps = {
            refDom: "uploadApk",
            btnName: "点击上传",
            location: location,
            uploadTo: "server",
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isApk = name.substring(name.lastIndexOf("."),name.length) === '.apk';
                if (!isApk) {
                    message.error('请上传apk文件');
                } else {
                    this.setState({
                        apkFile: {
                            ...this.state.apkFile,
                            fileId: null,
                            name: name
                        },
                        apk: {
                            name: "",
                            version: ""
                        }
                    });
                }
                return isApk
            },
            uploadSuccess: (res) => {
                this.setState({
                    apkFile: {
                        ...this.state.apkFile,
                        fileId: res.data.id
                    },
                    apk: {
                        name: res.data.apkName,
                        version: res.data.versionName
                    }
                });
            }
        };
        /*  ROM上传
         * */
        const romProps = {
            refDom: "uploadRom",
            btnName: "点击上传",
            location: location,
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isZip = name.substring(name.lastIndexOf("."),name.length) === '.zip';
                if (!isZip) {
                    message.error('请上传zip文件');
                    return false
                } else if (!(/^ROM_MXSY_(\d+\.){4}[z,Z][i,I][p,P]$/).test(name)) {
                    message.error('请上传正确格式的ROM文件');
                    return false
                } else {
                    this.setState({
                        romFile: {
                            ...this.state.romFile,
                            fileId: null,
                            name: name
                        },
                        rom: {
                            name: "",
                            version: ""
                        }
                    });
                }
                return true
            },
            uploadSuccess: (res) => {
                const { romFile: { name } } = this.state;
                this.setState({
                    romFile: {
                        ...this.state.romFile,
                        fileId: res.data.FileId
                    },
                    rom: {
                        name: name,
                        version: name.split("_")[2].substring(0,name.split("_")[2].length-4)
                    }
                });
            }
        };
        /*  服务台上传
         * */
        const warProps = {
            refDom: "uploadWar",
            btnName: "点击上传",
            location: location,
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isZip = name.substring(name.lastIndexOf("."),name.length) === '.war';
                if (!isZip) {
                    message.error('请上传war文件');
                } else {
                    this.setState({
                        warFile: {
                            ...this.state.warFile,
                            fileId: null,
                            name: name
                        },
                        war: {
                            name: "",
                            version: ""
                        }
                    });
                }
                return isZip
            },
            uploadSuccess: (res) => {
                this.setState({
                    warFile: {
                        ...this.state.warFile,
                        fileId: res.data.FileId
                    },
                    war: {
                        name: this.state.warFile.name,
                        version: isUpdate ? this.setUpdate() : 1
                    }
                });
            }
        };
        /*  教师控制端apk
         * */
        const teacherApkProps = {
            refDom: "uploadTeacherApk",
            btnName: "点击上传",
            location: location,
            uploadTo: "server",
            beforeUpload: (file, filest) => {
                const { name } = file;
                const isApk = name.substring(name.lastIndexOf("."),name.length) === '.apk';
                if (!isApk) {
                    message.error('请上传apk文件');
                } else {
                    this.setState({
                        teacherApkFile: {
                            ...this.state.teacherApkFile,
                            fileId: null,
                            name: name
                        },
                        teacherApk: {
                            name: "",
                            version: ""
                        }
                    });
                }

                return isApk
            },
            uploadSuccess: (res) => {
                this.setState({
                    teacherApkFile: {
                        ...this.state.teacherApkFile,
                        fileId: res.data.id
                    },
                    teacherApk: {
                        name: res.data.apkName,
                        version: res.data.versionName
                    }
                });
            }
        };

        let isUpload = false, title = "", name = "";
        if (selectedKey === "apk" ) {
            title = "APK更新";
            name = "应用名称";
            if (this.state.apkFile.fileId && apkNickName !== "") {
                isUpload = true
            } else {
                isUpload = false
            }
        }

        if (selectedKey === "rom") {
            title = "ROM更新";
            name = "ROM名称";
            if (this.state.romFile.fileId && romNickName !== "") {
                isUpload = true
            } else {
                isUpload = false
            }
        }

        if (selectedKey === "war") {
            title = "服务台更新";
            name = "文件名";
            if (this.state.warFile.fileId && warNickName !== "") {
                isUpload = true
            } else {
                isUpload = false
            }
        }

        if (selectedKey === "teacherApk") {
            title = "教师控制端apk更新";
            name = "应用名称";
            if (this.state.teacherApkFile.fileId && teacherApkName !== "") {
                isUpload = true
            } else {
                isUpload = false
            }
        }

        // rom 1 apk 2 war 3 教师控制端apk 4
        return (
            <div>
                <Spin tip="Loading..." spinning={detailLoading}>
                    <h2 className={`text-center ${!isUpdate && "hidden"}`}>{title}</h2>
                    <Form
                        onSubmit={this.handleSearch}
                        style={{ marginTop: 50 }}
                    >
                        <Row>
                            <FormItem {...formItemLayout} label="组件种类">
                                {getFieldDecorator(`type`, {
                                    initialValue: "apk"
                                })(
                                    <Select size="large" onChange={this.handleTypeChange} disabled={isUpdate}>
                                        <Option value="apk">APK</Option>
                                        <Option value="rom">ROM</Option>
                                        <Option value="war">服务台</Option>
                                        <Option value="teacherApk">教师控制端APK</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "apk" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="APK文件">
                                <FileUpload {...apkProps}/>
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "rom" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="ROM文件">
                                <FileUpload {...romProps}/>
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "war" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="服务台文件">
                                <FileUpload {...warProps}/>
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "teacherApk" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="APK文件">
                                <FileUpload {...teacherApkProps}/>
                            </FormItem>
                        </Row>
                        {
                            selectedKey === "apk" && (
                                <Row>
                                    <FormItem {...formItemLayout} label="支持课程类型">
                                        {getFieldDecorator(`apkType`, {
                                            initialValue: "1"
                                        })(
                                            <Select size="large" disabled={isUpdate}>
                                                <Option value="1">全景图</Option>
                                                <Option value="2">全景视频</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Row>
                            )
                        }
                        <Row>
                            <FormItem {...formItemLayout} label={name}>
                                {
                                    this.state[selectedKey]["name"] || "未上传"
                                }
                            </FormItem>
                        </Row>
                        <Row>
                            <FormItem {...formItemLayout} label="版本号">
                                {
                                    this.state[selectedKey]["version"] || "未上传"
                                }
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "apk" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="备注名" required>
                                {getFieldDecorator(`apkNickName`, {
                                    initialValue: "",
                                    onChange: this.handleNickNameChange1
                                })(
                                    <Input size="large" placeholder="备注名不超过20个字符" maxLength="20"/>
                                )}
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "rom" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="备注名" required>
                                {getFieldDecorator(`romNickName`, {
                                    initialValue: "",
                                    onChange: this.handleNickNameChange2
                                })(
                                    <Input size="large" placeholder="备注名不超过20个字符" maxLength="20"/>
                                )}
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "war" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="备注名" required>
                                {getFieldDecorator(`warNickName`, {
                                    initialValue: "",
                                    onChange: this.handleNickNameChange3
                                })(
                                    <Input size="large" placeholder="备注名不超过20个字符" maxLength="20"/>
                                )}
                            </FormItem>
                        </Row>
                        <Row className={`${selectedKey !== "teacherApk" && 'hidden'}`}>
                            <FormItem {...formItemLayout} label="备注名" required>
                                {getFieldDecorator(`teacherApkNickName`, {
                                    initialValue: "",
                                    onChange: this.handleNickNameChange4
                                })(
                                    <Input size="large" placeholder="备注名不超过20个字符" maxLength="20"/>
                                )}
                            </FormItem>
                        </Row>
                        <Row>
                            <Col span="18" offset="6">
                                <Button disabled={!isUpload} loading={btnLoading} type="primary" htmlType="submit" size="large" style={{ width:100 }}>确认</Button>
                                <Button type="primary" loading={btnLoading} style={{ width:100, float: "right" }} size="large" onClick={()=>(browserHistory.goBack())}>取消</Button>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </div>
        )
    }
}

export default ComponentManage = createForm({})(ComponentManage);