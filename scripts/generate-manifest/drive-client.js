const { google } = require('googleapis');
const path = require('path');
const config = require('./config.json');

function getDriveClient() {
  const keyPath = config.serviceAccountKeyPath || './service-account-key.json';
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(__dirname, keyPath),
    scopes: ['https://www.googleapis.com/auth/drive'],
    // A run can outlast the one-hour access token; on a 401, get a new token and retry once
    clientOptions: { forceRefreshOnFailure: true },
  });
  return google.drive({ version: 'v3', auth });
}

module.exports = { getDriveClient };
