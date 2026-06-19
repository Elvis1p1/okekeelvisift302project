param(
    [string]$RemoteUrl = "https://github.com/Elvis1p1/okekeelvisift302project.git",
    [string]$CommitMsg = "chore: publish ebook library"
)

Write-Host "Running push-to-github helper from: $(Get-Location)"

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "\nGit was not found on this machine. Please install Git for Windows:\nhttps://git-scm.com/download/win\nThen re-open PowerShell and run this script again.\n" -ForegroundColor Yellow
    exit 1
}

# Ensure script runs from repository folder (script's location)
$scriptPath = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
if ($scriptPath) { Set-Location $scriptPath }

# Initialize repo if needed
if (!(Test-Path ".git")) {
    Write-Host "Initializing git repository..."
    git init
    git branch -M main
}

# Configure user details if missing
$uname = git config user.name
$uemail = git config user.email
if (-not $uname -or -not $uemail) {
    Write-Host "Git user.name or user.email not set. You can set them with:\n  git config --global user.name \"Your Name\"\n  git config --global user.email \"you@example.com\"\n" -ForegroundColor Yellow
}

# Add and commit
Write-Host "Staging files..."
git add .
$st = git status --porcelain
if ($st) {
    Write-Host "Committing changes..."
    git commit -m "$CommitMsg"
} else {
    Write-Host "No changes to commit."
}

# Add remote if missing
$remotes = git remote
if (-not ($remotes -contains "origin")) {
    Write-Host "Adding remote origin: $RemoteUrl"
    git remote add origin $RemoteUrl
} else {
    Write-Host "Remote 'origin' already configured."
}

Write-Host "Attempting to push to origin main. You may be prompted to authenticate."
try {
    git push -u origin main
} catch {
    Write-Host "Push failed. Common causes:\n - Authentication required (use a personal access token for HTTPS or configure SSH keys)\n - Remote branch name conflicts\nCheck the output above for details." -ForegroundColor Red
    exit 1
}

Write-Host "Done. If push succeeded, check the repository on GitHub."
