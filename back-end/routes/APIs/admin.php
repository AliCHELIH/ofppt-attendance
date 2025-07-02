<?php

use App\Http\Controllers\AbsenceController;
use App\Http\Controllers\AlertController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DesignerController;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\SecteurController;
use App\Http\Controllers\ValidatorController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:admin'])->group(function () {
    Route::get('/filieres', [FiliereController::class, 'index']);
    Route::post('/filieres', [FiliereController::class, 'store']);
    Route::put('/filieres/{filiere}', [FiliereController::class, 'update']);
    Route::delete('/filieres/{filiere}', [FiliereController::class, 'destroy']);
    Route::get('/secteurs', [SecteurController::class, 'index']);
    Route::post('/secteurs', [SecteurController::class, 'store']);
    Route::put('/secteurs/{secteur}', [SecteurController::class, 'update']);
    Route::delete('/secteurs/{secteur}', [SecteurController::class, 'destroy']);
    Route::put('/reset-validator/{id}', [ValidatorController::class, 'resetPassword']);
    Route::put('/reset-designer/{id}', [DesignerController::class, 'resetPassword']);
    Route::get('/alerts', [AlertController::class, 'index']);
    Route::get('groups', [GroupController::class, 'index']);
    Route::post('groups', [GroupController::class, 'store']);
    Route::put('groups/{group}', [GroupController::class, 'update']);
    Route::delete('groups/{group}', [GroupController::class, 'destroy']);
    Route::get('groups/filiere/{filiere_id}', [GroupController::class, 'listByFiliere']);
    Route::get('/absencesByDaySeanceGroup', [AbsenceController::class, 'absencesByDaySeanceGroup']);
    Route::get('/etudiants/group/{id}', [EtudiantController::class, 'getEtudiantsByGroup']);
    Route::get('getEtudiantData/{id}', [EtudiantController::class, 'getEtudiantData']);
    Route::post('sendAlert', [EtudiantController::class, 'sendAlert']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/download-certificat', [EtudiantController::class, 'downloadCertificat'])->name('admin.download.certificat');
    Route::apiResource('designers', DesignerController::class)->names(['index' => 'designersAdmin.index', 'store' => 'designersAdmin.store', 'show' => 'designersAdmin.show', 'update' => 'designersAdmin.update', 'destroy' => 'designersAdmin.destroy']);
    Route::apiResource('validators', ValidatorController::class)->names(['index' => 'validatorsAdmin.index', 'store' => 'validatorsAdmin.store', 'show' => 'validatorsAdmin.show', 'update' => 'validatorsAdmin.update', 'destroy' => 'validatorsAdmin.destroy']);
    Route::apiResource('etudiants', EtudiantController::class)->names(['index' => 'etudiantsAdmin.index', 'store' => 'etudiantsAdmin.store', 'show' => 'etudiantsAdmin.show', 'update' => 'etudiantsAdmin.update', 'destroy' => 'etudiantsAdmin.destroy']);
    Route::apiResource('absences', AbsenceController::class)->names(['index' => 'absencesAdminn.index', 'store' => 'absencesAdminn.store', 'show' => 'absencesAdminn.show', 'update' => 'absencesAdminn.update', 'destroy' => 'absencesAdminn.destroy']);
    Route::post('justifyAbsence/{id}', [AbsenceController::class, 'justifyAbsence']);
});
