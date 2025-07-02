<?php

namespace Database\Seeders;

use App\Models\Secteur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SecteurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $secteurs = [
            [
                'nom' => 'Communication & Soft Skills',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Génie électrique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Génie Mécanique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Métiers de l’Automobile',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom' => 'Génie informatique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        Secteur::insert($secteurs);
    }
}
