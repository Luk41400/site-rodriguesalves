# Advocacia Rodrigues e Alves

Site institucional em português para o escritório de Valparaíso, SP. A interface adapta os tokens, as fontes, os controles e os painéis do Aural Design System fornecido no briefing. A balança jurídica em SVG acompanha a composição tipográfica.

## Tecnologias

HTML semântico, CSS, JavaScript nativo e Node.js 22 ou superior. O projeto não usa dependências externas de execução nem precisa de uma etapa de instalação de pacotes.

## Recursos do site

- Página institucional com informações sobre a equipe, atendimento, localização e contato.
- Layout responsivo com menu móvel acessível por teclado, fontes locais e suporte à preferência por movimento reduzido.
- Mapa interativo carregado sob demanda, link para rotas, telefone e Instagram.
- Formulário que prepara um rascunho local para envio pelo Instagram e página de Política de Privacidade.
- SEO local com dados estruturados `LegalService`, metadados por página, Open Graph e Twitter Cards. O build de produção gera URLs canônicas, sitemap e diretivas de rastreamento para o domínio configurado.

## Estrutura

- `src/index.html` contém a página institucional.
- `src/privacidade.html` contém a Política de Privacidade.
- `src/assets/` reúne os estilos Aural e os estilos de composição, as fontes locais, os gráficos e as interações.
- `site.config.mjs` define a origem pública e os dados estruturados do escritório.
- `scripts/` contém a geração do site estático e o servidor de prévia.
- `dist/` contém o resultado do build e é ignorado pelo Git.

## Instalação e prévia local

Instale o Node.js 22 ou superior e execute na pasta do projeto:

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Abra [a prévia local](http://127.0.0.1:4173/). Execute o build novamente após editar os arquivos. Com npm disponível, `npm run dev` executa as duas etapas. Para somente gerar os arquivos de publicação, use `node scripts/build.mjs` ou `npm run build`.

## Publicação na Vercel

O projeto é um site estático, sem framework. A Vercel usa o comando de instalação vazio, executa `node scripts/build.mjs` e publica a pasta `dist`. A geração do SEO de produção usa a variável de sistema `VERCEL_ENV`. O projeto dispensa credenciais e variáveis secretas.

1. Revise [as informações pendentes](INFORMACOES_PENDENTES.md) e confirme a identificação profissional a publicar.
2. Defina em `site.config.mjs` a origem HTTPS do domínio definitivo, sem barra final. Use a mesma origem na configuração de domínios da Vercel. Se houver versões com e sem `www`, configure a secundária para redirecionar à principal.
3. Importe o repositório na Vercel e ative a opção **Automatically expose System Environment Variables**. O `vercel.json` usa `node scripts/build.mjs`, publica `dist` e serve a política em `/privacidade`. O caminho antigo `/privacidade.html` redireciona para a URL curta. [Configuração de rotas da Vercel](https://vercel.com/docs/project-configuration/vercel-json) · [Variáveis de sistema](https://vercel.com/docs/environment-variables/system-environment-variables)
4. Em produção, com o domínio definido e `VERCEL_ENV=production`, o build emite URLs canônicas, Open Graph e Twitter Cards com imagem absoluta, além de `sitemap.xml` e sua referência no `robots.txt`. Prévias e builds sem domínio usam `noindex, follow` e deixam o sitemap indisponível. Após o deploy, confira as duas páginas e os arquivos de rastreamento na origem pública.

## Google Search Console

1. No Search Console, selecione **Adicionar propriedade** e escolha **Domínio**. Informe o domínio definitivo sem protocolo nem caminho. [Adicionar uma propriedade](https://support.google.com/webmasters/answer/34592)
2. Copie o registro TXT informado pelo Google para o provedor DNS do domínio. Após a propagação, volte ao Search Console, clique em **Verificar** e mantenha o registro DNS. [Verificação de propriedade](https://support.google.com/webmasters/answer/9008080)
3. Com o deploy de produção ativo, abra `/sitemap.xml` no domínio definitivo. Em **Sitemaps**, envie essa URL e confira se o Google conseguiu ler o arquivo. [Relatório de sitemaps](https://support.google.com/webmasters/answer/7451001)
4. Use **Inspeção de URL** para verificar a página inicial e `/privacidade`. Compare a URL canônica declarada com a escolhida pelo Google quando houver dados. Em **Indexação > Páginas**, acompanhe falhas de rastreamento, bloqueios por `noindex` e URLs duplicadas. [Inspeção de URL](https://support.google.com/webmasters/answer/9012289) · [Indexação de páginas](https://support.google.com/webmasters/answer/7440203)
5. Em **Desempenho > Resultados da pesquisa**, acompanhe impressões, cliques e consultas locais. Use o relatório de **Core Web Vitals** quando houver dados de visitas suficientes. [Desempenho](https://support.google.com/webmasters/answer/7576553) · [Core Web Vitals](https://support.google.com/webmasters/answer/9205520)

## Contato e dados institucionais

O telefone abre o discador e o Instagram abre o perfil oficial. O formulário valida os dados e prepara um rascunho para o usuário enviar pelo Instagram. Se o navegador bloquear a cópia automática, o rascunho fica disponível para cópia manual. O site não transmite os campos do formulário. O mapa do Google é carregado após ação do visitante.

Consulte as fontes dos dados publicados e os itens a confirmar em [INFORMACOES_PENDENTES.md](INFORMACOES_PENDENTES.md).
