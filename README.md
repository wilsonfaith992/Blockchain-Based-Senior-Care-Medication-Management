# Blockchain-Based Senior Care Medication Management

A comprehensive blockchain solution for managing senior care medication schedules, adherence monitoring, and family notifications using Clarity smart contracts on the Stacks blockchain.

## Overview

This system provides a secure, transparent, and decentralized approach to managing medication for senior citizens. It includes pharmacy verification, medication tracking, adherence monitoring, drug interaction checking, and family notification systems.

## Features

### 🏥 Pharmacy Verification
- Register and verify senior care pharmacies
- Admin-controlled verification process
- License validation and tracking

### 💊 Medication Tracking
- Patient registration and management
- Medication prescription tracking
- Dosage and frequency management
- Guardian authorization system

### 📊 Adherence Monitoring
- Schedule dose tracking
- Real-time adherence statistics
- Missed dose alerts
- Comprehensive reporting

### ⚠️ Interaction Checking
- Drug interaction database
- Automatic interaction alerts
- Severity classification
- Healthcare provider notifications

### 👨‍👩‍👧‍👦 Family Notifications
- Family member registration
- Automated alert system
- Customizable notification preferences
- Multi-priority messaging

## Smart Contracts

### 1. Pharmacy Verification Contract (`pharmacy-verification.clar`)
Manages the registration and verification of pharmacies authorized to serve senior patients.

**Key Functions:**
- `register-pharmacy`: Register a new pharmacy
- `verify-pharmacy`: Verify a registered pharmacy (admin only)
- `is-pharmacy-verified`: Check verification status
- `add-admin`: Add new admin users

### 2. Medication Tracking Contract (`medication-tracking.clar`)
Tracks patient medications, prescriptions, and schedules.

**Key Functions:**
- `register-patient`: Register a new patient
- `add-medication`: Add medication for a patient
- `get-patient-medications`: Retrieve patient's medications
- `deactivate-medication`: Deactivate a medication

### 3. Adherence Monitoring Contract (`adherence-monitoring.clar`)
Monitors medication adherence and generates statistics.

**Key Functions:**
- `schedule-dose`: Schedule a medication dose
- `mark-dose-taken`: Mark a dose as taken
- `mark-dose-missed`: Mark a dose as missed
- `get-adherence-stats`: Get adherence statistics

### 4. Interaction Checking Contract (`interaction-checking.clar`)
Manages drug interactions and generates alerts.

**Key Functions:**
- `add-interaction`: Add a drug interaction (admin only)
- `check-interaction`: Check for interactions between drugs
- `create-alert`: Create an interaction alert
- `resolve-alert`: Resolve an interaction alert

### 5. Family Notification Contract (`family-notification.clar`)
Manages family member notifications and alerts.

**Key Functions:**
- `add-family-member`: Add a family member
- `send-notification`: Send notification to family member
- `mark-notification-read`: Mark notification as read
- `send-adherence-alert`: Send adherence-related alerts

## Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd senior-care-blockchain
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run tests:
   \`\`\`bash
   npm test
   \`\`\`

## Testing

The project includes comprehensive test suites for all smart contracts using Vitest:

- `pharmacy-verification.test.ts`: Tests pharmacy registration and verification
- `medication-tracking.test.ts`: Tests patient and medication management
- `adherence-monitoring.test.ts`: Tests dose tracking and adherence statistics
- `interaction-checking.test.ts`: Tests drug interaction management
- `family-notification.test.ts`: Tests family notification system

Run all tests:
\`\`\`bash
npm run test
\`\`\`

Run specific test file:
\`\`\`bash
npm run test pharmacy-verification.test.ts
\`\`\`

## Usage Examples

### Register a Pharmacy
\`\`\`clarity
(contract-call? .pharmacy-verification register-pharmacy
"Senior Care Pharmacy"
"LIC123456"
"123 Main Street, City, State")
\`\`\`

### Add a Patient
\`\`\`clarity
(contract-call? .medication-tracking register-patient
"John Doe"
u75
'ST1GUARDIAN123...)
\`\`\`

### Schedule Medication
\`\`\`clarity
(contract-call? .medication-tracking add-medication
u1 u1 "Aspirin" "81mg" u1 u1000 u2000)
\`\`\`

### Track Adherence
\`\`\`clarity
(contract-call? .adherence-monitoring schedule-dose u1 u1 u1500)
(contract-call? .adherence-monitoring mark-dose-taken u1 "Taken with breakfast")
\`\`\`

## Security Considerations

- **Access Control**: Admin-only functions for critical operations
- **Data Validation**: Input validation for all contract functions
- **Guardian Authorization**: Family member authorization for patient data
- **Immutable Records**: Blockchain-based audit trail

## Error Codes

| Code | Description |
|------|-------------|
| u100 | Not authorized |
| u101 | Pharmacy not found |
| u102 | Already verified |
| u200 | Patient not found |
| u201 | Medication not found |
| u202 | Invalid pharmacy |
| u300 | Record not found |
| u301 | Already taken |
| u400 | Interaction exists |
| u401 | Alert not found |
| u500 | Member not found |
| u501 | Notification not found |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.

## Roadmap

- [ ] Integration with healthcare APIs
- [ ] Mobile application development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with IoT medication dispensers
- [ ] Telemedicine integration
  \`\`\`

Now let's create the PR details file:
