import { autenticador, bancoDados } from "./firebase/config.js";
import { signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.getElementById("envio").addEventListener("click", () => {
    const email = document.getElementById("txtEmail").value
    const senha = document.getElementById("txtSenha")
    
    signInWithEmailAndPassword(autenticador, email, senha.value)
    .then(() => {
        getDocs(query (collection(bancoDados, "usuarios"), where("email", "==", email))) 
        .then ((snaps) => {
        snaps.forEach ((chos) => {
            snaps.forEach ((chose) => {
                let url = new URL (location.protocol+"//"+location.host+"/home.html");
                url.searchParams.set('id',chose.id)
                location.href = url;
            })
        })
        })   
    })
    .catch((error) => {
        if (error.code == "auth/wrong-password") {
            alert ("A senha está errada!"); senha.focus()
        } else if (error.code == "auth/user-not-found") {
            alert ("E-mail não cadastrado no sistema!!!");
            location.href = "criarConta.html";
        }
    });
})


