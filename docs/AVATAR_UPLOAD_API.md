# Avatar Upload API Documentation

## Endpoint

```
POST /v1/profile/avatar
```

## Authentication

Requires JWT Bearer token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Request

**Content-Type:** `multipart/form-data`

### Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| avatar | File | Yes | Avatar image file |

### File Constraints

- **Max Size:** 5MB
- **Allowed Formats:** JPG, JPEG, PNG, WEBP
- **Field Name:** `avatar`

## Response

### Success (200 OK)

Returns the updated user object:

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "name": "User Name",
  "phone": "081234567890",
  "avatar_url": "/uploads/avatars/abc123def456.jpg",
  "style_preferences": ["pref-id-1", "pref-id-2"]
}
```

### Error Responses

**400 Bad Request - No file uploaded**
```json
{
  "statusCode": 400,
  "message": "No file uploaded"
}
```

**400 Bad Request - Invalid file type**
```json
{
  "statusCode": 400,
  "message": "Only JPG, PNG, or WEBP files are allowed"
}
```

**400 Bad Request - File too large**
```json
{
  "statusCode": 400,
  "message": "File size must be less than 5MB"
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:8080/v1/profile/avatar \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "avatar=@/path/to/your/avatar.jpg"
```

### JavaScript (Fetch API)

```javascript
const formData = new FormData();
formData.append('avatar', fileInput.files[0]);

const response = await fetch('http://localhost:8080/v1/profile/avatar', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwtToken}`
  },
  body: formData
});

const user = await response.json();
console.log('New avatar URL:', user.avatar_url);
```

### TypeScript (Axios)

```typescript
import axios from 'axios';

const uploadAvatar = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await axios.post(
    'http://localhost:8080/v1/profile/avatar',
    formData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};
```

## Storage

### Development
- Files are stored locally in: `/uploads/avatars/`
- Accessible via: `http://localhost:8080/uploads/avatars/<filename>`

### Production (Docker)
- Files are stored in: `/app/uploads/avatars/`
- **Note:** For production, consider using:
  - AWS S3
  - Cloudinary
  - Other CDN services
  
  To implement cloud storage, modify the `uploadAvatar` method in `src/profile/profile.service.ts`.

## Testing with Swagger UI

1. Navigate to: `http://localhost:8080/api`
2. Click the "Authorize" button and enter your JWT token
3. Find the `POST /v1/profile/avatar` endpoint
4. Click "Try it out"
5. Select an image file
6. Click "Execute"
