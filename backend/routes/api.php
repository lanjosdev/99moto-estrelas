<?php

use App\Http\Controllers\UserCoordinatesController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\VoucherCoordinatesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//rotas do jogo
//pegar os voucher proximos a você
Route::get("/get-vouchers/{id}", [VoucherCoordinatesController::class, "getVouchers"]);

//cadastrar coordenadas users
Route::post("/coordenadas-users", [UserCoordinatesController::class, "coordinatesUsers"]);

//----------------------------------------------------------------------------------------

//inserir vouchers-coordenadas
Route::post("/insert-vouchers-coordinates", [VoucherCoordinatesController::class, "insertVoucherCoordinates"]);
//inserir vouchers-cupons
Route::post("/insert-vouchers-cupons", [VoucherController::class, "insertVoucherCupons"]);
//deletar coordenadas user
Route::delete("/delete-users/{id}", [UserCoordinatesController::class, "deleteCoordinatesUsers"]);