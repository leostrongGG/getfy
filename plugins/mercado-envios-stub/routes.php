<?php

use Illuminate\Support\Facades\Route;

Route::get('/panel', function () {
    return response()->json([
        'message' => 'Painel Mercado Envios (stub). Configure api_token em PluginRegistry::config.',
    ]);
})->name('panel');
