# Controle de Pedidos e Estoque

Site estático para informar quantidades para reposição e gerar e compartilhar somente a folha do pedido em PDF.

## Arquivos
- `index.html`: estrutura da página.
- `style.css`: visual e responsividade.
- `script.js`: lista de produtos, campos, cálculos e geração do PDF.

## Publicar no GitHub Pages
1. Crie um repositório no GitHub.
2. Envie os três arquivos (`index.html`, `style.css` e `script.js`) para a raiz do repositório.
3. Abra **Settings > Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione a branch `main` e a pasta `/ (root)`, depois salve.
6. Aguarde a publicação e abra o endereço informado pelo GitHub.

## Gerar o PDF
Preencha a coluna **Qtd. a pedir (fardos)** nos produtos desejados e clique em **Baixar PDF do pedido**. O navegador tentará abrir o compartilhamento nativo do aparelho (por exemplo, WhatsApp). Se não for compatível, o PDF será baixado automaticamente, sem abrir a impressão. É necessário acesso à internet para carregar as bibliotecas de PDF. Para compartilhamento nativo, publique em HTTPS (como GitHub Pages).

Observação: os campos são salvos no armazenamento local do navegador (localStorage), no mesmo dispositivo e navegador. Limpar os dados do navegador pode apagar essas informações.
