<?php

namespace Database\Seeders;

use App\Models\Designer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DesignerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Mle Affecté Présentiel Actif    Formateur Affecté Présentiel Actif
            ['first_name' => 'Fatima', 'last_name' => 'Moustati', 'email' => 'fatima.moustati@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Kaoutar', 'last_name' => 'Meddri', 'email' => 'kaoutar.meddri@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Hassan', 'last_name' => 'Khoullak', 'email' => 'hassan.khoullak@ofppt.ma', 'is_cgcp' => 1, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Faical', 'last_name' => 'Essaiydy', 'email' => 'faical.essaiydy@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khadija', 'last_name' => 'Traf', 'email' => 'khadija.traf@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mostafa', 'last_name' => 'Zahouani', 'email' => 'mostafa.zahouani@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mohammed', 'last_name' => 'Salahi', 'email' => 'mohammed.salahi@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdeltif', 'last_name' => 'Lahrari', 'email' => 'abdeltif.lahrari@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Said', 'last_name' => 'Fallah', 'email' => 'said.fallah@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Youssef', 'last_name' => 'Fatah', 'email' => 'youssef.fatah@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Saida', 'last_name' => 'Kraiouch', 'email' => 'saida.kraiouch@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Karim', 'last_name' => 'Hassoune', 'email' => 'karim.hassoune@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdelhadi', 'last_name' => 'Souda', 'email' => 'abdelhadi.souda@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ahmed', 'last_name' => 'Elharti', 'email' => 'ahmed.elharti@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Boubker', 'last_name' => 'Mouti', 'email' => 'boubker.mouti@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ilham', 'last_name' => 'Barhdadi', 'email' => 'ilham.barhdadi@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ayoub', 'last_name' => 'Rajil', 'email' => 'ayoub.rajil@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khadija', 'last_name' => 'Chekrani', 'email' => 'khadija.chekrani@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Zineb', 'last_name' => 'Chaki', 'email' => 'zineb.chaki@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Anass', 'last_name' => 'Khalfi', 'email' => 'anass.khalfi@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdelkrim', 'last_name' => 'Belasri', 'email' => 'abdelkrim.belasri@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Redouane', 'last_name' => 'Souhail', 'email' => 'redouane.souhail@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Said', 'last_name' => 'Nait El Haj', 'email' => 'said.naitelhaj@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Adil', 'last_name' => 'Anibat', 'email' => 'adil.anibat@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Badr-eddine', 'last_name' => 'Aaqil', 'email' => 'badr-eddine.aaqil@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mohamed', 'last_name' => 'Ait Tahar', 'email' => 'mohamed.aittahar@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mohamed', 'last_name' => 'Elmechbouk', 'email' => 'mohamed.elmechbouk@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Ahmed', 'last_name' => 'Eddanguir', 'email' => 'ahmed.eddanguir@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdelmajid', 'last_name' => 'Maziane', 'email' => 'abdelmajid.maziane@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Khalid', 'last_name' => 'Naji', 'email' => 'khalid.naji@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Mostafa', 'last_name' => 'Lagmiri', 'email' => 'mostafa.lagmiri@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Abdelghani', 'last_name' => 'Ennaciri', 'email' => 'abdelghani.ennaciri@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Salaheddine', 'last_name' => 'Bahri', 'email' => 'salaheddine.bahri@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Moussa', 'last_name' => 'Essaadaoui', 'email' => 'moussa.essaadaoui@ofppt.ma', 'is_cgcp' => 0, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Anas', 'last_name' => 'Tazi', 'email' => 'anas.tazi@ofppt.ma', 'is_cgcp' => 1, 'password' => Hash::make('ofppt')],
            ['first_name' => 'Hichame', 'last_name' => 'Lmrahi', 'email' => 'hicham.lmrahi@ofppt.ma', 'is_cgcp' => 1, 'password' => Hash::make('ofppt')],
        ];

        foreach ($data as $designerData) {
            Designer::create($designerData);
        }
    }
}
