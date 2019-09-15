# What you can do
Send PageViews ranking to Slack from Google Analytics.

# Setup
## Google Developer Console & Google Analytics 
* Activate "Google Analytics Reporting API" on Google Developer Console.
* Create a service account key from credentials.
* Download it as JSON. 
* Access to Google Analytics and register client_email in the JSON file as a new user.

## Slack 
* Access to slack.
* Add Incoming WebHooks integration on channels you want to send notifications.
* Copy "Web Hook URL."

## Test locally
* Move the JSON file you just downloaded from Google into "config" folder.
* Rename it to "dev.js."
* Add the URL you just copied from Slack on dev.js like below. 
> slack_webhook_uri: "THE_LINK_YOU_JUST_COPIED_FROM_SLACK"
* Let's test in local by the command below.
> node index.js

## Deploy on Heroku
* Push your codes onto Heroku. 
* Set environment variables from setting.
![environment_variable](https://user-images.githubusercontent.com/38170678/64870568-7b0a3280-d67e-11e9-8b20-b71090dfe232.png)
* Setup the Heroku Scheduler.The default code is to send the daily GA report from the day before yesterday to yesterday. So, you can set the frequency of the scheduler as "Daily."

# References
@nishii 「Node.jsでGoogle AnalyticsのPV数を取得」 on Qiita (May 21, 2018)
https://qiita.com/nishii/items/b33f217c0a0521d82093

modeo.co "Heroku Scheduler with Node.js Tutorial" (January 08, 2015)
http://www.modeo.co/blog/2015/1/8/heroku-scheduler-with-nodejs-tutorial
