<?php

namespace App\Models;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class Employee extends Model
{
     protected $table = 'employee';

    protected $fillable = [
        'firstName',
        'firstLastName',
        'secondLastName',
        'otherName',
        'country',
        'document',
        'identification',
        'area',
        'email',
        'startDate',
        'status',
    ];

    public function getCountries()
    {
        return ['Colombia', 'Estados Unidos'];
    }

    public function getDocuments()
    {
        return ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Permiso Especial'];
    }

    public function getAreas()
    {
        return ['Administración', 'Financiera', 'Compras', 'Infraestructura', 'Operación', 'Talento Humano', 'Servicios Varios'];
    }

    public static function create(array $attributes)
    {
        $data=[];
        
        $data['firstName'] = $attributes['firstName'];
        $data['firstLastName'] = $attributes['firstLastName'];
        $data['secondLastName'] = $attributes['secondLastName'];
        $data['otherName'] = $attributes['otherName'];
        $data['area'] = $attributes['area'];
        $data['identification'] = $attributes['identification'];
        $data['country'] = $attributes['country'];
        $data['document'] = $attributes['document'];
        $data['startDate'] = $attributes['startDate'];
        $data['status'] = true; 

        $firstLastName = $data['firstLastName'];
        $firstName = $data['firstName'];
      
        $email = strtolower(str_replace(' ', '', $firstName)) . '.' . strtolower(str_replace(' ', '', $firstLastName));

        $findId = static::latest('id')->first();
        $id = 1;

        if($findId){
            $id = $findId->id + 1;
        }

        if ($data['country'] == 'Colombia') {
            $emailExist = $email.'@global.com.co';
            $existe = static::where('email', $emailExist)->first();
            $email = ($existe) ? $email.'.'. $id . '@global.com.co':  $emailExist;
        } else {
            $emailExist = $email.'@global.com.us';
            $existe = static::where('email', $emailExist)->first();
            $email = ($existe) ? $email.'.'. $id . '@global.com.us':  $emailExist;
        }

        $data['email'] = str_replace(' ', '', $email);
          
        $employee = static::query()->create($data);

        return $employee;
    }

    
    public static function updateValues(array $attributes)
    {
       
        $data=[];
        $employee = self::find($attributes['id']);
        $id = $attributes['id'];
        
        $data['firstName'] = $attributes['firstName'];
        $data['firstLastName'] = $attributes['firstLastName'];
        $data['secondLastName'] = $attributes['secondLastName'];
        $data['otherName'] = $attributes['otherName'];
        $data['identification'] = $attributes['identification'];
        $data['area'] = $attributes['area'];
        $data['country'] = $attributes['country'];
        $data['document'] = $attributes['document'];

        $firstLastName = $data['firstLastName'];
        $firstName = $data['firstName'];
      
        $email = strtolower(str_replace(' ', '', $firstName)) . '.' . strtolower(str_replace(' ', '', $firstLastName));

        if ($data['country'] == 'Colombia') {
            $emailExist = $email.'@global.com.co';
            $existe = static::where('email', $emailExist)->first();
            $email = ($existe) ? $email.'.'. $id . '@global.com.co':  $emailExist;
        } else {
            $emailExist = $email.'@global.com.us';
            $existe = static::where('email', $emailExist)->first();
            $email = ($existe) ? $email.'.'. $id . '@global.com.us':  $emailExist;
        }

        $data['email'] = str_replace(' ', '', $email);
          
        $employee->update($data);

        return $employee;
    }


    public static function generateUniqueCode()
    {
        $code = Str::random(20);
        while (self::where('identification', $code)->exists()) {
            $code = Str::random(20);
        }
        return $code;
    }

    public function getDataByCriteria($criteria)
    {

        $patron = '/^\d{4}-\d{2}-\d{2}$/';

        return $this->where('firstName', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('firstLastName', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('secondLastName', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('otherName', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('country', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('document', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('identification', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('area', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('email', 'LIKE', '%' . $criteria . '%')
                    ->orWhere('startDate', '==',  (preg_match($patron, $criteria) ? $criteria : "0000-00-00"))
                    ->orWhere('status', '==',  ($criteria == "Activo" ? 1 : ($criteria == "Inactivo" ? 0 : "") ));
                    
    }

    public function getStartDateAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y H:i:s');
    }

    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y H:i:s');
    }
    
    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d/m/Y H:i:s');
    }

}
