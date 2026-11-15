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
  state[index] = { stock: saved.stock ?? "", order: saved.order ?? "" };
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
        <th>Produto</th><th>Tamanho</th><th>Estoque atual</th><th>Qtd. a pedir</th>
      </tr></thead><tbody></tbody>`;
    const tbody = table.querySelector("tbody");

    filtered.forEach(product => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-name">${product.name}</td>
        <td class="product-size">${product.size}</td>
        <td><input class="qty-input" type="number" min="0" step="1" inputmode="numeric"
          aria-label="Estoque atual de ${product.name} ${product.size}" placeholder="0"
          value="${state[product.index].stock}" data-index="${product.index}" data-field="stock"></td>
        <td><input class="qty-input order-input" type="number" min="0" step="1" inputmode="numeric"
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

function generatePDF() {
  const orderedProducts = products
    .map((p, index) => ({ ...p, stock: state[index].stock, order: Number(state[index].order) || 0 }))
    .filter(p => p.order > 0)
    .sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
      || sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size));

  if (!orderedProducts.length) {
    alert("Informe a quantidade a pedir de pelo menos um produto antes de gerar o PDF.");
    return;
  }

  const dateValue = document.getElementById("orderDate").value;
  const date = dateValue ? new Date(`${dateValue}T12:00:00`).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR");
  const total = orderedProducts.reduce((sum, p) => sum + p.order, 0);
  let html = `<h1 class="print-title">Pedido de Reposição de Estoque</h1>
    <div class="print-meta">Data: ${date}<br>Documento para conferência e envio ao fornecedor</div>`;
  categoryOrder.forEach(category => {
    const group = orderedProducts.filter(p => p.category === category);
    if (!group.length) return;
    html += `<h2 class="print-section">${category}</h2>
      <table class="print-table"><thead><tr><th>Produto</th><th>Tamanho</th><th>Estoque atual</th><th>Quantidade a pedir</th></tr></thead><tbody>`;
    group.forEach(p => {
      html += `<tr><td>${p.name}</td><td>${p.size}</td><td>${p.stock === "" ? "—" : p.stock}</td><td><strong>${p.order}</strong></td></tr>`;
    });
    html += `</tbody></table>`;
  });
  html += `<div class="print-total">Total de unidades solicitadas: ${total}</div>
    <div class="print-note">Pedido gerado pelo Controle de Pedidos e Estoque.</div>`;
  const printArea = document.getElementById("printArea");
  printArea.innerHTML = html;
  window.print();
}

document.getElementById("printButton").addEventListener("click", generatePDF);
document.getElementById("printTop").addEventListener("click", generatePDF);
document.getElementById("clearOrder").addEventListener("click", () => {
  if (!confirm("Deseja zerar todas as quantidades de estoque e pedido?")) return;
  Object.keys(state).forEach(index => {
    state[index].stock = "";
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
