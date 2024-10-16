let $d = document,
  randomColor = () => {
    col = Math.round(Math.random() * 16777216);
    return [
      "#" + ("000000" + col.toString(16)).slice(-6),
      "#" + ("000000" + (16777216 - col).toString(16)).slice(-6),
    ];
  },
  caso = 1;

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

class Program {
  constructor(pid, nombre, t_stack, t_heap, t_codigo, t_data, t_bss) {
    this.pid = pid;
    this.nombre = nombre;
    this.segmentos = {
      t_stack: t_stack,
      t_heap: t_heap,
      t_codigo: t_codigo,
      t_data: t_data,
      t_bss: t_bss,
    };
    this.memoria = stack + heap;
    this.color = null;
  }
  resize() {
    this.memoria +=
      this.segmentos.t_codigo[0] +
      this.segmentos.t_data[0] +
      this.segmentos.t_bss[0];
    this.color = randomColor();
  }
}

const
  stack = 65536,
  heap = 131072,
  programas = {
    SO: [
      "S.O.", 
      425984, 
      212992, 
      212992],
    Notepad: [
      "Notepad",
      18654,
      8352,
      166,
      "https://icon-library.com/images/notepad-icon-png/notepad-icon-png-16.jpg",
    ],
    Word: [
      "Word",
      120465,
      25548,
      276,
      "https://icon-library.com/images/icon-word/icon-word-5.jpg",
    ],
    Excel: [
      "Excel",
      167776,
      36426,
      371,
      "https://icon-library.com/images/excel-sheet-icon/excel-sheet-icon-8.jpg",
    ],
    AutoCAD: [
      "AutoCAD",
      369883,
      457842,
      1685,
      "https://icon-library.com/images/autodesk-autocad.png",
    ],
    Calculadora: [
      "Calculadora",
      18280,
      303,
      387,
      "https://icon-library.com/images/windows-calculator-icon/windows-calculator-icon-8.jpg",
    ],
    Chrome: [
      "Chrome",
      384762,
      224288,
      1228,
      "https://icon-library.com/images/chrome-icon/chrome-icon-5.jpg",
    ],
    "Grand Theft Auto V": [
      "Grand Theft Auto V",
      2859361,
      732470,
      9892,
      "https://icon-library.com/images/grand-theft-auto-v-icon/grand-theft-auto-v-icon-20.jpg",
    ],
    Oracle: [
      "Oracle",
      776319,
      814403,
      2764,
      "https://icon-library.com/images/oracle-icon-png/oracle-icon-png-14.jpg",
    ],
  },
  exe = [],
  segs = [],
  lanzarSO = (p) => {
    let programa = new Program(
      0,
      p[0],
      [stack, 0, "BIOS"],
      [heap, stack, "BIOS"],
      [p[1], heap + stack, "Kernel"],
      [p[2], p[1] + heap + stack, "Kernel"],
      [p[3], p[1] + p[2] + heap + stack, "Kernel"]
    );
    programa.resize();
    exe.push(programa);
    for (const seg in programa.segmentos) {
      segs.push([0, ...programa.segmentos[seg]]);
    }
    segs.push([null, 16777216 - programa.memoria, programa.memoria, ""]);
    console.log(segs);
  },
  lanzar = (p) => {
    let pid = 0,
      b = true;
    exe.forEach((e) => {
      if (e.pid >= pid) pid = e.pid + 1;
    });

    let programa = new Program(
      pid,
      p[0],
      [stack, null, "stack"],
      [heap, null, "heap"],
      [p[1], null, "code"],
      [p[2], null, "data"],
      [p[3], null, "bss"]
    );
    programa.resize();
    console.log(programa);
    for (const seg in programa.segmentos) {
      let i = null,
        segmento = programa.segmentos[seg],
        disp = segs.find((s) => s[0] == null)[1];
      switch (caso) {
        case 0: //primer caso
          for (let x = 0; x < segs.length; x++) {
            if (segs[x][0] == null && segs[x][1] >= segmento[0]) {
              i = x;
              break;
            }
          }
          break;
        case 1: //mejor caso
          segs.forEach((s) => {
            if (s[0] == null && s[1] > disp) {
              disp = s[1];
            }
          });
          segs.forEach((s, ind) => {
            if (s[0] == null && s[1] >= segmento[0] && s[1] <= disp) {
              disp = s[1];
              i = ind;
            }
          });
          break;
        case 2: //peor caso
          segs.forEach((s) => {
            if (s[0] == null && s[1] < disp) {
              disp = s[1];
            }
          });
          segs.forEach((s, ind) => {
            if (s[0] == null && s[1] >= segmento[0] && s[1] >= disp) {
              disp = s[1];
              i = ind;
            }
          });
          break;
      }
      if (i && b) {
        segmento[1] = segs[i][2];
        segs[i][2] += segmento[0];
        segs[i][1] -= segmento[0];
        segs[i][1] === 0
          ? segs.splice(i, 1, [pid, ...segmento])
          : segs.splice(i, 0, [pid, ...segmento]);
      } else {
        i = programa.pid;
        console.log("No hay memoria suficiente");
        while (segs.findIndex((e) => e[0] == i) !== -1) {
          segs[segs.findIndex((e) => e[0] == i)][3] = "";
          console.log(segs[segs.findIndex((e) => e[0] == i)]);
          segs[segs.findIndex((e) => e[0] == i)][0] = null;
        }
        for (let x = 1; x < segs.length; x++) {
          if (segs[x - 1][0] == null && segs[x][0] == null) {
            segs[x - 1][1] += segs[x][1];
            segs.splice(x, 1);
            x--;
          }
        }
        b = false;
      }
    }
    if (b) {
      exe.push(programa);
    }
    console.log('Programas: ', exe);
    console.log('Segmentos: ', segs);
    return b;
  };

let drawProc = () => {
    let proc = $d.querySelector(".proc");
    proc.innerHTML = `<article><span>PID</span></article>
      <article><span>Programa</span></article>
      <article><span>Segmento</span></article>
      <article><span>Tamaño</span></article>
      <article><span>Direccion</span></article>`;
    exe.forEach((e) => {
      let $articles = ``;
      for (const seg in e.segmentos) {
        $articles += `<article><span>${e.pid}</span></article>
        <article><span>${e.nombre}</span></article>
        <article><span>${e.segmentos[seg][2]}</span></article>
        <article><span>${e.segmentos[seg][0]}</span></article>
        <article><span>${(
          "000000" + e.segmentos[seg][1].toString(16).toUpperCase()
        ).slice(-6)}</span></article>`;
      }
      proc.innerHTML += $articles;
    });
  },
  drawSegs = () => {
    let seg = $d.querySelector(".segs");
    seg.innerHTML = `<article><span>Tamaño</span></article>
      <article><span>Direccion</span></article>`;
    segs.forEach((s) => {
      if (s[0] == null) {
        seg.innerHTML += `<article><span>${s[1]}</span></article>
        <article><span>${("000000" + s[2].toString(16).toUpperCase()).slice(
          -6
        )}</span></article>`;
      }
    });
  },
  drawRam = () => {
    $ram = $d.querySelector(".ram");
    $ram.innerHTML = "";
    segs.forEach((e) => {
      let $article = $d.createElement("article"),
        $span = $d.createElement("span"),
        prog = null,
        col = ["", ""];
      exe.forEach((p) => (e[0] === p.pid && !prog ? (prog = p) : null));
      $article.dataset.Proceso = e[0];
      $article.dataset.Direccion = e[2];
      $article.dataset.Memoria = e[1];
      $article.appendChild($span);
      if (!prog) {
        col[0] = col[1] = "#ddd";
        $span.textContent = "";
      } else {
        $span.textContent = prog.nombre + " - " + e[3];
        col[0] = prog.color[0];
        col[1] = prog.color[1];
      }
      $article.setAttribute(
        "style",
        `background: ${col[0]};text-shadow: -1.5px 2.5px 2px black, 1.5px -1.5px 0.08em ${col[1]}, 0 0 2em black;flex-grow: ${e[1]}`
      );
      $ram.appendChild($article);
    });
  },
  events = () => {
    $d.querySelectorAll(".icons figure").forEach((e) => {
      e.addEventListener("click", (fig) => {
        Array(...e.parentElement.children).forEach((f) => {
          f.classList.remove("figclick");
        });
        let $figure = fig.target;
        while (!$figure.matches("figure")) $figure = $figure.parentNode;
        $figure.classList.add("figclick");
        let programa = programas[$figure.children[1].children[0].textContent];
        console.log({
          Nombre: programa[0],
          "Tamaño codigo": programa[1],
          "Datos inicializados": programa[2],
          "Datos sin inicializar": programa[3],
          Memoria: stack + heap + programa[1] + programa[2] + programa[3],
        });
      });
      e.addEventListener("dblclick", (fig) => {
        let $figure = fig.target;
        while (!$figure.matches("figure")) $figure = $figure.parentNode;
        let programa = programas[$figure.children[1].children[0].textContent],
          disp = lanzar(programa);
        if (disp) {
          drawProc();
          drawSegs();
          drawRam();
          drawMem();
        } else {
          console.log(programa);
          alert("No hay memoria suficiente");
        }
      });
    });

    let $ram = $d.querySelector(".ram");
    $ram.addEventListener("click", (e) => {
      let $article = e.target;
      while (!$article.matches("article")) $article = $article.parentNode;
      drawStats($article);
    });
    $ram.addEventListener("dblclick", (e) => {
      let $article = e.target;
      while (!$article.matches("article")) $article = $article.parentNode;
      let i = $article.dataset.Proceso;
      if (i != "null" && i != 0) {
        exe.splice(
          exe.findIndex((e) => e.pid == i),
          1
        );
        while (segs.findIndex((e) => e[0] == i) !== -1) {
          segs[segs.findIndex((e) => e[0] == i)][3] = "";
          segs[segs.findIndex((e) => e[0] == i)][0] = null;
        }
        for (let x = 1; x < segs.length; x++) {
          if (segs[x - 1][0] == null && segs[x][0] == null) {
            segs[x - 1][1] += segs[x][1];
            segs.splice(x, 1);
            x--;
          }
        }
        drawProc();
        drawSegs();
        drawRam();
        drawMem();
      }
    });
  },
  drawSO = () => {
    let $so = $d.querySelector(".so");
    $so.innerHTML += `<span>BIOS: 193898</span>
      <span>Kernel: 854678</span>
      <span>Total: 1048576</span>`;
  },
  drawStats = ($sel) => {
    let $prog = $d.querySelector(".prog");
    $prog.innerHTML = "<span><b>Detalles de programa</b></span>";
    for (const key in $sel.dataset) {
      $prog.innerHTML += `<span>${key}: ${
        key == "Direccion"
          ? (
              "000000" + parseInt($sel.dataset[key]).toString(16).toUpperCase()
            ).slice(-6)
          : $sel.dataset[key]
      }</span>`;
    }
  },
  drawMem = () => {
    let $mem = $d.querySelector(".mem"),
      usada = 0;
    exe.forEach((e) => {
      if (e.nombre) usada += e.memoria;
    });
    let prc = Math.round((usada / 16777216) * 100),
      red = 0;
    green = 0;
    if (prc > 50) {
      red = 255;
      green = 255 - (prc - 50) * 5.1;
    }
    if (prc < 50) {
      green = 255;
      red = prc * 5.1;
    }
    if (prc == 50) green = red = 255;

    $mem.innerHTML = `<span><b>Memoria</b></span>
      <span>Ocupada: ${usada}</span>
      <span>Libre: ${16777216 - usada}</span>
      <div class="prc">
        <div><div style="width: ${prc}%;background-color: rgb(${red},${green},0);"></div></div>
        <span>${prc}%</span>
      </div>`;
  },
  drawIcons = () => {
    let $icons = $d.querySelector(".icons");
    $icons.innerHTML = "";
    for (let p in programas) {
      if (programas[p][0] !== "S.O.") {
        fig = `<figure>
    <img src="${programas[p][4]}" alt=" ">
    <figcaption><span>${programas[p][0]}</span></figcaption>
  </figure>`;
        $icons.innerHTML += fig;
      }
    }
  },
  inicio = () => {
    lanzarSO(programas.SO);
    drawIcons();
    drawProc();
    drawSegs();
    drawRam();
    drawSO();
    drawStats($d.querySelector(".ram article"));
    drawMem();
    events();
    $d.querySelector(".main").classList.remove("none");
    $d.querySelector(".proc").classList.remove("none");
    $d.querySelector(".segs").classList.remove("none");
    $d.querySelectorAll(".title").forEach((e) => e.classList.remove("none"));
  };

$d.getElementById("inicio").addEventListener("submit", (e) => {
  e.preventDefault();
  caso = parseInt(e.target.caso.value) | 0;
  console.log(caso);
  e.target.style.display = "none";
  inicio();
});

$d.getElementById("nuevo").addEventListener("submit", (e) => {
  let $n = e.target;
  e.preventDefault();
  programas[$n.nombre.value] = [
    $n.nombre.value,
    parseInt($n.codigo.value),
    parseInt($n.datos.value),
    parseInt($n.bss.value),
  ];
  $n.reset();
  drawIcons();
  events();
});
