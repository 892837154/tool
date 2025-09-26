/**更新页面*/
function updatePage(id) {
    for (var i = 0; i < memuList.length; i++) {
        if (id == i) {
            document.getElementById('headTitle').innerHTML = memuList[i].title ? memuList[i].title : memuList[i].name;
            if (document.getElementById(memuList[i].pageId)) {
                $("#" + memuList[i].pageId).show("slow");　//div1缓慢显示
            } else {
                //如果找不到id，根据pageFields创建
                createPageByPageFields(memuList[i], i);
            }
        } else {
            $("#" + memuList[i].pageId).hide("slow");　　//div1缓慢隐藏
        }
    }
}

/*根据pageFields创建页面*/
function createPageByPageFields(menuMap, i) {
    // 创建页面容器
    const pageDiv = createElement('div', {
        id: memuList[i].pageId,
        className: 'container'
    });
    document.body.appendChild(pageDiv);

    // 创建新增按钮
    const addBtn = createElement('button', {
        type: 'button',
        className: 'btn-normal',
        textContent: '新增',
        eventListeners: {
            click: () => insertData(memuList[i].pageId + "_insert")
        }
    });
    pageDiv.appendChild(addBtn);// 添加到文档片段

    // 创建台账表格（如果有配置）
    createLedgerTable(menuMap, i, pageDiv);

    // 创建表单容器
    const insertDiv = createElement('div', {
        id: memuList[i].pageId + "_insert",
        style: {display: 'none'}
    });

    // 创建表单元素
    const {fragment, btnFragment} = createFormElements(menuMap, i);
    insertDiv.appendChild(fragment);

    // 添加提交按钮（如果有数据键）
    if (menuMap.data_key != null) {
        const submitBtn = createElement('button', {
            type: 'button',
            className: 'btn-normal',
            textContent: "提交",
            eventListeners: {
                click: () => commit(i)
            }
        });
        btnFragment.appendChild(submitBtn);
    }

    insertDiv.appendChild(btnFragment);
    pageDiv.appendChild(insertDiv);
    $("#" + memuList[i].pageId).show("slow");　//缓慢显示
}

// 辅助函数：创建台账表格
function createLedgerTable(menuMap, i, parentElement) {
    const listKeys = menuMap.queryListKey ? menuMap.queryListKey.split(',') : [];
    const listNames = menuMap.queryListName ? menuMap.queryListName.split(',') : [];

    if (listKeys.length === 0 || listNames.length === 0 || listKeys.length !== listNames.length) return;

    const ledgerContainer = createElement('div', {
        className: 'ledger-container',
        innerHTML: '<h3>最近记录</h3>'
    });

    const table = createElement('table', {className: 'ledger-table'});
    const thead = createElement('thead');
    const headerRow = createElement('tr');

    listNames.forEach(name => {
        headerRow.appendChild(createElement('th', {textContent: name}));
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = createElement('tbody');
    const data = getHtmlDateKey(memuList[i].data_key);

    if (data?.length > 0) {
        data.slice(-10).forEach(item => {
            const row = createElement('tr');
            listKeys.forEach(key => {
                row.appendChild(createElement('td', {
                    textContent: item[key] ?? ''
                }));
            });
            tbody.appendChild(row);
        });
    } else {
        const emptyRow = createElement('tr');
        emptyRow.appendChild(createElement('td', {
            colSpan: listNames.length,
            textContent: '暂无记录'
        }));
        tbody.appendChild(emptyRow);
    }

    table.appendChild(tbody);
    ledgerContainer.appendChild(table);
    parentElement.appendChild(ledgerContainer);
}

// 辅助函数：创建表单元素
function createFormElements(menuMap, i) {
    const fragment = document.createDocumentFragment();
    const btnFragment = document.createDocumentFragment();
    let foldContainer = null;

    if (!menuMap.pageFields || !Array.isArray(menuMap.pageFields)) {
        console.error('pageFields格式错误或不存在');
        return {fragment, btnFragment};
    }

    menuMap.pageFields.forEach(field => {
        if (field.field_type === 9) {
            // 按钮类型
            btnFragment.appendChild(createElement('button', {
                type: 'button',
                className: 'btn-normal',
                textContent: field.name
            }));
        } else if (field.field_type === 10) {
            // 折叠容器类型
            foldContainer = handleFoldContainer(field, fragment, foldContainer);
        } else {
            // 普通表单元素
            const formGroup = createFormGroup(field, i);

            if (field.fold) {
                if (!foldContainer) {
                    foldContainer = createElement('div', {style: {display: 'none'}});
                }
                foldContainer.appendChild(formGroup);
            } else {
                if (foldContainer) {
                    fragment.appendChild(createFoldWrapper(foldContainer));
                    foldContainer = null;
                }
                fragment.appendChild(formGroup);
            }
        }
    });

    // 处理最后一个折叠容器
    if (foldContainer) {
        fragment.appendChild(createFoldWrapper(foldContainer));
    }

    return {fragment, btnFragment};
}

// 辅助函数：创建折叠包装器
function createFoldWrapper(foldContainer) {
    const foldDiv = createElement('div');
    const toggleBtn = createElement('button', {
        type: 'button',
        className: 'btn-normal',
        style: {
            position: "absolute",
            right: 0
        },
        textContent: '展开',
        eventListeners: {
            click: () => {
                foldContainer.style.display = foldContainer.style.display === 'none' ? 'block' : 'none';
            }
        }
    });

    foldDiv.appendChild(createElement('label', {textContent: "展开"}));
    foldDiv.appendChild(toggleBtn);
    foldDiv.appendChild(foldContainer);
    return foldDiv;
}

// 辅助函数：创建表单组
function createFormGroup(field, i) {
    const formGroup = createElement('div', {className: 'form-group'});
    formGroup.appendChild(createElement('label', {
        textContent: (field.name || '') + (field.unit || '')
    }));

    formGroup.appendChild(createElement('input', {
        type: 'text',
        id: memuList[i].pageId + "__" + field.data_key
    }));

    return formGroup;
}

// 辅助函数：处理折叠容器
function handleFoldContainer(field, fragment, foldContainer) {
    if (foldContainer) {
        fragment.appendChild(createFoldWrapper(foldContainer));
    }

    return createElement('div', {
        id: field.fold_name,
        style: {display: 'none'}
    });
}

// 通用元素创建函数
function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    Object.entries(options).forEach(([key, value]) => {
        if (key === 'eventListeners') {
            Object.entries(value).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
        } else if (key === 'style') {
            Object.assign(element.style, value);
        } else {
            element[key] = value;
        }
    });

    return element;
}

/**加载工具列表*/
function loadToolList() {
    // 获取第一个工具的pageId
    const firstMenuPageId = memuList[0].pageId;

    let container = document.getElementById(firstMenuPageId);

    // 如果容器不存在则创建
    if (!container) {
        const pageDiv = document.createElement("div");
        pageDiv.id = firstMenuPageId;
        pageDiv.className = 'container';
        document.body.appendChild(pageDiv);
        container = pageDiv;
    } else {
        container.innerHTML = ''; // 清空容器
    }

    // 创建文档片段优化DOM操作
    const fragment = document.createDocumentFragment();

    // 遍历工具列表创建div元素
    for (let i = 0; i < memuList.length; i++) {
        const tool = memuList[i];
        if (tool.toolShow != false) {//跳过不显示
            // 创建工具项div
            const toolDiv = document.createElement('div');
            // 设置div内容
            toolDiv.className = 'tool-item';
            toolDiv.style.width = (tool.name.length + 4) + "em";
            toolDiv.textContent = tool.name;

            // 添加点击事件（跳转到对应工具页面）
            toolDiv.addEventListener('click', () => {
                updatePage(i);
            });

            fragment.appendChild(toolDiv);// 添加到文档片段
        }
    }

    // 一次性将所有元素添加到容器
    container.appendChild(fragment);
}

//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
function formatJson(json, options) {
    let formatted = '',
        pad = 0,
        PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else if (json.trim() !== '') {
        try {
            // 尝试解析JSON以验证格式
            JSON.parse(json);
        } catch (e) {
            alert("解析错误:" + e.message);
            return json;
        }
    }
    // 添加实际格式化逻辑
    try {
        const parsed = JSON.parse(json || '{}');
        formatted = JSON.stringify(parsed, null, 0);
    } catch (e) {
        formatted = json; // 格式错误时返回原始内容
    }
    return formatted;
};

/*json压缩*/
function compressJson(json) {
    json = json.replace(/(\r)/g, '').replace(/(\n)/g, '').replace(/\s+/g, '');
    return json;
}

// 添加随机ID生成函数
function generateRandomId() {
    // 时间戳 + 随机字符串，确保唯一性
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 6);
    return `${timestamp}_${randomStr}`;
}

/*保存到localStorage*/
function insertData(id) {
    const div = document.getElementById(id);
    div.style.display = div.style.display === 'none' ? 'block' : 'none';
}

function getNowFormatTime(format, date) {
    // 参数校验：确保format是字符串类型
    if (typeof format !== 'string') {
        format = "YYYY-MM-DD HH:mm:ss";
    }

    // 支持自定义日期，默认使用当前时间
    const targetDate = date instanceof Date ? date : new Date();

    // 提取日期组件并统一补零处理
    const dateParts = {
        YYYY: targetDate.getFullYear(),
        MM: String(targetDate.getMonth() + 1).padStart(2, '0'),
        DD: String(targetDate.getDate()).padStart(2, '0'),
        HH: String(targetDate.getHours()).padStart(2, '0'),
        mm: String(targetDate.getMinutes()).padStart(2, '0'),
        ss: String(targetDate.getSeconds()).padStart(2, '0')
    };

    // 单次正则匹配所有占位符，提升性能
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, placeholder => dateParts[placeholder]);
}

/*保存到localStorage*/
function commit(i) {
    const page_data = {
        id: generateRandomId(),
    };
    for (let p = 0; p < memuList[i].pageFields.length; p++) {
        const pageField = memuList[i].pageFields[p];
        if (pageField.field_type == 9) {
            continue;
        }
        let value = document.getElementById(memuList[i].pageId + "__" + pageField.data_key).value;
        page_data[pageField.data_key] = value;
    }
    if (!page_data.createTime) {//创建时间
        page_data.createTime = getNowFormatTime();//yyyymmddHHmmss
    }
    if (!page_data.is_del) {//是否删除
        page_data.is_del = 0;//否删除
    }
    const dataStr = localStorage.getItem(htmlDateKey);
    const data = dataStr ? JSON.parse(dataStr) : {};

    // 初始化数据数组（如果不存在）
    if (!data[memuList[i].data_key]) {
        data[memuList[i].data_key] = [];
    }

    data[memuList[i].data_key].push(page_data);
    // 保存回localStorage（需序列化为字符串）
    localStorage.setItem(htmlDateKey, JSON.stringify(data));
}

/*获取localStorage保存到数据*/
function getHtmlDateKey(data_key) {
    const dataStr = localStorage.getItem(htmlDateKey);
    // 修复：解析JSON字符串为对象，处理null情况
    const data = dataStr ? JSON.parse(dataStr) : {};
    return data[data_key] || []; // 确保返回数组，避免后续操作报错
}