
const express = require("express");
let app = express();
let path = require("path");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.RDS_HOSTNAME || "localhost",
        user: process.env.RDS_USERNAME || "intex",
        password: process.env.RDS_PASSWORD || "intexroot15",
        database: process.env.RDS_DB_NAME || "ebdb",
        port: process.env.RDS_PORT || 5432,
        ssl: process.env.DB_SSL ? {rejectUnauthorized: false} : false
    }
});

// Login
// app.use(express.json());

// client.connect();

// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

//     if (result.rows.length === 1 && comparePassword(password, result.rows[0].password_hash)) {
//         res.json({ success: true, message: 'Login successful' });
//     } else {
//         res.json({ success: false, message: 'Invalid username or password' });
//     }
// });

app.listen(port, () => console.log("Server listening."));

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile('/views/index.html', {root: __dirname});
});

app.get('/surveyData', (req, res) => {
    knex.select()
        .from('main')
        .leftJoin('respondent', 'main.respondent_id', 'respondent.respondent_id')
        .leftJoin('organizationaffiliation', 'main.affiliation_id', 'organizationaffiliation.affiliation_id')
        .leftJoin('socialmediaplatforms', 'main.platform_id', 'socialmediaplatforms.platform_id')
        .then(result => {
            res.render("displaySurveyData", {surveyData : result});
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Source Code Error');
      });
});