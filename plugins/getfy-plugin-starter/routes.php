<?php

use App\Http\Controllers\PluginInertiaController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard', [PluginInertiaController::class, 'show'])
    ->defaults('page', 'Dashboard')
    ->name('dashboard');
