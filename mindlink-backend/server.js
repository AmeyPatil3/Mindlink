
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
// A secure, randomly generated secret key for signing JWTs.
const JWT_SECRET = 'mindlink-jwt-secret-key-a7b3e9c1d5f8g2h4j6k8l0m1n3p5q7r9s2t4u6v8w0x';

// --- MIDDLEWARE ---
app.use(cors()); // Allows requests from your frontend (running on a different port)
app.use(express.json({ limit: '10mb' })); // To handle base64 image strings in request bodies

// --- IN-MEMORY DATABASE (FOR DEMONSTRATION) ---
// In a production app, use a real database like MongoDB or PostgreSQL.

let users = [
    {
        _id: 'user-1',
        fullName: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'password123', // In production, passwords MUST be hashed
        mobile: '123-456-7890',
        role: 'user',
        profileImage: 'https://i.pravatar.cc/150?u=alex'
    }
];

let therapists = [
    {
        _id: 'therapist-1',
        fullName: 'Dr. Evelyn Reed',
        email: 'evelyn.reed@example.com',
        password: 'password123',
        specialties: ['Anxiety', 'Depression', 'Trauma'],
        experienceYears: 12,
        education: 'PhD in Clinical Psychology, Stanford University',
        profileImage: 'https://i.pravatar.cc/300?u=evelyn',
        role: 'therapist'
    },
    {
        _id: 'therapist-2',
        fullName: 'Dr. Ben Carter',
        email: 'ben.carter@example.com',
        password: 'password123',
        specialties: ['Family Counseling', 'Stress Management'],
        experienceYears: 8,
        education: 'MA in Counseling Psychology, NYU',
        profileImage: 'https://i.pravatar.cc/300?u=ben',
        role: 'therapist'
    },
    {
        _id: 'therapist-3',
        fullName: 'Dr. Olivia Chen',
        email: 'olivia.chen@example.com',
        password: 'password123',
        specialties: ['Cognitive Behavioral Therapy (CBT)', 'Mindfulness'],
        experienceYears: 15,
        education: 'PsyD, University of California, Berkeley',
        profileImage: 'https://i.pravatar.cc/300?u=olivia',
        role: 'therapist'
    },
];

let rooms = [
    { _id: 'room-1', roomId: 'global-anxiety-support', name: 'Anxiety Support', topic: 'General discussion for anxiety', participantsCount: 7 },
    { _id: 'room-2', roomId: 'global-daily-wins', name: 'Daily Wins', topic: 'Share something positive from your day', participantsCount: 5 },
    { _id: 'room-3', roomId: 'global-stress-relief', name: 'Stress Relief', topic: 'Techniques for managing stress', participantsCount: 9 },
];

let roomHistory = {
    'user-1': [ rooms[0], rooms[2] ],
};

let userIdCounter = 2;
let therapistIdCounter = 4;
let roomIdCounter = 4;

// --- AUTHENTICATION MIDDLEWARE ---
// This function checks for a valid JWT in the request header
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if the token is no longer valid
        req.user = user;
        next(); // move on to the next middleware or route handler
    });
};


// --- API ROUTES ---

console.log("Setting up API routes...");

// === AUTH ROUTES ===
const authRouter = express.Router();

authRouter.post('/register/user', (req, res) => {
    const { fullName, email, password, mobile, profileImage } = req.body;
    if (users.find(u => u.email === email) || therapists.find(t => t.email === email)) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const newUser = {
        _id: `user-${userIdCounter++}`,
        fullName, email, password, mobile, profileImage,
        role: 'user'
    };
    users.push(newUser);
    const { password: _, ...userPayload } = newUser;
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, ...userPayload });
});

authRouter.post('/register/therapist', (req, res) => {
    const { fullName, email, password, specialties, experienceYears, education, profileImage } = req.body;
     if (users.find(u => u.email === email) || therapists.find(t => t.email === email)) {
        return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    const newTherapist = {
        _id: `therapist-${therapistIdCounter++}`,
        fullName, email, password, specialties, experienceYears, education, profileImage,
        role: 'therapist'
    };
    therapists.push(newTherapist);
    const { password: _, ...therapistPayload } = newTherapist;
    const token = jwt.sign(therapistPayload, JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ token, ...therapistPayload });
});

authRouter.post('/login', (req, res) => {
    const { email, password: inputPassword, role } = req.body;
    let account;
    if (role === 'user') {
        account = users.find(u => u.email === email && u.password === inputPassword);
    } else {
        account = therapists.find(t => t.email === email && t.password === inputPassword);
    }

    if (!account) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }
    
    const { password, ...payload } = account;
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, ...payload });
});

app.use('/api/auth', authRouter);

// === THERAPIST ROUTES ===
const therapistRouter = express.Router();

// GET all therapists (public endpoint, but authenticated users can see it too)
therapistRouter.get('/', (req, res) => {
    // Simulate a delay
    setTimeout(() => {
        const publicTherapists = therapists.map(({ password, ...rest }) => rest);
        res.json(publicTherapists);
    }, 1500);
});

// PUT update therapist profile (protected)
therapistRouter.put('/profile', authenticateToken, (req, res) => {
    if (req.user.role !== 'therapist') return res.sendStatus(403);
    
    const therapistIndex = therapists.findIndex(t => t._id === req.user._id);
    if (therapistIndex === -1) return res.status(404).json({ message: "Therapist not found." });

    const updatedTherapistData = { ...req.body };
    // Ensure specialties is an array if it's a string
    if (typeof updatedTherapistData.specialties === 'string') {
        updatedTherapistData.specialties = updatedTherapistData.specialties.split(',').map(s => s.trim());
    }

    const updatedTherapist = { ...therapists[therapistIndex], ...updatedTherapistData };
    therapists[therapistIndex] = updatedTherapist;

    const { password, ...payload } = updatedTherapist;
    res.json(payload);
});

app.use('/api/therapists', therapistRouter);


// === USER ROUTES ===
const userRouter = express.Router();

userRouter.put('/profile', authenticateToken, (req, res) => {
    if (req.user.role !== 'user') return res.sendStatus(403);

    const userIndex = users.findIndex(u => u._id === req.user._id);
    if (userIndex === -1) return res.status(404).json({ message: "User not found." });
    
    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;

    const { password, ...payload } = updatedUser;
    res.json(payload);
});

app.use('/api/users', userRouter);


// === ROOM ROUTES ===
const roomRouter = express.Router();

// GET all live rooms (protected)
roomRouter.get('/', authenticateToken, (req, res) => {
    // Simulate a delay
    setTimeout(() => {
        res.json(rooms);
    }, 1500);
});

// GET user's room history (protected)
roomRouter.get('/history', authenticateToken, (req, res) => {
    if (req.user.role !== 'user') return res.sendStatus(403);
    const userHistory = roomHistory[req.user._id] || [];
    res.json(userHistory);
});

// POST a new room (not implemented on frontend, but good to have)
roomRouter.post('/', authenticateToken, (req, res) => {
    const { name, topic } = req.body;
    const newRoom = {
        _id: `room-${roomIdCounter++}`,
        roomId: `custom-${Math.random().toString(36).substr(2, 9)}`,
        name,
        topic,
        participantsCount: 1 // starts with the creator
    };
    rooms.unshift(newRoom); // Add to the beginning of the list
    res.status(201).json(newRoom);
});


app.use('/api/rooms', roomRouter);

// === ROOT ENDPOINT ===
app.get('/api', (req, res) => {
  res.send('MindLink API is running!');
});

// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`MindLink backend server running on http://localhost:${PORT}`);
});
