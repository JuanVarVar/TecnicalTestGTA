<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
Use App\Models\Employee;

class employeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run()
    {
        $modelo = new Employee();

        $nombres = ['Juan', 'Maria', 'Carlos', 'Laura', 'Pedro', 'Ana', 'Luis', 'Sofia', 'Diego', 'Valentina'];
        $apellidos = ['Gomez', 'Rodriguez', 'Lopez', 'Martinez', 'Gonzalez', 'Hernandez', 'Perez', 'Torres', 'Sanchez', 'Ramirez'];
        $countries = $modelo->getCountries();
        $documents = $modelo->getDocuments();
        $areas = $modelo->getAreas();
       

        for ($i = 0; $i < 75; $i++) {
            $data = [];
            $data['startDate']= date('Y-m-d');
            $data['firstLastName'] = $apellidos[array_rand($apellidos)];
            $data['secondLastName'] = $apellidos[array_rand($apellidos)];
            $data['otherName'] = "";
            $data['identification'] = $modelo->generateUniqueCode();
            $data['firstName'] = $nombres[array_rand($nombres)];
            $data['country']= $countries[array_rand($countries)];
            $data['document']=$documents[array_rand($documents)];
            $data['area']=$areas[array_rand($areas)];

            Employee::create($data);
        }
    }
}
