# Getfy Plugin Starter

Template oficial para novos plugins. **Não edite o código fonte da plataforma** — desenvolva tudo nesta pasta.

## Documentação para parceiros

Leia o guia completo:

**[resources/docs/plugins/GUIA_PARCEIROS.md](../../resources/docs/plugins/GUIA_PARCEIROS.md)**

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
