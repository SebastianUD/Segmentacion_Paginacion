let $d = document,
  randomColor = () => {
    col = Math.round(Math.random() * 16777216);
    return [
      "#" + ("000000" + col.toString(16)).slice(-6),
      "#" + ("000000" + (16777216 - col).toString(16)).slice(-6),
    ];
  };

$d.addEventListener("click", (e) => {
  if (e.target.matches(".panel-btn") || e.target.matches(`${".panel-btn"} *`)) {
    $d.querySelector(".panel").classList.toggle("is-active");
    $d.querySelector(".panel-btn").classList.toggle("is-active");
  }

  if (e.target.matches(".menu a")) {
    $d.querySelector(".panel").classList.remove("is-active");
    $d.querySelector(".panel-btn").classList.remove("is-active");
  }
});

segs = $d.querySelectorAll(".ram article");

class Program {
  constructor(nombre, t_codigo, t_data, t_bss, logo) {
    this.nombre = nombre;
    this.t_codigo = t_codigo;
    this.t_data = t_data;
    this.t_bss = t_bss;
    this.memoria = stack + heap;
    this.logo = logo;
    this.paginasMarco = [];
    this.numOffset = [];
    this.pid = "";
  }
  resize() {
    this.memoria += this.t_codigo + this.t_data + this.t_bss;
    this.numPaginas = Math.ceil(this.memoria / 65536);
    //console.log(this.memoria, this.nombre, this.numPaginas);
  }
}

const
  bios= 193898,
  kernel = 854678,
  stack = 65536,
  heap = 131072,
  SO = new Program(
    "S.O.",
    425984, 
    212992, 
    212992
  ),
  Notepad = new Program(
    "Notepad",
    18654,
    10352,
    164,
    "https://icon-library.com/images/notepad-icon-png/notepad-icon-png-16.jpg"
  ),
  Word = new Program(
    "Word",
    81465,
    13548,
    276,
    "https://icon-library.com/images/icon-word/icon-word-5.jpg"
  ),
  Excel = new Program(
    "Excel",
    91776,
    15000,
    300,
    "https://icon-library.com/images/excel-sheet-icon/excel-sheet-icon-8.jpg"
  ),
  AutoCAD = new Program(
    "AutoCAD",
    122883,
    137842,
    1055,
    "https://icon-library.com/images/autodesk-autocad.png"
  ),
  Calculadora = new Program(
    "Calculadora",
    20480,
    303,
    387,
    "https://icon-library.com/images/windows-calculator-icon/windows-calculator-icon-8.jpg"
  ),
  Chrome = new Program(
    "Chrome",
    384762,
    224288,
    1228,
    "https://icon-library.com/images/chrome-icon/chrome-icon-5.jpg"
  ),
  GTA5 = new Program(
    "Grand Theft Auto V",
    2359361,
    532470,
    8692,
    "https://icon-library.com/images/grand-theft-auto-v-icon/grand-theft-auto-v-icon-20.jpg"
  ),
  Oracle = new Program(
    "Oracle",
    576319,
    614403,
    2364,
    "https://icon-library.com/images/oracle-icon-png/oracle-icon-png-14.jpg"
  ),
  noProgram = new Program("", 0, 0, 0, "");

let programas = [
    SO,
    Notepad,
    Word,
    Excel,
    AutoCAD,
    Calculadora,
    Chrome,
    GTA5,
    Oracle,
  ],
  pEjecutados = 0,
  programasRAM = [];


  let renderProgramas = () => {
    SO.memoria = stack + heap;
    fig = `<div>
              <h2>PROGRAMAS</h2>
            </div>`;
    $d.querySelector(".icons").innerHTML = fig;
    for (let p of programas) {
        p.resize();
        if (p.nombre!=="S.O.") {
            fig = `<figure data-name="${p.nombre}">
            <img src="${p.logo}" alt="${p.nombre}" data-name="${p.nombre}">
            <figcaption data-name="${p.nombre}"><span data-name="${p.nombre}">${p.nombre}</span></figcaption>
            </figure>`;
            $d.querySelector(".icons").innerHTML += fig;
        }
    }
  }

renderProgramas();

$d.querySelectorAll(".icons figure").forEach((e) => {
  e.addEventListener("click", (fig) => {
    Array(...e.parentElement.children).forEach((f) => {
      f.classList.remove("figclick");
    });
    let $figure = fig.target;
    while (!$figure.matches("figure")) $figure = $figure.parentNode;
    $figure.classList.add("figclick");
  });
});

const datos = () => {
  $d.querySelectorAll(".article__DataSO").forEach((e,i) => {
    if (i===0) {
      e.children[0].textContent = `Kernel: ${kernel}`
    }else if (i === 1) {
      e.children[0].textContent = `BIOS: ${bios}`
    } else if (i === 2) {
      e.children[0].textContent = `Total: ${kernel+bios}`
    }
  });
}

datos();

const $ram = $d.querySelector(".ram");
const tamPaginas = 65536,
  tamRAM = 16777216,
  numPaginasRam = tamRAM / tamPaginas,
  divisionRAM = () => {
    // console.log($ram);
    // console.log(numPaginasRam);
    for (let i = 0; i < numPaginasRam; i++) {
      let $pagina = `<article class="article__pEjecucion" data-number="${i}"></article>`;
      $ram.insertAdjacentHTML("beforeend", $pagina);
    }
  },
  direccionesRAMBase = () => {
    $dirRAMBase = $d.querySelector(".dirRamBase");
    for (let i = 0; i < numPaginasRam; i++) {
      let $dir = `<p>${(i * tamPaginas).toString(16)}</p>`;
      $dirRAMBase.insertAdjacentHTML("beforeend", $dir);
    }
  };

divisionRAM();
direccionesRAMBase();

const ejecucionSO = () => {
  let color = randomColor();
  SO.pid = 0;
  // console.log(SO.numPaginas);
  programasRAM.push(SO);
  for (let i = 0; i < SO.numPaginas; i++) {
    SO.paginasMarco.push($ram.children[i].getAttribute("data-number"));
    SO.numOffset.push($dirRAMBase.children[i].textContent);
    if ($ram.children[i].localName === "article") {
      $ram.children[i].setAttribute(
        "style",
        `background: ${color[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${color[0]}, 0 0 2em black;`
      );
      $dirRAMBase.children[i].setAttribute(
        "style",
        `background: ${color[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${color[0]}, 0 0 2em black;`
      );
      $ram.children[i].textContent = `SO ${i + 1}`;
    }
  }
};

ejecucionSO();



let arrPosLibres = [];
let numPSO = SO.numPaginas;
let paginasLibres = numPaginasRam - numPSO;
const espacioLibre = () => {
  $ram.childNodes.forEach((eR, pos) => {
    if (eR.textContent === "") {
      //paginasLibres++;
      arrPosLibres.push(pos);
      //console.log(pos);
    }
  });
};
// espacioLibre();
// console.log(arrPosLibres);
let pid = 1;
let tabla = "";

const tablaMarcos = () => {
  let $ramEspacios = $d.querySelectorAll(".article__pEjecucion"),
  $ramDirBases = $d.querySelector(".dirRamBase");
  // console.log($ramEspacios);
    $d.querySelector(".contTablaMarcos").innerHTML = "";
    $d.querySelector(".contTablaMarcos").insertAdjacentHTML("beforeend", "<article><span>MARCO</span></article><article><span>DIR. BASE</span></article>")
  $ramEspacios.forEach(element => {
    if (element.innerText === "") {
      console.log(element.getAttribute("data-number"), element.innerText);
      $d.querySelector(".contTablaMarcos").insertAdjacentHTML("beforeend", `<article><span>${element.getAttribute("data-number")} : ${parseInt(element.getAttribute("data-number")).toString(16)}</span></article><article><span>${$ramDirBases.children[element.getAttribute("data-number")].textContent}</span></article>`)
    }
  });
}

const ejecucionPrograma = () => {
  // console.log(programasRAM);
  $d.addEventListener("dblclick", (e) => {
    arrPosLibres = [];
    espacioLibre();
    let color = randomColor();
    (aux = 0),
      programas.forEach((p) => {
        if (e.target.getAttribute("data-name") === p.nombre) {
          let auxPrograma = new Program(p.nombre, p.t_codigo, p.t_data, p.t_bss, p.logo);
          auxPrograma.resize();
          //console.log(auxPrograma.numPaginas, paginasLibres);
          if (auxPrograma.numPaginas < paginasLibres) {
            auxPrograma.pid = pid++;
            paginasLibres -= auxPrograma.numPaginas;
            programasRAM.push(auxPrograma);
            // console.log(programasRAM);
            calculos();
            //console.log(programasRAM);
            for (const pos of arrPosLibres) {
              $ram.children[pos].setAttribute(
                "style",
                `background: ${color[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${color[0]}, 0 0 2em black;`
              );
              $dirRAMBase.children[pos].setAttribute(
                "style",
                `background: ${color[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${color[0]}, 0 0 2em black;`
                );
                // arrPosLibres.shift();
                auxPrograma.paginasMarco.push(pos);
                auxPrograma.numOffset.push($dirRAMBase.children[pos].textContent);
                $ram.children[pos].textContent = `${auxPrograma.nombre} ${aux + 1}`;
                aux++;
                //console.log(aux, p.numPaginas);
                arrPosLibres = [];
                espacioLibre();
                //console.log(arrPosLibres);
                if (aux === auxPrograma.numPaginas) {
                  break;
              }
            }
            //programasRAM.push(p);
            //num marco
            let numP = 0;
            for (const e of auxPrograma.paginasMarco) {
              numP++;
              tabla += `PAgina: ${numP} Num Marco: ${e} OffSet: ${
                auxPrograma.numOffset[numP - 1]
              } \n`;
            }
            tablaMarcos();
            // console.log(tabla);
            // console.log(programasRAM);
          } else {
            alert("No se puede ejecutar mas");
          }
        }
      });
  });
};

ejecucionPrograma();

const detTablaProceso = () => {
  $d.querySelector(".tablaPaginas").insertAdjacentHTML("beforeend","<article><span>PID</span></article><article><span>Nombre</span></article><article><span>Num. Pagina</span></article><article><span>Num. Marco</span></article><article><span>OffSet</span></article>")
  $d.addEventListener("click", e=>{
    $d.querySelector(".tablaPaginas").innerHTML = "<div><h2>Tabla de paginas</h2></div>";
    $d.querySelector(".tablaPaginas").insertAdjacentHTML("beforeend","<article><span>PID</span></article><article><span>Nombre</span></article><article><span>Num. Pagina</span></article><article><span>Num. Marco</span></article><article><span>OffSet</span></article>")
    if (e.target.matches(".article__pEjecucion")) {
      let pos = e.target.getAttribute("data-number");
      //console.log($dirRAMBase.children[pos].textContent);
      for (const pEjecutado of programasRAM) {
        // console.log(pEjecutado.numOffset);
        // console.log(pEjecutado.paginasMarco);
        for (const ofs of pEjecutado.numOffset) {
          // console.log(ofs);
          if (ofs === $dirRAMBase.children[pos].textContent) {
            // console.log(pEjecutado);
            for (let i = 0; i < pEjecutado.numOffset.length; i++) {
              $d.querySelector(".tablaPaginas").insertAdjacentHTML("beforeend",`<article><span>${pEjecutado.pid}</span></article>
              <article><span>${pEjecutado.nombre}</span></article>
              <article><span>${i} : ${i.toString(16)}</span></article>
              <article><span>${pEjecutado.paginasMarco[i]} : ${parseInt(pEjecutado.paginasMarco[i]).toString(16)}</span></article>
              <article><span>${pEjecutado.numOffset[i]}</span></article>`);
            }
            $d.querySelectorAll(".article__programa").forEach((e, i) => {
              if (i===0) {
                e.children[0].textContent = `PROCESO: ${pEjecutado.pid}`
              }else if (i===1) {
                e.children[0].textContent = `DIRECCÓN: ${pEjecutado.numOffset[0]}`
              }else if (i===2){
                e.children[0].textContent = `MEMORIA: ${pEjecutado.memoria}`
              }
            });
          }
        }
      }
    }
    //console.log(programasRAM);
  })
}

detTablaProceso();

const cerrarPrograma = () => {
  $d.addEventListener("dblclick", (e) => {
    if (e.target.matches(`.article__pEjecucion`)) {
      //console.log(e.target.textContent);
      if (/SO/g.test(e.target.textContent)) {
        alert("No se puede cerrar el sistema operativo");
      } else {
        $d.querySelectorAll(".article__programa").forEach((e, i) => {
          if (i===0) {
            e.children[0].textContent = `PROCESO: `
          }else if (i===1) {
            e.children[0].textContent = `DIRECCÓN: `
          }else if (i===2){
            e.children[0].textContent = `MEMORIA: `
          }
        });
        let elementoClickeado = Number(e.target.getAttribute("data-number"));
        let dBE = $dirRAMBase.children[elementoClickeado].textContent;
        let contador = 0;
        for (const proEjecutado of programasRAM) {
          contador++;
          if (proEjecutado.paginasMarco.includes(elementoClickeado)) {
            // console.log(elementoClickeado, pro);
            paginasLibres += proEjecutado.numPaginas;
            for (const pos of proEjecutado.paginasMarco) {
              $ram.children[pos].textContent = "";
              $ram.children[pos].setAttribute(
                "style",
                `background: #ddd;text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em #ddd, 0 0 2em black;`
              );
              $dirRAMBase.children[pos].setAttribute(
                "style",
                `background: #ddd;text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em #ddd, 0 0 2em black;`
              );
            }
            break;
          }
        }
        pid--;
        $d.querySelector(".tablaPaginas").innerHTML = "<div><h2>Tabla de paginas</h2></div>";
        $d.querySelector(".tablaPaginas").insertAdjacentHTML("beforeend","<article><span>PID</span></article><article><span>Nombre</span></article><article><span>Num. Pagina</span></article><article><span>Num. Marco</span></article><article><span>OffSet</span></article>")
        // console.log(programasRAM);
        programasRAM.splice(contador-1, 1);
        // console.log(programasRAM);
        calculos();
        tablaMarcos();
        // console.log(contador, programasRAM);
      }
    }
  });
};

cerrarPrograma();

const nuevoP = () => {
  $d.getElementById("nuevo").addEventListener("submit", (e) => {
    let $n = e.target;
    e.preventDefault();
    const programaNuevo = new Program($n.nombre.value, parseInt($n.codigo.value), parseInt($n.datos.value), parseInt($n.bss.value));
    programas.push(programaNuevo);
    $n.reset();
    renderProgramas();
    console.log(programasRAM);
  });
}

nuevoP();

const calculos = () => {
  let tamPag = 16*1024*1024/256,
  usada = 0,
  libre = 16*1024*1024,
  pUsadas = 0;
  for (const e of programasRAM) {
    pUsadas +=e.numPaginas
  }
  usada = pUsadas*tamPag;
  libre -= usada;
  // console.log(pUsadas, programasRAM);
  $d.querySelector(".usada").children[0].textContent = `USADA: ${usada}`;
  $d.querySelector(".libre").children[0].textContent = `LIBRE: ${libre}`;
}

calculos();

tablaMarcos();