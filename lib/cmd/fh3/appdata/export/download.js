"use strict";

var fs = require('fs')
  , fhreq = require('../../../../utils/request.js')
  , async = require('async')
  , common = require('../../../../common');

module.exports = {
  'desc': 'Download the result of a completed export job by job_id',
  'examples': [{
    cmd: [
      'fhc addpata export download --appId=5ujx2eifvzaudq43nw4nmvcu --envId=live --jobId=5731da1dd3e2b283203c4054 ',
      '--file=export_5ujx2eifvzaudq43nw4nmvcu.gz.tar'
    ].join(''),
    desc: 'Download the result of a completed export job by job_id'
  }],
  'demand': ['envId', 'appId', 'jobId', 'file'],
  'alias': {},
  'describe': {
    'envId': 'Environment id',
    'appId': 'Application id',
    'jobId': 'Export job id',
    'file': 'Path and filename of downloaded file'
  },
  'method': 'get',
  'customCmd': function (params, cb) {
    var url  = 'api/v2/appdata/' + params.envId + '/' + params.appId + '/export/data/' + params.jobId;


    fs.stat(params.file, function (err) {
      // If there is no error this means the file does
      // exist
      if (!err) {
        return cb("The file at path [" + params.file + "] already exists. Aborting.");
      }

      // Get the download URL
      common.doApiCall(fhreq.getFeedHenryUrl(), url, null, 'Error downloading export', function (err, res) {
        if (err) {
          return cb(err);
        }

        params.url = res.url;
        params.method = 'GET';
        params.output = params.file;

        // Download it
        fhreq.downloadFile(params, cb);
      });
    });
  }
};
