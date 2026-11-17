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

async function generatePDF() {
  const orderedProducts = products
    .map((p, index) => ({ ...p, order: Number(state[index].order) || 0 }))
    .filter(p => p.order > 0)
    .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
      || sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));

  if (!orderedProducts.length) {
    alert("Informe a quantidade de fardos de pelo menos um produto antes de compartilhar o PDF.");
    return;
  }

  if (!window.jspdf?.jsPDF) {
    alert("Não foi possível carregar o gerador de PDF. Verifique sua conexão e tente novamente.");
    return;
  }

  const buttonIds = ["printButton", "printTop"];
  const buttons = buttonIds.map(id => document.getElementById(id));
  buttons.forEach(button => { button.disabled = true; button.textContent = "Gerando PDF..."; });

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const dateValue = document.getElementById("orderDate").value;
    const date = dateValue ? new Date(`${dateValue}T12:00:00`).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR");
    const total = orderedProducts.reduce((sum, p) => sum + p.order, 0);
    const filename = `pedido-${dateValue || new Date().toISOString().slice(0, 10)}.pdf`;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(17);
    pdf.text("PEDIDO DE REPOSICAO", 14, 19);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Data: ${date}`, 14, 27);
    pdf.setDrawColor(210, 220, 230);
    pdf.line(14, 31, 196, 31);

    const rows = [];
    categoryOrder.forEach(category => {
      const group = orderedProducts.filter(p => p.category === category);
      if (!group.length) return;
      rows.push([{ content: category, colSpan: 3, styles: { fillColor: [231, 239, 247], textColor: [16, 42, 67], fontStyle: "bold" } }]);
      group.forEach(p => rows.push([p.name, p.size, `${p.order} fardo(s)`]));
    });
    pdf.autoTable({
      startY: 36,
      head: [["Produto", "Tamanho", "Quantidade"]],
      body: rows,
      theme: "grid",
      margin: { left: 14, right: 14, top: 14, bottom: 18 },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.7, overflow: "linebreak" },
      headStyles: { fillColor: [16, 42, 67], textColor: 255 },
      columnStyles: { 0: { cellWidth: 102 }, 1: { cellWidth: 34 }, 2: { cellWidth: 46 } }
    });
    let y = pdf.lastAutoTable.finalY + 10;
    if (y > 270) { pdf.addPage(); y = 20; }
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text(`Total de fardos: ${total}`, 14, y);

    const blob = pdf.output("blob");
    const file = new File([blob], filename, { type: "application/pdf" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: "Pedido de reposição" });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        // Alguns navegadores falham ao compartilhar arquivos: disponibilizar download.
      }
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Não foi possível gerar o PDF. Tente novamente.");
  } finally {
    buttons.forEach((button, index) => {
      button.disabled = false;
      button.textContent = index === 0 ? "Compartilhar PDF do pedido" : "Compartilhar PDF";
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
