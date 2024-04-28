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
        Schema::create('employee', function (Blueprint $table) {
            $table->id();
            $table->string('firstName', 20)->charset('utf8')->collation('utf8_spanish_ci');
            $table->string('firstLastName', 20)->charset('utf8')->collation('utf8_spanish_ci');
            $table->string('secondLastName', 20)->charset('utf8')->collation('utf8_spanish_ci');
            $table->string('otherName', 50)->charset('utf8')->collation('utf8_spanish_ci')->nullable();
            $table->enum('country', ['Colombia', 'Estados Unidos']);
            $table->enum('document', ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Permiso Especial']);
            $table->string('identification', 20);
            $table->string('email', 300)->charset('utf8')->collation('utf8_spanish_ci')->unique();
            $table->date('startDate');
            $table->enum('area', ['Administración', 'Financiera', 'Compras', 'Infraestructura', 'Operación', 'Talento Humano', 'Servicios Varios']);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee');
    }
};
