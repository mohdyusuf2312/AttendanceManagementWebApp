# Attendance Management Web Application

## Overview
The **Attendance Management Web Application** is designed to help students and teachers efficiently manage and track attendance records. The system allows teachers to manually mark attendance, and students can view their attendance data, including subject-wise and cumulative reports. Additionally, students can filter and view their attendance data based on date ranges, providing them with a detailed overview of their academic participation.

## Features
- **Teacher Dashboard**: Teachers can view a list of courses, select a course, and mark attendance for each student using a toggle button.
- **Student Dashboard**: Students can view subject-wise and cumulative attendance reports.
- **Cumulative Attendance**: Displays a detailed report with the total number of classes held, present, and the cumulative attendance percentage.
- **Date-wise Attendance**: Allows students to filter and view attendance for specific subjects within a date range.
- **Profile Management**: Both students and teachers can view their profiles, including basic personal information.

## Technologies Used
- **Frontend**: 
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap (for responsiveness)
- **Backend**:
  - Node.js
  - Express.js
- **Database**:
  - MongoDB (with Mongoose for object modeling)
- **Other Libraries**:
  - CORS (for cross-origin requests)
  - JWT (for authentication)
  - bcrypt.js (for password hashing)
  
## Installation and Setup

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- Git (optional but recommended)

### Steps to Run the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/AttendanceManagementWebApp.git
   cd attendance-management-web-app
2. **Install dependencies**:
   ```bash
   npm install bcrypt cookie-parser cors exceljs express jsonwebtoken mongoose nodemailer
  },
  "devDependencies": {
    "dotenv": "^16.4.5",
    "nodemon": "^3.1.7"
3. **Create a .env file in the root directory and add the following environment variables**:
   ```bash
   MONGO_URI=mongodb://localhost:27017/amu_attendance
   JWT_SECRET=your_jwt_secret_key
4. **Start the MongoDB server (if it's not already running)**:
   ```bash
   mongodb
5. **Run the application**:
   ```bash
   npm run dev
  The server will be running at http://localhost:3000.

## API Endpoints
### Authentication Endpoints
POST /api/users/login: Login a student/teacher.
POST /api/users/register: Register a new student/teacher.

### Attendance Endpoints
GET /api/cumulative-attendance: Fetch cumulative attendance report for the logged-in student.
GET /api/date-wise-attendance: Fetch attendance records for a selected subject and date range.
POST /api/attendance/mark: Mark attendance for students in a course (teacher only).

### Subject and Profile Endpoints
GET /api/subjects: Fetch the list of subjects for the logged-in student.
GET /api/student-profile: Fetch the profile of the logged-in student.
GET /api/teacher-profile: Fetch the profile of the logged-in teacher.

## Usage
### For Students
Login using the student credentials.
View the Cumulative Attendance Report or Date-wise Attendance Report by selecting date ranges and subjects.
Access your Profile to view personal information.

### For Teachers
Login using the teacher credentials.
View the list of courses on the Teacher Dashboard.
Select a course and mark attendance for students using the toggle button.
Access your Profile to view personal information.

## Project Structure
  ```bash
attendance-management-web-app/
│
├── models/         # MongoDB Schemas for users and attendance
├── routes/         # API routes (e.g., users, attendance, subjects)
├── controllers/    # Business logic for routes
├── public/         # Static frontend files (HTML, CSS, JS)
│   ├── assets/     # Images and other assets
│   ├── styles/     # CSS files
│   ├── script/     # JavaScript files for the frontend
├── config/         # Database and server configurations
├── server.js       # Main server file (Express setup)
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

## Contributing
Contributions are welcome! Feel free to submit a pull request or open an issue if you have any suggestions for improving the application.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
For any queries or issues, feel free to reach out to the project maintainer:

[<img align="left" alt="gmail_icon" color="white" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/gmail.svg" />][gmail]
[<img align="left" alt="linkedIn_icon" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg" />][linkedin]
[<img align="left" alt="github_icon" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/github.svg" />][github]
[<img align="left" alt="twitter_icon" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/twitter.svg" />][twitter]
[<img align="left" alt="telegram_icon" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/telegram.svg" />][telegram]
[<img align="left" alt="whatsapp_icon" width="25px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/whatsapp.svg" />][whatsapp]

[gmail]: https://mohdyusufr@gmail.com
[linkedin]: https://www.linkedin.com/in/mohdyusuf2312/
[github]: https://www.github.com/mohdyusuf2312/
[twitter]: https://www.twitter.com/mohdyusuf2312/
[telegram]: https://t.me/MOHD0YUSUF
[whatsapp]: https://api.whatsapp.com/send?phone=919084662330

