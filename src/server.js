
import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js'
import authMiddlewatre from './middleware/authMiddleware.js';


const app = express();

const PORT = process.env.PORT || 6464;


// get file path from url of curr module

const __filename = fileURLToPath(import.meta.url);

// get the directory name of file path

const __dirname = dirname(__filename);

//Servers the html file from public dir , tells express to serve all files from that dir and not the src

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')));

// Serving the html file from public dir

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//ROUTES
app.use('/auth', authRoutes)
app.use('/todos', authMiddlewatre , todoRoutes)

app.listen(PORT , ()=>{
    console.log(`Server has started on port ${PORT}`);
})


