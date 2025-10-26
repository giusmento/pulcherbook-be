# @pulcherbook/types

TypeScript types for PulcherBook backend services.

## Entities

| Type | Description |
|------|-------------|
| `iam.entities.User` | User entity (uid, firstName, lastName, email) |
| `iam.entities.PartnerUser` | Partner user entity (uid, firstName, lastName) |
| `iam.entities.AdminUser` | Admin user entity (uid, firstName, lastName, groups) |

## Enums

| Type | Description |
|------|-------------|
| `iam.enums.PartnerStatus` | PENDING, UNDER_REVIEW, ACTIVE, DISABLED |

## API Types

### Groups

| Type | Description |
|------|-------------|
| `iam.api.v1.groups.GET.RequestBody` | Get all groups |
| `iam.api.v1.groups.GET.ResponseBody` | List of groups |
| `iam.api.v1.groups.POST.RequestBody` | Create group (uid, name, description, permissions) |
| `iam.api.v1.groups.POST.ResponseBody` | Created group |
| `iam.api.v1.groups.DELETE.RequestBody` | Delete group by uid |
| `iam.api.v1.groups.DELETE.ResponseBody` | Success status |
| `iam.api.v1.groups.admin.*` | Admin group operations (GET, POST) |
| `iam.api.v1.groups.partner.*` | Partner group operations (GET, POST) |
| `iam.api.v1.groups.user.*` | User group operations (GET, POST) |

### Admin Users

| Type | Description |
|------|-------------|
| `iam.api.v1.adminUser.POST.RequestBody` | Create admin (firstName, lastName, username, email, password, age, groups) |
| `iam.api.v1.adminUser.POST.ResponseBody` | Created admin user |
| `iam.api.v1.adminUser.PUT.RequestBody` | Update admin (firstName, lastName, phoneNumber) |
| `iam.api.v1.adminUser.PUT.ResponseBody` | Update status |
| `iam.api.v1.adminUser.activate.POST.RequestBody` | Activate admin via magic link (firstName, lastName, password) |
| `iam.api.v1.adminUser.activate.POST.ResponseBody` | Activated admin user |
| `iam.api.v1.adminUser.groups.POST.RequestBody` | Assign groups to admin |
| `iam.api.v1.adminUser.groups.POST.ResponseBody` | Assignment status |
| `iam.api.v1.adminUser.magiclinks.GET.RequestBody` | Get admin by magic link |
| `iam.api.v1.adminUser.magiclinks.GET.ResponseBody` | Admin user data |

### Partners

| Type | Description |
|------|-------------|
| `iam.api.v1.partners.GET.RequestBody` | Get all partners |
| `iam.api.v1.partners.GET.ResponseBody` | List of partners |
| `iam.api.v1.partners.POST.RequestBody` | Create partner (companyName, email, businessType, etc.) |
| `iam.api.v1.partners.POST.ResponseBody` | Created partner |
| `iam.api.v1.partners.PUT.RequestBody` | Update partner |
| `iam.api.v1.partners.PUT.ResponseBody` | Update status |
| `iam.api.v1.partners.uid.GET.RequestBody` | Get partner by uid |
| `iam.api.v1.partners.uid.GET.ResponseBody` | Partner data |

### Partner Users

| Type | Description |
|------|-------------|
| `iam.api.v1.partners.users.POST.RequestBody` | Create partner user (firstName, lastName, email, password, groups) |
| `iam.api.v1.partners.users.POST.ResponseBody` | Created partner user |
| `iam.api.v1.partners.users.PUT.RequestBody` | Update partner user |
| `iam.api.v1.partners.users.PUT.ResponseBody` | Update status |
| `iam.api.v1.partners.users.activate.POST.RequestBody` | Activate partner user via magic link |
| `iam.api.v1.partners.users.activate.POST.ResponseBody` | Activated partner user |
| `iam.api.v1.partners.users.groups.POST.RequestBody` | Assign groups to partner user |
| `iam.api.v1.partners.users.groups.POST.ResponseBody` | Assignment status |
| `iam.api.v1.partners.users.magiclinks.GET.RequestBody` | Get partner user by magic link |
| `iam.api.v1.partners.users.magiclinks.GET.ResponseBody` | Partner user data |

### Users

| Type | Description |
|------|-------------|
| `iam.api.v1.users.POST.RequestBody` | Create user (firstName, lastName, email, password, groups) |
| `iam.api.v1.users.POST.ResponseBody` | Created user |
| `iam.api.v1.users.PUT.RequestBody` | Update user (firstName, lastName, phoneNumber) |
| `iam.api.v1.users.PUT.ResponseBody` | Update status |
| `iam.api.v1.users.activate.POST.RequestBody` | Activate user via magic link |
| `iam.api.v1.users.activate.POST.ResponseBody` | Activated user |
| `iam.api.v1.users.groups.POST.RequestBody` | Assign groups to user |
| `iam.api.v1.users.groups.POST.ResponseBody` | Assignment status |
| `iam.api.v1.users.magiclinks.GET.RequestBody` | Get user by magic link |
| `iam.api.v1.users.magiclinks.GET.ResponseBody` | User data |

### Authentication

| Type | Description |
|------|-------------|
| `iam.api.v1.auth.admins.login.POST.RequestBody` | Admin login (email, password) |
| `iam.api.v1.auth.admins.login.POST.ResponseBody` | Auth result with admin user |
| `iam.api.v1.auth.partners.login.POST.RequestBody` | Partner login (email, password) |
| `iam.api.v1.auth.partners.login.POST.ResponseBody` | Auth result with partner |
| `iam.api.v1.auth.users.login.POST.RequestBody` | User login (email, password) |
| `iam.api.v1.auth.users.login.POST.ResponseBody` | Auth result with user |
