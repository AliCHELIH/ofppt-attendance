<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DesignerController;

Route::middleware(['guest:designer'])->group(function () {
    Route::post('/login', [DesignerController::class, 'login']);
    // register
    // forgot password
});
Route::middleware(['auth:designer'])->group(function () {
    Route::get('/profile', function () {
        return request()->user("designer");
    });
    Route::post('/logout', [DesignerController::class, 'logout']);

    // logout
    // new password
    // change email
});
