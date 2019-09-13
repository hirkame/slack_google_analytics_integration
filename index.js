const { GoogleApis } = require('googleapis');
const google = new GoogleApis();
var analytics = google.analyticsreporting('v4');
var request = require('request');
var moment = require('moment');

var keys = require('./config/keys');

formatPeriod = () => {
  // Set a endDate
  var endDate = moment().format('YYYY-MM-DD');
  // set a startDate one week ago
  var startDate = moment()
    .add(-7, 'days')
    .format('YYYY-MM-DD');

  // return endDate and startDate
  return { startDate, endDate };
};

var jwtClient = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/analytics.readonly'],
  null
);

jwtClient.authorize((error, tokens) => {
  if (error) {
    console.log(error);
    return;
  }

  // Set a period of analytics.
  var period = formatPeriod();

  analytics.reports.batchGet(
    {
      resource: {
        reportRequests: [
          {
            viewId: keys.view_id,
            dateRanges: [
              {
                startDate: period.startDate,
                endDate: period.endDate
              }
            ],
            metrics: [{ expression: 'ga:pageviews' }],
            dimensions: [{ name: 'ga:pageTitle' }],
            orderBys: [{ fieldName: 'ga:pageviews', sortOrder: 'DESCENDING' }]
          }
        ]
      },
      auth: jwtClient
    },
    (error, response) => {
      if (error) {
        console.log(error);
      }

      var analyticsData = response.data.reports[0].data;
      var i = 0;
      var testData = [];
      while (analyticsData.rows[i]) {
        testData[i] = {
          title: i + 1 + '. ' + analyticsData.rows[i].dimensions[0],
          value: 'Pageviews: ' + analyticsData.rows[i].metrics[0].values[0]
        };
        i++;
      }
      sendToSlack(testData);
    }
  );
});

// Send Google Analytics Data through incoming webhook function.
const sendToSlack = data => {
  request.post(
    {
      uri: keys.slack_webhook_uri,
      headers: { 'Content-Type': 'application/json' },
      json: {
        icon_emoji: ':pushpin:',
        username: 'Google Analytics Notifier',
        attachments: [
          {
            fallback: 'fallback Test',
            pretext: 'Here is a Weekly Google Analytics summary!',
            color: '#79CDFD',
            fields: data
          }
        ]
      }
    },
    function(error, res, body) {
      console.log(error, body, res.statusCode);
    }
  );
};
