/**更新页面*/
function updatePage(id) {
    memuList.forEach((menu, index) => {
        const pageElement = $("#" + menu.pageId);
        if (id == index) {
            document.getElementById('headTitle').innerHTML = menu.title || menu.name;
            if (document.getElementById(menu.pageId)) {
                pageElement.show("slow");
                closeInsert(index)
            } else {
                createPageByPageFields(index);
            }
        } else {
            pageElement.hide("slow");
        }
    });
}

/*根据pageFields创建页面*/
function createPageByPageFields(i) {
    const menu = memuList[i];
    // 创建页面容器
    const pageDiv = createElement('div', {
        id: menu.pageId,
        className: 'container'
    });
    document.body.appendChild(pageDiv);

    // 创建新增按钮
    const addBtn = createElement('button', {
        type: 'button',
        className: 'btn-normal',
        id: "addBtn_" + menu.pageId,
        textContent: '新增',
        eventListeners: {
            click: () => insertRecord(menu.pageId)
        }
    });
    pageDiv.appendChild(addBtn);// 添加到文档片段

    // 创建台账表格（如果有配置）
    createLedgerTable(i, pageDiv);

    // 创建表单容器
    const insertDiv = createElement('div', {
        id: "insert_" + menu.pageId,
        style: {display: 'none'}
    });

    // 创建表单元素
    const {fragment, btnFragment} = createFormElements(menu, i);
    insertDiv.appendChild(fragment);

    // 添加提交、关闭按钮（如果有数据键）
    if (menu.data_key != null) {
        const submitBtn = createElement('button', {
            type: 'button',
            className: 'btn-normal',
            id: 'btn_submit_' + menu.pageId,
            textContent: "提交",
            eventListeners: {
                click: () => commit(i)
            }
        });
        btnFragment.appendChild(submitBtn);
        const closeBtn = createElement('button', {
            type: 'button',
            className: 'btn-normal',
            id: 'btn_close_' + menu.pageId,
            textContent: "关闭",
            eventListeners: {
                click: () => closeInsert(i)
            }
        });
        btnFragment.appendChild(closeBtn);
    }

    insertDiv.appendChild(btnFragment);
    pageDiv.appendChild(insertDiv);
    $("#" + menu.pageId).show("slow");　//缓慢显示
}

// 辅助函数：创建台账表格
function createLedgerTable(i, parentElement) {
    const menuMap = memuList[i];
    const listKeys = menuMap.queryListKey ? menuMap.queryListKey.split(',') : [];
    const listNames = menuMap.queryListName ? menuMap.queryListName.split(',') : [];

    if (listKeys.length == 0 || listNames.length == 0 || listKeys.length !== listNames.length) return;

    const ledgerContainer = createElement('div', {
        className: 'ledger-container',
        innerHTML: '<h3>最近记录</h3>',
        id: "ledger_" + menuMap.pageId
    });

    const table = createElement('table', {style: {bordercollapse: "collapse"}});
    const thead = createElement('thead');
    const headerRow = createElement('tr');

    listNames.forEach(name => {
        headerRow.appendChild(createElement('th', {textContent: name}));
    });
    headerRow.appendChild(createElement('th', {textContent: "操作"}))
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = createElement('tbody');
    const data = getHtmlDateKey(memuList[i].data_key);

    if (data?.length > 0) {
        data.slice(-10).forEach(item => {
            const row = createElement('tr');
            listKeys.forEach(key => {
                row.appendChild(createElement('td', {
                    style: {
                        boxSizing: 'border-box'
                    },
                    textContent: item[key] ?? ''
                }));
            });

            // 操作单元格
            const actionCell = createElement('td', {textContent: ""});

            // 详情按钮
            const detailBtn = createElement('button', {
                className: 'btn-detail',
                textContent: '详情',
                eventListeners: {
                    click: () => showDetail(item, i) // 添加点击事件处理函数
                }
            });
            actionCell.appendChild(detailBtn);

            // 编辑按钮
            const editBtn = createElement('button', {
                className: 'btn-edit',
                textContent: '编辑',
                style: {marginLeft: '5px'},
                eventListeners: {
                    click: () => editRecord(item, i)
                }
            });
            actionCell.appendChild(editBtn);

            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    } else {
        const emptyRow = createElement('tr');
        emptyRow.appendChild(createElement('td', {
            colSpan: listNames.length + 1,
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
    let foldName = "";

    if (!menuMap.pageFields || !Array.isArray(menuMap.pageFields)) {
        console.error('pageFields格式错误或不存在');
        return {fragment, btnFragment};
    }

    menuMap.pageFields.forEach(field => {
        if (field.default == "initialization_time") {
            field.default = new Date().toLocaleDateString();
        }
        if (field.field_type == 2) {
            // select类型
            let optionsHtml = ddflds[field.ddfld].map(item =>
                `<option value="${item.code}" ${item.code === field.default ? 'selected' : ''}>${item.name}</option>`
            ).join('');
            fragment.appendChild(createElement('div', {
                className: 'form-group',
                innerHTML: `<label>${(field.name || '') + (field.unit || '') + "："}</label><select id="${field.data_key}" ">${optionsHtml}<</select>`
            }));
        } else if (field.field_type == 9) {
            // 按钮类型
            btnFragment.appendChild(createElement('button', {
                type: 'button',
                className: 'btn-normal',
                textContent: field.name
            }));
        } else if (field.field_type == 10) {
            // 折叠容器类型
            foldName = field.name;
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
                    fragment.appendChild(createFoldWrapper(foldContainer, foldName));
                    foldContainer = null;
                    foldName = "";
                }
                fragment.appendChild(formGroup);
            }
        }
    });

    // 处理最后一个折叠容器
    if (foldContainer) {
        fragment.appendChild(createFoldWrapper(foldContainer, foldName));
    }

    return {fragment, btnFragment};
}

// 辅助函数：创建折叠包装器
function createFoldWrapper(foldContainer, foldName) {
    const foldDiv = createElement('div');
    const foldTopDiv = createElement('div');
    foldName = foldName || "更多";
    const toggleBtn = createElement('a', {
        textContent: foldName + '↓',
        eventListeners: {
            click: () => {
                foldContainer.style.display = foldContainer.style.display == 'none' ? 'block' : 'none';
                toggleBtn.textContent = foldName + (foldContainer.style.display == 'none' ? '↓' : '↑');
            }
        }
    });
    foldContainer.style.paddingLeft = "0.5em"
    foldTopDiv.appendChild(toggleBtn)
    foldDiv.appendChild(foldTopDiv);
    foldDiv.appendChild(foldContainer);
    return foldDiv;
}

// 辅助函数：创建表单组
function createFormGroup(field, i) {
    const formGroup = createElement('div', {className: 'form-group'});
    formGroup.appendChild(createElement('label', {
        textContent: (field.name || '') + (field.unit || '') + "："
    }));

    formGroup.appendChild(createElement('input', {
        type: 'text',
        id: memuList[i].pageId + "__" + field.data_key,
        value: field.default || ''
    }));

    return formGroup;
}

// 辅助函数：处理折叠容器
function handleFoldContainer(field, fragment, foldContainer) {
    if (foldContainer) {
        fragment.appendChild(createFoldWrapper(foldContainer, field.name));
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
        if (key == 'eventListeners') {
            Object.entries(value).forEach(([event, handler]) => {
                element.addEventListener(event, handler);
            });
        } else if (key == 'style') {
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
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket == true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon == false) ? false : true;
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

/*新增*/
function insertRecord(id) {
    document.getElementById("insert_" + id).style.display = 'block';
    document.getElementById("addBtn_" + id).style.display = 'none';
    document.getElementById("ledger_" + id).style.display = 'none';
}

/*编辑*/
function editRecord(item, menuIndex) {
    const menu = memuList[menuIndex];

    // 显示编辑表单
    document.getElementById("insert_" + menu.pageId).style.display = 'block';
    document.getElementById("addBtn_" + menu.pageId).style.display = 'none';
    document.getElementById("ledger_" + menu.pageId).style.display = 'none';

    // 填充表单数据
    menu.pageFields.forEach(field => {
        if (field.field_type !== 9) {
            const inputId = menu.pageId + "__" + field.data_key;
            const input = document.getElementById(inputId);
            if (input) {
                input.value = item[field.data_key] || '';
            }
        }
    });

    // 修改提交按钮行为为更新而非新增
    const submitBtn = document.querySelector(`#insert_${menu.pageId} button[textContent="提交"]`);
    if (submitBtn) {
        submitBtn.onclick = () => updateRecord(item.id, menuIndex);
    }
}

// 更新记录函数
function updateRecord(id, menuIndex) {
    if (!confirm('确定要更新这条记录吗？')) {
        return;
    }

    const menu = memuList[menuIndex];
    const updatedData = {};

    menu.pageFields.forEach(field => {
        if (field.field_type !== 9) {
            const inputId = menu.pageId + "__" + field.data_key;
            updatedData[field.data_key] = document.getElementById(inputId).value;
        }
    });

    try {
        const dataStr = localStorage.getItem(htmlDateKey) || '{}';
        const data = JSON.parse(dataStr);

        if (data[menu.data_key]) {
            const index = data[menu.data_key].findIndex(item => item.id === id);
            if (index !== -1) {
                // 保留原有创建时间和ID
                updatedData.id = id;
                updatedData.createTime = data[menu.data_key][index].createTime;
                updatedData.is_del = data[menu.data_key][index].is_del || 0;

                data[menu.data_key][index] = updatedData;
                localStorage.setItem(htmlDateKey, JSON.stringify(data));
                alert('更新成功！');

                // 关闭编辑表单并刷新列表
                closeInsert(menu.pageId);
                document.getElementById("ledger_" + menu.pageId).innerHTML = '';
                createLedgerTable(menuIndex, document.getElementById(menu.pageId));
                return;
            }
        }
        alert('未找到要更新的记录');
    } catch (error) {
        console.error('更新数据失败:', error);
        alert('更新失败');
    }
}

/*详情*/
function showDetail(item, menuIndex) {
    const menu = memuList[menuIndex];

    // 显示表单
    document.getElementById("insert_" + menu.pageId).style.display = 'block';
    document.getElementById("addBtn_" + menu.pageId).style.display = 'none';
    document.getElementById("ledger_" + menu.pageId).style.display = 'none';

    // 填充表单数据并设置为只读
    menu.pageFields.forEach(field => {
        if (field.field_type !== 9) {
            const inputId = menu.pageId + "__" + field.data_key;
            const input = document.getElementById(inputId);
            if (input) {
                input.value = item[field.data_key] || '';
                input.readOnly = true;  // 设置为只读
                input.style.backgroundColor = '#f5f5f5';  // 添加视觉提示
            }
        }
    });

    // 隐藏提交按钮，显示关闭按钮
    const submitBtn = document.getElementById('btn_submit_' + menu.pageId);
    const closeBtn = document.getElementById('btn_close_' + menu.pageId);
    if (submitBtn) submitBtn.style.display = 'none';
    if (closeBtn) closeBtn.style.display = 'block';
}

/*点击关闭*/
function closeInsert(i) {
    if (document.getElementById("insert_" + memuList[i].pageId)) {
        document.getElementById("insert_" + memuList[i].pageId).style.display = "none";

        //清空表单
        document.getElementById("insert_" + memuList[i].pageId).querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        //清空select
        document.getElementById("insert_" + memuList[i].pageId).querySelectorAll('select').forEach(select => {
            select.value = '';
        });
    }

    if (document.getElementById("addBtn_" + memuList[i].pageId)) {
        document.getElementById("addBtn_" + memuList[i].pageId).style.display = "block";
    }
    if (document.getElementById("ledger_" + memuList[i].pageId)) {
        document.getElementById("ledger_" + memuList[i].pageId).style.display = "block";
    }
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

/*点击提交，保存到localStorage*/
function commit(i) {
    if (confirm('确定要保存内容吗？')) {
        // 内容非空校验

        const menu = memuList[i];
        const page_data = {};

        menu.pageFields.forEach(pageField => {
            if (pageField.field_type !== 9) {
                const inputId = menu.pageId + "__" + pageField.data_key;
                page_data[pageField.data_key] = document.getElementById(inputId).value;
            }
        });
        // 校验page_data是否为空
        if (page_data && Object.keys(page_data).length > 0) {

            page_data.id = generateRandomId();
            page_data.createTime = page_data.createTime || getNowFormatTime();//创建时间 yyyymmddHHmmss
            page_data.is_del = page_data.is_del || 0;//是否删除 否

            try {
                const dataStr = localStorage.getItem(htmlDateKey) || '{}';
                const data = JSON.parse(dataStr);
                // 初始化数据数组（如果不存在）
                data[menu.data_key] = data[menu.data_key] || [];
                data[menu.data_key].push(page_data);
                // 保存回localStorage（需序列化为字符串）
                localStorage.setItem(htmlDateKey, JSON.stringify(data));
            } catch (error) {
                console.error('保存数据失败:', error);
            }
            alert('保存成功！');
        } else {
            alert('内容不能为空！');
        }
    } else {
        alert('已取消保存');
    }

}

/*获取localStorage保存到数据*/
function getHtmlDateKey(data_key) {
    const dataStr = localStorage.getItem(htmlDateKey);
    // 修复：解析JSON字符串为对象，处理null情况
    const data = dataStr ? JSON.parse(dataStr) : {};
    return data[data_key] || []; // 确保返回数组，避免后续操作报错
}