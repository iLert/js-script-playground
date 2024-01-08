# Ilert User Role Change Script

<h2>📄Description:</h2> 

This script has been designed to help with the management of role changes for a particular user. 


<h2> ⚙️ Requirements: </h2>

   **Node version 18 or higher is required [NVM-Node](https://github.com/nvm-sh/nvm)**
    

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone Repository</p>

```
git clone https://github.com/iLert/switch-user-role-script.git
```

<p>2. Set Node Version</p>

```
nvm use 18
```

<p>2. Install Dependencies</p>

```
npm install .
```

<p>3. Create .env file</p>

<p>4. Add ilert API Key to .env</p>

```
ILERT_API_KEY="{YOUR_ILERT_API_KEY}"
```

<p>5. Example Command</p>

```
npm start email="test@test.de" role="USER"
```
