# API Examples - Partner Service

This document provides practical examples for all API endpoints in the Partner Service.

**Base URL**: `http://localhost:3002` (development) or `https://api.pulcherbook.com` (production)

**All examples use cURL**. Responses are formatted for readability.

---

## Partners

### Create a Partner

```bash
curl -X POST http://localhost:3002/api/v1/partners \
  -H "Content-Type: application/json" \
  -d '{
    "owner_user_id": "user_123",
    "company_name": "Bella Beauty Salon",
    "description": "Premium beauty and wellness services",
    "address": "123 Main Street",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postal_code": "94102",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "phone": "+1-415-555-0100",
    "email": "contact@bellasalon.com",
    "website": "https://bellasalon.com"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_abc123",
  "data": {
    "id": "1",
    "owner_user_id": "user_123",
    "company_name": "Bella Beauty Salon",
    "description": "Premium beauty and wellness services",
    "address": "123 Main Street",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "postal_code": "94102",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "phone": "+1-415-555-0100",
    "email": "contact@bellasalon.com",
    "website": "https://bellasalon.com",
    "status": "ACTIVE",
    "created_at": "2024-11-04T10:30:00.000Z",
    "updated_at": "2024-11-04T10:30:00.000Z"
  }
}
```

### Get Partner by ID

```bash
curl http://localhost:3002/api/v1/partners/1
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_def456",
  "data": {
    "id": "1",
    "company_name": "Bella Beauty Salon",
    "teams": [
      {
        "id": "1",
        "name": "Downtown Team",
        "status": "ACTIVE"
      }
    ],
    "services": [
      {
        "id": "1",
        "name": "Haircut",
        "price": 50.00,
        "duration_minutes": 60
      }
    ]
  }
}
```

### Search Partners by Location

```bash
curl "http://localhost:3002/api/v1/partners/search?latitude=37.7749&longitude=-122.4194&radius=10"
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_ghi789",
  "data": [
    {
      "id": "1",
      "company_name": "Bella Beauty Salon",
      "city": "San Francisco",
      "distance": 2.5
    },
    {
      "id": "2",
      "company_name": "Urban Spa",
      "city": "San Francisco",
      "distance": 5.2
    }
  ]
}
```

### Update Partner

```bash
curl -X PUT http://localhost:3002/api/v1/partners/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Award-winning beauty and wellness services",
    "phone": "+1-415-555-0101"
  }'
```

### Delete Partner (Soft Delete)

```bash
curl -X DELETE http://localhost:3002/api/v1/partners/1
```

---

## Teams

### Create a Team

```bash
curl -X POST http://localhost:3002/api/v1/teams \
  -H "Content-Type: application/json" \
  -d '{
    "partner_id": "1",
    "name": "Downtown Team",
    "description": "Main team for downtown location"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_team123",
  "data": {
    "id": "1",
    "partner_id": "1",
    "name": "Downtown Team",
    "description": "Main team for downtown location",
    "status": "ACTIVE",
    "created_at": "2024-11-04T10:35:00.000Z",
    "updated_at": "2024-11-04T10:35:00.000Z"
  }
}
```

### Get All Teams

```bash
curl http://localhost:3002/api/v1/teams
```

### Get Team by ID

```bash
curl http://localhost:3002/api/v1/teams/1
```

---

## Team Members

### Add Member to Team

```bash
curl -X POST http://localhost:3002/api/v1/team-members \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "1",
    "user_id": "user_456",
    "role": "stylist"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_member123",
  "data": {
    "id": "1",
    "team_id": "1",
    "user_id": "user_456",
    "role": "stylist",
    "joined_at": "2024-11-04T10:40:00.000Z",
    "created_at": "2024-11-04T10:40:00.000Z",
    "updated_at": "2024-11-04T10:40:00.000Z"
  }
}
```

### Get Team Member's Upcoming Appointments

```bash
curl http://localhost:3002/api/v1/team-members/1/appointments
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_appts123",
  "data": [
    {
      "id": "1",
      "customer_user_id": "user_789",
      "appointment_date": "2024-11-10",
      "start_time": "14:00",
      "end_time": "15:00",
      "status": "CONFIRMED",
      "service": {
        "id": "1",
        "name": "Haircut"
      }
    }
  ]
}
```

---

## Services

### Create a Service

```bash
curl -X POST http://localhost:3002/api/v1/services \
  -H "Content-Type: application/json" \
  -d '{
    "partner_id": "1",
    "name": "Haircut",
    "description": "Professional haircut and styling",
    "duration_minutes": 60,
    "price": 50.00,
    "currency": "USD"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_service123",
  "data": {
    "id": "1",
    "partner_id": "1",
    "name": "Haircut",
    "description": "Professional haircut and styling",
    "duration_minutes": 60,
    "price": 50.00,
    "currency": "USD",
    "status": "ACTIVE",
    "created_at": "2024-11-04T10:45:00.000Z",
    "updated_at": "2024-11-04T10:45:00.000Z"
  }
}
```

### Get All Services

```bash
curl http://localhost:3002/api/v1/services
```

---

## Team Services (Assignments)

### Assign Service to Team

```bash
curl -X POST http://localhost:3002/api/v1/team-services \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "1",
    "service_id": "1"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_assign123",
  "data": {
    "id": "1",
    "team_id": "1",
    "service_id": "1",
    "created_at": "2024-11-04T10:50:00.000Z"
  }
}
```

---

## Company Media

### Add Company Media

```bash
curl -X POST http://localhost:3002/api/v1/company-media \
  -H "Content-Type: application/json" \
  -d '{
    "partner_id": "1",
    "url": "https://cdn.example.com/logo.png",
    "type": "LOGO",
    "display_order": 0,
    "alt_text": "Bella Beauty Salon Logo"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_media123",
  "data": {
    "id": "1",
    "partner_id": "1",
    "url": "https://cdn.example.com/logo.png",
    "type": "LOGO",
    "display_order": 0,
    "alt_text": "Bella Beauty Salon Logo",
    "created_at": "2024-11-04T10:55:00.000Z",
    "updated_at": "2024-11-04T10:55:00.000Z"
  }
}
```

---

## Appointments

### Book an Appointment

```bash
curl -X POST http://localhost:3002/api/v1/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customer_user_id": "user_789",
    "team_member_id": "1",
    "service_id": "1",
    "appointment_date": "2024-11-10",
    "start_time": "14:00",
    "duration_minutes": 60,
    "customer_notes": "Please use organic products"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_appt123",
  "data": {
    "id": "1",
    "customer_user_id": "user_789",
    "team_member_id": "1",
    "service_id": "1",
    "appointment_date": "2024-11-10",
    "start_time": "14:00",
    "end_time": "15:00",
    "duration_minutes": 60,
    "status": "PENDING",
    "customer_notes": "Please use organic products",
    "created_at": "2024-11-04T11:00:00.000Z",
    "updated_at": "2024-11-04T11:00:00.000Z"
  }
}
```

### Check Availability Before Booking

```bash
curl -X POST http://localhost:3002/api/v1/appointments/check-availability \
  -H "Content-Type: application/json" \
  -d '{
    "team_member_id": "1",
    "appointment_date": "2024-11-10",
    "duration_minutes": 60
  }'
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_check123",
  "data": {
    "available": true,
    "message": "Team member is available for the requested time"
  }
}
```

### Update Appointment Status

```bash
curl -X PATCH http://localhost:3002/api/v1/appointments/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CONFIRMED"
  }'
```

### Cancel Appointment

```bash
curl -X PATCH http://localhost:3002/api/v1/appointments/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CANCELLED",
    "cancellation_reason": "Customer requested reschedule"
  }'
```

---

## Availability

### Create Recurring Availability (Weekly Schedule)

```bash
curl -X POST http://localhost:3002/api/v1/availability \
  -H "Content-Type: application/json" \
  -d '{
    "team_member_id": "1",
    "is_recurring": true,
    "day_of_week": 1,
    "start_time": "09:00",
    "end_time": "17:00"
  }'
```

**Response** (201 Created):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_avail123",
  "data": {
    "id": "1",
    "team_member_id": "1",
    "is_recurring": true,
    "day_of_week": 1,
    "specific_date": null,
    "start_time": "09:00",
    "end_time": "17:00",
    "created_at": "2024-11-04T11:05:00.000Z",
    "updated_at": "2024-11-04T11:05:00.000Z"
  }
}
```

**Note**: `day_of_week` values: 0 = Sunday, 1 = Monday, ..., 6 = Saturday

### Create One-Time Availability (Specific Date)

```bash
curl -X POST http://localhost:3002/api/v1/availability \
  -H "Content-Type: application/json" \
  -d '{
    "team_member_id": "1",
    "is_recurring": false,
    "specific_date": "2024-11-25",
    "start_time": "10:00",
    "end_time": "14:00"
  }'
```

### Get Available Time Slots

```bash
curl "http://localhost:3002/api/v1/availability/slots?team_member_id=1&date=2024-11-10&service_id=1"
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_slots123",
  "data": [
    {
      "start_time": "09:00",
      "end_time": "10:00",
      "available": true
    },
    {
      "start_time": "10:00",
      "end_time": "11:00",
      "available": true
    },
    {
      "start_time": "14:00",
      "end_time": "15:00",
      "available": false
    },
    {
      "start_time": "15:00",
      "end_time": "16:00",
      "available": true
    }
  ]
}
```

### Get Partner Availability Tree

```bash
curl http://localhost:3002/api/v1/partners/1/availability
```

**Response** (200 OK):
```json
{
  "ok": true,
  "timestamp": 1699123456789,
  "requestId": "req_tree123",
  "data": {
    "partner_id": "1",
    "partner_name": "Bella Beauty Salon",
    "teams": [
      {
        "team_id": "1",
        "team_name": "Downtown Team",
        "members": [
          {
            "member_id": "1",
            "user_id": "user_456",
            "role": "stylist",
            "availability": [
              {
                "id": "1",
                "day_of_week": 1,
                "start_time": "09:00",
                "end_time": "17:00",
                "is_recurring": true
              },
              {
                "id": "2",
                "day_of_week": 2,
                "start_time": "09:00",
                "end_time": "17:00",
                "is_recurring": true
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Health Check

### Check Service Health

```bash
curl http://localhost:3002/health
```

**Response** (200 OK):
```json
{
  "status": "ok",
  "service": "partner-service",
  "timestamp": "2024-11-04T11:10:00.000Z"
}
```

---

## Error Examples

### 404 Not Found

```bash
curl http://localhost:3002/api/v1/partners/999
```

**Response** (404):
```json
{
  "ok": false,
  "timestamp": 1699123456789,
  "requestId": "req_err404",
  "error": "Partner not found"
}
```

### 400 Bad Request (Missing Required Field)

```bash
curl -X POST http://localhost:3002/api/v1/partners \
  -H "Content-Type: application/json" \
  -d '{
    "owner_user_id": "user_123"
  }'
```

**Response** (400):
```json
{
  "ok": false,
  "timestamp": 1699123456789,
  "requestId": "req_err400",
  "error": "Missing required field: company_name"
}
```

### 409 Conflict (Duplicate Entry)

```bash
curl -X POST http://localhost:3002/api/v1/team-members \
  -H "Content-Type: application/json" \
  -d '{
    "team_id": "1",
    "user_id": "user_456"
  }'
```

**Response** (409):
```json
{
  "ok": false,
  "timestamp": 1699123456789,
  "requestId": "req_err409",
  "error": "Team member already exists in this team"
}
```

---

## Testing with Swagger UI

All endpoints are documented and testable in Swagger UI:

**URL**: http://localhost:3002/api-docs

Swagger UI provides:
- Interactive API testing
- Request/response schema documentation
- Example values
- Real-time validation

---

## Common Workflow Examples

### Complete Booking Flow

1. **Search for nearby partners**
2. **Get partner details with services**
3. **Check team member availability**
4. **Get available time slots**
5. **Book appointment**
6. **Confirm appointment**

### Partner Setup Flow

1. **Create partner**
2. **Create team**
3. **Add team members**
4. **Create services**
5. **Assign services to team**
6. **Add company media**
7. **Set team member availability**

---

## Notes

- All timestamps are in ISO 8601 format
- All dates use YYYY-MM-DD format
- All times use HH:MM format (24-hour)
- All IDs are strings (even though stored as bigint)
- All prices are decimal numbers
- Request IDs are unique per request for debugging
