<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vitrine Demo</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 2rem; background: #fafafa; color: #18181b; }
        .grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
        .card { background: #fff; border: 1px solid #e4e4e7; border-radius: 12px; padding: 1rem; }
        a { color: #0ea5e9; font-weight: 600; text-decoration: none; }
        .hint { color: #71717a; font-size: 0.875rem; margin-bottom: 1.5rem; }
    </style>
</head>
<body>
    <h1>Vitrine Demo (plugin)</h1>
    <p class="hint">
        Passe <code>?tenant_id=ID</code> ou header <code>X-Tenant-Id</code> para listar produtos do tenant.
        Checkout continua no core (<code>/c/{slug}</code>).
    </p>
    @if ($tenant_id)
        <p>Tenant: {{ $tenant_id }}</p>
    @endif
    <div class="grid">
        @forelse ($products as $p)
            <div class="card">
                <strong>{{ $p['name'] }}</strong>
                <p>{{ number_format($p['price'], 2, ',', '.') }} {{ $p['currency'] }}</p>
                <a href="{{ $p['checkout_url'] }}">Comprar</a>
            </div>
        @empty
            <p>Nenhum produto (informe tenant_id válido).</p>
        @endforelse
    </div>
</body>
</html>
