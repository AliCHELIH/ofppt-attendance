<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\GroupController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ValidatorController;

Route::middleware(['auth:validator'])->group(function () {
    Route::get('/etudiants/group/{id}', [EtudiantController::class, 'getEtudiantsByGroup']);
    Route::get('/etudiants', [EtudiantController::class, 'index']);
    Route::get('/validators', [ValidatorController::class, 'index']);
    Route::get('/alerts', [AlertController::class, 'index']);
    Route::get('/absencesByDaySeanceGroup', [AbsenceController::class, 'absencesByDaySeanceGroup']);
    Route::get('/groups', [GroupController::class, 'index']);
    Route::put('/etudiants/{id}/updateObservationConseiller', [EtudiantController::class, 'updateObservationConseiller']);
    Route::apiResources([
        'absences' => AbsenceController::class,
        'appointments' => AppointmentController::class,
    ]);
});
