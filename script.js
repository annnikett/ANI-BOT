let prompt=document.querySelector("#prompt") 
let submitbtn=document.querySelector("#submit")
let chatContainer=document.querySelector(".chat-container")
let imagebtn=document.querySelector("#image")
let image=document.querySelector("#image img")
let imageinput=document.querySelector("#image input")



let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}
let chatHistory = [
    {
        role: "user",
        parts: [{ text: "You are ANIBOT created by Aniket. Reply in Hinglish." }]
    }
];
 
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    function typeEffect(element, text) {
    let i = 0;
    element.innerHTML = "";
    let interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

    const Api_Url =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBb8943v_2Jjdu5rEpquv3ZOnwQ9GEjzgI";


    try {
        let response = await fetch(Api_Url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
    contents: chatHistory
})
        });

        if (!response.ok) {
            if (response.status === 429) {
  text.innerHTML = "Too many requests. Thoda wait karo 🙏";
}
            console.log(await response.text());
            return;
        }

        let data = await response.json();

        if (!data.candidates) {
            text.innerHTML = "API Error";
            console.log(data);
            return;
        }

        let reply =
            data.candidates[0].content.parts[0].text;
            chatHistory.push({
    role: "model",
    parts: [{ text: reply }]
});

        typeEffect(text, reply);

    } catch (error) {
        console.log(error);
        text.innerHTML = "Error";
    }

    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: "smooth"
    });
}

function createChatBox(html,classes){
    let div=document.createElement("div")
    div.innerHTML=html
    div.classList.add(classes)
    return div
}

function handlechatResponse(userMessage){
    user.message=userMessage
    chatHistory.push({
    role: "user",
    parts: [{ text: userMessage }]
});
    let html=`<img src="user.png" alt="" id="userImage" width="8%">
<div class="user-chat-area">
${user.message}
${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}
</div>`
    prompt.value=""
    let userChatBox=createChatBox(html,"user-chat-box")
    chatContainer.appendChild(userChatBox)
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
    setTimeout(()=>{
        let html=`<img src="me.jpg.png" alt="" id="aiImage" width="10%">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" class="load" width="50px">
        </div>`
        let aiChatBox=createChatBox(html,"ai-chat-box")
        chatContainer.appendChild(aiChatBox)
        generateResponse(aiChatBox)
    },600)
}

prompt.addEventListener("keydown",(e)=>{
    if(e.key=="Enter"){
       handlechatResponse(prompt.value)
    }
})

submitbtn.addEventListener("click",()=>{
    handlechatResponse(prompt.value)
})

imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader=new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data:base64string
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`
        image.classList.add("choose")
    }
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})
