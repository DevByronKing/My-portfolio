# ==========================================
# KIT DE REPARO DE ESTILO ASTRO + TAILWIND
# ==========================================
$ErrorActionPreference = "Stop"

Write-Host ">>> Iniciando reparo dos arquivos de configuração..." -ForegroundColor Cyan

# 1. Configurar astro.config.mjs (Garante que o Tailwind está ativo)
$astroConfig = @"
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
});
"@
Set-Content -Path "astro.config.mjs" -Value $astroConfig
Write-Host "[OK] astro.config.mjs corrigido." -ForegroundColor Green

# 2. Configurar tailwind.config.mjs (Garante que ele acha os arquivos)
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...defaultTheme.fontFamily.sans],
				serif: ["Lora", ...defaultTheme.fontFamily.serif],
			},
            colors: {
                'void': '#050505',
            }
		},
	},
	plugins: [],
}
"@
Set-Content -Path "tailwind.config.mjs" -Value $tailwindConfig
Write-Host "[OK] tailwind.config.mjs corrigido." -ForegroundColor Green

# 3. Garantir que a pasta Styles existe e criar o CSS Global
if (-not (Test-Path "src\styles")) { New-Item -ItemType Directory -Path "src\styles" -Force }

$cssContent = @"
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Reseta os links azuis feios */
  a {
    text-decoration: none;
    color: inherit;
  }
  
  /* Força fundo escuro */
  body {
    background-color: #050505;
    color: #e2e8f0;
    font-family: 'Inter', sans-serif;
  }
}
"@
Set-Content -Path "src\styles\global.css" -Value $cssContent
Write-Host "[OK] src/styles/global.css recriado." -ForegroundColor Green

# 4. Corrigir o BaseLayout para importar o CSS corretamente
$layoutContent = @"
---
import '@fontsource/lora/400.css';
import '@fontsource/lora/600.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '../styles/global.css';

const { title } = Astro.props;
---

<html lang=""pt-br"" class=""scroll-smooth"">
  <head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width"" />
    <title>{title}</title>
  </head>
  <body class=""bg-[#050505] min-h-screen relative overflow-x-hidden"">
    
    <!-- Grid Tecnológico de Fundo -->
    <div class=""fixed inset-0 z-[-1] pointer-events-none opacity-20"">
        <div class=""absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]""></div>
        <div class=""absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent""></div>
    </div>

    <!-- Conteúdo Centralizado -->
    <div class=""max-w-4xl mx-auto px-6 py-12 relative z-10"">
      <slot />
    </div>

  </body>
</html>
"@
Set-Content -Path "src\layouts\BaseLayout.astro" -Value $layoutContent
Write-Host "[OK] src/layouts/BaseLayout.astro corrigido." -ForegroundColor Green

# 5. Limpar cache do Vite para forçar atualização
if (Test-Path "node_modules\.vite") { 
    Remove-Item "node_modules\.vite" -Recurse -Force 
    Write-Host "[OK] Cache limpo." -ForegroundColor Green
}

Write-Host ">>> REPARO CONCLUÍDO! Tente rodar 'npm run dev' agora." -ForegroundColor Cyan