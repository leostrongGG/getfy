# Getfy Plugin Starter

Template oficial para novos plugins. **Não edite o código fonte da plataforma** — desenvolva tudo nesta pasta.

## Documentação para parceiros

Comece pelo índice:

**[resources/docs/plugins/README.md](../../resources/docs/plugins/README.md)**

| Documento | Conteúdo |
|-----------|----------|
| [GUIA_PARCEIROS.md](../../resources/docs/plugins/GUIA_PARCEIROS.md) | Guia principal |
| [MANIFEST.md](../../resources/docs/plugins/MANIFEST.md) | Referência `plugin.json` |
| [HOOKS.md](../../resources/docs/plugins/HOOKS.md) | Hooks e SDK |
| [CHECKOUT.md](../../resources/docs/plugins/CHECKOUT.md) | Extensões de checkout |

## Comandos rápidos

```bash
# Na raiz do projeto Getfy
php artisan plugin:make meu-plugin
php artisan plugin:build meu-plugin
php artisan plugin:validate meu-plugin
```

## Build da UI

```bash
cd frontend
npm install
npm run build
```

O ZIP de distribuição deve incluir a pasta `dist/` gerada.
