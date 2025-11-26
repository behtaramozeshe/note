import { Client, Databases, Functions } from "appwrite";

const client = new Client();

// Replace these with your actual Appwrite IDs
const PROJECT_ID = "67d5e484001dab3f9eec";
const DATABASE_ID = "form-builder";
const COLLECTION_ID_NOTES = "notes"; // Renamed for clarity
const COLLECTION_ID_MOTHER = "mothernotes"; // NEW
const FUNCTION_ID_TRANSCRIPTION = "transcribe";
const FUNCTION_ID_EDIT = "editor"; // <--- ADD THIS

client.setEndpoint("https://cloud.appwrite.io/v1").setProject(PROJECT_ID);

export const databases = new Databases(client);
export const functions = new Functions(client);

// Export IDs to use them in other components
export const APPWRITE_CONFIG = {
  DATABASE_ID,
  COLLECTION_ID_NOTES,
  COLLECTION_ID_MOTHER,
  FUNCTION_ID_TRANSCRIPTION,
  FUNCTION_ID_EDIT,
};
