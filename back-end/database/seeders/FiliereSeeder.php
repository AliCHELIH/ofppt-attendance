<?php

namespace Database\Seeders;

use App\Models\Filiere;
use App\Models\Secteur;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FiliereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filiers = [
            [
                'nom' => 'Automatisation et Instrumentation Industrielle',
                'code' => 'GE_AII_TS',
                'secteur_id' => Secteur::where('nom', 'Génie électrique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Electromécanique des Systèmes Automatisées',
                'code' => 'GE_ESA_TS',
                'secteur_id' => Secteur::where('nom', 'Génie électrique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '(CDS)Electromécanique des Systèmes Automatisées',
                'code' => 'GE_ESA_TS_RCDS',
                'secteur_id' => Secteur::where('nom', 'Génie électrique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Technicien Spécialisé de Méthodes en Fabrication Mécanique',
                'code' => 'FM_TSMFM_TS',
                'secteur_id' => Secteur::where('nom', 'Génie Mécanique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Réparateur de véhicule automobile (MAALEM)',
                'code' => 'REM_RVAM_FQ',
                'secteur_id' => Secteur::where('nom', 'Métiers de l’Automobile')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Technico-Commercial en Vente de Véhicules et Pièces de Rechange',
                'code' => 'REM_TCVVPR_TS',
                'secteur_id' => Secteur::where('nom', 'Métiers de l’Automobile')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Technicien spécialisé en Diagnostic et Electronique Embarquée',
                'code' => 'REM_TSDEE_TS',
                'secteur_id' => Secteur::where('nom', 'Métiers de l’Automobile')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => '(CDS)Technicien spécialisé en Diagnostic et Electronique Embarquée',
                'code' => 'REM_TSDEE_TS_RCDS',
                'secteur_id' => Secteur::where('nom', 'Métiers de l’Automobile')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Développement digital',
                'code' => 'DEV',
                'secteur_id' => Secteur::where('nom', 'Génie informatique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Infrastructure digital',
                'code' => 'ID',
                'secteur_id' => Secteur::where('nom', 'Génie informatique')->first()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Filiere::insert($filiers);
    }
}
