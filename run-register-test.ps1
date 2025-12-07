param()

Set-Location "C:/Users/USER/OneDrive/Desktop/PeerEdu_updated-ashraf/PeerEdu_updated-ashraf"

$env:NODE_ENV = 'development'
$proc = Start-Process -FilePath 'pnpm' -ArgumentList 'dev' -PassThru -RedirectStandardOutput dev-out.log -RedirectStandardError dev-err.log

try {
    $maxAttempts = 30
    for ($i = 0; $i -lt $maxAttempts; $i++) {
        try {
            Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing | Out-Null
            break
        } catch {
            Start-Sleep -Seconds 1
        }
    }

    $email = "cli-test-$([guid]::NewGuid().ToString())@example.com"
    $response = & curl.exe -s -D - -w "`n%{http_code}" -X POST http://localhost:3000/api/auth/register `
        -F "role=student" `
        -F "firstName=Test" `
        -F "middleName=Script" `
        -F "familyName=User" `
        -F "phone=+96812345678" `
        -F "email=$email" `
        -F "university=squ" `
        -F "yearOfStudy=study1" `
        -F "password=TestPass1!" `
        -F "confirmPassword=TestPass1!" `
        -F "agreeToTerms=true"

    Write-Output $response
}
finally {
    Stop-Process -Id $proc.Id -Force
    Remove-Item dev-out.log, dev-err.log -ErrorAction SilentlyContinue
}
