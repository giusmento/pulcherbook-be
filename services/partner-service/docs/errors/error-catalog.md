# Error Catalog - Partner Service

This document describes all error scenarios for the Partner Service.

All errors use the MangoJS `errors.APIError` class from `@giusmento/mangojs-core` for consistent error handling and response formatting.

## HTTP 400 - Bad Request

| HTTP Error Code | Error Code               | Error Name              | Message                                         | Cause                                   | Resolution                             |
| --------------- | ------------------------ | ----------------------- | ----------------------------------------------- | --------------------------------------- | -------------------------------------- |
| 400             | ERR_INVALID_REQUEST      | Invalid Request Body    | "Invalid request body"                          | Missing required fields or invalid data | Verify all required fields are present |
| 400             | ERR_DUPLICATE_ENTRY      | Duplicate Entry         | "Team member already exists in this team"       | User already in team                    | Check team membership before adding    |
| 400             | ERR_DUPLICATE_ENTRY      | Duplicate Entry         | "Service already assigned to team"              | Service already assigned to team        | Check team services before assigning   |
| 400             | ERR_INVALID_AVAILABILITY | Invalid Availability    | "Either day_of_week or specific_date must be set" | Missing recurring or one-time schedule | Set day_of_week or specific_date     |
| 400             | ERR_INVALID_TIME_RANGE   | Invalid Time Range      | "End time must be after start time"             | End time before start time              | Ensure end_time is after start_time    |
| 400             | ERR_APPOINTMENT_CONFLICT | Appointment Conflict    | "Time slot not available"                       | Team member already booked              | Check availability before booking      |
| 400             | ERR_INVALID_GEOLOCATION  | Invalid Geolocation     | "Invalid latitude/longitude"                    | Coordinates out of range                | Lat: -90 to 90, Lon: -180 to 180       |

## HTTP 404 - Not Found

| HTTP Error Code | Error Code                 | Error Name              | Message                           | Cause                  | Resolution            |
| --------------- | -------------------------- | ----------------------- | --------------------------------- | ---------------------- | --------------------- |
| 404             | ERR_PARTNER_NOT_FOUND      | Partner Not Found       | "Partner not found"               | Invalid partner ID     | Verify partner ID     |
| 404             | ERR_TEAM_NOT_FOUND         | Team Not Found          | "Team not found"                  | Invalid team ID        | Verify team ID        |
| 404             | ERR_MEMBER_NOT_FOUND       | Team Member Not Found   | "Team member not found"           | Invalid team member ID | Verify team member ID |
| 404             | ERR_SERVICE_NOT_FOUND      | Service Not Found       | "Service not found"               | Invalid service ID     | Verify service ID     |
| 404             | ERR_APPOINTMENT_NOT_FOUND  | Appointment Not Found   | "Appointment not found"           | Invalid appointment ID | Verify appointment ID |
| 404             | ERR_AVAILABILITY_NOT_FOUND | Availability Not Found  | "Availability schedule not found" | Invalid availability ID | Verify availability ID |
| 404             | ERR_MEDIA_NOT_FOUND        | Media Not Found         | "Media not found"                 | Invalid media ID       | Verify media ID       |

## HTTP 403 - Forbidden

| HTTP Error Code | Error Code       | Error Name   | Message        | Cause                                | Resolution                          |
| --------------- | ---------------- | ------------ | -------------- | ------------------------------------ | ----------------------------------- |
| 403             | ERR_UNAUTHORIZED | Unauthorized | "Unauthorized" | User lacks permission                | Authenticate with valid credentials |
| 403             | ERR_FORBIDDEN    | Forbidden    | "Forbidden"    | User accessing unauthorized resource | Access only own resources           |

## HTTP 409 - Conflict

| HTTP Error Code | Error Code            | Error Name        | Message            | Cause                          | Resolution              |
| --------------- | --------------------- | ----------------- | ------------------ | ------------------------------ | ----------------------- |
| 409             | ERR_RESOURCE_CONFLICT | Resource Conflict | Varies by scenario | Operation conflicts with state | Resolve conflicts first |

## HTTP 500 - Internal Server Error

| HTTP Error Code | Error Code   | Error Name            | Message                 | Cause                     | Resolution                     |
| --------------- | ------------ | --------------------- | ----------------------- | ------------------------- | ------------------------------ |
| 500             | ERR_DATABASE | Database Error        | "Database error"        | DB connection/query error | Check database and server logs |
| 500             | ERR_INTERNAL | Internal Server Error | "Internal server error" | Unexpected exception      | Review server logs             |
