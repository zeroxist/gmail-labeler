# Gmail Labeler

Label and filter Gmail threads using basic RegEx against the email body or headers.

## Configuration

#### Filters Options

```javascript
var filters = [
  // star emails deliveredto user@domain.com
  { name: 'user emails', match: /deliveredto:user@domain.com/, star: true },
  
  // organize by list name
  { match: /(?:List-ID:\s(.+?)\s<)/, archive: true },

  // label all emails with "bank" in the subject as "finance" and mark as read
  { name: 'finance', subject: 'bank', markRead: true },
];
```

* `name` - The label name to apply when matched. This can also be nested by adding slashes `folder/name`. If no name is set, it will use the first RegEx selector result (.+?)
* `match` - The RegEx to match against. This searches the entire raw contents of the email, including the header. Include a RegEx selector to return dynamic label names (.+?)
* `subject` - Helper to search the subject for text
* `archive` - true/false to archive the matching emails
* `star` - true/false to star the matching emails
* `markRead` - true/false to mark the matching emails as read

## From

```javascript
var from = [
  "from:email@domain.com",
  "list:subscription.domain.com"
];
```

This can be any combination of [Gmail filters](https://support.google.com/mail/answer/7190?hl=en) to apply the labels against.

## Installation

_You'll need to enable [Google App Scripts](https://script.google.com) in your Google Drive account_


#### Create a new Google App Script

![](https://cloud.githubusercontent.com/assets/35968/11613861/188b8622-9be5-11e5-812c-837f0f585d48.png)

#### Paste the labeler.gs contents into the new file and Save

![](https://cloud.githubusercontent.com/assets/35968/11613887/bddbaabc-9be5-11e5-81e9-7f6f2e897ac1.png)

#### After savings, create a new trigger

![](https://cloud.githubusercontent.com/assets/35968/11613897/eb3a119c-9be5-11e5-8f3c-728a00d693a6.png)

#### Run the `labeler` function every minute

![](https://cloud.githubusercontent.com/assets/35968/11613896/eb399d16-9be5-11e5-8292-1ff11201da1e.png)

#### Sample results:
[![Screenshot from 2016-11-23 17-24-23.png](https://s3.postimg.org/4drnvq0j7/Screenshot_from_2016_11_23_17_24_23.png)](https://postimg.org/image/5st8kg1m7/)

currently leveraging this companion GMail native filter, to identify emails that the script will process
[![Screenshot from 2016-11-28 11-57-03.png](https://s21.postimg.org/d74s7bojr/Screenshot_from_2016_11_28_11_57_03.png)](https://postimg.org/image/wc81h337n/)

```
Matches: ((from:notifications@github.com OR replyto:users@*apache.org OR replyto:dev@*apache.org) OR replyto:*@*yahoogroups.com OR replyto:*@*lists.jboss.org) AND -label:OSS-personal)
Do this: Apply label "OSS"

Matches: (to:(author@noreply.github.com OR mention@noreply.github.com ) OR cc:comment@noreply.github.com)
Do this: Apply label "OSS/personal", Categorize as Personal
```

#### Quota limits:
https://script.google.com/dashboard
