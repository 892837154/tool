// DOM元素缓存（统一管理）
const elements = {
    editor: document.getElementById('editor'),
    charCount: document.getElementById('charCount'),
    saveStatus: document.getElementById('saveStatus'),
    fileHandleEl: document.getElementById('fileHandle'),
    headTitle: document.getElementById('headTitle'),
};


// 自动保存到localStorage
elements.editor.addEventListener('input', () => {
    updateCharCount();
    localStorage.setItem('notepadContent', elements.editor.value);
    updateSaveStatus('自动保存到浏览器存储');
});
// 加载保存的内容
window.addEventListener('load', () => {
    if (localStorage.getItem('notepadContent')) {
        elements.editor.value = localStorage.getItem('notepadContent');
        updateCharCount();
        updateSaveStatus('已从浏览器存储加载');
    }
});

// 新建文档处理
function handleNewDocument() {
    if (elements.editor.value && !confirm('当前内容未保存，确定要新建吗？')) return;
    elements.editor.value = '';
    updateCharCount();
    updateSaveStatus('新建文档');
    elements.fileHandleEl.textContent = '';
}

// 保存文件处理（优化错误提示）
async function handleSaveFile() {
    try {
        if ('showSaveFilePicker' in window) {
            const handle = await getFileHandle();
            if (handle) {
                await writeFile(handle, elements.editor.value);
                updateSaveStatus(`已保存到 ${handle.name}`);
            }
        } else {
            downloadFile(elements.editor.value, 'notepad_content.txt');
            updateSaveStatus('已下载文件');
        }
    } catch (err) {
        console.error('保存失败:', err);
        updateSaveStatus('保存失败');
    }
}

/*另存为*/
function handleSaveAs() {
    downloadFile(elements.editor.value, 'notepad_content.txt');
    updateSaveStatus('已下载文件');
}

/*打开文件处理*/
async function handleOpenFile() {
    try {
        if ('showOpenFilePicker' in window) {
            const [handle] = await window.showOpenFilePicker();
            const file = await handle.getFile();
            const content = await file.text();
            elements.editor.value = content;
            elements.fileHandleEl.textContent = `当前文件: ${file.name}`;
            updateCharCount();
            updateSaveStatus(`已加载 ${file.name}`);
        } else {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.txt';
            input.onchange = async e => {
                const file = e.target.files[0];
                const content = await file.text();
                elements.editor.value = content;
                updateCharCount();
                updateSaveStatus(`已加载 ${file.name}`);
            };
            input.click();
        }
    } catch (err) {
        console.error('打开失败:', err);
        updateSaveStatus('打开失败');
    }
}

// 辅助函数：更新字符计数
function updateCharCount() {
    elements.charCount.textContent = `${elements.editor.value.length} 字符`;
}

function updateSaveStatus(message) {
    elements.saveStatus.textContent = message;
    setTimeout(() => {
        const now = new Date();
        elements.saveStatus.textContent = `最后操作: ${now.toLocaleString()}`;
    }, 3000);
}

function downloadFile(content, filename) {
    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

async function getFileHandle() {
    try {
        if (elements.fileHandleEl.textContent) {
            return await window.showSaveFilePicker({
                suggestedName: elements.fileHandleEl.textContent.replace('当前文件: ', '')
            });
        }
        return await window.showSaveFilePicker({
            suggestedName: 'notepad_content.txt'
        });
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('文件操作取消:', err);
        }
        return null;
    }
}

async function writeFile(handle, contents) {
    const writable = await handle.createWritable();
    await writable.write(contents);
    await writable.close();
    elements.fileHandleEl.textContent = `当前文件: ${handle.name}`;
}
