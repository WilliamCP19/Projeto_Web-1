import { bancoDados, fotos } from "./firebase/config.js";
import { doc, getDoc, updateDoc, deleteDoc, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { uploadBytes, getDownloadURL, ref } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js";

const id = new URL (location.href).searchParams.get('id')
const idVac = new URL (location.href).searchParams.get("idVac")
if (id == null) {
    location.href = "entrar.html"
}
let file;
const pop = document.getElementById ("popup");
const docVac = doc (bancoDados, `usuarios/${id}/vacinas`, idVac)

var nome = document.getElementById("txtNomeVac");
var data = document.getElementById("txtDataVac");
var dataProx = document.getElementById ("txtDataProx")

const doses = 
[
    document.getElementById("d1"), 
    document.getElementById("d2"),
    document.getElementById("d3"),
    document.getElementById("dReforco"),
    document.getElementById("dUnica")
]

getDoc (docVac)
.then ((snap) => {
    nome.value = snap.data().Nome
    data.value = snap.data().Data;
    document.getElementById("imgFundo").src = snap.data().Comprovante
    dataProx.value = snap.data().DataProx;
    for (let i=0;i < doses.length;i++) {
        if (doses[i].value == snap.data().Dose) {
            doses[i].checked = true; break;
        }
    }
})

document.getElementById("botaoSegundo").addEventListener("click", () => {
    let url = new URL (location.protocol+"//"+location.host+"/home.html");
    url.searchParams.set("id", new URL (location.href).searchParams.get('id'))
    location.href = url;
})

const verificarDose = () => {
    for (let i=0;i < doses.length;i++) {
        if (doses[i].checked) {
            return doses[i].value;
        }
    }
    return "";
}
const verificaCampos = () => {
    if (nome.value == "" || data.value == "" || dataProx.value == "" || verificarDose() == "") {
        alert("Preencha todos os campos corretamente");
        return false;
    } 
    return true;
}

document.getElementById("enviar").addEventListener("click", () => {

    if (verificaCampos()) {
        const dadosVacinas = {
            Nome: document.getElementById("txtNomeVac").value,
            Data: document.getElementById("txtDataVac").value,
            Dose: verificarDose(),
            DataProx: document.getElementById("txtDataProx").value
        }
        const image = ref (fotos, "images/"+dadosVacinas.Nome+dadosVacinas.Dose+".jpg")
        if (file == null) {
            dadosVacinas.Comprovante = document.getElementById("imgFundo").src;
            updateDoc(docVac, dadosVacinas)
            .then (() => {
                alert ("Alteração realiza com sucesso!!!")
                let url = new URL (location.protocol+"//"+location.host+"/home.html");
                url.searchParams.set("id", id)
                location.href = url;
            })
            .catch ((error) => {
                alert (error.code)
            })
        } else {
            uploadBytes(image, file)
            .then (() => {
                getDownloadURL(image)
                .then ((url) => {
                    dadosVacinas.Comprovante = url
                    updateDoc(docVac, dadosVacinas)
                    .then (() => {
                        alert ("Alteração realiza com sucesso!!!")
                        let url = new URL (location.protocol+"//"+location.host+"/home.html");
                        url.searchParams.set("id", id)
                        location.href = url;
                    })
                    .catch ((error) => {
                        alert (error.code)
                    })
                })
                .catch ((error) => {
                    alert (error.code)
                })
            })
            .catch ((error) => {
                alert (error.code)
            })
        }
    }  
})

document.getElementById("imgFundo").addEventListener('click', () => {
    const iconImage = document.getElementById("imgFundo");
    const comprovante = document.getElementById("imgComp")
    
    comprovante.click()

    comprovante.addEventListener("change",  () => {
        file = event.target.files[0];
        if (comprovante.files.length != 0) {        
            let reader = new FileReader();

            reader.onload = () => {
                iconImage.src = reader.result;
            }

            reader.readAsDataURL(comprovante.files[0]);
        } else {
            iconImage.src = "logoImagem.png"
        }
    })
})

document.getElementById("excluir").addEventListener ("click", () => {
    pop.showModal()
})

document.getElementById("confirmarExc").addEventListener ("click", () => {
    deleteDoc (docVac)
    .then (() => {
        pop.close();
        let url = new URL (location.protocol+"//"+location.host+"/home.html");
        url.searchParams.set("id", id)
        location.href = url;
    })
    .catch ((error) => {
        alert (error.code)
    })
})

document.getElementById("cancelExc").addEventListener("click", () => {
    pop.close();
})