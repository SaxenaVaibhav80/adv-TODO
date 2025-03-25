
# <span style="color:#FF5733">Adv Todo - A Smart Collaborative Task Manager</span>

## 🚀 <span style="color:#3498db">Overview</span>

**Adv Todo** is an advanced to-do application that allows users to manage tasks efficiently while enabling real-time collaboration. Users can create tasks, track progress, and maintain a history of updates. The system supports **room-based collaboration**, ensuring that two users with the same room ID can share tasks but edit only their own.

## 🔥 <span style="color:#2ecc71">Features</span>

- ✅ **Collaborative Task Management** – Users join a room using a generated room ID.
- 🔄 **Real-time Updates** – Tasks sync instantly between collaborators.
- 📊 **Progress Meter** – Track completion percentage for tasks.
- 📜 **Task History** – Keep track of the previous 30 days' tasks.
- 🔒 **Restricted Editing** – Users can modify only their own tasks.
- 💡 **Task Suggestions** – Smart recommendations for task ideas.

## 🛠️ <span style="color:#e74c3c">Tech Stack</span>

- **Frontend:** EJS, CSS, JS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Real-time:** Socket.io
- **Authentication:** JWT

## 🎮 <span style="color:#9b59b6">How It Works</span>

1. **Create or Join a Room** – If you want to create a room, go to **Add User** and join the room. The ID will automatically be copied to your clipboard; now send this ID to the other user you want to collaborate with.
2. **Add Tasks** – Users can create and manage their own tasks.
3. **View & Collaborate** – Both users see each other's tasks as well as their own in real-time.
4. **Edit Privileges** – Users can edit only the tasks they created.
5. **Track Progress** – A meter displays task completion status.

## 🏗️ <span style="color:#f39c12">Installation & Setup</span>

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/adv-todo.git
   cd adv-todo
   ```
2. **Install dependencies:**
   ```sh
   npm init 
   npm i mongoose body-parser ejs cookie-parser jsonwebtoken socket.io --save-dev nodemon
   ```
3. **Start the server:**
   - Go to `package.json` and edit the **start** field value as:
     ```json
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     }
     ```
   - Then run on the terminal:
     ```sh
     npm run dev
     ```

## 🔐 <span style="color:#1abc9c">Environment Variables</span>

Create a `.env` file and add:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=1000
```

## 🤝 <span style="color:#34495e">Contributing</span>

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📩 <span style="color:#d35400">Contact</span>

For queries, reach out to **vaibhavsaxena599@gmail.com** or create an issue in the repository.

---
Made with ❤️ by **Vaibhav Saxena** 🚀



