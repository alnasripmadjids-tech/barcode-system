<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Tatanungin ka ng terminal para sa email at password nang live at ligtas
        $email = $this->command->ask('I-type ang iyong Admin Email');
        $password = $this->command->secret('I-type ang iyong Admin Password');

        if (!$email || !$password) {
            $this->command->error('Bawal ang walang laman na email o password!');
            return;
        }

        User::updateOrCreate(
            ['email' => $email],
            [
                'name' => 'System Administrator',
                'password' => Hash::make($password), 
            ]
        );

        $this->command->info('Ligtas na nagawa ang iyong Admin account!');
    }
}
