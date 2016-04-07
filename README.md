LIFX-CI
==============

Use the LIFX bulb as a CI build light with Jenkins......

Installation
============

```
$ npm install
```

Usage
=====


```
$ URL=https://my_ci_box.com AUTH=jenkins_user:jenkins_api_token JOB=my_jenkins_job_name node build_light.js
```

If no auth needed - drop the AUTH export
