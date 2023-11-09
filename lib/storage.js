const { BlobServiceClient } = require("@azure/storage-blob");

async function storeJsonToBlobStorage(jsonData, blobName) {
    const AZURE_STORAGE_CONNECTION_STRING =
        process.env.AZURE_STORAGE_CONNECTION_STRING;
    const CONTAINER_NAME = process.env.CONTAINER_NAME;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient =
        blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const data = JSON.stringify(jsonData);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
}

async function readJsonFromBlobStorage(blobName) {
    const AZURE_STORAGE_CONNECTION_STRING =
        process.env.AZURE_STORAGE_CONNECTION_STRING;
    const CONTAINER_NAME = process.env.CONTAINER_NAME;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
        AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient =
        blobServiceClient.getContainerClient(CONTAINER_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const downloadBlockBlobResponse = await blockBlobClient.download();
    const downloadedData = await streamToString(
        downloadBlockBlobResponse.readableStreamBody
    );

    const jsonData = JSON.parse(downloadedData);
    return jsonData;
}

async function streamToString(readableStream) {
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

module.exports = {
    storeJsonToBlobStorage,
    readJsonFromBlobStorage,
};

// Example usage
// const storage = require("./storage.js");
// const myJsonData = {
//     name: "John Doe",
//     age: 30,
//     email: "johndoe@example.com",
// };
// storage.storeJsonToBlobStorage(myJsonData, "foo.json")
//     .then(() => console.log("JSON data stored in Azure Blob Storage"))
//     .catch((error) => console.error("Error storing JSON data:", error));

// storage
//     .readJsonFromBlobStorage("foo.json")
//     .then(() => console.log("JSON data read from Azure Blob Storage"))
//     .catch((error) => console.error("Error reading JSON data:", error));
