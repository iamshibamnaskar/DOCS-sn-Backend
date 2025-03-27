const express = require("express");
const { google } = require("googleapis");
const { Readable } = require("stream");
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Google OAuth Client
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:5173"
);

router.post("/create-folder",verifyToken, async (req, res) => {
    const { token } = req.body;
    console.log(process.env.CLIENT_ID)
    console.log(process.env.CLIENT_SECRET)

    if (!token) {
        return res.status(400).json({ error: "No token provided" });
    }

    console.log(token)

    try {
        oAuth2Client.setCredentials({ access_token: token });
        const drive = google.drive({ version: "v3", auth: oAuth2Client });
        console.log(2)

        // Check if folder exists
        const folderName = "DOCS-sn";
        const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;

        console.log(3)

        const response = await drive.files.list({ q: query });
        const folders = response.data.files;

        console.log(4)

        if (folders.length > 0) {
            console.log("Folder already exists:", folders[0].id);
            return res.json({ message: "Folder already exists", folderId: folders[0].id });
        }

        // Create the folder if it doesn't exist
        const fileMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
        };

        const createResponse = await drive.files.create({
            resource: fileMetadata,
            fields: "id",
        });

        console.log("Folder created with ID:", createResponse.data.id);
        res.json({ message: "Folder created", folderId: createResponse.data.id });

    } catch (error) {
        console.log(error)
        console.error("Error creating folder:", error.message);
        res.status(500).json({ error: error.message });
    }
});




router.post("/list-files",verifyToken, async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: "No token provided" });
    }

    try {
        oAuth2Client.setCredentials({ access_token: token });
        const drive = google.drive({ version: "v3", auth: oAuth2Client });

        // Get Folder ID for "DOCS-sn"
        const folderName = "DOCS-sn";
        const folderQuery = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;

        const folderResponse = await drive.files.list({ q: folderQuery });
        const folders = folderResponse.data.files;

        if (folders.length === 0) {
            return res.status(404).json({ error: "Folder not found" });
        }

        const folderId = folders[0].id;

        // Get Files inside the folder
        const fileQuery = `'${folderId}' in parents and trashed=false`;

        const filesResponse = await drive.files.list({
            q: fileQuery,
            fields: "files(id, name, mimeType, webViewLink, createdTime)",
        });

        const files = filesResponse.data.files;

        if (files.length === 0) {
            return res.json({ message: "No files found in the folder", files: [] });
        }

        res.json({ message: "Files retrieved successfully", files });
    } catch (error) {
        console.error("Error getting files:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post("/upload-doc",verifyToken, async (req, res) => {
    const { token, htmlContent, fileName } = req.body;
  
    if (!token || !htmlContent || !fileName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      oAuth2Client.setCredentials({ access_token: token });
      const drive = google.drive({ version: "v3", auth: oAuth2Client });
  
      // Step 1: Check if "DOCS-sn" folder exists
      const folderName = "DOCS-sn";
      const folderQuery = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
      const folderResponse = await drive.files.list({ q: folderQuery });
      const folders = folderResponse.data.files;
  
      let folderId;
      if (folders.length > 0) {
        folderId = folders[0].id;
        console.log("Folder found with ID:", folderId);
      } else {
        // Create "DOCS-sn" folder if it doesn't exist
        const folderMetadata = {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        };
        const createFolder = await drive.files.create({
          resource: folderMetadata,
          fields: "id",
        });
        folderId = createFolder.data.id;
        console.log("Folder created with ID:", folderId);
      }
  
      // Step 4: Convert HTML to Readable Stream
      const buffer = Buffer.from(htmlContent, "utf-8");
      const stream = Readable.from(buffer);
  
      // Step 5: Upload new DOCX file to "DOCS-sn" folder
      const fileMetadata = {
        name: `${fileName}.docx`,
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        parents: [folderId],
      };
  
      const media = {
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        body: stream,
      };
  
      const createResponse = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: "id",
      });
  
      console.log("DOCX file created with ID:", createResponse.data.id);
      res.json({ message: "DOCX file created", fileId: createResponse.data.id });
    } catch (error) {
      console.error("Error uploading DOCX file:", error.message);
      res.status(500).json({ error: error.message });
    }
  });
  


module.exports = router;
