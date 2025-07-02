<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->double('duree')->default(2.5);
            $table->enum('seance', ['s1', 's2', 's3', 's4']);
            $table->string('certificat')->nullable();
            $table->string('commentaire')->nullable();
            $table->enum('statut', ['Présent', 'Absent']);
            $table->boolean('is_justified')->default(false);
            $table->foreignId('etudiant_id')->nullable()->constrained('etudiants')->cascadeOnDelete();
            $table->foreignId('designer_id')->nullable()->constrained('designers')->cascadeOnDelete();
            $table->foreignId('validator_id')->nullable()->constrained('validators')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absences');
    }
};
