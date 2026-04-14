# Backend Programming Template (2025)

## Petunjuk untuk menggunakan methods di gacha

1. POST api/gacha/roll
   `localhost:5000/api/gacha/roll`

- Body:
  {
  "userId":"string",
  "userName":"string"
  }
- userId dan userName wajib diisi

2. GET api/gacha/history
   `localhost:5000/api/gacha/history?userId=(isi id yang ingin dilihat)`

- Parameter userId diperlukan untuk melihat history gacha

3. GET api/gacha/inventory
   `localhost:5000/api/gacha/inventory`

- Gunakan endpoint ini untuk melihat daftar prize yang masih tersedia

4. GET api/gacha/winners
   `localhost:5000/api/gacha/winners`

- Gunakan endpoint ini untuk melihat daftar pemenang yang diurutkan dari pemenang terbaru

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.
