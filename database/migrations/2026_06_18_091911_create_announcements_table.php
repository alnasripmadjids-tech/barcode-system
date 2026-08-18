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
        Schema::table('announcements', function (Blueprint $table) {
            $table->text('message')->after('id');
            $table->unsignedInteger('recipients_count')->default(0)->after('message');
            $table->string('status')->default('pending')->after('recipients_count');
            $table->timestamp('sent_at')->nullable()->after('status');
            $table->foreignId('created_by')
                ->nullable()
                ->after('sent_at')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'message',
                'recipients_count',
                'status',
                'sent_at',
                'created_by',
            ]);
        });
    }
};
