import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

export default mongoose;
