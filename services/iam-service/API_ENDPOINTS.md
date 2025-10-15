# IAM Service - API Endpoints Reference

Complete list of all available API endpoints in the IAM Service.

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.example.com`

## API Prefix

All endpoints are prefixed with: `/api/iam/v1`

---

## Health Check

### Check Service Health
- **Endpoint**: `GET /api/iam/v1/health`
- **Description**: Returns service health status
- **Authentication**: None
- **Response**: `200 OK`
```json
{
  "ok": true
}
```

---

## Authentication - Admin Users

### Admin Login
- **Endpoint**: `POST /api/iam/v1/auth/admins/login`
- **Description**: Authenticates an admin user and returns JWT cookie
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "hashedPassword"
}
```
- **Response**: `200 OK` + Sets admin session cookie
```json
{
  "ok": true,
  "timestamp": "2024-10-14T12:00:00Z",
  "requestId": "req-123",
  "data": {
    "authenticated": true,
    "message": "Authentication Successful.",
    "user": {
      "uid": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "admin@example.com"
    }
  }
}
```

### Admin Logout
- **Endpoint**: `POST /api/iam/v1/auth/admins/logout`
- **Description**: Logs out admin user by clearing session cookie
- **Authentication**: Required (Admin Cookie)
- **Response**: `200 OK`

### Admin Register
- **Endpoint**: `POST /api/iam/v1/auth/admins/register`
- **Description**: Registers a new admin user
- **Authentication**: None
- **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "admin@example.com",
  "password": "securePassword"
}
```

### Admin Verify Token
- **Endpoint**: `POST /api/iam/v1/auth/admins/verify`
- **Description**: Verifies if the admin JWT token is valid
- **Authentication**: Required (Admin Cookie)
- **Response**: Returns authenticated user information

### Admin Test Endpoint
- **Endpoint**: `POST /api/iam/v1/auth/admins/test`
- **Description**: Test endpoint with middleware and authentication
- **Authentication**: Required (Admin Cookie)

---

## Authentication - Partner Users

### Partner Login
- **Endpoint**: `POST /api/iam/v1/auth/partners/login`
- **Description**: Authenticates a partner user and returns JWT cookie
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "partner@example.com",
  "password": "hashedPassword"
}
```

### Partner Logout
- **Endpoint**: `POST /api/iam/v1/auth/partners/logout`
- **Description**: Logs out partner user by clearing session cookie
- **Authentication**: Required (Partner Cookie)

### Partner Register
- **Endpoint**: `POST /api/iam/v1/auth/partners/register`
- **Description**: Registers a new partner user
- **Authentication**: None

### Partner Verify Token
- **Endpoint**: `POST /api/iam/v1/auth/partners/verify`
- **Description**: Verifies if the partner JWT token is valid
- **Authentication**: Required (Partner Cookie)

---

## Admin User Management

### List Admin Users
- **Endpoint**: `GET /api/iam/v1/admins`
- **Description**: Retrieves list of all active admin users
- **Authentication**: Required (Admin Cookie)
- **Authorization**: Admin groups
- **Response**: Array of admin users

### Get Admin by Magic Link
- **Endpoint**: `GET /api/iam/v1/admins/magiclinks/:magiclink`
- **Description**: Retrieves admin user by magic link token
- **Authentication**: None
- **Parameters**:
  - `magiclink` (path) - Magic link token

### Create Admin User
- **Endpoint**: `POST /api/iam/v1/admins`
- **Description**: Creates a new admin user
- **Authentication**: Required (Admin Cookie)
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phoneNumber": "+1234567890"
}
```

### Activate Admin User
- **Endpoint**: `POST /api/iam/v1/admins/activate/:magiclink`
- **Description**: Activates admin account using magic link
- **Authentication**: None
- **Parameters**:
  - `magiclink` (path) - Magic link token
- **Request Body**:
```json
{
  "password": "securePassword"
}
```

### Update Admin User
- **Endpoint**: `PUT /api/iam/v1/admins/:uid`
- **Description**: Updates admin user information
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier
- **Request Body**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+1234567890"
}
```

### Update Admin User Groups
- **Endpoint**: `PUT /api/iam/v1/admins/:uid/groups`
- **Description**: Adds or updates groups for an admin user
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier
- **Request Body**:
```json
{
  "groups": ["Admin", "Manager"]
}
```

### Enable Admin User
- **Endpoint**: `POST /api/iam/v1/admins/:uid/enable`
- **Description**: Enables a disabled admin account
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

### Disable Admin User
- **Endpoint**: `POST /api/iam/v1/admins/:uid/disable`
- **Description**: Disables an admin account
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

### Hard Delete Admin User
- **Endpoint**: `DELETE /api/iam/v1/admins/:uid/delete/hard`
- **Description**: Permanently deletes an admin user from database
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

---

## Partner User Management

### List Partner Users
- **Endpoint**: `GET /api/iam/v1/partners`
- **Description**: Retrieves list of all partner users
- **Authentication**: Required (Admin Cookie)

### Get Partner User
- **Endpoint**: `GET /api/iam/v1/partners/:uid`
- **Description**: Retrieves a specific partner user by UID
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

### Create Partner User
- **Endpoint**: `POST /api/iam/v1/partners`
- **Description**: Creates a new partner user
- **Authentication**: Required (Admin Cookie)
- **Request Body**:
```json
{
  "firstName": "Partner",
  "lastName": "Name",
  "email": "partner@example.com",
  "groups": ["PartnerBasic"]
}
```

### Update Partner User
- **Endpoint**: `PUT /api/iam/v1/partners/:uid`
- **Description**: Updates partner user information
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

### Delete Partner User
- **Endpoint**: `DELETE /api/iam/v1/partners/:uid`
- **Description**: Deletes a partner user
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - User unique identifier

---

## Group Management

### List All Groups
- **Endpoint**: `GET /api/iam/v1/groups`
- **Description**: Retrieves all groups across all user types
- **Authentication**: Required (Admin Cookie)

### Create Group
- **Endpoint**: `POST /api/iam/v1/groups`
- **Description**: Creates a new group
- **Authentication**: Required (Admin Cookie)
- **Request Body**:
```json
{
  "name": "GroupName",
  "description": "Group description",
  "userType": "ADMIN",
  "permissions": "read,write,delete"
}
```

### List Admin Groups
- **Endpoint**: `GET /api/iam/v1/groups/admin`
- **Description**: Retrieves all admin-type groups
- **Authentication**: Required (Admin Cookie)

### Create Admin Group
- **Endpoint**: `POST /api/iam/v1/groups/admin`
- **Description**: Creates a new admin group
- **Authentication**: Required (Admin Cookie)

### List Partner Groups
- **Endpoint**: `GET /api/iam/v1/groups/partner`
- **Description**: Retrieves all partner-type groups
- **Authentication**: Required (Admin Cookie)

### Create Partner Group
- **Endpoint**: `POST /api/iam/v1/groups/partner`
- **Description**: Creates a new partner group
- **Authentication**: Required (Admin Cookie)

### Delete Group
- **Endpoint**: `DELETE /api/iam/v1/groups/:uid`
- **Description**: Deletes a group by UID
- **Authentication**: Required (Admin Cookie)
- **Parameters**:
  - `uid` (path) - Group unique identifier

---

## Common Response Structure

All API responses follow this structure:

```json
{
  "ok": true,
  "timestamp": "2024-10-14T12:00:00Z",
  "requestId": "req-unique-id",
  "data": { /* endpoint-specific data */ }
}
```

### Error Response Structure

```json
{
  "ok": false,
  "timestamp": "2024-10-14T12:00:00Z",
  "requestId": "req-unique-id",
  "error": {
    "code": 400,
    "message": "Error description",
    "details": {}
  }
}
```

---

## HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Headers

### Cookie-based Authentication

The service uses HTTP-only cookies for authentication:

- **Admin Cookie Name**: `admin_session` (configurable via `ADMIN_COOKIE_NAME`)
- **Partner Cookie Name**: `partner_session` (configurable via `PARTNER_COOKIE_NAME`)

Cookies are automatically set by the server upon successful login and should be sent with subsequent requests.

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All endpoints use JSON content type unless specified otherwise
3. Passwords should be properly hashed before sending to the server
4. Magic links expire after a configurable duration
5. Soft-deleted users can be restored; hard-deleted users are permanently removed
