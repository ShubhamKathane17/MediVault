# MediVault — Design Document
Author: Shubham Kathane  
Date: 2025-12-10  

-----------------------------------------
1. TECH STACK CHOICES
-----------------------------------------

Q1. What frontend framework did you use and why?  
Frontend: React.js  
Reason: React provides fast development using components, state management, and easy re-rendering of the UI when documents are uploaded, deleted, or downloaded. It is widely used, stable, and perfect for small to medium UI projects.

Q2. What backend framework did you choose and why?  
Backend: Node.js + Express  
Reason: Express is lightweight, easy to configure, and integrates perfectly with Multer (for file uploads). It requires minimal boilerplate and makes creating REST APIs very straightforward.

Q3. What database did you choose and why?  
Database: SQLite  
Reason: It is file-based, requires no setup, and is ideal for a local assignment. It supports SQL, performs well for small datasets, and is fully sufficient for storing document metadata.

Q4. If you were to support 1,000 users, what changes would you consider?  
- Move from SQLite to PostgreSQL (for concurrency and reliability).  
- Add authentication + user accounts.  
- Store documents in AWS S3 or GCP Storage instead of local disk.  
- Introduce caching (Redis) for faster API responses.  
- Add pagination + search to list documents.  
- Deploy using load balancers + multiple backend instances.  
- Introduce monitoring, logging, and rate limiting.

-----------------------------------------
2. ARCHITECTURE OVERVIEW
-----------------------------------------

Frontend ↔ Backend ↔ Database ↔ File Storage

Flow Summary:
- React UI sends requests to Express API.
- Express handles upload via Multer and saves PDFs to `/uploads/`.
- Document metadata is stored in SQLite.
- Listing documents fetches data from SQLite only.
- Download uses metadata → finds file → streams to client.
- Delete removes file from disk → removes DB row.

Simple Diagram:

[Browser: React UI]  
   | POST /documents/upload  
   v  
[Express API]  
   | writes file to uploads/  
   | inserts metadata into SQLite  
   |  
   | GET /documents → returns metadata  
   | GET /documents/:id → reads filepath → returns file  
   | DELETE /documents/:id → deletes file + DB row  
   v  
[SQLite + Local File Storage]

-----------------------------------------
3. API SPECIFICATION
-----------------------------------------

Base URL: http://localhost:5000/documents

-----------------------------------------
Endpoint: POST /documents/upload
-----------------------------------------
Upload a PDF file.

Request:
- multipart/form-data
- field name: file

Sample:
curl -X POST -F "file=@report.pdf" http://localhost:5000/documents/upload

Success Response:
{ "message": "File uploaded successfully" }

Errors:
{ "error": "No file uploaded" }
{ "error": "Only PDF files allowed" }
{ "error": "Database error" }

-----------------------------------------
Endpoint: GET /documents
-----------------------------------------
List all uploaded files.

Sample:
curl http://localhost:5000/documents

Response:
[
  {
    "id": 1,
    "filename": "1700000000-report.pdf",
    "filesize": 120000,
    "created_at": "2025-12-10 12:00:00"
  }
]

-----------------------------------------
Endpoint: GET /documents/:id
-----------------------------------------
Download a file.

Sample:
curl -O http://localhost:5000/documents/1

Errors:
{ "error": "File not found" }

-----------------------------------------
Endpoint: DELETE /documents/:id
-----------------------------------------
Delete file from disk + DB.

Sample:
curl -X DELETE http://localhost:5000/documents/1

Response:
{ "message": "File deleted successfully" }

-----------------------------------------
4. DATA FLOW DESCRIPTION
-----------------------------------------

UPLOAD FLOW:
1. User selects or drops a PDF in React UI.  
2. React creates FormData and sends POST /documents/upload.  
3. Express receives multipart/form-data and Multer stores file in `/uploads/`.  
4. Metadata (filename, filepath, size) is inserted into SQLite.  
5. Response returned → frontend refreshes list.

DOWNLOAD FLOW:
1. User clicks Download in the UI.  
2. Browser triggers GET /documents/:id.  
3. Express reads SQLite → retrieves filepath.  
4. Express streams file using res.download.  

DELETE FLOW:
1. User clicks Delete in React UI.  
2. React calls DELETE /documents/:id.  
3. Backend fetches filepath from DB.  
4. Removes file from disk.  
5. Deletes DB entry.  
6. Returns success message.

-----------------------------------------
5. ASSUMPTIONS
-----------------------------------------

- Only PDFs are allowed (server-side enforcement).  
- No authentication required for this assignment.  
- File size is assumed to be small (<10–20MB).  
- Local storage (`/uploads/`) is acceptable because it's a local assignment.  
- SQLite is sufficient for single-user or demo scale.  
- File paths are not exposed to the client for security reasons.  
- Frontend and backend run locally and independently (ports 3000 and 5000).  



## Screenshots


![text](<images/Screenshot 2025-12-10 235423.png>) 
![text](<images/Screenshot 2025-12-10 235447.png>) 
![text](<images/Screenshot 2025-12-10 235505.png>) 
![text](<images/Screenshot 2025-12-10 235528.png>) 
![text](<images/Screenshot 2025-12-10 235544.png>) 
![text](<images/Screenshot 2025-12-10 235607.png>) 
![text](<images/Screenshot 2025-12-10 235745.png>)
