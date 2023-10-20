 
  
const connectDB = async () => {  
  const mongoose = require('mongoose')
  try {  
    await mongoose.connect("mongodb+srv://1575577205:admin@cluster0.nzrcitw.mongodb.net/?retryWrites=true&w=majority", {  
      useNewUrlParser: true,  
      
    });  
    console.log('MongoDB connected...');  
  } catch (error) {  
    console.error('Error connecting to MongoDB:', error);  
    throw error;  
  }  
};  
  
connectDB()