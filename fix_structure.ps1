# ==========================================
# SCRIPT DE CORREÇÃO DE ESTRUTURA ASTRO
# Autor: Gemini (Para Portfólio Data Science)
# ==========================================

# 1. Definições
$subfolderName = "visible-velocity" # O nome da pasta interna que vimos no print
$currentDir = Get-Location

Write-Host ">>> Iniciando reorganização do projeto..." -ForegroundColor Cyan

# 2. Verificação de Segurança
if (-not (Test-Path $subfolderName)) {
    Write-Error "A pasta '$subfolderName' não foi encontrada. Verifique se você está na raiz 'MY-PORTFOLIO'."
    exit
}

# 3. Limpeza Preventiva da Raiz
# Removemos node_modules da raiz para evitar conflitos de merge e arquivos travados
if (Test-Path "node_modules") {
    Write-Host "-> Removendo node_modules antigo da raiz..." -ForegroundColor Yellow
    Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") { Remove-Item "package-lock.json" -Force }

# 4. Movendo os Arquivos (O "Move" Operation)
Write-Host "-> Movendo arquivos de '$subfolderName' para a raiz..." -ForegroundColor Yellow

$files = Get-ChildItem -Path $subfolderName

foreach ($file in $files) {
    $destination = Join-Path $currentDir $file.Name
    
    # Se o arquivo já existir na raiz (ex: README.md), ele será substituído pela versão correta
    if (Test-Path $destination) {
        Remove-Item $destination -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Move-Item -Path $file.FullName -Destination $currentDir -Force
}

# 5. Limpeza Final
Write-Host "-> Removendo a pasta vazia..." -ForegroundColor Yellow
Remove-Item $subfolderName -Recurse -Force

# 6. Reinstalação Limpa (Clean Install)
Write-Host "-> Instalando dependências (Isso pode demorar um pouco)..." -ForegroundColor Cyan
npm install

Write-Host "==========================================" -ForegroundColor Green
Write-Host "SUCESSO! Estrutura corrigida." -ForegroundColor Green
Write-Host "Agora rode: npm run dev" -ForegroundColor Green
Write-Host "=========================================="