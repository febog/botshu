// Storage Service
// Persists and reads JSON objects to and from Azure Blob Storage.
//
// Usage:
//
// import StorageService from "./storage-service.js";
//
// const myJsonData = {
//     name: "John Doe",
//     age: 30,
//     email: "johndoe@example.com",
// };
//
// const storage = new StorageService({ blobServiceClient, containerName });
//
// storage.storeJsonToBlobStorage({ myJsonData, "foo.json" })
//     .then(() => console.log("JSON data stored in Azure Blob Storage"))
//     .catch((error) => console.error("Error storing JSON data:", error));
//
// storage
//     .readJsonFromBlobStorage({ "foo.json" })
//     .then(() => console.log("JSON data read from Azure Blob Storage"))
//     .catch((error) => console.error("Error reading JSON data:", error));

class StorageService {
  #blobServiceClient;
  #containerClient;

  constructor({ blobServiceClient, containerName }) {
    this.blobServiceClient = blobServiceClient;
    this.containerClient = this.blobServiceClient.getContainerClient(containerName);
  }

  async storeJsonToBlobStorage({ jsonData, blobName }) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    const data = JSON.stringify(jsonData);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
  }

  async readJsonFromBlobStorage({ blobName }) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    const downloadBlockBlobResponse = await blockBlobClient.download();
    const downloadedData = await this.streamToString(downloadBlockBlobResponse.readableStreamBody);
    const jsonData = JSON.parse(downloadedData);
    return jsonData;
  }

  async #streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }
}
