# Adv Todo - A Smart Collaborative Task Manager

## 🚀 Overview

**Adv Todo** is an advanced to-do application that allows users to manage tasks efficiently while enabling real-time collaboration. Users can create tasks, track progress, and maintain a history of updates. The system supports **room-based collaboration**, ensuring that two users with the same room ID can share tasks but edit only their own.

## 🔥 Features

- ✅ **Collaborative Task Management** – Users join a room using a generated room ID.
- 🔄 **Real-time Updates** – Tasks sync instantly between collaborators.
- 📊 **Progress Meter** – Track completion percentage for tasks.
- 📜 **Task History** – Keep track of the previous 30 days' tasks.
- 🔒 **Restricted Editing** – Users can modify only their own tasks.
- 💡 **Task Suggestions** – Smart recommendations for task ideas.



## 🛠️ Tech Stack

- **Frontend:** EJS, CSS, JS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas)
- **Real-time:** Socket.io
- **Authentication:** JWT

## 🎮 How It Works

1. **Create or Join a Room** – If you want to create a room, go to **Add User** and join the room. The ID will automatically be copied to your clipboard; now send this ID to the other user you want to collaborate with.
2. **Add Tasks** – Users can create and manage their own tasks.
3. **View & Collaborate** – Both users see each other's tasks as well as their own in real-time.
4. **Edit Privileges** – Users can edit only the tasks they created.
5. **Track Progress** – A meter displays task completion status.

## 🏗️ Installation & Setup

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

## 🔐 Environment Variables

Create a `.env` file and add:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=1000
```

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

## 📩 Contact

For queries, reach out to [**vaibhavsaxena599@gmail.com**](mailto\:vaibhavsaxena599@gmail.com) or create an issue in the repository.

---


![homepage](https://github.com/user-attachments/assets/4b95e6f5-13fc-4aef-aa7e-5efaa5d60daa)
![signup form](https://github.com/user-attachments/assets/d7e16472-6eb7-4e73-aedc-ade746675708)
![login form](https://github.com/user-attachments/assets/74ed587e-eae3-4b05-964a-53f49a9eb38f)
![solo mode ui](https://github.com/user-attachments/assets/ac056b4f-9692-42e0-be95-97093fc4fa93)
![solomode dark](https://github.com/user-attachments/assets/e16e2ac4-9288-4b65-a253-cf58d392ed8b)
![task adding](https://github.com/user-attachments/assets/80a8deaf-980e-4ca9-9688-53aad88cf5e5)
![added tasks solo](https://github.com/user-attachments/assets/bd17ac7f-55e9-4a80-9972-8bd301a3296a)
![joining room admin](https://github.com/user-attachments/assets/42adce01-22d4-406a-bcd6-645adf91bcae)
![join room by admin id](https://github.com/user-attachments/assets/649c7d7c-33ab-4b79-86c0-70daf8b664ab)
![other user added](https://github.com/user-attachments/assets/c128e595-e698-4512-bd3d-e2b2952e8bce)
![dual mode light](https://github.com/user-attachments/assets/bcd655ba-0f02-4598-b35f-b680e7e91a9f)


Made with ❤️ by **Vaibhav Saxena** 🚀


