<?php

namespace Database\Seeders;

use App\Models\Secteur;
use App\Models\Validator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ValidatorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Communication & Soft Skills
            ['first_name' => 'Kaoutar', 'last_name' => 'Meddri', 'email' => 'kaoutar.meddri@ofppt.ma', 'is_conseiller' => 1, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khadija', 'last_name' => 'Traf', 'email' => 'khadija.traf@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khadija', 'last_name' => 'Chekrani', 'email' => 'khadija.chekrani@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            // Génie électrique
            ['first_name' => 'Faical', 'last_name' => 'Essaiydy', 'email' => 'faical.essaiydy@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mohammed', 'last_name' => 'Salahi', 'email' => 'mohammed.salahi@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Said', 'last_name' => 'Fallah', 'email' => 'said.fallah@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdelhadi', 'last_name' => 'Souda', 'email' => 'abdelhadi.souda@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ilham', 'last_name' => 'Barhdadi', 'email' => 'ilham.barhdadi@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            // Génie Mécanique
            ['first_name' => 'Badr-eddine', 'last_name' => 'Aaqil', 'email' => 'badr-eddine.aaqil@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ahmed', 'last_name' => 'Eddanguir', 'email' => 'ahmed.eddanguir@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            // Métiers de l’Automobile
            ['first_name' => 'Ayoub', 'last_name' => 'Rajil', 'email' => 'ayoub.rajil@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khalid', 'last_name' => 'Naji', 'email' => 'khalid.naji@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Salaheddine', 'last_name' => 'Bahri', 'email' => 'salaheddine.bahri@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Rajae', 'last_name' => 'Bahri', 'email' => 'rajae.bahri@ofppt.ma', 'is_conseiller' => 0, 'is_cgcp' => 1, 'password' => Hash::make('ofppt')],
        ];

        foreach ($data as $validatorData) {
            Validator::create($validatorData);
        }
    }
}
