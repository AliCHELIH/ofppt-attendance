<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AlertController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\GroupController;

Route::middleware(['auth:designer'])->group(function () {
    Route::get('/etudiants/group/{id}', [EtudiantController::class, 'getEtudiantsByGroup']);
    Route::get('/etudiants', [EtudiantController::class, 'index']);
    Route::get('/absences', [AbsenceController::class, 'index']);
    Route::post('/absences', [AbsenceController::class, 'store']);
    Route::get('/absences/{id}', [AbsenceController::class, 'show']);
    Route::put('/absences/{id}', [AbsenceController::class, 'update']);
    Route::delete('/absences/{id}', [AbsenceController::class, 'destroy']);
    Route::get('/groups', [GroupController::class, 'formateurGroups']);
    Route::put('/etudiants/{id}/updateObservation', [EtudiantController::class, 'updateObservation']);
});
