import { bancoDados, fotos } from "./firebase/config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

var id = new URL (location.href).searchParams.get('id')
if (id == null) {
    location.href = "entrar.html"
}
var colecao = collection(bancoDados, `usuarios/${id}/vacinas`)
let file

const doses =
[
    document.getElementById("d1"),
    document.getElementById("d2"),
    document.getElementById("d3"),
    document.getElementById("dReforco"),
    document.getElementById("dUnica")
]

const verificarDose = () => {
    for (let i=0;i < doses.length;i++) {
        if (doses[i].checked) {
            return doses[i].value
        }
    }
    return "";
}

document.getElementById("botaoSegundo").addEventListener("click", () => {
    let url = new URL (location.protocol+"//"+location.host+"/home.html");
    url.searchParams.set("id", id)
    location.href = url;
})

const verificaCampos = () => {
    const Nome = document.getElementById("txtNomeVac").value
    const Data = document.getElementById("txtDataVac").value
    const DataProx = document.getElementById ("txtDataProx").value
    const inpFile = document.getElementById ("imgComp").value
    if (Nome == "" || Data == "" || inpFile == "" || DataProx == "" || verificarDose() == "") {
        alert("Preencha todos os campos corretamente");
        return false;
    } 
    return true;
}

document.getElementById("enviar").addEventListener ("click", () => {
    if (verificaCampos()) {
        const dadosVacinas = {
            Nome: document.getElementById("txtNomeVac").value,
            Data: document.getElementById("txtDataVac").value,
            Dose: verificarDose(),
            DataProx: document.getElementById("txtDataProx").value
        }
        const imageRef = ref(fotos, "images/"+dadosVacinas.Nome+dadosVacinas.Dose+".jpg")
        
        uploadBytes(imageRef, file)
        .then((file) => {
            getDownloadURL(imageRef)
                .then((url) => {
                    dadosVacinas.Comprovante = url;
                    addDoc(colecao, dadosVacinas)
                    .then (() => {
                        let caminho = new URL (location.protocol+"//"+location.host+"/home.html");
                        caminho.searchParams.set("id", id)
                        location.href = caminho;
                    })
                    .catch ((error) => {
                        alert (error.code)
                    })
                })
                .catch ((erro) => {
                    alert (erro.code)
                })
        })
        .catch((error) => {
            alert("Erro ao enviar arquivo: " + error)
        })
    }
})

document.getElementById("imgFundo").addEventListener('click', () => {
    const iconImage = document.getElementById("imgFundo");
    const inpFile = document.getElementById("imgComp");

    inpFile.click()
    
    inpFile.addEventListener("change",  () => {
        file = event.target.files[0];
        if (inpFile.files.length != 0) {        
            let reader = new FileReader();

            reader.onload = () => {
                iconImage.src = reader.result;
            }

            reader.readAsDataURL(inpFile.files[0]);
        } else {
            iconImage.src = "logoImagem.png"
        }
    })
})

document.getElementById("botaoSegundo").addEventListener("click", () => {
    let url = new URL (location.protocol+"//"+location.host+"/home.html");
    url.searchParams.set("id", new URL (location.href).searchParams.get('id'))
    location.href = url;
})