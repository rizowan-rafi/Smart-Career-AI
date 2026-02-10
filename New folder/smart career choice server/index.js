require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios'); 
const app = express();
const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch("2201af91e5bb26f3eea163b90d32777d0ddd875950a1e8e4a9653685b3eb807b");

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v8zqf.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // 2. NEW: Define your database and collection explicitly
        const database = client.db("CareerChoice");
        const CareerUpskill = database.collection("CareerUpskill");
        const users = database.collection("users");

        app.post('/profession', async (req, res) => {
            try {
                console.log("Data received from React:", req.body);

                const { education, skills, interests } = req.body;

                // 1. Call Python AI (Use a unique name like 'aiResponse')
                const aiResponse = await axios.post('http://127.0.0.1:8000/predict', {
                    education,
                    skills,
                    interests
                });

                const predictedCareer = aiResponse.data.recommended_career;
                // console.log("AI Prediction:", predictedCareer);

                const roadmap = await CareerUpskill.findOne({ career: predictedCareer })
                // console.log(roadmap)
                // 2. Send the response back to React
                // We use the 'res' provided by Express (req, res)
                res.status(200).json({
                    career: predictedCareer,
                    details: roadmap
                });

            } catch (error) {
                console.error("Error connecting to AI:", error.message);
                res.status(500).json({
                    message: "Node.js could not talk to Python. Is Uvicorn running on port 8000?"
                });
            }
        });

        // Add this route to your server.js
        app.get('/api/jobs', async (req, res) => {
            try {
                const { career } = req.query; // Get career from query params
                const appId = process.env.JOB_ID;
                const appKey = process.env.JOB_KEY;
                // console.log(appId,appKey)

                const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=5&what=${career}`;

                const response = await axios.get(adzunaUrl);

                // Send the data back to React
                res.json(response.data.results);
            } catch (error) {
                console.error("Adzuna API Error:", error.message);
                res.status(500).json({ error: "Failed to fetch jobs" });
            }
        });
        
        app.get('/api/live-jobs', (req, res) => {
            const career = req.query.career || "Software Engineer";
            console.log(`Searching for: ${career}...`);

            const params = {
                engine: "google_jobs",
                q: `${career} jobs in Bangladesh`,
                hl: "en",
                gl: "bd",
            };

            try {
                search.json(params, (data) => {
                    if (data.error) {
                        return res.json(FALLBACK_JOBS);
                    }

                    if (data.jobs_results && data.jobs_results.length > 0) {
                        // --- SPEED FIX: ONLY TAKE THE TOP 5 ---
                        const top5Jobs = data.jobs_results.slice(0, 5);
                        res.json(top5Jobs);
                    } else {
                        res.json(FALLBACK_JOBS);
                    }
                });
            } catch (error) {
                res.json(FALLBACK_JOBS);
            }
        });

        // === FALLBACK DATA (Prevents crash if API fails) ===
        const FALLBACK_JOBS = [
            {
                title: "Software Engineer (Backup Data)",
                company_name: "Brain Station 23",
                location: "Dhaka, Bangladesh",
                via: "LinkedIn",
                thumbnail: "https://media.licdn.com/dms/image/v2/C510BAQHGj-74t-J2QA/company-logo_200_200/0/1630639564669?e=2147483647&v=beta&t=...",
                alternate_link: "https://bdjobs.com"
            },
            {
                title: "MERN Stack Developer",
                company_name: "TigerIT",
                location: "Dhaka",
                via: "Bdjobs",
                alternate_link: "https://bdjobs.com"
            }
        ];

        app.post('/users', async (req, res) => {
            try {
                const userData = req.body;

                // 1. Basic Validation
                if (!userData.email || !userData.password) {
                    return res.status(400).json({ error: "Email and password are required" });
                }

                // 2. Check if user already exists
                const existingUser = await users.findOne({ email: userData.email });
                if (existingUser) {
                    return res.status(409).json({ error: "User already exists" });
                }

                // 3. HASH THE PASSWORD (Security Step)
                // The '10' is the salt rounds (complexity). Higher is slower but safer.
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                // 4. Prepare User Object
                const newUser = {
                    fullName: userData.fullName,
                    email: userData.email,
                    password: hashedPassword, // Store the HASH, not the plain text
                    role: "user",             // Default role
                    createdAt: new Date()
                };

                // 5. Insert User
                const result = await users.insertOne(newUser);

                res.status(201).json({
                    message: 'User created',
                    userId: result.insertedId,
                    success: true
                });

            } catch (error) {
                console.error("Error creating user:", error.message);
                res.status(500).json({ error: "Failed to create user" });
            }
        });

        app.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;

                // 1. Basic Validation
                if (!email || !password) {
                    return res.status(400).json({ error: "Please provide both email and password" });
                }

                // 2. Find the user by Email
                const user = await users.findOne({ email });

                // If user doesn't exist
                if (!user) {
                    return res.status(401).json({ error: "Invalid email or password" });
                }

                // 3. Compare the Hashed Password
                // bcrypt.compare(plainTextPassword, hashedPasswordFromDB)
                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ error: "Invalid email or password" });
                }

                // 4. Success! Send back user info (but NOT the password)
                res.json({
                    message: "Login successful",
                    success: true,
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role // Very important! The frontend needs this to know if it's an Admin
                    }
                });

            } catch (error) {
                console.error("Login Error:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });

        // 1. GET ALL USERS (For Admin Dashboard)
        app.get('/users', async (req, res) => {
            try {
                const result = await users.find().toArray();
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to fetch users" });
            }
        });

        // 2. DELETE USER
        app.delete('/users/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await users.deleteOne(query);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to delete user" });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



const port = 3500;
app.listen(port, () => {
    console.log(`Node.js Server listening on port ${port}`);
});