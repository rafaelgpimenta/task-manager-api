const mongoose = require('mongoose');

async function removeAllCollections() {
  const collections = Object.keys(mongoose.connection.collections)
  for (const collectionName of collections) {
    const collection = mongoose.connection.collections[collectionName]
    await collection.deleteMany()
  }
}

global.beforeEach(async () => await removeAllCollections());
global.afterEach(async () => await removeAllCollections());
