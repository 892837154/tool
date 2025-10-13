/*获取htmlContent内容*/
function getHtmlContentInfo() {
    let content = localStorage.getItem(htmlContentKey);
    if (content == null || content == "") {
        return;
    }
    content = formatJson(content);
    content = JSON.parse(content);
    content.menuList = content.menuList || [];
    content.ddflds = content.ddflds || {};
    if (isMergeLocal) {
        content.menuList = deepMergeJSON(content.menuList, defaultMenuList);
        content.ddflds = deepMergeJSON(content.ddflds, ddflds);
    }
    $("#content_json").val(JSON.stringify(content));
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
            result += '<ul style="list-style-type: none;padding-inline-start: 0;">';
        } else {
            // 子集使用嵌套列表
            result += '<ul class="nested-list" style="padding-inline-start: 0.1em;">';
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
                if (typeCode === 'string' || typeCode === 'number' || typeCode === 'boolean' || typeCode === 'array' || typeCode === 'object') {
                    // 字符串/数字
                    valueControl = `<input id=${"value__input__" + id} type="text" value="${escapeHtml(value)}" class="value-input" oninput="changeContentJsonValue(this,'${id}')" style="${(typeCode === 'string' || typeCode == 'number') ? '' : 'display: none'}">`;

                    // 布尔值
                    valueControl += `<select id=${"value__boolean__" + id} class="value-select" onchange="changeContentJsonValue(this,'${id}')"  style="${(typeCode === 'boolean') ? '' : 'display: none'}">
                            <option value="true" ${value === true ? 'selected' : ''}>true</option>
                            <option value="false" ${value === false ? 'selected' : ''}>false</option>
                        </select>`;
                    if (typeCode == 'string') {
                        //对象/数组
                        valueControl += `<div style="display: inline-block;"><div id="${"value__array_object__" + id}" style="display: none">${addbtn(id)}</div></div>`;
                    }
                } else {
                    valueControl = '';
                }

                // 当前key的列表项[类型下拉框添加禁用条件、添加折叠按钮]
                result += `
                        <li class="json-item ${typeCode === 'array' || typeCode === 'object' ? 'collapsible' : ''}">
                          <div class="key-input-group">
                            ${(typeCode === 'array' || typeCode === 'object') ? `<span class="toggle-btn" onclick="toggleCollapse(this)">+</span>` : ''}
                            <select class="type-select" id=${"typeCode__" + id} ${hasValue ? 'disabled' : ''} style="${(typeCode === 'array' || typeCode === 'object') ? 'display: none' : ''}" onchange="changeTypeCode(this,'${id}')">${optionsHtml}</select>
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
        result += `<li class="json-item "><div class="key-input-group">${addbtn(idkey)}</div></li>`;
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

function addbtn(idkey) {
    return `<div id=${"addBtn__" + idkey} class="tool-icon" onclick="addContentJsonInput('${idkey}')">✚</div>
            <input id=${"addInput__" + idkey} type="text"  class="value-input" style="display:none">
            <div id=${"addSucBtn__" + idkey} class="tool-icon" onclick="addContentJsonKey('${idkey}')" style="display:none">✔</div>`;
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
    if (("," + defaultContentFields + ",").indexOf("," + keyPath + ",") != -1) {
        alert("不能删除默认字段");
        return;
    }
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

function addContentJsonInput(keyPath) {
    document.getElementById("addBtn__" + keyPath).style.display = "none";
    document.getElementById("addInput__" + keyPath).style.display = "";
    document.getElementById("addSucBtn__" + keyPath).style.display = "";
}

function addContentJsonKey(keyPath) {
    let addInput = document.getElementById("addInput__" + keyPath);
    setValueBykeyPath(keyPath, addInput.value, "");
    initializationDivjsonDiv()
}

/*根据路径设置值*/
function setValueBykeyPath(keyPath, key, value) {
    let content = document.getElementById('content_json').value;
    content = JSON.parse(content);
    if (keyPath == "") {
        content[key] = value;
    } else {
        var keyPaths = keyPath.split("__");
        var param = content
        for (var i = 0; i < keyPaths.length; i++) {
            if (i === keyPaths.length - 1) {
                if (key == "") {
                    param[keyPaths[i]] = value;
                } else {
                    if (Array.isArray(param[keyPaths[i]])) {
                        param[keyPaths[i]].push({[key]: value});
                    } else {
                        param[keyPaths[i]][key] = value;
                    }
                }
            } else {
                param = param[keyPaths[i]]
            }
        }
    }
    document.getElementById('content_json').value = JSON.stringify(content)
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
    const dataStr = localStorage.getItem(htmlContentKey);
    if (dataStr) {
        document.getElementById("content_json").value = dataStr;
    }
}

function changeTypeCode(select, keyPath) {
    let value__input = document.getElementById("value__input__" + keyPath);
    let value__boolean = document.getElementById("value__boolean__" + keyPath);
    let value__array_object = document.getElementById("value__array_object__" + keyPath);
    value__input.style.display = "none";
    value__boolean.style.display = "none";
    value__array_object.style.display = "none";
    if (select.value == "array" || select.value == "object") {
        value__array_object.style.display = "";
        setValueBykeyPath(keyPath, "", select.value == "array" ? [] : {});
    } else if (select.value == "boolean") {
        value__boolean.style.display = "";
        value__boolean[1].selected = true;
        setValueBykeyPath(keyPath, "", false);
        value__input.value = false;
    } else if (select.value == "string" || select.value == "number") {
        value__input.style.display = "";
        setValueBykeyPath(keyPath, "", "");
        value__input.value = "";
    }
}
