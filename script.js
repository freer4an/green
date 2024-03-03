const form = document.querySelector('form');
const getSettingsBtn = document.getElementById('getSettingsBtn');
const getStateInstanceBtn = document.getElementById('getStateInstanceBtn');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const sendFileByUrlBtn = document.getElementById('sendFileByUrlBtn');
const responseBox = document.getElementById('responseBox')

async function sendRequest(url, method, body, headers) {
    try {
        const response = await fetch(url, {method: method, body: JSON.stringify(body)});
        if (!response.ok) throw new Error(response);
        const data = await response.json();
        responseBox.textContent = JSON.stringify(data, null, 2);
    } catch(err) {
        console.log(err)
    }
}

getSettingsBtn.addEventListener('click', () => {
    const idInstance = form.idInstance.value;
    const apiTokenInstance = form.apiTokenInstance.value;
    const url = `https://api.green-api.com/waInstance${idInstance}/getSettings/${apiTokenInstance}`
    sendRequest(url, "GET")
})

getStateInstanceBtn.addEventListener('click', () => {
    const idInstance = form.idInstance.value;
    const apiTokenInstance = form.apiTokenInstance.value;
    const url = `https://api.green-api.com/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`
    sendRequest(url, "GET")
})

sendMessageBtn.addEventListener('click', () => {
    const idInstance = form.idInstance.value;
    const apiTokenInstance = form.apiTokenInstance.value;
    const body = {
        chatId: getChatId(form.phoneMsg.value),
        message: form.message.value
    }
    const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
    sendRequest(url, "POST", body)
})

sendFileByUrlBtn.addEventListener('click', async () => {
    const idInstance = form.idInstance.value;
    const apiTokenInstance = form.apiTokenInstance.value;
    const urlFile = parseFileUrl();
    const fileType = await fetchBlob(urlFile.fullPath);
    const body = {
        chatId: getChatId(form.phoneFile.value),
        urlFile: urlFile.fullPath,
        fileName: `${urlFile.fileName}.${fileType}`
    }
    const url = `https://api.green-api.com/waInstance${idInstance}/sendFileByUrl/${apiTokenInstance}`
    sendRequest(url, "POST", body)
})

async function fetchBlob(url) {
    const response = await fetch(url);
    const img = await response.blob();
    return img.type.split('/').slice(-1)[0];
}

function getChatId(id) {
    if (id.includes('@c.us' || id.includes('@g.us'))) return id;
    return id + '@c.us'
}

function parseFileUrl() {
    const urlObj = new URL(form.fileUrl.value);
    const parsedUrl = {
        fullPath: urlObj.origin + urlObj.pathname,
        fileName: ''
    }
    const pathname = urlObj.pathname;
    const filename = pathname.split('/').pop();
    const dotIndex = filename.lastIndexOf('.');
    parsedUrl.fileName = dotIndex !== -1 ? filename.substring(0, dotIndex) : filename;
    return parsedUrl;
}