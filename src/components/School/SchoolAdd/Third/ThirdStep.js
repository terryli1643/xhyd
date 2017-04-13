import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PackageManageSearch from '../../SchoolManage/PackageManage/Search';
import PackageManageTable from '../../SchoolManage/PackageManage/Table';
import PackageMangeConfirmModal from '../../SchoolManage/PackageManage/ConfirmModal';

@inject('packageList', "packageInfo") @observer
export default class ThirdStep extends Component{
    render = () => {
        const { step, nextStep, prevStep, clearStep, modalType, location,
            modalVisible, showModal, hideModal, thirdStep, btnLoading,
            clearStatus, 
            packageList: {
                getInfoPackageList, list, page, pageSize, count, resetPackageList, 
                loading, packageDetail, getPackageDetail, saveSearchFields,
                getDetailLoading
            },
            packageInfo: {
                saveSelectedKey, selectedRowKey, resetPackageInfo, selectedRows,
            },
        } = this.props;
        const PackageManageSearchProps = {
            getInfoPackageList, page, saveSearchFields, clearStatus, 
            resetPackageList, resetPackageInfo
        };
        const PackageManageTableProps = {
            prevStep, clearStep, showModal, getInfoPackageList,
            list, page, pageSize, count, loading, saveSelectedKey,
            selectedRowKey, getPackageDetail
        };
        const PackageModalProps = {
            nextStep, modalType, modalVisible, hideModal,
            thirdStep, btnLoading, packageDetail, location,
            selectedRowKey, getDetailLoading, selectedRows
        };
        return (
            <div className={`add-step ${step === 3 ? "" : "hidden"}`}>
                <h3 className="text-center">第3步：新增所属课程</h3>
                <PackageManageSearch {...PackageManageSearchProps}/>
                <PackageManageTable {...PackageManageTableProps} />
                <PackageMangeConfirmModal {...PackageModalProps} />
            </div>
        )
    }
}
