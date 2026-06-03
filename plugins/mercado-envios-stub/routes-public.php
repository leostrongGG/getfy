<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/webhook', function (Request $request) {
    return response()->json(['ok' => true, 'received' => $request->all()]);
})->name('webhook');
