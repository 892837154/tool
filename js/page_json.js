/*获取htmlContent内容*/
function getHtmlContentInfo() {
    let content = localStorage.getItem(htmlContentKey);
    if (content == null || content == "") {
        return;
    }
    content = formatJson(content);
    $("#content_json").val(content);
    initializationDivjsonDiv()
}

function initializationDivjsonDiv() {
    // 分析JSON结构并显示结果
    const analysisResult = analyzeJsonStructure("", $("#content_json").val());
    const jsonContainer = document.getElementById('jsonDiv');
    jsonContainer.innerHTML = analysisResult;
    // 添加：默认展开顶层容器
    const topLevelItems = jsonContainer.querySelectorAll('.json-item.collapsible');
    topLevelItems.forEach(item => {
        const content = item.querySelector('.collapsible-content');
        const btn = item.querySelector('.toggle-btn');
        if (content && btn) {
            content.style.display = 'block';
            btn.textContent = '-';
        }
    });
}

/*循环JSON的key并判断值类型（支持递归展示子集）*/
function analyzeJsonStructure(idkey, jsonString, isTopLevel = true) {
    try {
        // 解析JSON
        const jsonObj = JSON.parse(jsonString || '{}');
        let result = '';
        // 顶层容器（仅首次调用添加）
        if (isTopLevel) {
            result += '<div class="json-analysis">';
            result += '<h4>JSON结构分析：</h4>';
            result += '<ul>';
        } else {
            // 子集使用嵌套列表
            result += '<ul class="nested-list">';
        }
        // 循环所有key
        for (const key in jsonObj) {
            var id = (idkey !== "" ? idkey + "__" : idkey) + key;
            if (jsonObj.hasOwnProperty(key)) {
                const value = jsonObj[key];
                let typeCode;
                // 判断值类型并获取类型编码
                if (Array.isArray(value)) {
                    typeCode = 'array';
                } else if (value !== null && typeof value === 'object') {
                    typeCode = 'object';
                } else if (typeof value === 'boolean') {
                    typeCode = 'boolean';
                } else if (value === null) {
                    typeCode = 'null';
                } else {
                    typeCode = typeof value;
                }
                // 判断是否有数据（非空值）
                const hasValue = value !== undefined && value !== null && value !== '';
                // 生成类型下拉框（添加禁用条件）
                let optionsHtml = ddflds.json_type.map(item =>
                    `<option value="${item.code}" ${item.code === typeCode ? 'selected' : ''}>${item.name}</option>`
                ).join('');
                // 创建值输入控件
                let valueControl = '';
                if (typeCode === 'string' || typeCode === 'number') {
                    // 字符串/数字使用文本输入框[添加HTML转义]
                    valueControl = `<input type="text" value="${escapeHtml(value)}" class="value-input" oninput="changeContentJsonValue(this,'${id}')" >`;
                } else if (typeCode === 'boolean') {
                    // 布尔值使用下拉选择框
                    valueControl = `<select class="value-select" onchange="changeContentJsonValue(this,'${id}')" >
                            <option value="true" ${value === true ? 'selected' : ''}>true</option>
                            <option value="false" ${value === false ? 'selected' : ''}>false</option>
                        </select>`;
                } else if (typeCode === 'null') {
                    // null值显示固定文本
                    valueControl = `<span class="null-value">null</span>`;
                } else if (typeCode === 'array' || typeCode === 'object') {
                    // 对象/数组不显示值输入框
                    valueControl = '';
                } else {
                    // 其他类型显示类型提示
                    valueControl = `<span class="type-hint">${typeCode}</span>`;
                }
                // 当前key的列表项[类型下拉框添加禁用条件、添加折叠按钮]
                result += `
                        <li class="json-item ${typeCode === 'array' || typeCode === 'object' ? 'collapsible' : ''}">
                          <div class="key-input-group">
                            ${(typeCode === 'array' || typeCode === 'object') ? `<span class="toggle-btn" onclick="toggleCollapse(this)">+</span>` : ''}
                            <select class="type-select" id=${"typeCode__" + id} ${hasValue ? 'disabled' : ''} style="${(typeCode === 'array' || typeCode === 'object') ? 'display: none' : ''}">${optionsHtml}</select>
                            <strong>${escapeHtml(key)}:</strong>
                            ${valueControl}
                            <div class="tool-icon" onclick="deleteContentJsonKey('${id}')">✖</div>
                          </div>
                    `;
                // 递归处理子集（数组/对象）- 添加可折叠容器
                if (typeCode === 'array' || typeCode === 'object') {
                    // 将子集对象转为JSON字符串传入递归
                    const subsetJson = JSON.stringify(value);
                    // 添加可折叠内容容器
                    result += `<div class="collapsible-content">`;
                    // 递归调用，生成子集结构HTML
                    result += analyzeJsonStructure(id, subsetJson, false);
                    result += `</div>`; // 闭合可折叠容器
                }
                result += `</li>`; // 闭合当前列表项
            }
        }
        // 当前key的列表项[类型下拉框添加禁用条件、添加折叠按钮]
        result += `<li class="json-item ">
                          <div class="key-input-group">
                            <div class="tool-icon" onclick="addContentJsonKey('${idkey}')">✚</div>
                            <input type="text" id=${"add__" + idkey} class="value-input" style="display: none">
                          </div>
                       </li>`;
        // 闭合列表容器
        result += '</ul>';
        // 闭合顶层容器
        if (isTopLevel) {
            result += '</div>';
        }
        return result;
    } catch (e) {
        console.log(`<div class="error">无效的JSON格式：${escapeHtml(e.message)}</div>`)
        return `<div class="error">无效的JSON格式：${escapeHtml(e.message)}</div>`;
    }
}

/*HTML转义函数（防止XSS和引号冲突）*/
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function changeContentJsonValue(input, keyPath) {
    var keyPaths = keyPath.split("__");
    let content = document.getElementById('content_json').value;
    content = JSON.parse(content);
    var param = content
    for (let i = 0; i < keyPaths.length; i++) {
        if (i === keyPaths.length - 1) {
            param[keyPaths[i]] = input.value;
        } else {
            param = param[keyPaths[i]]
        }
    }
    document.getElementById('content_json').value = JSON.stringify(content)
}

function deleteContentJsonKey(keyPath) {
    var keyPaths = keyPath.split("__");
    let content = document.getElementById('content_json').value;
    content = JSON.parse(content);
    var param = content
    for (var i = 0; i < keyPaths.length; i++) {
        if (i === keyPaths.length - 1) {
            if (Array.isArray(param)) {
                param.splice(keyPaths[i], 1)
            } else {
                delete param[keyPaths[i]];
            }
        } else {
            param = param[keyPaths[i]]
        }
    }
    document.getElementById('content_json').value = JSON.stringify(content)
    initializationDivjsonDiv()
}

function addContentJsonKey(keyPath) {
    let addInput = document.getElementById("add__" + keyPath);
    if (addInput.style.display === "none") {
        addInput.style.display = ""
        return;
    }
    if (addInput.value === null || addInput.value.trim() === "") {
        alert("请输入值");
        return;
    }
    var keyPaths = keyPath.split("__");
    let content = document.getElementById('content_json').value;
    content = JSON.parse(content);
    var param = content
    for (var i = 0; i < keyPaths.length; i++) {
        if (i === keyPaths.length - 1) {
            if (Array.isArray(param[keyPaths[i]])) {
                var c = {};
                c[addInput.value] = ""
                param[keyPaths[i]].push(c);
            } else {
                param[keyPaths[i]][addInput.value] = "";
            }
        } else {
            param = param[keyPaths[i]]
        }
    }
    document.getElementById('content_json').value = JSON.stringify(content)
    initializationDivjsonDiv()
}

/*折叠/展开切换函数*/
function toggleCollapse(btn) {
    const jsonItem = btn.closest('.json-item');
    const content = jsonItem.querySelector('.collapsible-content');
    if (content) {
        // 切换显示状态
        if (content.style.display === 'none' || !content.style.display) {
            content.style.display = 'block';
            btn.textContent = '-'; // 展开状态显示减号
        } else {
            content.style.display = 'none';
            btn.textContent = '+'; // 折叠状态显示加号
        }
    }
}

/**保存到localStorage**/
function saveHtmlContentInfo() {
    let content = document.getElementById('content_json').value;
    content = formatJson(content);
    // 添加保存确认弹窗
    if (confirm('确定要保存内容吗？')) {
        // 内容非空校验
        if (content && content.trim() !== '') {
            localStorage.setItem(htmlContentKey, compressJson(content));
            alert('保存成功！');
        } else {
            alert('内容不能为空！');
        }
    } else {
        alert('已取消保存');
    }
}
function coypHtmlDateKey() {
    const dataStr = localStorage.getItem(htmlDateKey);
    if (dataStr) {
        document.getElementById("content_json").value = dataStr;
    }
}
