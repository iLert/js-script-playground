# Ilert User Role Change Script

## Description:

This Script can chnage a User Role with one command line. It also consider the user Teams and chnage the role there too.


<h2> ⚙️ Requirerments: </h2>

   **Node Version 18 or higher is required [NVM-Node](https://github.com/nvm-sh/nvm)**
   
   After Installation
    ```
    nvm use 18
    ```

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone Repository</p>

```
git clone https://github.com/iLert/switch-user-role-script.git
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
