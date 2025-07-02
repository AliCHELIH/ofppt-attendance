<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ValidatorController;

Route::middleware(['guest:validator'])->group(function () {
    Route::post('/login', [ValidatorController::class, 'login']);
    // register
    // forgot password
});
Route::middleware(['auth:validator'])->group(function () {
    Route::get('/profile', function () {
        return request()->user("validator");
    });
    Route::post('/logout', [ValidatorController::class, 'logout']);

    // logout
    // new password
    // change email
});
