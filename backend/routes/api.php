<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('employee')->group(function () {
    Route::get('/{offset}/{orders}',[ EmployeeController::class, 'getEmployeesData']);
    Route::get('/',[ EmployeeController::class, 'getEmployeesData']);
    Route::post('/',[ EmployeeController::class, 'create']);
    Route::delete('/{id}',[ EmployeeController::class, 'delete']);
    Route::get('/{id}',[ EmployeeController::class, 'get']);
    Route::put('/{id}',[ EmployeeController::class, 'update']);
    Route::post('/criteria',[ EmployeeController::class, 'getEmployeesDataByCriteria']);
});
