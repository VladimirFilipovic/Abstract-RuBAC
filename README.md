
---

### Rule-Based Access Control (RuBAC) Service

This project implements a Rule-Based Access Control (RuBAC) service using best practices, designed to evaluate access requests based on predefined rules in JSON format. The service processes input parameters from `User` and `Request` objects and returns a boolean result indicating whether access is allowed or denied.

---

### Input Types:
- **User**
  - `getRole()`: Returns the user's role as a string.
- **Request**
  - `getIpAddress()`: Returns the request's IP address as a string.
  - `getPath()`: Returns the request's resource path as a string.

---

### Workflows:

#### **Workflow 1: Allow Specific IP for ADMIN Role**
- **Rule Logic:**
  - Allow access to paths under `/admin/*` only if:
    - The user's role is `ADMIN`.
    - The IP address matches `100.100.100.100`.

#### Example JSON Rule:
```json
{
  "WorkflowID": 1,
  "WorkflowName": "Allow only specific IP for ADMIN role",
  "Path": "/admin/*",
  "Params": [
    { "Name": "ip_address", "Expression": "$request.getIpAddress" },
    { "Name": "user_role", "Expression": "$user.getRole" }
  ],
  "Rules": [
    { "RuleName": "Allow only specific IP", "Expression": "$ip_address == '100.100.100.100'" },
    { "RuleName": "Check role", "Expression": "$user_role == 'ADMIN'" }
  ]
}
```

---

#### **Workflow 2: Allow Specific IP Range for ADMIN and SUPER_ADMIN Roles**
- **Rule Logic:**
  - Allow access to paths under `/admin/*` only if:
    - The user's role is either `ADMIN` or `SUPER_ADMIN`.
    - The IP address falls within the range `100.100.100.1/28`.

#### Example JSON Rule:
```json
{
  "WorkflowID": 2,
  "WorkflowName": "Allow only specific IPs for ADMIN and SUPER_ADMIN roles",
  "Path": "/admin/*",
  "Params": [
    { "Name": "ip_address", "Expression": "$request.getIpAddress" },
    { "Name": "user_role", "Expression": "$user.getRole" }
  ],
  "Rules": [
    { "RuleName": "Allow only specific IP", "Expression": "ip_range($ip_address, '100.100.100.1/28')" },
    { "RuleName": "Check role", "Expression": "in($user_role, 'ADMIN', 'SUPER_ADMIN')" }
  ]
}
```

---

### Features:
- JSON-defined rules for dynamic access control.
- IP-based filtering and role-based validation.
- Dockerized application setup with detailed instructions.
- Mock data and automated tests for demonstration purposes.

---

### Setup:
1. Clone the repository.
2. Build and run the Docker container following the provided instructions.
3. Use the mock data and tests to verify service functionality.

---

### How It Works:
1. The service reads the JSON rule configuration.
2. Evaluates the `User` and `Request` inputs based on the specified rules.
3. Returns `true` if all conditions are met; otherwise, returns `false`.

---

### Testing:
- Unit tests are provided to demonstrate rule evaluations.
- Mock data simulates real-world scenarios for testing various workflows.

---
