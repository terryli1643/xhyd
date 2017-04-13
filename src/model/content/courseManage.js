import { observable, action } from "mobx";
import ModalStore from "../common/modal";
import { browserHistory } from 'react-router';
import { fetchSubjects, fetchCreateCourse, fetchCourseDetail, 
    fetchUpdateCourse } from '../../servers/content/courseManage';
import { message } from 'antd'

class CourseMangeStore extends ModalStore{
    @observable applyUploadData;
    @observable imgUploadSrc;
    @observable subject;
    @observable btnLoading;
    @observable courseInfo;
    @observable courseDetail;
    @observable courseLoading;

    constructor(){
        super();
        this.applyUploadData = {};
        this.imgUploadSrc = "";
        this.subject = [];
        this.btnLoading = false;
        this.courseInfo = {};
        this.courseDetail = {};
        this.courseLoading = false
    }

    //  获取课程内容
    @action
    getSubject = async () => {
        const { data } = await fetchSubjects();

        if (data.code === 0) {
            this.subject = data.data.listItems
        }
    };

    //  改变上传图片的url
    @action
    changeImgSrc = (src) => {
        this.imgUploadSrc = src
    };

    //  创建课程
    @action
    createCourse = async () => {
        const { courseInfo } = this;
        this.btnLoading =true;

        let payload = {
            courseName: courseInfo.courseName,
            courseCode: courseInfo.courseCode,
            subject: Number(courseInfo.courseTheme) || Number(courseInfo.subCourse),
            contentType: courseInfo.contentType,
            coverFileId: courseInfo.imgFileId
        };

        if (courseInfo.vrFile.fileId) {
            payload = {
                ...payload,
                vrAssetFileId: courseInfo.vrFile.fileId
            }
        }

        if (courseInfo.webFile.fileId) {
            payload = {
                ...payload,
                webFileId: courseInfo.webFile.fileId
            }
        }

        if (courseInfo.videoFile.fileId) {
            payload = {
                ...payload,
                videoId: courseInfo.videoFile.fileId
            }
        }

        if (courseInfo.apkFile.fileId) {
            payload = {
                ...payload,
                vrApkFileId: courseInfo.apkFile.fileId
            }
        }

        const { data } = await fetchCreateCourse(payload);

        this.btnLoading = false;

        if (data.code === 0) {
            this.hideModal();
            message.success("增加课程成功",2);
            browserHistory.push("/admin/content/course/list")
        }
    };
    
    //  保存课程信息
    @action
    saveCourseInfo = (payload) => {
        this.courseInfo = payload
    };
    
    @action
    getCourseDetail = async (payload) => {
        this.courseLoading = true;

        const { data } = await fetchCourseDetail(payload);

        this.courseLoading = false;

        if (data.code === 0) {
            this.courseDetail = data.data
        }
    };

    /*  更新课程
    * */
    @action
    updateCourse = async (payload) => {
        this.btnLoading = true;
        const { courseInfo } = this;
        let params = {
            courseCode: courseInfo.courseCode,
            subject: Number(courseInfo.courseTheme) || Number(courseInfo.subCourse),
            contentType: courseInfo.contentType,
            courseId: payload.courseId,
            courseName: courseInfo.courseName
        };

        if (courseInfo.imgFileId) {
            params = {
                ...params,
                coverFileId: courseInfo.imgFileId
            }
        }

        if (courseInfo.vrFile.fileId) {
            params = {
                ...params,
                vrAssetFileId: courseInfo.vrFile.fileId
            }
        }

        if (courseInfo.webFile.fileId) {
            params = {
                ...params,
                webFileId: courseInfo.webFile.fileId
            }
        }

        if (courseInfo.videoFile.fileId) {
            params = {
                ...params,
                videoId: courseInfo.videoFile.fileId
            }
        }

        if (courseInfo.apkFile.fileId) {
            params = {
                ...params,
                vrApkFileId: courseInfo.apkFile.fileId
            }
        }

        const { data } = await fetchUpdateCourse(params);

        this.btnLoading = false;

        if (data.code === 0) {
            this.hideModal();
            message.success("更新课程成功",2);
            browserHistory.goBack()
        }
    }
}

const courseManage = new CourseMangeStore();
export default courseManage
