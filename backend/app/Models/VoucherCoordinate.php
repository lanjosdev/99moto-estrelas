<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VoucherCoordinate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['latitudine_1', 'longitudine_1', 'qtn_recovered_voucher','custom_3', 'custom_4', 'custom_5'];
    protected $table = "vouchers_coordinates";
    protected $dates = ['deleted_at'];


    public function rulesCoordinatesVouchers()
    {
        return [
            'latitudine_1' => "required",
            'longitudine_1' => "required",
            'qtn_recovered_voucher' => 'integer'
        ];
    }

    public function feedbackCoordinatesVouchers()
    {
        return [
            'latitudine_1.required' => "Campo é obrigátorio.",
            'longitudine_1.required' => "Campo é obrigátorio.",
            'qtn_recovered_voucher.integer' => 'Valido apenas valores inteiro.',
        ];
    }
}