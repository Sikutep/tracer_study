require('dotenv').config();

const https = require('https');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || 'http://localhost';


const options = {
    key: fs.readFileSync('./server.key'), // Path ke file private key
    cert: fs.readFileSync('./server.cert'), // Path ke file sertifikat
  };
  
const UserRouter = require('./src/Routes/UserRoutes')
const prodiRoute = require('./src/Routes/ProdiRoutes');
const KampusRoutes = require('./src/Routes/KampusRoutes')
const BekerjaRouter = require('./src/Routes/BekerjaRoutes');
const WirausahaRoutes = require('./src/Routes/WirausahaRoutes');
const MahasiswaRoutes = require('./src/Routes/MahasiswaRoutes');
const DataProcessingRoutes = require('./src/Routes/DataProcessingRoutes');
const TracerStudyRoutes = require('./src/Routes/TracerStudyRoutes');
const PusatBantuanRoutes = require('./src/Routes/PusatBantuanRoutes');
const BelumBekerjaRouter = require('./src/Routes/BelumBekerjaRoutes');
const ReportRoutes = require('./src/Routes/ReportRoutes');
// const calculateHorizontal = require('./src/Controllers/Processing/HorizontalController');
// const { calculateScores } = require('./src/Controllers/TracerProcessingController')
const setupSwaggerDocs = require('./src/swagger');
const RoleRoutes = require('./src/Routes/RoleRoutes');


const DB_CONNECTION = process.env.DB_CONNECTION;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const mongoURI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

// MongoDB Connection
mongoose.connect(mongoURI)
    .then(() => console.log('Connection MongoDB Succesfully'))
    .catch(err => console.error('Connection MongoDB Failed:', err));


// Middleware Connections
app.use(cors())
app.use(express.json())


// Routes
app.use('/pekerjaan', BekerjaRouter)
app.use('/wirausaha', WirausahaRoutes)
app.use('/belum_bekerja', BelumBekerjaRouter)
app.use('/role', RoleRoutes)

// Report

app.use('/report', ReportRoutes)



//Super Admin Routes
app.use('/dashboard', DataProcessingRoutes)
app.use('/tracerstudy', TracerStudyRoutes)
app.use('/users', UserRouter)
app.use('/prodi', prodiRoute)
app.use('/kampus', KampusRoutes)
app.use('/pusat-bantuan', PusatBantuanRoutes)



//Admin Routes

app.use('/mahasiswa', MahasiswaRoutes)


//Mahasiswa Routes



// calculateScores();


setupSwaggerDocs(app);


app.listen(PORT, () => {
    console.log(`Server is running on ${URL}:${PORT}`);
});

// https.createServer(options, app).listen(443, () => {
//     console.log(`Server Running at https://localhost:443`)
// })