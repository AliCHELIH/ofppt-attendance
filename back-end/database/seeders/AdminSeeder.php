<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        Admin::updateOrCreate(
            ['email' => 'admin@ofppt.ma'],
            [
                'first_name' => 'OFPPT',
                'last_name' => 'Admin',
                'password' => Hash::make('ofppt'),
                'email_verified_at' => now(),
                'deleted_at' => null,
            ]
        );
    }
}
