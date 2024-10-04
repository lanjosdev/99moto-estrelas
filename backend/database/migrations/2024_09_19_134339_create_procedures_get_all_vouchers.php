<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared(
            'CREATE PROCEDURE GetAllVoucherCoordinates()
            BEGIN
                SELECT * 
                FROM vouchers_coordinates
                WHERE deleted_at IS NULL;
            END;'
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared(
            'DROP PROCEDURE IF EXISTS GetAllVoucherCoordinates;'
        );
    }
};