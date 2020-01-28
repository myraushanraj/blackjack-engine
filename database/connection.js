const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, { useCreateIndex: true,useNewUrlParser: true,  useUnifiedTopology: true }).then(() => { 
    // if all is ok we will be here
    console.error('db connect successfully');
})
.catch(err => { 
    // we will not be here...
    console.error('App starting error:', err.stack);
});