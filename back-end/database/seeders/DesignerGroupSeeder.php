<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DesignerGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designer_group = [
            [
                'designer_id' => 35,
                'group_id' => 1,
            ],
            [
                'designer_id' => 35,
                'group_id' => 2,
            ],
        ];

        DB::table('designer_group')->insert($designer_group);
    }
}
