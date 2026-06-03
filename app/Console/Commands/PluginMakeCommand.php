<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PluginMakeCommand extends Command
{
    protected $signature = 'plugin:make {slug : Slug do plugin (ex: meu-plugin)}';

    protected $description = 'Gera estrutura de plugin (PHP + frontend Vite) a partir do starter';

    public function handle(): int
    {
        $slug = Str::slug((string) $this->argument('slug'));
        if ($slug === '') {
            $this->error('Slug inválido.');

            return self::FAILURE;
        }

        $starter = base_path('plugins/getfy-plugin-starter');
        $target = base_path('plugins/'.$slug);
        if (is_dir($target)) {
            $this->error("Já existe: plugins/{$slug}");

            return self::FAILURE;
        }
        if (! is_dir($starter)) {
            $this->error('Starter plugins/getfy-plugin-starter não encontrado.');

            return self::FAILURE;
        }

        File::copyDirectory($starter, $target);
        $this->replaceInTree($target, 'getfy-plugin-starter', $slug);
        $this->replaceInTree($target, 'Getfy Plugin Starter', Str::headline(str_replace('-', ' ', $slug)));
        $this->info("Plugin criado em plugins/{$slug}");
        $this->line('  1. Edite plugin.json e frontend/src/');
        $this->line('  2. cd plugins/'.$slug.'/frontend && npm install && npm run build');
        $this->line('  3. php artisan plugin:validate '.$slug);

        return self::SUCCESS;
    }

    private function replaceInTree(string $dir, string $search, string $replace): void
    {
        foreach (File::allFiles($dir) as $file) {
            $path = $file->getPathname();
            if (str_contains($path, 'node_modules') || str_contains($path, DIRECTORY_SEPARATOR.'dist'.DIRECTORY_SEPARATOR)) {
                continue;
            }
            $content = file_get_contents($path);
            if (is_string($content) && str_contains($content, $search)) {
                file_put_contents($path, str_replace($search, $replace, $content));
            }
        }
        foreach (File::directories($dir) as $sub) {
            if (basename($sub) === 'node_modules') {
                continue;
            }
            $newName = str_replace($search, $replace, basename($sub));
            if ($newName !== basename($sub)) {
                File::moveDirectory($sub, dirname($sub).DIRECTORY_SEPARATOR.$newName);
            }
        }
    }
}
