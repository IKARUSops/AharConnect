Set-ExecutionPolicy Unrestricted -Scope Process -Force
npx create-react-app AharConnect

I'll provide a detailed guide on how to run the AharConnect project:

1. **Prerequisites**
   - Install Node.js (latest LTS version)
   - Install MongoDB
   - Install Git (optional but recommended)

2. **Project Setup**
```bash
# Clone the project (or create project directory)
git clone [repository-url]
# OR
mkdir aharconnect
cd aharconnect

# Install root-level dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Configuration**
Create `.env` files:

In `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/aharconnect
PORT=5000
JWT_SECRET=your_secret_key
```

In `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Running the Project**

**Option 1: Concurrent Development Mode**
```bash
# In the root project directory
npm run dev
# OR
npm start
```
This will:
- Start MongoDB (if not already running)
- Launch backend server on port 5000
- Launch React frontend on port 3000

**Option 2: Separate Terminal Windows**
Terminal 1 (Backend):
```bash
# In server directory
npm run dev
# OR
npm start
```

Terminal 2 (Frontend):
```bash
# In client directory
npm start
```

5. **Accessing the Application**
- Backend API: `http://localhost:5000`
- Frontend UI: `http://localhost:3000`

6. **Common Scripts** (in package.json)
```json
{
  "scripts": {
    "start": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm start",
    "dev": "concurrently \"npm run server\" \"npm run client\""
  }
}
```

7. **Troubleshooting**
- Ensure MongoDB is running
- Check console for any error messages
- Verify all dependencies are installed
- Confirm `.env` files are correctly configured

8. **Additional Commands**

**Backend Testing**:
```bash
# In server directory
npm test
```

**Frontend Testing**:
```bash
# In client directory
npm test
```

**Build for Production**:
```bash
# In client directory
npm run build

# In server directory
npm run build
```

9. **Database Setup**
```bash
# Start MongoDB (if not automatically running)
mongod

# Connect to MongoDB
mongo
# Then create database
use aharconnect
```

10. **Deployment Preparation**
```bash
# Build frontend
cd client
npm run build

# Prepare backend
cd ../server
npm run build
```

**Pro Tips:**
- Use `nodemon` in development for auto-restart
- Set up proper error handling
- Implement environment-specific configurations

