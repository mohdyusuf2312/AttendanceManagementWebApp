const fs = require('fs');
const { MongoClient } = require('mongodb');
const csvParser = require('csv-parser');

async function insertFromCSV() {
  const uri = "mongodb://localhost:27017";  // MongoDB URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('userDB');
    const users = database.collection('users');

    const studentList = [];

    fs.createReadStream('students.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        studentList.push(row);
      })
      .on('end', async () => {
        const result = await users.insertMany(studentList);
        console.log(`${result.insertedCount} students were inserted`);
        client.close();
      });
  } catch (err) {
    console.error(err);
  }
}

insertFromCSV();
