import app from './app';
import connectDB from './config/database';

const port = process.env.PORT || 5000;

connectDB();

app.listen(port, () => {
  console.log(`server is ready on port ${port}`);
})
