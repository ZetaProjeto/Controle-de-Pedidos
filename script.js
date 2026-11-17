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

// Gerador PDF independente: não precisa de CDN, internet ou janela de impressão.
function createOrderPDF(items, date, total) {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const pages = [];
  let commands = [];
  let y = 0;
  const safe = value => String(value)
    .replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u201c\u201d]/g, '"').replace(/[^\x20-\xFF]/g, '?')
    .replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const text = (value, x, top, size = 10, bold = false) => {
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 1 0 0 1 ${x} ${(pageHeight - top).toFixed(2)} Tm (${safe(value)}) Tj ET`);
  };
  const line = (top) => commands.push(`0.78 G 0.6 w 40 ${(pageHeight-top).toFixed(2)} m 555 ${(pageHeight-top).toFixed(2)} l S`);
  const beginPage = () => {
    commands = [];
    text('FOLHA DE PEDIDO', 40, 45, 17, true);
    text(`Data do pedido: ${date}`, 40, 65, 10);
    line(77);
    text('PRODUTO', 43, 98, 9, true);
    text('TAMANHO', 345, 98, 9, true);
    text('FARDOS', 472, 98, 9, true);
    line(106);
    y = 126;
  };
  const finishPage = () => {
    pages.push(commands.join('\n') + '\n');
  };
  beginPage();
  let lastCategory = '';
  items.forEach(item => {
    if (item.category !== lastCategory) {
      if (y > 750) { finishPage(); beginPage(); }
      text(item.category.toUpperCase(), 43, y, 10, true);
      y += 23;
      lastCategory = item.category;
    }
    if (y > 755) { finishPage(); beginPage(); text(item.category.toUpperCase(), 43, y, 10, true); y += 23; }
    // Nomes longos são quebrados para não invadir as colunas.
    const words = item.name.split(' ');
    const lines = [''];
    words.forEach(word => {
      const last = lines.length - 1;
      if ((lines[last] + ' ' + word).trim().length > 39) lines.push(word);
      else lines[last] = (lines[last] + ' ' + word).trim();
    });
    lines.forEach((part, i) => text(part, 43, y + i * 13, 10));
    text(item.size, 345, y, 10);
    text(String(item.order), 485, y, 10, true);
    y += Math.max(23, lines.length * 13 + 9);
    line(y - 8);
  });
  if (y > 755) { finishPage(); beginPage(); }
  text(`TOTAL DE FARDOS: ${total}`, 43, y + 16, 12, true);
  finishPage();

  const objects = [null];
  const add = value => { objects.push(value); return objects.length - 1; };
  const catalogId = add('');
  const pagesId = add('');
  const regularId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const boldId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const pageIds = [];
  for (const content of pages) {
    const streamId = add(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
    pageIds.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${regularId} 0 R /F2 ${boldId} 0 R >> >> /Contents ${streamId} 0 R >>`));
  }
  objects[catalogId] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  let pdf = '%PDF-1.4\n%âãÏÓ\n';
  const offsets = [0];
  for (let id = 1; id < objects.length; id++) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) pdf += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 255;
  return new Blob([bytes], { type: 'application/pdf' });
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
