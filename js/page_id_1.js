document.getElementById("empty1").addEventListener("dragenter", function (event) {
    event.preventDefault();
}, false);
document.getElementById("empty1").addEventListener("dragover", function (event) {
    event.preventDefault();
}, false);
document.getElementById("empty1").addEventListener("drop", function (event) {
    let reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById("page_id_1_empty").insertAdjacentHTML("afterBegin", e.target.result);
        document.getElementById("page_id_1_empty").classList.remove('page_id_1_empty');
    };
    reader.readAsDataURL(event.dataTransfer.files[0]);
    event.preventDefault();
}, false);

function clean_empty() {
    document.getElementById("page_id_1_empty").value = "";
    document.getElementById("btnColor").style.background = "";
}

function validateJson() {
    document.getElementById("page_id_1_empty").value = formatJson(document.getElementById("page_id_1_empty").value);
}

function compressJson() {
    var json = document.getElementById("page_id_1_empty").value;
    json = json.replace(/(\r)/g, '').replace(/(\n)/g, '').replace(/\s+/g, '');
    document.getElementById("page_id_1_empty").value = json;
}

let fileType = ['txt', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'pptx', 'ppt', 'png', 'jpg', 'gif', 'svg', 'ico', 'bmp', 'ofd'];
let typeValue = ['data:text/plain;base64,', 'data:application/msword;base64,', 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', 'data:application/vnd.ms-excel;base64,', 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', 'data:application/pdf;base64,', 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,', 'data:application/vnd.ms-powerpoint;base64,', 'data:image/png;base64,', 'data:image/jpeg;base64,', 'data:image/gif;base64,', 'data:image/svg+xml;base64,', 'data:image/x-icon;base64,', 'data:image/bmp;base64,', 'data:application/vnd.ofd;base64,'];

//将base64转换为blob
function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

//下载方法
function downloadFile(url, name = "What's the fuvk") {
    let a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", name);
    a.setAttribute("target", "_blank");
    let clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
}

function downloadFileByBase64(base64, name) {
    try {
        let myBlob = dataURLtoBlob(base64);
        let myUrl = URL.createObjectURL(myBlob);
        downloadFile(myUrl, name);
    } catch (e) {
        alert("解析base64失败:" + e.message);
        console.log(e)
    }
}

function download() {
    let base64 = document.getElementById("page_id_1_empty").value;
    if (base64.indexOf("data:") != 0) {
        if (base64.split("####").length > 1) {
            if (fileType.indexOf(base64.split("####")[0]) == -1) {
                alert("请输入文件前缀");
                return;
            }
            base64 = base64.replace((base64.split("####")[0] + "####"), typeValue[fileType.indexOf(base64.split("####")[0])]);
            document.getElementById("page_id_1_empty").value = base64;
            if (base64) {
                downloadFileByBase64(base64, "文件")
            }

        } else {
            alert("请输入文件前缀");
        }
    } else {
        downloadFileByBase64(base64, document.getElementById("input1").value ? document.getElementById("input1").value : "base64文件")
    }
}

function qzGet() {
    let base64 = document.getElementById("page_id_1_empty").value;
    document.getElementById("page_id_1_empty").value = typeValue[fileType.indexOf(base64)];
}

function setRgbTo16() {
    // 将str中的数字提取出来放进数组中
    var arr = document.getElementById("page_id_1_empty").value.split(",");
    if (arr.length != 3) {
        alert("格式错误(例:255,255,255)");
    }
    let c = '#';
    for (var i = 0; i < arr.length; i++) {
        // Number() 函数把对象的值转换为数字
        // toString(16) 将数字转换为十六进制的字符表示
        var t = Number(arr[i]).toString(16);
        //如果小于16，需要补0操作,否则只有5位数
        if (Number(arr[i]) < 16) {
            t = '0' + t;
        }
        c += t;
    }
    document.getElementById("page_id_1_empty").value = c;
    document.getElementById("btnColor").style.background = c;
}

function addition() {
    var res = 0;
    var values = document.getElementById("page_id_1_empty").value.replaceAll("\n", ",");
    for (var i = 0; i < values.split(",").length; i++) {
        var value = values.split(",")[i];
        res += parseInt(!value ? 0 : parseInt(value))
    }
    document.getElementById("page_id_1_empty").value = res
}

function valReplaceAll() {
    var val_input1 = document.getElementById("input1").value;
    if (val_input1 == null || val_input1 == "") {
        if (!confirm("是否替换成空？")) {
            return;
        }
    }
    document.getElementById("page_id_1_empty").value = document.getElementById("page_id_1_empty").value.replaceAll("\n", val_input1)
}

function valEval() {
    document.getElementById("page_id_1_empty").value = eval(document.getElementById("page_id_1_empty").value);
}

function camelToSnake() {
    //驼峰转大写
    document.getElementById("page_id_1_empty").value = document.getElementById("page_id_1_empty").value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
        .replace(/^_/, ''); // 去除首字母可能多出的下划线
}

function upperCase() {
    //大写
    document.getElementById("page_id_1_empty").value = document.getElementById("page_id_1_empty").value.toUpperCase();
}

function lowerCase() {
    //小写
    document.getElementById("page_id_1_empty").value = document.getElementById("page_id_1_empty").value.toLowerCase();
}

function toCamelCase() {
    //下划线大写转驼峰
    const parts = document.getElementById("page_id_1_empty").value.toLowerCase().split('_');
    document.getElementById("page_id_1_empty").value = parts[0] + parts.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

// 预生成拼音首字母映射表（包含所有常见汉字）
const PINYIN_MAP = (() => {
    const letters = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
    const boundaryChars = '驁簿錯鵽樲鰒餜靃攟鬠纙鞪黁漚曝裠鶸蜶籜鶩鑂韻糳'.split('');
    const map = new Map();

    boundaryChars.forEach((char, index) => {
        map.set(char, letters[index]);
        // 可在此扩展更多汉字映射
    });
    return map;
})();

// 带缓存的拼音首字母获取
const pinyinCache = new Map();

function getChinesePinyinAbbreviation() {
    str = document.getElementById("page_id_1_empty").value;
    options = {}
    if (!str) return '';

    // 处理字符串
    document.getElementById("page_id_1_empty").value = Array.from(str).map(char => {
        // 非中文直接返回
        if (!/[\u4e00-\u9fa5]/.test(char)) {
            return options.lowerCase ? char.toLowerCase() : char;
        }

        // 检查缓存
        if (pinyinCache.has(char)) {
            return pinyinCache.get(char);
        }

        // 查找拼音首字母
        let result = '';
        for (const [boundaryChar, initial] of PINYIN_MAP) {
            if (boundaryChar.localeCompare(char, 'zh-CN-u-co-pinyin') >= 0) {
                result = options.lowerCase ? initial.toLowerCase() : initial;
                break;
            }
        }

        // 缓存结果
        if (result) pinyinCache.set(char, result);
        return result || char;
    }).join('');
}