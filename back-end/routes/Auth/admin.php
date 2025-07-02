<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

Route::middleware(['guest:admin'])->group(function () {
    Route::post('/login', [AdminController::class, 'login']);
    // register
    // forgot password
});
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/profile', function () {
        return request()->user("admin");
    });
    Route::post('/logout', [AdminController::class, 'logout']);
    // logout
    // new password
    // change email
});
