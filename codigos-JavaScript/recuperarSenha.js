import { autenticador } from "./firebase/config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

document.getElementById("enviaRedefinir").addEventListener("click", () => {
    const email = document.getElementById("txtEmail").value
    sendPasswordResetEmail(autenticador, email)
    .then(() => {
        alert("Um e-mail foi enviado!!!")
        location.href = "entrar.html"
    })
    .catch((error) => {
        alert("Erro!!!\n"+error.code);
    });
})