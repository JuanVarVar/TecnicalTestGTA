<?php

namespace App\Http\Controllers\API;

use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;
Use App\Models\Employee;
Use Log;

class EmployeeController extends Controller
{
      private $preloadData = 50;

      private $messages = [
        'exists' => 'Ese empleado no existe',
        'required' => 'El campo es obligatorio',
        'max' => 'Supero el numero de caracteres permitidos',
        'regex' => 'El campo solo debe contener elementos de la A a la Z sin incluir la ñ',
        'in' => 'El campo enviado no corresponde a los valores permitidos',
        'date' => 'El campo debe ser una fecha',
        'before_or_equal' => 'La fecha supera a la actual',
        'after' => 'La fecha es demasiado antigua',
      ];

      public function getEmployeesData($offset = "", $orders = ""){

        try{
          //Verificación de datos
          $ordersField = [];
          $offsetValue = str_replace(" ", "", $offset) != "" && 
          is_numeric($offset) && intval($offset) >= 0 ? intval($offset) : 0;

          if($orders != "") 
            $ordersField = explode(";", $orders);

          if(count($ordersField) == 1 && $ordersField[0] == 'none')
            $ordersField = [];

          //Consulta de datos

          $data = Employee::query()->orderBy('id');

          foreach ($ordersField as $field){
            if(existField($field))
              $data = $data->orderBy($field);
          }

          $output= $data->offset($offsetValue * $this->preloadData)->take($this->preloadData)->get();

          return $this->responseData($output->all(),'Busqueda completa','ninguno',true,200);
        }catch(\Exception $e){

          return $this->responseData([],'Ha ocurrido un error en el API',$e->getCode(),false,500);
            
        }
      }

      public function getEmployeesDataByCriteria(Request $request){
        //Verificación de datos
        
        try {
          $requestValidate = [
          'criteria' => 'required|max:50|regex:/^[a-zA-Z0-9\/áéíóúÁÉÍÓÚ\s]+$/'
          ];

          $messages2 = [
            'required' => 'El campo es obligatorio',
            'max' => 'Supero el numero de caracteres permitidos',
            'regex' => 'Estas colocando caracteres no permitidos',
          ];

          $validator = Validator::make($request ->all(),$requestValidate, $messages2);

          if($validator->fails()){
            return $this->responseData($validator->errors()->toArray(),'Validación Fallida','ninguno',false,403);
          }

          $ordersField = [];

          $criteria = str_replace(" ", "", $request['criteria'])  != "" ?  $request['criteria']: "";

          $offsetValue = str_replace(" ", "", $request['offset']) != "" && 
          is_numeric($request['offset']) ? intval($request['offset']) : 0;

          if($request['orders'] != "") 
            $ordersField = explode(";", $request['orders']);

          if(count($ordersField) == 1 && $ordersField[0] == 'none')
            $ordersField = [];

          //Consulta de datos
          $criteriaQuery = str_replace(" ", "%", $criteria);

          $modelo = new Employee();

          //Función de Modelo
          $data = $modelo->getDataByCriteria( $criteriaQuery );

          foreach ($ordersField as $field){
            if(existField($field))
              $data = $data->orderBy($field);
          }

          $output= $data->offset($offsetValue * $this->preloadData)->take($this->preloadData)->get();

          return $this->responseData($output->all(),'Busqueda completa','ninguno',true,200);
        }catch(\Exception $e){

          return $this->responseData([],'Ha ocurrido un error en el API',$e->getCode(),false,500);
            
        }
      }

      private function existField($string) {
       
        $modelo = new Employee();
        $fillableFields = $modelo->getFillable();

        if (in_array($string, $fillableFields->all())) {
            return true;
        } else {
            return false;
        }
    }
  
      private function responseData(array $array,string $messages,string $internalCode,bool $success,int $code){
          
        return response()->json([
          'data' => $array,
          'message' => $messages,
          'internalCode' => $internalCode,
          'success' => $success
        ], $code);
    }

      public function create(Request $request){
        
        $modelo = new Employee();
          
        try{

          $requestValidate = [
            'firstName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'firstLastName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'secondLastName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'otherName' => 'max:50|regex:/^[a-zA-Z]+$/',
            'country' => ['required', Rule::in($modelo->getCountries())],
            'document' => ['required', Rule::in($modelo->getDocuments())],
            'startDate' => [
                'required',
                'date',
                'before_or_equal:' .now()->format('Y-m-d'),
                'after:' .now()->subMonth()->format('Y-m-d'),
            ],
            'area' => ['required', Rule::in($modelo->getAreas())]
          ];

          $validator = Validator::make($request ->all(),$requestValidate, $this->messages);

          if($validator->fails()){
            return $this->responseData($validator->errors()->toArray(),'Validación Fallida','ninguno',false,403);
          }
          
          $usuario = Employee::create($request->all());
          
          return $this->responseData($usuario->toArray(),'Creación completa','ninguno',true,200);
        
        }catch(\Exception $e){

          return $this->responseData($request->all(),'Ha ocurrido un error en el API',$e->getCode(),false,500);
          
        }
        
      }
      
      public function delete($id){
        try{
          $request = new Request(['id'=> $id]);

          $requestValidate = [
            'id' => 'required|exists:employee,id',
          ];

          $validator = Validator::make($request ->all(),$requestValidate, $this->messages);

          if($validator->fails()){
            return $this->responseData($validator->errors()->toArray(),'Validación Fallida','ninguno',false,403);
          }

          $res = Employee::findOrFail($id);
          $response = $res->toArray();
          $res->delete();
          return $this->responseData($response->toArray(),'Eliminación completa','ninguno',true,200);
        
        }catch(\Exception $e){

          return $this->responseData([],'Ha ocurrido un error en el API',$e->getCode(),false,500);
            
        }
      
      }
  
      public function get($id){
       
        try{
          $request = new Request(['id'=> $id]);

          $requestValidate = [
            'id' => 'required|exists:employee,id',
          ];


          $validator = Validator::make($request ->all(),$requestValidate, $this->messages);

          if($validator->fails()){
            return $this->responseData($validator->errors()->toArray(),'Validación Fallida','ninguno',false,403);
          }

          $res = Employee::findOrFail($id);
          return $this->responseData($res->toArray(),'Busqueda completa','ninguno',true,200);
        
        }catch(\Exception $e){

          return $this->responseData([],'Ha ocurrido un error en el API',$e->getCode(),false,500);
            
        }
      }
  
      public function update($id,Request $request){

        $modelo = new Employee();
        $request = $request->merge(['id'=> $id]);
        
        try{
          $requestValidate = [
            'id' => 'required|exists:employee,id',
            'firstName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'firstLastName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'secondLastName' => 'required|max:20|regex:/^[a-zA-Z]+$/',
            'otherName' => 'max:50|regex:/^[a-zA-Z]+$/',
            'country' => ['required', Rule::in($modelo->getCountries())],
            'document' => ['required', Rule::in($modelo->getDocuments())],
            'startDate' => [
                'required',
                'date',
                'before_or_equal:' .now()->format('Y-m-d'),
                'after:' .now()->subMonth()->format('Y-m-d'),
            ],
            'area' => ['required', Rule::in($modelo->getAreas())]
          ];

       

          $validator = Validator::make($request ->all(),$requestValidate, $this->messages);

          if($validator->fails()){
            return $this->responseData($validator->errors()->toArray(),'Validación Fallida','ninguno',false,403);
          }

          $usuario = $modelo->updateValues($request->all());
  
          return $this->responseData($usuario->toArray(),'Actualización completa','ninguno',true,200);
        
        }catch(\Exception $e){

          return $this->responseData($request->all(),'Ha ocurrido un error en el API',$e->getCode(),false,500);
            
        }
      }

     
}
