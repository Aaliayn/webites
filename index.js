const express = require('express'); 
const cors = require('cors');
const app = express(); 
app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{ 
    res.status(200); 
    res.send("Home"); 
});
app.use('/api/user', require('./routes/User'));

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'sql312.infinityfree.com',
    user: 'if0_36026470',
    password: 'ZoG23945MweJ2M8',
    database: 'if0_36026470_moviesDB'
});
// connect to the MySQL database

// app.listen(5000, (error) =>{ 
//     if(!error) 
//     console.log(`Server is Successfully Running, and App is listening on http://localhost:${5000}`) 
// else 
// console.log("Error occurred, server can't start", error); 
// })

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to MySQL database:', error);
    } else {
        console.log('Connected to MySQL database!');
        app.listen(5000, (error) =>{ 
            if(!error) 
            console.log(`Server is Successfully Running, and App is listening on http://localhost:${5000}`) 
        else 
        console.log("Error occurred, server can't start", error); 
} 
); 
}
});