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
- `site.config.mjs` mantém os dados estruturados do escritório.
- `scripts/` contém a geração do site estático e o servidor de prévia.
- `.github/workflows/deploy.yml` gera e publica o site no GitHub Pages.
- `dist/` contém o resultado do build e é ignorado pelo Git.

## Instalação e prévia local

Instale o Node.js 22 ou superior e execute na pasta do projeto:

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Abra [a prévia local](http://127.0.0.1:4173/). Execute o build novamente após editar os arquivos. Com npm disponível, `npm run dev` executa as duas etapas. Para somente gerar os arquivos de publicação, use `node scripts/build.mjs` ou `npm run build`.

## Publicação no GitHub Pages

Em **Settings → Pages → Build and deployment → Source**, selecione **GitHub Actions**. Cada push na branch `main` roda o build com Node.js 22 e publica o artefato de `dist/`. Para executar manualmente, abra **Actions → Publicar no GitHub Pages → Run workflow**, selecione `main` e confirme. [Configurações do repositório](https://github.com/Luk41400/site-rodriguesalves/settings/pages)

O workflow usa a URL fornecida pelo GitHub Pages para gerar as URLs canônicas, os metadados sociais e o sitemap. A página de privacidade fica em `privacidade/` dentro do site. [Site publicado](https://luk41400.github.io/site-rodriguesalves/) · [Sitemap](https://luk41400.github.io/site-rodriguesalves/sitemap.xml)

## Google Search Console

1. No Search Console, selecione **Adicionar propriedade** e escolha **Prefixo do URL**. Informe a URL completa do site, incluindo `/site-rodriguesalves/`. [Adicionar uma propriedade](https://support.google.com/webmasters/answer/34592)
2. Siga o método de verificação oferecido para a propriedade, como a tag HTML na página inicial. [Verificação de propriedade](https://support.google.com/webmasters/answer/9008080)
3. Com o site publicado, em **Sitemaps**, envie `https://luk41400.github.io/site-rodriguesalves/sitemap.xml` e confira a leitura do arquivo. [Relatório de sitemaps](https://support.google.com/webmasters/answer/7451001)
4. Use **Inspeção de URL** para verificar a página inicial e a política em `privacidade/`. Compare a URL canônica declarada com a escolhida pelo Google quando houver dados. Em **Indexação > Páginas**, acompanhe falhas de rastreamento, bloqueios por `noindex` e URLs duplicadas. [Inspeção de URL](https://support.google.com/webmasters/answer/9012289) · [Indexação de páginas](https://support.google.com/webmasters/answer/7440203)
5. Em **Desempenho > Resultados da pesquisa**, acompanhe impressões, cliques e consultas locais. Use o relatório de **Core Web Vitals** quando houver dados de visitas suficientes. [Desempenho](https://support.google.com/webmasters/answer/7576553) · [Core Web Vitals](https://support.google.com/webmasters/answer/9205520)

## Contato e dados institucionais

O telefone abre o discador e o Instagram abre o perfil oficial. O formulário valida os dados e prepara um rascunho para o usuário enviar pelo Instagram. Se o navegador bloquear a cópia automática, o rascunho fica disponível para cópia manual. O site não transmite os campos do formulário. O mapa do Google é carregado após ação do visitante.

Consulte as fontes dos dados publicados e os itens a confirmar em [INFORMACOES_PENDENTES.md](INFORMACOES_PENDENTES.md).
