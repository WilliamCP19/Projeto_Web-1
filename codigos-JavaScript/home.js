import { bancoDados } from "./firebase/config.js";
import { collection, getDocs, updateDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const id = new URL (location.href).searchParams.get("id");
if (id == null) {
  location.href = "entrar.html"
}
let colecao = collection (bancoDados, `usuarios/${id}/vacinas`)
const listaVacinas = [];
getDocs(query(colecao))
.then ((snaps) => {
  snaps.forEach((vacina) => {
    listaVacinas.push(vacina.data())
    listarVacinas(listaVacinas[listaVacinas.length-1])
  })
})

let listarVacinas = (vacina) => {
  let mainGrid = document.getElementById("vacinas-grid");
  mainGrid.style.display = "grid;";
  mainGrid.style.gridTemplateColumns = "auto auto auto"
  mainGrid.style.gap = "10px;"

  const secoesVacinas = document.createElement ("section")
  secoesVacinas.setAttribute("class", "bVacinas")

  let nome = document.createElement("h1");
  let data = document.createElement("h1")
  let dose = document.createElement("h1") 
  let comprovante = document.createElement("img")
  let proxData = document.createElement("h1")

  nome.innerHTML = vacina.Nome;
  data.innerHTML = formataData(vacina.Data);
  dose.innerHTML = vacina.Dose;
  proxData.innerHTML = formataData(vacina.DataProx)

  comprovante.setAttribute ("src", vacina.Comprovante);
  comprovante.setAttribute("height", "146px");
  comprovante.setAttribute("width", "299px");

  secoesVacinas.appendChild(nome)
  secoesVacinas.appendChild(data)
  secoesVacinas.appendChild(dose) 
  secoesVacinas.appendChild(comprovante)
  secoesVacinas.appendChild(proxData) 

  mainGrid.appendChild(secoesVacinas)
}

function formataData (date) {
  const dateFormat = new Date (date)
  let dia = dateFormat.getDate() + 1; 
  let mes = dateFormat.getMonth() + 1; 
  let ano = dateFormat.getFullYear();
  if (dia < 10) {
    dia = "0"+dia.toString();
  } 
  if (mes < 10) {
    mes = "0"+mes.toString();
  } 
  return dia+"/"+mes+"/"+ano;
}

document.getElementById("cadVacina").addEventListener ("click", () => {
  let url = new URL (location.protocol+"//"+location.host+"/novaVacina.html");
  url.searchParams.set("id", id)
  location.href = url;
}) 

document.getElementById("vacinas-grid").addEventListener ("click", (event) => {
  let vacinaEscolhida = event.target;
  if (vacinaEscolhida.tagName != "SECTION") {
    vacinaEscolhida = vacinaEscolhida.parentElement;
  } 
  if (vacinaEscolhida.tagName == "SECTION") {
    const nomeVac = vacinaEscolhida.children[0].innerHTML
    const nDoseVac = vacinaEscolhida.children[2].innerHTML 
    getDocs(query (colecao, where("Nome", "==", nomeVac)))
    .then ((snaps) => {
      snaps.forEach ((vacina) => {
        if(vacina.data().Dose == nDoseVac) {
          let url = new URL (location.protocol+"//"+location.host+"/editarVacina.html");
          url.searchParams.set("id", id)
          url.searchParams.set("idVac", vacina.id);
          location.href = url;
        }
      })
    }) 
    .catch ((erro) => {
      alert (erro.code)
    }) 
  }
})

document.getElementById("buscador").addEventListener("input", (event) => {
  document.getElementById ("vacinas-grid").innerHTML = "";
  const letra = event.target.value.toLowerCase();
  listaVacinas.forEach ((vacina) => {
    const palavra = vacina.Nome.toLowerCase();
    if (palavra.includes(letra)) {
      listarVacinas(vacina)
    }
  })
})