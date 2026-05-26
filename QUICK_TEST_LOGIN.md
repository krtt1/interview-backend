# 🚀 Quick Test - Login API

## Test User Credentials
- **ID**: `0123456789123`
- **Password**: `1234`

## Test with cURL (Windows PowerShell)
```powershell
$body = @{
    id = "0123456789123"
    password = "1234"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3011/api/employees/login" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

## Test with cURL (Command Line)
```bash
curl -X POST http://localhost:3011/api/employees/login \
  -H "Content-Type: application/json" \
  -d "{\"id\":\"0123456789123\",\"password\":\"1234\"}"
```

## Test with Postman
1. Create new POST request
2. URL: `http://localhost:3011/api/employees/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "id": "0123456789123",
  "password": "1234"
}
```
5. Click Send

## Expected Success Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAxMjM0NTY3ODkxMjMiLCJyb2xlIjoidXNlciIsImlhdCI6MTcxNjc3NzAwMCwiZXhwIjoxNzE2ODYzNDAwfQ.xxx",
  "user": {
    "id": "0123456789123",
    "role": "user",
    "name": "ทดสอบ"
  }
}
```

## Error Responses

### Missing Credentials (400)
```json
{
  "message": "กรุณากรอก id และ password",
  "required": ["id", "password"]
}
```

### Invalid Credentials (401)
```json
{
  "message": "รหัสผ่านไม่ถูกต้อง"
}
```

### User Not Found (404)
```json
{
  "message": "ไม่พบผู้ใช้งาน"
}
```

## Using the Token

Once you have the token, use it in subsequent requests:

```bash
curl -X GET http://localhost:3011/api/employees/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Endpoints to Test

### Public (No Auth Required)
- `POST /api/employees/login` - Login
- `GET /api/employees/public/all` - Get all employees
- `GET /api/employees/public/summary` - Get summary

### Protected (Requires Token)
- `GET /api/employees/summary` - Get summary (authenticated)
- `GET /api/employees/filter/job-group?job_group_id=1` - Filter by job group
- `GET /api/employees/:id` - Get employee details

---

**Status**: Ready to test! 🎯
