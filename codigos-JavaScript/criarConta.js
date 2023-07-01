import { autenticador, bancoDados } from "./firebase/config.js"
import { createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const verificaRadios = () => {
    const mas = document.getElementById("rbMasculino")
    const fem = document.getElementById("rbFeminino") 
    
    if (mas.checked && fem.checked) {
        return "";
    } else if (mas.checked) {
        return mas.value;
    } else if (fem.checked) {
        return fem.value
    }
}; 

const verificaCampos = () => {
    const nome = document.getElementById("textNome").value;
    const data = document.getElementById("data").value;
    const sexo = verificaRadios();

    if (nome == "" || data == "" || sexo == "") {
        alert("Preencha todos os campos corretamente");
        return false;
    } 
    return true;
}

const cadastraInFirestore = (idAuth) => {
    const dadosUsuarios = {
        nome: document.getElementById("textNome").value,
        data:document.getElementById("data").value,
        sexo: verificaRadios(),
        email: document.getElementById("txtEmail").value
    }
    setDoc(doc(bancoDados, "usuarios", idAuth), dadosUsuarios)
    .then (() => {
        location.href = "entrar.html";
    })
    .catch ((erro) => {
        alert ("Cloud Firestore informa:\n"+erro.code)
    })
}

/* Código abaixo é responsável por capturar as credencias do usuário e cadastra-los no firebase */
document.getElementById("envio").addEventListener("click", () => {    
    const email = document.getElementById("txtEmail").value
    const senha = document.getElementById("senha")
    const confirma = document.getElementById("senhaRepetida").value

    if (verificaCampos()) {
        if (senha.value == confirma) {
            createUserWithEmailAndPassword(autenticador, email, senha.value)
            .then((users) => {
                cadastraInFirestore(users.user.uid);
            })
            .catch((error) => {
                if (error.code == "auth/email-already-in-use") {
                    alert ("Email já está cadastrado")
                    location.href = "entrar.html"
                } else if (error.code == "auth/invalid-value-(password),-starting-an-object-on-a-scalar-field") {
                    alert("A senha é muito fraca!\nDigite pelo menos 6 dígitos"); senha.focus()
                } else {
                    alert("Firebase Authentication informa:\n"+error.code)
                }
            });
        } else {
            alert("As senhas devem ser iguais!!!"); senha.focus()
        }    
    }
})

