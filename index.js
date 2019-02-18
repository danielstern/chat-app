const url = `https://chat-app-server-workshop.herokuapp.com`;
const id = "WORKSHOP";

/**
 * Async method that gets and returns an auth code from the server.
 * Keeps trying again and again until it makes a successful request.
 */
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

/**
 * Gets messages from server and calls render function.
 */
async function refreshMessages(){
    while (true) {
        try {
            let code = await getAuthCode();
            let { messages } = await $.get(`${url}/getMessages`,{code});
            return renderMessages(messages);
        } catch (error) {
            console.error(error);
        }
    }
};

/**
 * Draws messages in browser with HTML
 */
function renderMessages(messages){
    let container = document.getElementById("MessageContainer");
    container.innerHTML = messages.map(message=>`<div>${message.owner.name} : ${message.text}</div>`).join('');
}

/**
 * Gets the value of several inputs, then uploads a message to the server.
 */
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
            await refreshMessages();
            textInput.value = "";
            return textInput.disabled = false;
        } catch (error) {
            console.log(error);
        }
    }
}

setInterval(refreshMessages,1000);