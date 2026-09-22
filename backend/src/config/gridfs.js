const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gridFSBucket;

const initGridFS = () => {
  const db = mongoose.connection.db;

  gridFSBucket = new GridFSBucket(db, {
    bucketName: "bookCovers",
  });

  console.log("GridFS initialized");
};

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error("GridFS is not initialized");
  }

  return gridFSBucket;
};

module.exports = {
  initGridFS,
  getGridFSBucket,
};