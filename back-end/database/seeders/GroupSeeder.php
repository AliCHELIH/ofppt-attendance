<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = [
            [
                'nom' => 'DD101',
                'filiere_id' => 9,
            ],
            [
                'nom' => 'DD201',
                'filiere_id' => 9,
            ],
            [
                'nom' => 'TSMFM101',
                'filiere_id' => 4,
            ],
            [
                'nom' => 'ESA201',
                'filiere_id' => 2,
            ],
            [
                'nom' => 'ESA202',
                'filiere_id' => 2,
            ],
        ];

        DB::table('groups')->insert($groups);
    }
}
