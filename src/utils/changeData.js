export function changeDeviceType(type) {
    if (type === 1) {
        return "VR一体机"
    } else if (type === 2) {
        return "VR控制手柄"
    }
}

export function changeComponentType(type) {
    if (type === 1) {
        return "ROM"
    } else if (type === 2) {
        return "APK"
    } else if (type === 3) {
        return "服务台"
    } else if (type === 4) {
        return "教师控制端APK"
    }
}

export function changeComponentApkType(type) {
    if (type === 1) {
        return "全景图"
    } else if (type === 2) {
        return "全景视频"
    } else {
        return "/"
    }
}