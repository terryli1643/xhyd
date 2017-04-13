const SparkMD5 = require('./spark-md5');

const computedFileMd5 = function (self, applyUpload, uploadFile, uploadSuccess, stateThis, refDom) {
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
        file = self.files[0],
        chunkSize = 2097152,                             // Read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5.ArrayBuffer(),
        fileReader = new FileReader();

    function loadNext() {
        let start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    fileReader.onload = function (e) {
        spark.append(e.target.result);                   // Append array buffer
        currentChunk++;

        if (currentChunk < chunks) {
            loadNext();
        } else {
            applyUpload(uploadFile, self, spark.end(), uploadSuccess, stateThis, refDom)
        }
    };

    fileReader.onerror = function () {
        console.warn('oops, something went wrong.');
    };

    loadNext();
};

export default computedFileMd5