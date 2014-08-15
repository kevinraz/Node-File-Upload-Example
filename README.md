Node.js File Upload Example
===============
## Purpose

Creates an HTTP server to listen on user specified port.
API includes a RESTful file upload and download utility.

## How to Install/Use

### Installation is as easy as running:
```bash
git clone git@github.com:kevinraz/Node-File-Upload-Example.git
```


### Start service:
```bash
node index.js
```

## Outline
Create a basic node.js program that provides a HTTP service listening on port 18881 which allows a HTTP client to create a new file object, then upload and download the file data for the file object.

The service should meet the following minimum requirements:
- The following API should be used:
  - POST /files
    - The request should allow a client to create a new file object and set its name and extension properties, but not upload file data.
    - The response should provide the new file’s fileId.
  - GET /files/{fileId}
    - The response should return the name and extension properties associated with withfile object.
  - PUT /files/{fileId}/data
    - The request should upload the file data for the existing file object.
    - The request header Content-Type should be set appropriately.
  - GET /files/{fileId}/data
    - The response should provide the file data for the existing file object.
    - The response header Content-Type should be set appropriately.
- File data should be transferred directly in the request and response bodies.
- Use JSON for any text data in request and response bodies.
- Each request should use a custom HTTP header to pass in a client’s API key.
  - The API key need only be checked for existence in the service.
- File data should be stored on the local disk in the PUT request.
- File data should be retrieved from the local disk in the GET request.
- You may choose how the service stores file object properties name and extension.

