import imaRouter from './ima.js';
import express from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use('/api/ima', imaRouter);
app.listen(PORT, () => {
    console.log(`Server port ${PORT}`);
});
