<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\SoftDeletes;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('participation', function (Blueprint $table) {
            $table->id();
            $table->string('user_participation_latitudine', 255);
            $table->string('user_participation_longitudine', 255);
            $table->unsignedBigInteger('voucher_id')->nullable();
            $table->boolean('recovered_voucher')->default(value: 0);
            $table->boolean('promotional_area')->nullable();
            $table->string('start_participation');
            $table->string('end_participation')->default(value:0);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participation');
    }
};