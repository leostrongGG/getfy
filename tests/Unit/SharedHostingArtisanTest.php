<?php

namespace Tests\Unit;

use App\Support\SharedHostingArtisan;
use Exception;
use Tests\TestCase;

class SharedHostingArtisanTest extends TestCase
{
    public function test_humanize_migration_error_for_duplicate_table(): void
    {
        $msg = SharedHostingArtisan::humanizeMigrationError(
            new Exception('SQLSTATE[42S01]: Base table or view already exists')
        );

        $this->assertStringContainsString('já existe', $msg);
        $this->assertStringContainsString('migrations', $msg);
    }

    public function test_humanize_migration_error_for_access_denied(): void
    {
        $msg = SharedHostingArtisan::humanizeMigrationError(
            new Exception('SQLSTATE[HY000] [1045] Access denied for user')
        );

        $this->assertStringContainsString('Acesso negado', $msg);
    }

    public function test_humanize_migration_error_for_missing_vendor(): void
    {
        $msg = SharedHostingArtisan::humanizeMigrationError(
            new Exception('vendor/autoload.php não encontrado')
        );

        $this->assertStringContainsString('vendor', $msg);
    }
}
