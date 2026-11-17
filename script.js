const products = [
  // Refrigerantes: do maior para o menor volume
  { name: "Coca-Cola", size: "2L", category: "Refrigerantes" },
  { name: "Coca-Cola Zero", size: "2L", category: "Refrigerantes" },
  { name: "Fanta Laranja", size: "2L", category: "Refrigerantes" },
  { name: "Fanta Uva", size: "2L", category: "Refrigerantes" },
  { name: "Guaraná Antarctica", size: "2L", category: "Refrigerantes" },
  { name: "Guaraná Antarctica Zero", size: "2L", category: "Refrigerantes" },
  { name: "Sprite", size: "2L", category: "Refrigerantes" },
  { name: "Sukita Uva", size: "2L", category: "Refrigerantes" },
  { name: "Sukita Laranja", size: "2L", category: "Refrigerantes" },
  { name: "Pepsi", size: "2L", category: "Refrigerantes" },
  { name: "Coca-Cola", size: "1L", category: "Refrigerantes" },
  { name: "Guaraná Antarctica", size: "1L", category: "Refrigerantes" },
  { name: "Pepsi", size: "1L", category: "Refrigerantes" },
  { name: "Mate Cola", size: "1,5L", category: "Refrigerantes" },
  { name: "Mate Cola Zero", size: "1,5L", category: "Refrigerantes" },
  { name: "Coca-Cola", size: "600ML", category: "Refrigerantes" },
  { name: "Coca-Cola Zero", size: "600ML", category: "Refrigerantes" },
  { name: "Fanta Laranja", size: "600ML", category: "Refrigerantes" },
  { name: "Fanta Uva", size: "600ML", category: "Refrigerantes" },
  { name: "Mate Cola", size: "600ML", category: "Refrigerantes" },
  { name: "Coca-Cola", size: "350ML", category: "Refrigerantes" },
  { name: "Coca-Cola Zero", size: "350ML", category: "Refrigerantes" },
  { name: "Fanta Laranja", size: "350ML", category: "Refrigerantes" },
  { name: "Fanta Uva", size: "350ML", category: "Refrigerantes" },
  { name: "Guaraná Antarctica", size: "350ML", category: "Refrigerantes" },
  { name: "Guaraná Antarctica Zero", size: "350ML", category: "Refrigerantes" },
  // Águas e bebidas
  { name: "Água", size: "500ML", category: "Águas e outras bebidas" },
  { name: "Água com Gás", size: "500ML", category: "Águas e outras bebidas" },
  { name: "H2OH!", size: "500ML", category: "Águas e outras bebidas" },
  // Cervejas
  { name: "Brahma", size: "Latão", category: "Cervejas" },
  { name: "Spaten", size: "Latão", category: "Cervejas" },
  { name: "Heineken", size: "Long Neck", category: "Cervejas" },
  { name: "Skol", size: "Latão", category: "Cervejas" },
  { name: "Antarctica", size: "Latão", category: "Cervejas" }
];

const sizeOrder = ["2L", "1,5L", "1L", "600ML", "500ML", "350ML", "Latão", "Long Neck"];
const categoryOrder = ["Refrigerantes", "Águas e outras bebidas", "Cervejas"];
const STORAGE_KEY = "controlePedidosEstoque_v1";
let savedState = {};
try { savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) { savedState = {}; }
const state = {};
const sections = document.getElementById("productSections");
const searchInput = document.getElementById("searchInput");

products.forEach((product, index) => {
  const saved = savedState[index] || {};
  state[index] = { order: saved.order ?? "" };
});

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
}

function render() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  sections.innerHTML = "";

  categoryOrder.forEach(category => {
    const filtered = products
      .map((p, index) => ({ ...p, index }))
      .filter(p => p.category === category && `${p.name} ${p.size}`.toLocaleLowerCase("pt-BR").includes(query))
      .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));

    if (!filtered.length) return;

    const section = document.createElement("section");
    section.className = "product-section";
    const heading = document.createElement("div");
    heading.className = "section-heading";
    heading.innerHTML = `<h3>${category}</h3><span>${filtered.length} produto(s)</span>`;

    const table = document.createElement("table");
    table.className = "product-table";
    table.innerHTML = `
      <thead><tr>
        <th>Produto</th><th>Tamanho</th><th>Qtd. a pedir (fardos)</th>
      </tr></thead><tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    filtered.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-name" data-label="Produto">${product.name}</td>
        <td class="product-size" data-label="Tamanho">${product.size}</td>
        <td data-label="Qtd. a pedir (fardos)"><span class="qty-unit">Fardos</span><input class="qty-input order-input" type="number" min="0" step="1" inputmode="numeric"
          aria-label="Quantidade a pedir de ${product.name} ${product.size}" placeholder="0"
          value="${state[product.index].order}" data-index="${product.index}" data-field="order"></td>`;
      tbody.appendChild(row);
    });

    section.append(heading, table);
    sections.appendChild(section);
  });

  if (!sections.children.length) {
    sections.innerHTML = '<div class="empty-state">Nenhum produto encontrado.</div>';
  }

  sections.querySelectorAll("input[data-index]").forEach(input => {
    input.addEventListener("input", event => {
      const el = event.target;
      const value = el.value === "" ? "" : Math.max(0, Math.floor(Number(el.value)));
      state[el.dataset.index][el.dataset.field] = value;
      if (el.value !== "" && el.value !== String(value)) el.value = value;
      saveState();
      updateSummary();
    });
  });
  updateSummary();
}

function updateSummary() {
  const totalProducts = products.length;
  const ordered = products.reduce((sum, p, i) => sum + (Number(state[i].order) || 0), 0);
  const items = products.reduce((sum, p, i) => sum + ((Number(state[i].order) || 0) > 0 ? 1 : 0), 0);
  document.getElementById("totalProducts").textContent = totalProducts;
  document.getElementById("itemsInOrder").textContent = items;
  document.getElementById("totalUnits").textContent = ordered;
}

// PDF A4 personalizado, sem bibliotecas externas e sem impressão.
function createOrderPDF(items, date, total) {
  const W = 595.28, H = 841.89;
  const pages = [];
  let ops = [], y = 0, pageNumber = 0;
  const esc = value => String(value).replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-').replace(/[\u201c\u201d]/g, '"')
    .replace(/[^\x20-\xFF]/g, '?').replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const rgb = (r,g,b) => `${(r/255).toFixed(3)} ${(g/255).toFixed(3)} ${(b/255).toFixed(3)}`;
  const rect = (x,top,w,h,color) => ops.push(`${rgb(...color)} rg ${x} ${(H-top-h).toFixed(2)} ${w} ${h} re f`);
  const text = (value,x,top,size=10,bold=false,color=[36,59,83]) =>
    ops.push(`${rgb(...color)} rg BT /${bold?'F2':'F1'} ${size} Tf 1 0 0 1 ${x} ${(H-top).toFixed(2)} Tm (${esc(value)}) Tj ET`);
  const line = (top,color=[224,232,240]) => ops.push(`${rgb(...color)} RG 0.6 w 42 ${(H-top).toFixed(2)} m 553 ${(H-top).toFixed(2)} l S`);
  const wrap = (value, maxChars) => {
    const lines=[''];
    String(value).split(/\s+/).forEach(word => {
      if ((lines[lines.length-1]+' '+word).trim().length > maxChars) lines.push(word);
      else lines[lines.length-1]=(lines[lines.length-1]+' '+word).trim();
    });
    return lines;
  };
  const begin = () => {
    pageNumber++; ops=[];
    rect(0,0,W,116,[16,42,67]);
    rect(42,24,5,62,[59,173,216]);
    text('CONTROLE DE PEDIDOS',60,53,20,true,[255,255,255]);
    text('PEDIDO DE REPOSIÇÃO DE BEBIDAS',60,76,10,false,[209,227,242]);
    text('FOLHA DE PEDIDOS',42,148,13,true,[16,42,67]);
    text(`Data: ${date}`,42,172,10,false,[89,107,123]);
    text(`Produtos solicitados: ${items.length}`,330,172,10,false,[89,107,123]);
    rect(42,190,511,29,[235,242,248]);
    text('PRODUTO',52,209,9,true,[16,42,67]);
    text('TAMANHO',362,209,9,true,[16,42,67]);
    text('FARDOS',477,209,9,true,[16,42,67]);
    y=234;
  };
  const finish = () => {
    line(790);
    text('Documento gerado pelo Controle de Pedidos',42,807,8,false,[113,128,150]);
    text(`Página ${pageNumber}`,490,807,8,false,[113,128,150]);
    pages.push(ops.join('\n')+'\n');
  };
  begin();
  let previousCategory='';
  for (const item of items) {
    const parts=wrap(item.name,43);
    const rowHeight=Math.max(31,parts.length*14+14);
    const newCategory=item.category!==previousCategory;
    if (y+(newCategory?32:0)+rowHeight>748) { finish(); begin(); previousCategory=''; }
    if (item.category!==previousCategory) {
      rect(42,y,511,25,[243,247,251]);
      text(item.category.toUpperCase(),52,y+17,9,true,[23,105,170]);
      y+=32; previousCategory=item.category;
    }
    if (y+rowHeight>748) { finish(); begin(); rect(42,y,511,25,[243,247,251]); text(item.category.toUpperCase(),52,y+17,9,true,[23,105,170]); y+=32; }
    parts.forEach((part,i)=>text(part,52,y+18+i*14,10,i===0));
    text(item.size,362,y+18,10);
    text(String(item.order),492,y+18,11,true,[22,132,91]);
    y+=rowHeight; line(y);
  }
  if (y+72>755) { finish(); begin(); }
  rect(42,y+17,511,54,[235,247,241]);
  text('TOTAL DO PEDIDO',55,y+49,12,true,[16,42,67]);
  text(`${total} fardos`,438,y+49,14,true,[22,132,91]);
  finish();

  // Construção PDF com offsets em bytes WinAnsi, inclusive para acentos.
  const objects=[null];
  const add=v=>(objects.push(v),objects.length-1);
  const root=add(''), pagesRef=add('');
  const font=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const bold=add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const refs=[];
  for (const content of pages) {
    const stream=add(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
    refs.push(add(`<< /Type /Page /Parent ${pagesRef} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${stream} 0 R >>`));
  }
  objects[root]=`<< /Type /Catalog /Pages ${pagesRef} 0 R >>`;
  objects[pagesRef]=`<< /Type /Pages /Kids [${refs.map(id=>`${id} 0 R`).join(' ')}] /Count ${refs.length} >>`;
  let pdf='%PDF-1.4\n%âãÏÓ\n';
  const offsets=[0];
  for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=`${i} 0 obj\n${objects[i]}\nendobj\n`;}
  const xref=pdf.length;
  pdf+=`xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for(let i=1;i<objects.length;i++)pdf+=`${String(offsets[i]).padStart(10,'0')} 00000 n \n`;
  pdf+=`trailer\n<< /Size ${objects.length} /Root ${root} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes=new Uint8Array(pdf.length);
  for(let i=0;i<pdf.length;i++)bytes[i]=pdf.charCodeAt(i)&255;
  return new Blob([bytes],{type:'application/pdf'});
}

async function generatePDF() {
  const orderedProducts = products
    .map((p, index) => ({ ...p, order: Number(state[index].order) || 0 }))
    .filter(p => p.order > 0)
    .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
      || sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));
  if (!orderedProducts.length) {
    alert('Informe a quantidade de fardos de pelo menos um produto.');
    return;
  }
  const buttons = ['printButton', 'printTop'].map(id => document.getElementById(id));
  buttons.forEach(button => { button.disabled = true; button.textContent = 'Gerando PDF...'; });
  try {
    const dateValue = document.getElementById('orderDate').value;
    const date = dateValue ? new Date(`${dateValue}T12:00:00`).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
    const filename = `pedido-${dateValue || 'sem-data'}.pdf`;
    const total = orderedProducts.reduce((sum, p) => sum + p.order, 0);
    const blob = createOrderPDF(orderedProducts, date, total);
    const file = new File([blob], filename, { type: 'application/pdf' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Folha de pedido' });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.warn('Compartilhamento indisponível; iniciando download.', error);
      }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    console.error('Falha na geração do PDF:', error);
    alert(`Não foi possível gerar o PDF: ${error.message}`);
  } finally {
    buttons.forEach((button, i) => {
      button.disabled = false;
      button.textContent = i === 0 ? 'Compartilhar PDF do pedido' : 'Compartilhar PDF';
    });
  }
}

document.getElementById("printButton").addEventListener("click", generatePDF);
document.getElementById("printTop").addEventListener("click", generatePDF);
document.getElementById("clearOrder").addEventListener("click", () => {
  if (!confirm("Deseja zerar todas as quantidades do pedido?")) return;
  Object.keys(state).forEach(index => {
    state[index].order = "";
  });
  saveState();
  render();
});
searchInput.addEventListener("input", render);

const today = new Date();
document.getElementById("orderDate").value =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

render();
