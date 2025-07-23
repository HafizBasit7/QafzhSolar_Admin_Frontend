# Qahzah Admin Panel

A comprehensive admin dashboard for managing a solar marketplace platform. This admin panel provides tools for managing product approvals, engineers, shops, advertisements, and calculator settings.

## Features

### 🏠 Dashboard

- Overview statistics and metrics
- Quick action buttons for common tasks
- Recent activity feed
- Responsive design with sidebar navigation

### 📦 Product Approvals

- View pending product submissions from users
- Approve or reject products with reason
- Detailed product information display
- Status tracking (pending, approved, rejected)

### 👨‍💼 Manage Engineers

- Add new engineers with comprehensive details:
  - Name, email, phone, WhatsApp
  - Description and experience years
  - Location selection (dropdown)
  - Services offered (multiple selection)
  - Profile image upload
- Edit existing engineer information
- Delete engineers
- View all engineers in a table format

### 🏪 Manage Shops

- Add verified solar shops with details:
  - Shop name, location, description
  - Contact information (email, phone, WhatsApp)
  - Services offered
  - Shop image
  - Verification status toggle
- Separate display for verified and unverified shops
- Edit and delete shop information

### 📢 Manage Advertisements

- Upload new advertisements with:
  - Title and link URL
  - Image upload
  - Start and end dates
  - Active/inactive status
- View advertisement performance metrics
- Edit and delete advertisements
- Status management (active, inactive, expired)

### ⚙️ Calculator Settings

- Manage solar panel specifications:
  - Panel name, brand, power (W)
  - Efficiency percentage
  - Price in SAR
- Manage battery system specifications:
  - Battery name, brand, capacity (kWh)
  - Voltage, price
- Add, edit, and delete calculator components

### 📋 View Submissions

- Comprehensive view of all user submissions
- Filter by status, category, and search terms
- Tabbed interface (All, Pending, Approved, Rejected)
- Detailed submission information
- Export functionality (placeholder)

## Technology Stack

- **React 19** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **React Router** - Navigation and routing
- **React Hook Form** - Form management
- **Vite** - Build tool and development server

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd qahzah-admin
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.jsx      # Main dashboard with navigation
│   ├── ProductApprovals.jsx    # Product approval management
│   ├── ManageEngineers.jsx     # Engineer management
│   ├── ManageShops.jsx         # Shop management
│   ├── ManageAds.jsx           # Advertisement management
│   ├── CalculatorSettings.jsx  # Calculator configuration
│   └── ViewSubmissions.jsx     # Submission overview
├── App.jsx                     # Main app component with routing
├── App.css                     # Custom styles
├── index.css                   # Global styles
└── main.jsx                    # App entry point
```

## Key Features

### Responsive Design

- Mobile-friendly interface
- Collapsible sidebar navigation
- Adaptive layouts for different screen sizes

### Data Management

- Mock data for demonstration
- CRUD operations for all entities
- Form validation and error handling
- Image upload functionality

### User Experience

- Intuitive navigation
- Status indicators and chips
- Loading states and feedback
- Confirmation dialogs for destructive actions

### Admin Workflow

1. **Product Approval Process**: Review user submissions → Approve/Reject with reason
2. **Engineer Management**: Add engineers → Assign services → Manage profiles
3. **Shop Verification**: Add shops → Verify status → Manage listings
4. **Advertisement Management**: Upload ads → Set schedules → Monitor performance
5. **Calculator Configuration**: Set panel/battery specs → Update pricing

## Future Enhancements

- **Backend Integration**: Connect to real API endpoints
- **Authentication**: Admin login and role-based access
- **Real-time Updates**: Live notifications and data sync
- **Advanced Analytics**: Detailed reporting and insights
- **Bulk Operations**: Mass approve/reject functionality
- **File Management**: Better image handling and storage
- **Export Features**: PDF/Excel export capabilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
