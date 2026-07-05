let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

let chatHistory = [
  {
    role: "system",
    content: "You are ANIBOT created by Aniket. Reply in Hinglish in a friendly way."
  }
];

async function generateResponse(aiChatBox) {

    let text = aiChatBox.querySelector(".ai-chat-area");

    function typeEffect(element, message) {
        let i = 0;
        element.innerHTML = "";

        let interval = setInterval(() => {
            if (i < message.length) {
                element.innerHTML += message.charAt(i);
                i++;
            } else {
                clearInterval(interval);
            }
        }, 20);
    }

    try {

        let response = await fetch("https://ani-bot-qzau.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
    messages: chatHistory
})
        });

        let data = await response.json();

        if (!response.ok) {
            text.innerHTML = data.reply || "Server Error";
            return;
        }

       chatHistory.push({
    role: "assistant",
    content: data.reply
});

        typeEffect(text, data.reply);

    } catch (error) {
        console.log(error);
        text.innerHTML = "Cannot connect to server";
    }

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });

}

function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

function handlechatResponse(userMessage) {

    if (userMessage.trim() === "") return;

    user.message = userMessage;
    chatHistory.push({
  role: "user",
  content: userMessage
});

    let html = `
<img src="me.jpg.png" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>` : ""}
</div>`;

    prompt.value = "";

    let userChatBox = createChatBox(html, "user-chat-box");

    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });

    setTimeout(() => {

        let html = `
<img src="ai.png" id="aiImage" width="10%">
<div class="ai-chat-area">
<img src="loading.webp" class="load" width="50">
</div>`;

        let aiChatBox = createChatBox(html, "ai-chat-box");

        chatContainer.appendChild(aiChatBox);

        generateResponse(aiChatBox);

    }, 500);

}

prompt.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        handlechatResponse(prompt.value);

    }

});

submitbtn.addEventListener("click", () => {

    handlechatResponse(prompt.value);

});

imageinput.addEventListener("change", () => {

    const file = imageinput.files[0];

    if (!file) return;

    let reader = new FileReader();

    reader.onload = (e) => {

        let base64 = e.target.result.split(",")[1];

        user.file = {

            mime_type: file.type,
            data: base64

        };

        image.src = `data:${file.type};base64,${base64}`;

        image.classList.add("choose");

    };

    reader.readAsDataURL(file);

});

imagebtn.addEventListener("click", () => {

    imageinput.click();

});

const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {

    document.documentElement.classList.toggle("dark");

    if (document.documentElement.classList.contains("dark")) {

        toggleBtn.textContent = "☀️";

    } else {

        toggleBtn.textContent = "🌙";

    }

});