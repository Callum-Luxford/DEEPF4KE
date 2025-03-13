# 🖥️ SW4PS Web App

## 📌 About This Project

The **DeepF4ke Web App** is an **AI-powered face-swapping application** built using **Node.js, Express, MongoDB**, and **Python AI models**.  
It allows users to upload videos and apply **face swaps using deep learning**.

---

## 🚀 Project Setup & Installation

Follow these steps to set up and run the project on **Windows, macOS, or Linux**.

### ✅ **1. Clone the Repository**

Open a terminal or Command Prompt and run:

```sh
git clone https://github.com/Callum-Luxford/DEEPF4KE.git
cd DEEPF4KE
```

---

### ✅ **2. Set Up Environment Variables**

This project requires a `.env` file for configuration.

#### **How to Create the `.env` File**

1️⃣ In the **root directory**, create a file named **.env**  
2️⃣ Copy and paste the following into `.env`:

```ini
DB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/SW4PS?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
PORT=3000
```

3️⃣ **IMPORTANT:** Do **not** remove `/SW4PS` at the end of `DB_URI`!  
   - This ensures that the app connects to the **correct database** instead of the default `test` database.
   - If you remove it, MongoDB will automatically create and use a **new empty `test` database**, causing issues.

---

### ✅ **3. Install Dependencies & Set Up the Project**

Ensure **Python 3+** and **Node.js 14+** are installed.

#### **For Windows Users:**

- **Double-click** `setup.bat`
- OR open Command Prompt (`cmd`), navigate to the project folder, and run:
  ```sh
  setup.bat
  ```

#### **For macOS/Linux Users:**

1. Open a terminal and navigate to the project folder.
2. Run:
   ```sh
   chmod +x setup.sh
   ./setup.sh
   ```

---

## 📦 **Dependencies Installed**

The setup script automatically installs:

### **🔹 Node.js Dependencies**

- **Express.js** (Backend framework)
- **MongoDB** (Database connection)
- **Multer** (File upload handling)
- **JSON Web Tokens** (Authentication)
- **CORS & Cookie-parser** (Security & session handling)

### **🔹 Python Dependencies**

- **ONNXRuntime** (AI model execution)
- **OpenCV** (Image processing)
- **TensorFlow** (Deep learning)
- **Flask** (Python web server)
- **PyMongo** (MongoDB connection)

---

### ✅ **4. Start the App**

Once the setup is complete, start the app using:

```sh
npm start
```

Your app will now be running locally at:  
👉 **http://localhost:3000**

---

## 🚀 **Features**

✅ **AI-Powered Face Swapping**  
✅ **User Authentication (JWT + MongoDB)**  
✅ **File Upload & Processing**  
✅ **Fully Portable (Works on Any OS)**  
✅ **Automatic Setup Scripts for Quick Installation**

---

## 🛠 **Troubleshooting**

### ❌ **Error: Python or Node.js Not Found**

Ensure **Python 3+** and **Node.js 14+** are installed:

- [Download Python](https://www.python.org/downloads/)
- [Download Node.js](https://nodejs.org/)

### ❌ **Error: MongoDB Not Connected**

Ensure **MongoDB is running** and your `.env` file has the correct **DB_URI**.

---

## 📄 **License**

This project is **private** and intended for internal use only.  
For questions, contact the project owner.

---

## 💡 **Need Help?**

For issues, create a GitHub **issue**, or contact the project owner.

---

### 🎉 **Your SW4PS Web App is now fully portable and ready to run!**
