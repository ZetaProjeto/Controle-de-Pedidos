# Controle de Pedidos e Estoque

Site estático para cadastrar o estoque atual, informar quantidades para reposição e imprimir/salvar o pedido em PDF.

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
Preencha a coluna **Qtd. a pedir** nos produtos desejados e clique em **Gerar PDF do pedido**. Na janela de impressão do navegador, escolha **Salvar como PDF**.

Observação: os campos são salvos no armazenamento local do navegador (localStorage), no mesmo dispositivo e navegador. Limpar os dados do navegador pode apagar essas informações.
