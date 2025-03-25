Adv Todo - A Smart Collaborative Task Manager

🚀 Overview

Adv Todo is an advanced to-do application that allows users to manage tasks efficiently while enabling real-time collaboration. Users can create tasks, track progress, and maintain a history of updates. The system supports room-based collaboration, ensuring that two users with the same room ID can share tasks but edit only their own.

🔥 Features

✅ Collaborative Task Management – Users join a room using a generated room ID.

🔄 Real-time Updates – Tasks sync instantly between collaborators.

📊 Progress Meter – Track completion percentage for tasks.

📜 Task History – keep the track of previous 30 days tasks.

🔒 Restricted Editing – Users can modify only their own tasks.

💡 Task Suggestions – Smart recommendations for task ideas.

🛠️ Tech Stack

Frontend: EJS , CSS , JS

Backend: Node.js, Express.js

Database: MongoDB (Atlas)

Real-time: Socket.io

Authentication: JWT

🎮 How It Works

Create or Join a Room – if you want to create room the go to add user and join the room ,the id will automatically copied to your clipboard, now send this id to other user you want to make him/her collab.

Add Tasks – Users can create and manage their own tasks.

View & Collaborate – Both users see each others tasks as well as their own tasks in real-time.

Edit Privileges – Users can edit only the tasks they created.

Track Progress – A meter displays task completion status.



🏗️ Installation & Setup

Clone the repository:

git clone https://github.com/yourusername/adv-todo.git
cd adv-todo

Install dependencies:

npm init
npm i mongoose body-parser ejs cookie-parser jasonwebtoken socket.io --save-dev nodemon

Start the server:



🔐 Environment Variables

Create a .env file and add:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=1000

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

📩 Contact

For queries, reach out to vaibhavsaxena599@gmail.com or create an issue in the repository.

Made with ❤️ by vaibhav saxena 🚀

