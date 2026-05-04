import { BlobServiceClient } from "@azure/storage-blob";

class BlobService {
  #blobServiceClient;

  constructor({ connectionString }) {
    this.#blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  getBlobServiceClient() {
    return this.#blobServiceClient;
  }
}

export const createBlobService = ({ connectionString }) => new StorageService({ connectionString });
