const url = `http://localhost:9001`;
const id = "WORKSHOP";

async function getAuthCode(){
    while (true) {
        try {
            let { code } = await $.get(`${url}/getCode`,{id});
            return code;
        } catch (e) {
            console.error("Encountered error while getting authorization code. Retrying now.");
        }
    }
}

async function refreshMessages(){
    while (true) {
        try {
            let code = await getAuthCode();
            let { messages } = await $.get(`${url}/getMessages`,{code});
            let container = document.getElementById("MessageContainer");
            container.innerHTML = messages.map(message=>`<div>${message.owner.name} : ${message.text}</div>`).join('');
            return;
        } catch (error) {
            console.error(error);
        }
    }
};

async function postMessage(){
    event.preventDefault();
    let textInput = document.getElementById('MessageInput');
    let usernameInput = document.getElementById('UsernameInput');
    let text = textInput.value;
    let username = usernameInput.value;
    if (text === "") return;
    textInput.disabled = true;

    while (true) {
        try {
            let code = await getAuthCode();
            await $.get(`${url}/postMessage`,{code,text,name:username});
            textInput.value = "";
            await refreshMessages();
            return textInput.disabled = false;
        } catch (error) {
            console.log(error);
        }
    }
}

setInterval(refreshMessages,1000);