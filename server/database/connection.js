const mongoose = require('mongoose')
const databaseUrl = process.env.DATABASE_URL || 'mongodb://localhost/argentBankDB'

module.exports = async () => {
  try {
    await mongoose.connect(databaseUrl, { 
      useNewUrlParser: true,
      useUnifiedTopology: true  // ✅ AJOUTÉ pour supprimer le warning
    })
    console.log('Database successfully connected')
    console.log('Connected to:', databaseUrl.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB')
  } catch (error) {
    console.error(`Database Connectivity Error: ${error}`)
    throw new Error(error)
  }
}