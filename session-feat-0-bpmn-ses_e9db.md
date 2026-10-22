# BPMN Modeler Options for Human and Agent Collaboration

**Session ID:** ses_e9dba44c0ffeWI7zq55JeJ5y5h
**Created:** 10/22/2026, 8:21:39 AM
**Updated:** 10/22/2026, 5:59:45 PM

---

## User

I want to use a BPMN modeler that has a UI that a user and an agent can both concurrently to create, change, import, export, validate and parse BPMN diagrams. What are my options?

---

## Assistant (Plan · Claude Sonnet 5 · 6.2s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "find /home/user/src/docs -maxdepth 3 -iname \"*bpmn*\" 2>/dev/null; echo \"---\"; ls /home/user/src/docs"
}
```

**Output:**
```
---
README.md
docs
md
pyproject.toml
sources
src
uv.lock

```

---

## Assistant (Plan · Claude Sonnet 5 · 3.6s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "echo \"=== README ===\"; cat /home/user/src/docs/README.md 2>/dev/null | head -50; echo \"=== docs dir ===\"; find /home/user/src/docs/docs -maxdepth 2 2>/dev/null; echo \"=== src dir ===\"; find /home/user/src/docs/src -maxdepth 3 2>/dev/null; echo \"=== sources ===\"; find /home/user/src/docs/sources -maxdepth 2 2>/dev/null; echo \"=== md ===\"; find /home/user/src/docs/md -maxdepth 2 2>/dev/null"
}
```

**Output:**
```
=== README ===
=== docs dir ===
/home/user/src/docs/docs
/home/user/src/docs/docs/sop
/home/user/src/docs/docs/sop/sop-c79d22e9-af15-4168-92ed-b659bedc22d5-pdf-to-markdown-conversion-of-reference-documents.md
/home/user/src/docs/docs/arc
/home/user/src/docs/docs/arc/arc-c4-example.md
/home/user/src/docs/docs/arc/viewpoints-resource-draft.md
/home/user/src/docs/docs/arc/order-api.md
/home/user/src/docs/docs/arc/order-service.md
/home/user/src/docs/docs/arc/oms-root.md
/home/user/src/docs/docs/qa
/home/user/src/docs/docs/qa/qa-6dfe1a2f-6102-4460-8d28-efe1053e9a4e-open-design-decisions-for-new-specmgr-artifact-types-cr-arc.md
=== src dir ===
/home/user/src/docs/src
/home/user/src/docs/src/docs
/home/user/src/docs/src/docs/convert.py
/home/user/src/docs/src/docs/__init__.py
/home/user/src/docs/src/docs/__pycache__
/home/user/src/docs/src/docs/__pycache__/__init__.cpython-313.pyc
/home/user/src/docs/src/docs/__pycache__/convert.cpython-313.pyc
=== sources ===
/home/user/src/docs/sources
/home/user/src/docs/sources/iso-iec-25063-2014.pdf
/home/user/src/docs/sources/iso-iec-tr-25060-2010.pdf
/home/user/src/docs/sources/Business Architecture Guild BIZBOK tXRTC4AohgoP78nnKEBrxt2r---BIZBOK_9r_vp.pdf
/home/user/src/docs/sources/iso-iec-25001-2014.pdf
/home/user/src/docs/sources/iso-iec-ieee-42010-2011.pdf
/home/user/src/docs/sources/iso-iec-ieee-15288-2023.pdf
/home/user/src/docs/sources/iso-iec-25010-2011.pdf
/home/user/src/docs/sources/iso-iec-25040-2011.pdf
/home/user/src/docs/sources/iso-iec-25041-2012.pdf
/home/user/src/docs/sources/agile-extension-v2.pdf
/home/user/src/docs/sources/iso-iec-25020-2007.pdf
/home/user/src/docs/sources/wegleitung-natuerliche-personen-2025-de.pdf
/home/user/src/docs/sources/iso-iec-25064-2013.pdf
/home/user/src/docs/sources/iso-iec-ieee-29148-2018.pdf
/home/user/src/docs/sources/wegleitung-natuerliche-personen-2025-fr.pdf
/home/user/src/docs/sources/iso-iec-25051-2014.pdf
/home/user/src/docs/sources/babok-guide-v3.pdf
/home/user/src/docs/sources/iso-iec-27002-2022.pdf
/home/user/src/docs/sources/iso-dis-22301-2019.pdf
/home/user/src/docs/sources/iso-iec-25030-2007.pdf
/home/user/src/docs/sources/iso-iec-ieee-24765-2017.pdf
/home/user/src/docs/sources/iso-iec-ieee-12207-2026.pdf
/home/user/src/docs/sources/iso-iec-25012-2008.pdf
/home/user/src/docs/sources/iso-iec-27001-2022.pdf
/home/user/src/docs/sources/iso-iec-25045-2010.pdf
/home/user/src/docs/sources/iso-iec-25000-2014.pdf
=== md ===
/home/user/src/docs/md
/home/user/src/docs/md/iso-iec-ieee-15288-2023.md
/home/user/src/docs/md/iso-iec-ieee-12207-2026.md
/home/user/src/docs/md/iso-iec-ieee-29148-2018.md
/home/user/src/docs/md/img
/home/user/src/docs/md/img/iso-iec-ieee-15288-2023
/home/user/src/docs/md/img/iso-iec-ieee-29148-2018
/home/user/src/docs/md/img/iso-iec-ieee-12207-2026

```

---

## Assistant (Plan · Claude Sonnet 5 · 45.6s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://bpmn.io/toolkit/bpmn-js/",
  "format": "markdown"
}
```

**Output:**
```
            bpmn-js: BPMN 2.0 rendering toolkit and web modeler | Toolkits | bpmn.io         

Toggle navigation[](../..)

-   [bpmn-js](../bpmn-js)
    -   [Toolkit](../bpmn-js)
    -   [Download](download)
    
    -   [Examples](examples)
    -   [Walkthrough](walkthrough)
-   [dmn-js](../dmn-js)
    -   [Toolkit](../dmn-js)
    -   [Download](../dmn-js/download)
-   [form-js](../form-js)
    -   [Toolkit](../form-js)
    -   [Download](../form-js/download)

-   [Blog](../../blog)
-   [Forum](https://forum.bpmn.io)
-   [GitHub](https://github.com/bpmn-io "Explore our projects on GitHub")
-   [Mastodon](https://fosstodon.org/@bpmn_io "Follow us on Mastodon")

bpmn-js

BPMN 2.0 viewer and editor.

[Try Online](http://demo.bpmn.io) [Download](download)

Currently [v18.16.0](https://github.com/bpmn-io/bpmn-js/blob/develop/CHANGELOG.md#18160). [View on GitHub](https://github.com/bpmn-io/bpmn-js).

## BPMN everywhere, for everyone

Create, embed and extend BPMN diagrams in your Browser. Use it standalone or integrate it into your application.

---

![Model BPMN 2.0 diagrams](../../assets/img/model.png)

### Model

Easily create your own BPMN 2.0 diagrams using a [web-based modeling component](http://demo.bpmn.io).

![Embed BPMN 2.0 diagrams into the application](../../assets/img/embed.png)

### Embed and Annotate

Use the toolkit to embed BPMN 2.0 diagrams into your applications. [Enrich them](https://github.com/bpmn-io/bpmn-js-examples/tree/main/commenting) with the data that is important for you and your business.

![Extend the framework](../../assets/img/extend.png)

### Extend

Integrate an in-browser process engine, [token simulation](https://github.com/bpmn-io/bpmn-js-token-simulation), [custom elements](https://github.com/bpmn-io/bpmn-js-examples/tree/main/custom-elements), [styling](https://github.com/bpmn-io/bpmn-js-examples/tree/main/colors) or [modeling rules](https://github.com/bpmn-io/bpmn-js-examples/tree/main/custom-modeling-rules). It is up to you because bpmn-js is an open toolkit.

---

## Add BPMN diagrams to your application

Embed BPMN diagrams in your application with a few lines of code.

```html
<script>
  const viewer = new BpmnJS({ container: 'body' });

  try {
    await viewer.importXML(bpmnXML);
  } catch (err) {
    console.error('error loading BPMN 2.0 XML', err);
  }
</script>
```

Download our [starters](https://github.com/bpmn-io/bpmn-js-examples/tree/main/starter) and get running in no time.

Read our [walkthrough](walkthrough) or check out some [examples](examples) to learn more.

---

## Make it yours

bpmn-js is built for extensibility. [Customize](https://github.com/bpmn-io/bpmn-js-nyan) or [extend](https://github.com/bpmn-io/bpmn-js-examples/tree/main/custom-elements) the toolkit to suit your needs.

---

## Brought to you by Camunda

[The bpmn.io project](../../about) is brought to you by the makers of Camunda.

If you are looking to create BPMN diagrams, we encourage you to [sign-up for a free Camunda account](https://signup.camunda.com/accounts/?uc=signup&utm_medium=referral&utm_source=bpmn.io).

 

-   [Blog](../../blog)
-   [Forum](https://forum.bpmn.io)
-   [GitHub](https://github.com/bpmn-io)
-   [Mastodon](https://fosstodon.org/@bpmn_io)
-   [Online Demo](http://demo.bpmn.io)
-   [Camunda Modeler](https://camunda.com/platform/modeler/)
-   [Roadmap](../../roadmap)

-   [About](../../about)
-   [Work with us](https://camunda.com/career/)
-   [License](../../license)
-   [Imprint](/legal/imprint)
-   [Privacy Policy](https://camunda.com/legal/privacy)
-   [Cookie Preferences](#)

[bpmn.io](https://bpmn.io) is built and maintained by [Camunda](https://camunda.com) and contributors.

[](https://camunda.com)

Camunda Services GmbH © 2026
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/bpmn-io/bpmn-js",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - bpmn-io/bpmn-js: A BPMN 2.0 rendering toolkit and web modeler. · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmn-js)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmn-js)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=bpmn-io%2Fbpmn-js)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [bpmn-io](/bpmn-io)
2.  [bpmn-js](/bpmn-io/bpmn-js)

## Repository navigation

-   [Code](/bpmn-io/bpmn-js)
-   [Issues116 (116)](/bpmn-io/bpmn-js/issues)
-   [Pull requests3 (3)](/bpmn-io/bpmn-js/pulls)
-   [Actions](/bpmn-io/bpmn-js/actions)
-   [Security and quality](/bpmn-io/bpmn-js/security)
-   [Insights](/bpmn-io/bpmn-js/pulse)

More items

 [](/bpmn-io/bpmn-js)

![bpmn-io](https://avatars.githubusercontent.com/u/6481734?s=60&v=4)

**[bpmn-js](/bpmn-io/bpmn-js)**

Public

-   [Notifications](/login?return_to=%2Fbpmn-io%2Fbpmn-js)You must be signed in to change notification settings
-   [Fork1.5k (1.5k)](/login?return_to=%2Fbpmn-io%2Fbpmn-js)
-   [Star9.7k (9.7k)](/login?return_to=%2Fbpmn-io%2Fbpmn-js)You must be signed in to star a repository

## About

A BPMN 2.0 rendering toolkit and web modeler.

[bpmn.io/toolkit/bpmn-js/](https://bpmn.io/toolkit/bpmn-js/)

### Topics

[bpmn](/topics/bpmn)[bpmn-js](/topics/bpmn-js)[browser](/topics/browser)[hacktoberfest](/topics/hacktoberfest)[javascript](/topics/javascript)[modeler](/topics/modeler)[toolkit](/topics/toolkit)

### Resources

[Readme](#readme-ov-file)

[License](#License-1-ov-file)

### Code of conduct

[Code of conduct](/bpmn-io/bpmn-js#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/bpmn-io/bpmn-js/activity)

[Custom properties](/bpmn-io/bpmn-js/custom-properties)

### Stars

**9.7k** stars

### Watchers

**228** watching

### Forks

[**1.5k** forks](/bpmn-io/bpmn-js/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmn-js&report=bpmn-io+%28user%29)

develop

[Branches](/bpmn-io/bpmn-js/branches)[Tags](/bpmn-io/bpmn-js/tags)

[](/bpmn-io/bpmn-js/branches)[](/bpmn-io/bpmn-js/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[3,566 Commits](/bpmn-io/bpmn-js/commits/develop/)

[](/bpmn-io/bpmn-js/commits/develop/)3,566 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github](/bpmn-io/bpmn-js/tree/develop/.github ".github")

[.github](/bpmn-io/bpmn-js/tree/develop/.github ".github")

[assets](/bpmn-io/bpmn-js/tree/develop/assets "assets")

[assets](/bpmn-io/bpmn-js/tree/develop/assets "assets")

[docs](/bpmn-io/bpmn-js/tree/develop/docs "docs")

[docs](/bpmn-io/bpmn-js/tree/develop/docs "docs")

[lib](/bpmn-io/bpmn-js/tree/develop/lib "lib")

[lib](/bpmn-io/bpmn-js/tree/develop/lib "lib")

[resources](/bpmn-io/bpmn-js/tree/develop/resources "resources")

[resources](/bpmn-io/bpmn-js/tree/develop/resources "resources")

[tasks](/bpmn-io/bpmn-js/tree/develop/tasks "tasks")

[tasks](/bpmn-io/bpmn-js/tree/develop/tasks "tasks")

[test](/bpmn-io/bpmn-js/tree/develop/test "test")

[test](/bpmn-io/bpmn-js/tree/develop/test "test")

[.gitignore](/bpmn-io/bpmn-js/blob/develop/.gitignore ".gitignore")

[.gitignore](/bpmn-io/bpmn-js/blob/develop/.gitignore ".gitignore")

[AGENTS.md](/bpmn-io/bpmn-js/blob/develop/AGENTS.md "AGENTS.md")

[AGENTS.md](/bpmn-io/bpmn-js/blob/develop/AGENTS.md "AGENTS.md")

[CHANGELOG.md](/bpmn-io/bpmn-js/blob/develop/CHANGELOG.md "CHANGELOG.md")

[CHANGELOG.md](/bpmn-io/bpmn-js/blob/develop/CHANGELOG.md "CHANGELOG.md")

[CLAUDE.md](/bpmn-io/bpmn-js/blob/develop/CLAUDE.md "CLAUDE.md")

[CLAUDE.md](/bpmn-io/bpmn-js/blob/develop/CLAUDE.md "CLAUDE.md")

[LICENSE](/bpmn-io/bpmn-js/blob/develop/LICENSE "LICENSE")

[LICENSE](/bpmn-io/bpmn-js/blob/develop/LICENSE "LICENSE")

[README.md](/bpmn-io/bpmn-js/blob/develop/README.md "README.md")

[README.md](/bpmn-io/bpmn-js/blob/develop/README.md "README.md")

[eslint.config.mjs](/bpmn-io/bpmn-js/blob/develop/eslint.config.mjs "eslint.config.mjs")

[eslint.config.mjs](/bpmn-io/bpmn-js/blob/develop/eslint.config.mjs "eslint.config.mjs")

[package-lock.json](/bpmn-io/bpmn-js/blob/develop/package-lock.json "package-lock.json")

[package-lock.json](/bpmn-io/bpmn-js/blob/develop/package-lock.json "package-lock.json")

[package.json](/bpmn-io/bpmn-js/blob/develop/package.json "package.json")

[package.json](/bpmn-io/bpmn-js/blob/develop/package.json "package.json")

[renovate.json](/bpmn-io/bpmn-js/blob/develop/renovate.json "renovate.json")

[renovate.json](/bpmn-io/bpmn-js/blob/develop/renovate.json "renovate.json")

[rollup.config.js](/bpmn-io/bpmn-js/blob/develop/rollup.config.js "rollup.config.js")

[rollup.config.js](/bpmn-io/bpmn-js/blob/develop/rollup.config.js "rollup.config.js")

[tsconfig.json](/bpmn-io/bpmn-js/blob/develop/tsconfig.json "tsconfig.json")

[tsconfig.json](/bpmn-io/bpmn-js/blob/develop/tsconfig.json "tsconfig.json")

View all files

## Repository files navigation

-   [README](#)
-   [Code of conduct](#)
-   [Contributing](#)
-   [License](#)
-   [Security](#)

More items

# bpmn-js - BPMN 2.0 for the web

[](#bpmn-js---bpmn-20-for-the-web)

[![Build Status](https://github.com/bpmn-io/bpmn-js/workflows/CI/badge.svg)](https://github.com/bpmn-io/bpmn-js/actions?query=workflow%3ACI)

View and edit BPMN 2.0 diagrams in the browser.

[![bpmn-js screencast](/bpmn-io/bpmn-js/raw/develop/resources/screencast.gif "bpmn-js in action")](http://demo.bpmn.io/s/start)

## Installation

[](#installation)

Use the library [pre-packaged](https://github.com/bpmn-io/bpmn-js-examples/tree/main/pre-packaged) or include it [via npm](https://github.com/bpmn-io/bpmn-js-examples/tree/main/bundling) into your node-style web-application.

## Usage

[](#usage)

To get started, create a [bpmn-js](https://github.com/bpmn-io/bpmn-js) instance and render [BPMN 2.0 diagrams](https://www.omg.org/spec/BPMN/2.0.2/) in the browser:

const xml \= '...'; // my BPMN 2.0 xml
const viewer \= new BpmnJS({
  container: 'body'
});

try {
  const { warnings } \= await viewer.importXML(xml);

  console.log('rendered');
} catch (err) {
  console.log('error rendering', err);
}

Checkout our [examples](https://github.com/bpmn-io/bpmn-js-examples) for many more supported usage scenarios.

## Resources

[](#resources)

-   [Demo](http://demo.bpmn.io)
-   [Issues](https://github.com/bpmn-io/bpmn-js/issues)
-   [Examples](https://github.com/bpmn-io/bpmn-js-examples)
-   [Forum](https://forum.bpmn.io)
-   [Changelog](/bpmn-io/bpmn-js/blob/develop/CHANGELOG.md)

## Build and Run

[](#build-and-run)

Prepare the project by installing all dependencies:

npm install

Then, depending on your use-case you may run any of the following commands:

# build the library and run all tests
npm run all

# spin up a single local modeler instance
npm start

# run the full development setup
npm run dev

You may need to perform [additional project setup](/bpmn-io/bpmn-js/blob/develop/docs/project/SETUP.md) when building the latest development snapshot.

## Related

[](#related)

bpmn-js builds on top of a few powerful tools:

-   [bpmn-moddle](https://github.com/bpmn-io/bpmn-moddle): Read / write support for BPMN 2.0 XML in the browser
-   [diagram-js](https://github.com/bpmn-io/diagram-js): Diagram rendering and editing toolkit

It is an extensible toolkit, complemented by many [additional utilities](https://github.com/bpmn-io/awesome-bpmn-io).

## License

[](#license)

Use under the terms of the [bpmn.io license](http://bpmn.io/license).

## About

A BPMN 2.0 rendering toolkit and web modeler.

[bpmn.io/toolkit/bpmn-js/](https://bpmn.io/toolkit/bpmn-js/)

### Topics

[bpmn](/topics/bpmn)[bpmn-js](/topics/bpmn-js)[browser](/topics/browser)[hacktoberfest](/topics/hacktoberfest)[javascript](/topics/javascript)[modeler](/topics/modeler)[toolkit](/topics/toolkit)

### Resources

[Readme](#readme-ov-file)

[License](#License-1-ov-file)

### Code of conduct

[Code of conduct](/bpmn-io/bpmn-js#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/bpmn-io/bpmn-js/activity)

[Custom properties](/bpmn-io/bpmn-js/custom-properties)

### Stars

**9.7k** stars

### Watchers

**228** watching

### Forks

[**1.5k** forks](/bpmn-io/bpmn-js/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmn-js&report=bpmn-io+%28user%29)

## Releases

## Used by

## Contributors

## Languages

## Footer

[](https://github.com)© 2026 GitHub, Inc.

### Footer navigation

-   [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
-   [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
-   [Security](https://github.com/security)
-   [Status](https://www.githubstatus.com/)
-   [Community](https://github.community/)
-   [Docs](https://docs.github.com/)
-   [Contact](https://support.github.com?tags=dotcom-footer)
-   Manage cookies
-   Do not share my personal information

You can’t perform that action at this time.
```

---

## Assistant (Plan · Claude Sonnet 5 · 5.2s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://camunda.com/platform/modeler/",
  "format": "markdown"
}
```

**Output:**
```
Camunda Modeler | BPMN Process Modeler | Camunda

[![Camunda](/logo-camunda.svg?dpl=dpl_2xYGo6wciUiwkjP7iT2GxHLeeEw6)](/)

The Pivot

The Platform

The Proof

[Contact us](/contact/)[</>Developers](/developer-hub/)

# Design the process you're accountable for and ship it without waiting on a backlog

Camunda Modeler is where business teams sketch claims, onboarding, and order-to-cash workflows, and where those drawings actually run.

[Talk to sales](/contact/)[Try Modeler free](https://docs.camunda.io/build-with-camunda/)

![Camunda Modeler showing a BPMN process diagram with deploy controls and team collaboration comments](https://cdn.sanity.io/images/12wkat9h/development/85db6a04bab9924c26a22feab920328f76582b38-2662x1253.png)

## The gap between what you designed and what runs

A business team sketches a process on a whiteboard, hands it to IT, and waits. By the time the workflow ships, the policy that motivated it has changed twice. When the next change comes (a new regulation, a new agent, a new SLA), the whole loop runs again. Every quarter you wait is a quarter your customers feel.

Camunda Modeler removes the loop. Business stakeholders, low-code developers, and software engineers all author the same artifact. The visual diagram is the executable model. The executable model is what runs, monitors, and improves.

### Key takeaways

-   Business teams design and own the process — no requirements doc, no IT translation, no waiting on a backlog.
-   The diagram business reviews is the exact model that runs in production.
-   Changes ship in days: edit the diagram, redeploy, in-flight cases continue safely on the version they started.
-   AI-assisted drafting turns a plain-language description into a working process in minutes.
-   Built on open BPMN: your processes stay portable as infrastructure, agents, and frameworks evolve.

## From whiteboard to production

The predictable steps that run automatically. The AI agents that handle exceptions. The human approvals that govern what matters most. Everything lives in one model, and the model is what runs.

#### One artifact from workshop to runtime

The diagram you sketch in a workshop is the system that runs in production. No requirements doc to translate. No IT rebuild. The same artifact moves from review to runtime.

#### From outcome description to working draft

Tell Camunda Copilot what the process should do. It generates the steps, the decisions, the connectors, and the forms. You review the diagram, edit what doesn’t fit, and deploy. Hours instead of weeks.

#### Your team stops waiting on IT

Business analysts add documentation and validation rules. Low-code developers wire connectors and forms. Engineers extend with code where it’s needed. Same diagram. No round-trips. Changes ship in days, not quarters.

## Built for every role in the process

The leader who owns the outcome and the developer who builds the integrations work on the same diagram. No handoffs. No rework when the policy changes.

### You’re measured on cycle time, error rates, and SLAs. Not on how the system gets built.

Sketch the process you want with drag-and-drop blocks. Set the policy rules and approval gates you’re accountable for. Mark where AI agents act and where humans review. Propose changes through the same diagram your IT team deploys, and see them ship in days, not quarters.

-   Visual canvas with no XML or code to read
-   Templates for claims, onboarding, order-to-cash, and casework
-   Decision rules and policies in plain language
-   Stakeholder comments and review built into the diagram

### Compose the process. Don’t code it from scratch.

Browse hundreds of connectors in Camunda Marketplace. Plug in AI agents from any provider or framework. Work in your preferred programming languages, using your CI/CD pipeline.

-   Drag-and-drop forms, decision rules, and connectors
-   Marketplace templates across hundreds of integrations
-   Process tests with click-based mocking and assertions
-   Escape to code anytime, no rebuild required

“

> The modeler is the first tool where my process team and the engineering team are looking at exactly the same thing.

Process Excellence Lead

Head of Process Excellence, Financial Services

## AI-assisted process modeling

Describe the result you want, like “approve a loan within four hours when documentation is complete,” and Camunda Copilot turns the intent into a runnable process. Tasks, decisions, agent prompts, connector configurations, and forms are all generated for review. You stay in control. Every change is yours to edit and approve before it deploys.

ProcessOS takes that further. It discovers how your processes actually run, re-engineers them around the outcomes you define (cycle time, accuracy, cost per case), and continuously improves what’s in production. Every proposed change is backtested against your historical data before it reaches your review queue. You deploy with evidence, not hope.

[See it in a demo](/contact/)[Learn about ProcessOS](/platform/process-os/)

## Connects directly to the runtime

The diagram you publish in Modeler immediately becomes a running process. Every step is observable in real time. Every bottleneck and SLA breach is traceable. Every change is versioned and audited. Whether you start with one process or one thousand, you have one operating model, not three siloed tools.

[Learn more about BPMN →](/bpmn/)

#### Deploy in one click

Publish directly to Camunda SaaS or Self-Managed. Versioned process definitions mean no breaking changes for in-flight work. Cases already in motion finish on the rules they started under.

#### See every case in flight

Live dashboards show which step every claim, application, or order is on, who’s working it, and how long it’s been waiting. SLA breaches surface before customers feel them.

#### Open by design

BPMN is an international standard. If you ever switch infrastructure, AI providers, or agent frameworks, your processes go with you. No vendor lock-in.

## Used by thousands of enterprise process teams

50%

#### Banca CF+

Process delivery time cut in half. Workflows that took four weeks now ship in two, modeled and deployed on the same canvas.

[Read case study →](/case-studies/banca-cf-plus/)

6 months

#### Generali Switzerland

Fully integrated and live in under six months, with no prior BPMN experience on the team. Modeling, learning, and shipping happened on one canvas.

[Read case study →](/case-studies/generali-switzerland/)

80%

#### Jyske Bank

Reduction in manual task time on KYC compliance processes. BPMN modeling let the team orchestrate every step — timers, user tasks, and edge cases — precisely on one canvas.

[Read case study →](/case-studies/jyske-bank/)

## Frequently asked questions

Can business teams really design processes without IT?

Yes. Modeler is a visual canvas with drag-and-drop blocks, plain-language decision rules, and no code or XML to read. Business teams own the process design: the steps, the policies, the approval gates, the points where AI agents act and where humans review. IT provides the connectors, security, and runtime, on the same diagram and not in a separate layer. The result is faster delivery without losing governance.

How fast can a new process go from idea to production?

Days to weeks, depending on complexity and integrations. Banca CF+ cut process delivery time by 50%: workflows that used to take four weeks now ship in two. Generali Switzerland was live with Camunda in under six months, with no prior BPMN experience on the team. Because the diagram is the executable model, there is no translation phase between business design and IT implementation.

What is Camunda Modeler?

Camunda Modeler is the visual design tool for building executable business processes on the Camunda platform. Business stakeholders, low-code developers, and software engineers all author the same diagram. What you draw is what runs. Modeler is available as a free desktop application and as a collaborative web application in Camunda 8.

Do I need to know BPMN to use Camunda Modeler?

No. Modeler ships with templates for common processes (claims, onboarding, order-to-cash, casework) and Camunda Copilot, which generates a working draft from a natural-language description. You can start from a template or describe the outcome you want, then refine the diagram from there.

Is Camunda Modeler free?

Yes. The desktop Modeler is free and open source. The web-based Modeler is included with the Camunda 8 free trial and all paid plans.

What systems can I integrate with?

Hundreds of pre-built connectors for SAP, Salesforce, ServiceNow, and other enterprise systems. Plus connectors for AI agents from any major framework: Claude, Gemini, LangChain, CrewAI, and custom-built agents. When developers need to drop into code, SDKs are available for Java, Go, Python, and Node.js.

## Ready to get started?

[Talk to sales](/contact/)[Try free](https://docs.camunda.io/build-with-camunda/)

## Orchestrate

-   [Agentic orchestration](/what-is-agentic-orchestration/)
-   [Process](/orchestrate/processes/)
-   [Agents](/orchestrate/agents/)
-   [Building blocks](/orchestrate/building-blocks/)
-   [ProcessOS](/platform/process-os/)
-   [Platform capabilities](/platform/)
-   [Security](/security/)
-   [All use cases](/platform/use-cases/)

## Why now

-   [Why now](/learn/the-great-re-engineering/)
-   [State of agentic orchestration](/state-of-agentic-orchestration-and-automation/)

## Why Camunda

-   [Case studies](/case-studies/)
-   [Industries hub](/outcomes/industries/)
-   [Open framework](/open-framework/)
-   [Analyst recognition](/what-analysts-say/)

## Developers

-   [Developer hub](/developer-hub/)
-   [Documentation](https://docs.camunda.io/)
-   [Forum](https://forum.camunda.io/)
-   [Release notes](https://docs.camunda.io/docs/reference/announcements-release-notes/overview/)
-   [Marketplace](https://marketplace.camunda.com/en-US/home)
-   [Downloads](https://docs.camunda.io/downloads/)
-   [Log in](https://console.camunda.io)
-   [Try it free](https://docs.camunda.io/build-with-camunda/)

## Learn

-   [Academy](https://academy.camunda.com)
-   [Documentation](https://docs.camunda.io/)
-   [Blog](/blog/)
-   [Best practices / guides](https://docs.camunda.io/docs/components/best-practices/best-practices-overview/)
-   [Resource library](/resources/)

## Partners

-   [Find a partner](/partners/)
-   [Become a partner](/become-a-partner/)
-   [Partner login](https://partnerportal.camunda.com/)

## Company

-   [Who we are](/about/)
-   [Careers](/careers/)
-   [Press](/about/press/)
-   [Contact](/contact/)
-   [Trust Center](https://trust.camunda.com/)
-   [Upcoming events](/events/)
-   [CamundaCon](https://camundacon.com)

-   Orchestrate
    
    -   [Agentic orchestration](/what-is-agentic-orchestration/)
    -   [Process](/orchestrate/processes/)
    -   [Agents](/orchestrate/agents/)
    -   [Building blocks](/orchestrate/building-blocks/)
    -   [ProcessOS](/platform/process-os/)
    -   [Platform capabilities](/platform/)
    -   [Security](/security/)
    -   [All use cases](/platform/use-cases/)
    
-   Why now
    
    -   [Why now](/learn/the-great-re-engineering/)
    -   [State of agentic orchestration](/state-of-agentic-orchestration-and-automation/)
    
-   Why Camunda
    
    -   [Case studies](/case-studies/)
    -   [Industries hub](/outcomes/industries/)
    -   [Open framework](/open-framework/)
    -   [Analyst recognition](/what-analysts-say/)
    
-   Developers
    
    -   [Developer hub](/developer-hub/)
    -   [Documentation](https://docs.camunda.io/)
    -   [Forum](https://forum.camunda.io/)
    -   [Release notes](https://docs.camunda.io/docs/reference/announcements-release-notes/overview/)
    -   [Marketplace](https://marketplace.camunda.com/en-US/home)
    -   [Downloads](https://docs.camunda.io/downloads/)
    -   [Log in](https://console.camunda.io)
    -   [Try it free](https://docs.camunda.io/build-with-camunda/)
    
-   Learn
    
    -   [Academy](https://academy.camunda.com)
    -   [Documentation](https://docs.camunda.io/)
    -   [Blog](/blog/)
    -   [Best practices / guides](https://docs.camunda.io/docs/components/best-practices/best-practices-overview/)
    -   [Resource library](/resources/)
    
-   Partners
    
    -   [Find a partner](/partners/)
    -   [Become a partner](/become-a-partner/)
    -   [Partner login](https://partnerportal.camunda.com/)
    
-   Company
    
    -   [Who we are](/about/)
    -   [Careers](/careers/)
    -   [Press](/about/press/)
    -   [Contact](/contact/)
    -   [Trust Center](https://trust.camunda.com/)
    -   [Upcoming events](/events/)
    -   [CamundaCon](https://camundacon.com)
    

-   Cookie Preferences
-   [Privacy Statement](https://legal.camunda.com/privacy-and-data-protection)
-   [Legal Center](/legal-center/)
-   [Impressum](/legal/imprint/)
-   [Brand](/brand/)

© Camunda 2026. All Rights Reserved
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/bpmn-io/bpmnlint",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - bpmn-io/bpmnlint: Validate BPMN diagrams based on configurable lint rules. · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmnlint)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmnlint)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=bpmn-io%2Fbpmnlint)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [bpmn-io](/bpmn-io)
2.  [bpmnlint](/bpmn-io/bpmnlint)

## Repository navigation

-   [Code](/bpmn-io/bpmnlint)
-   [Issues13 (13)](/bpmn-io/bpmnlint/issues)
-   [Pull requests1 (1)](/bpmn-io/bpmnlint/pulls)
-   [Actions](/bpmn-io/bpmnlint/actions)
-   [Security and quality](/bpmn-io/bpmnlint/security)
-   [Insights](/bpmn-io/bpmnlint/pulse)

More items

 [](/bpmn-io/bpmnlint)

![bpmn-io](https://avatars.githubusercontent.com/u/6481734?s=60&v=4)

**[bpmnlint](/bpmn-io/bpmnlint)**

Public

-   [Notifications](/login?return_to=%2Fbpmn-io%2Fbpmnlint)You must be signed in to change notification settings
-   [Fork48 (48)](/login?return_to=%2Fbpmn-io%2Fbpmnlint)
-   [Star173 (173)](/login?return_to=%2Fbpmn-io%2Fbpmnlint)You must be signed in to star a repository

## About

Validate BPMN diagrams based on configurable lint rules.

### Topics

[bpmn](/topics/bpmn)[cli](/topics/cli)[hacktoberfest](/topics/hacktoberfest)[linter](/topics/linter)[static-diagram-analysis](/topics/static-diagram-analysis)[validator](/topics/validator)

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

### Code of conduct

[Code of conduct](/bpmn-io/bpmnlint#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/bpmn-io/bpmnlint/activity)

[Custom properties](/bpmn-io/bpmnlint/custom-properties)

### Stars

**173** stars

### Watchers

**10** watching

### Forks

[**48** forks](/bpmn-io/bpmnlint/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmnlint&report=bpmn-io+%28user%29)

main

[Branches](/bpmn-io/bpmnlint/branches)[Tags](/bpmn-io/bpmnlint/tags)

[](/bpmn-io/bpmnlint/branches)[](/bpmn-io/bpmnlint/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[696 Commits](/bpmn-io/bpmnlint/commits/main/)

[](/bpmn-io/bpmnlint/commits/main/)696 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github](/bpmn-io/bpmnlint/tree/main/.github ".github")

[.github](/bpmn-io/bpmnlint/tree/main/.github ".github")

[bin](/bpmn-io/bpmnlint/tree/main/bin "bin")

[bin](/bpmn-io/bpmnlint/tree/main/bin "bin")

[config](/bpmn-io/bpmnlint/tree/main/config "config")

[config](/bpmn-io/bpmnlint/tree/main/config "config")

[docs/rules](/bpmn-io/bpmnlint/tree/main/docs/rules "This path skips through empty directories")

[docs/rules](/bpmn-io/bpmnlint/tree/main/docs/rules "This path skips through empty directories")

[lib](/bpmn-io/bpmnlint/tree/main/lib "lib")

[lib](/bpmn-io/bpmnlint/tree/main/lib "lib")

[rules](/bpmn-io/bpmnlint/tree/main/rules "rules")

[rules](/bpmn-io/bpmnlint/tree/main/rules "rules")

[test](/bpmn-io/bpmnlint/tree/main/test "test")

[test](/bpmn-io/bpmnlint/tree/main/test "test")

[.gitignore](/bpmn-io/bpmnlint/blob/main/.gitignore ".gitignore")

[.gitignore](/bpmn-io/bpmnlint/blob/main/.gitignore ".gitignore")

[CHANGELOG.md](/bpmn-io/bpmnlint/blob/main/CHANGELOG.md "CHANGELOG.md")

[CHANGELOG.md](/bpmn-io/bpmnlint/blob/main/CHANGELOG.md "CHANGELOG.md")

[LICENSE](/bpmn-io/bpmnlint/blob/main/LICENSE "LICENSE")

[LICENSE](/bpmn-io/bpmnlint/blob/main/LICENSE "LICENSE")

[README.md](/bpmn-io/bpmnlint/blob/main/README.md "README.md")

[README.md](/bpmn-io/bpmnlint/blob/main/README.md "README.md")

[eslint.config.mjs](/bpmn-io/bpmnlint/blob/main/eslint.config.mjs "eslint.config.mjs")

[eslint.config.mjs](/bpmn-io/bpmnlint/blob/main/eslint.config.mjs "eslint.config.mjs")

[package-lock.json](/bpmn-io/bpmnlint/blob/main/package-lock.json "package-lock.json")

[package-lock.json](/bpmn-io/bpmnlint/blob/main/package-lock.json "package-lock.json")

[package.json](/bpmn-io/bpmnlint/blob/main/package.json "package.json")

[package.json](/bpmn-io/bpmnlint/blob/main/package.json "package.json")

[tsconfig.json](/bpmn-io/bpmnlint/blob/main/tsconfig.json "tsconfig.json")

[tsconfig.json](/bpmn-io/bpmnlint/blob/main/tsconfig.json "tsconfig.json")

View all files

## Repository files navigation

-   [README](#)
-   [Code of conduct](#)
-   [Contributing](#)
-   [MIT license](#)
-   [Security](#)

More items

# bpmnlint

[](#bpmnlint)

[![CI](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml/badge.svg)](https://github.com/bpmn-io/bpmnlint/actions/workflows/CI.yml)

Validate your BPMN diagrams based on configurable lint rules.

## Installation

[](#installation)

Install the utility via [npm](https://www.npmjs.com/package/bpmnlint):

npm install -g bpmnlint

## Usage

[](#usage)

Validate your diagrams via the commandline:

\> bpmnlint invoice.bpmn

/Projects/process-application/resources/invoice.bpmn
  Flow\_1    error    Sequence flow is missing condition  conditional-flows
  Process   error    Process is missing end event        end-event-required
  Task\_13   warning  Element is missing label/name       label-required
  Event\_12  warning  Element is missing label/name       label-required
  Event\_27  warning  Element is missing label/name       label-required
  Process   error    Process is missing start event      start-event-required

✖ 6 problems (6 errors, 0 warnings)

## Rules

[](#rules)

Our [documentation](https://github.com/bpmn-io/bpmnlint/tree/main/docs/rules#rules) lists all currenty implemented rules, the [`./rules` folder](https://github.com/bpmn-io/bpmnlint/tree/main/rules) contains each rules implementation.

Do you miss a rule that should be included? [Propose a new rule](https://github.com/bpmn-io/bpmnlint/issues/new?assignees=&labels=rules&template=NEW_RULE.md).

## Configuration

[](#configuration)

Create a `.bpmnlintrc` file in your working directory and inherit from a common configuration using the `extends` block:

{
  "extends": "bpmnlint:recommended"
}

Add or customize rules using the `rules` block:

{
  "extends": "bpmnlint:recommended",
  "rules": {
    "label-required": "off"
  }
}

You may also extend from multiple configurations, including those provided by [custom plug-ins](#writing-a-plug-in):

{
  "extends": \[
    "bpmnlint:recommended",
    "plugin:foo/recommended",
    "plugin:@bar/bpmnlint-plugin-bar/recommended"
  \]
}

This will amend core `recommended` rules with `recommended` rulesets provided by `bpmnlint-plugin-foo` and `@bar/bpmnlint-plugin-bar`, respectively.

Plug-ins will be resolved relative to the configuration file location, using [node module resolution](https://nodejs.org/api/modules.html#loading-from-node_modules-folders).

### Available Configurations

[](#available-configurations)

-   [`bpmnlint:all`](/bpmn-io/bpmnlint/blob/main/config/all.js) - all rules as errors
-   [`bpmnlint:recommended`](/bpmn-io/bpmnlint/blob/main/config/recommended.js) - opinionated rules ("best practices") and rules enforcing BPMN compliance
-   [`bpmnlint:correctness`](/bpmn-io/bpmnlint/blob/main/config/correctness.js) - rules enforcing BPMN compliance

### Moddle extensions

[](#moddle-extensions)

To validate your diagrams with custom [moddle](https://github.com/bpmn-io/moddle) extensions, add `moddleExtensions` to the root configuration file:

{
  "extends": \[
    "bpmnlint:recommended",
    "plugin:custom/recommended"
  \],
  "moddleExtensions": {
    "custom": "custom-bpmn-moddle/resources/custom.json"
  }
}

The extension will be resolved relative to the configuration file location, using [node module resolution](https://nodejs.org/api/modules.html#loading-from-node_modules-folders).

## API

[](#api)

Invoke the tool directly from [NodeJS](https://nodejs.org/en):

import Linter from 'bpmnlint';
import NodeResolver from 'bpmnlint/lib/resolver/node-resolver';

import BpmnModdle from 'bpmn-moddle';

const moddle \= new BpmnModdle();

const linter \= new Linter({ 
  config: {
    extends: 'bpmnlint:recommended'
  },
  resolver: new NodeResolver()
});

const xmlStr \= \`
  <?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                     id="definitions" 
                     targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="process" />
  </bpmn:definitions>
\`;

const {
  rootElement: definitions
} \= await moddle.fromXML(xmlStr);

const reports \= linter.lint(definitions);

// {
//    "end-event-required": \[
//      {
//        "id": "process",
//        "message": "Process is missing end event"
//      }
//    \],
//    ...
// }

## Writing a Plug-in

[](#writing-a-plug-in)

Create your first plug-in using the [plugin creator](https://github.com/nikku/create-bpmnlint-plugin):

npm init bpmnlint-plugin {PLUGIN\_NAME}

Checkout the [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) for details on how to define, test, and consume custom lint rules. Use the [bpmnlint playground](https://github.com/bpmn-io/bpmnlint-playground) to implement new rules with quick visual feedback.

Note

Plug-ins must always follow the naming scheme `bpmnlint-plugin-{NAME_OF_YOUR_PLUGIN}` and may contain a namespace prefix.

When using your custom plug-in, reference its configuration or rules via the shorthand plug-in name, or the full identifier:

{
  "extends": \[
    "bpmnlint:recommended",
    "plugin:foo/recommended",
    "plugin:@bar/bpmnlint-plugin-bar/recommended"
  \],
  "rules": {
    "foo/special-rule": "off",
    "@bar/bar/other-rule": "warn"
  }
}

## Bundling

[](#bundling)

For browser usage include your [linting configuration](#configuration) using your favorite bundler plug-in ([Rollup](https://www.npmjs.com/package/rollup-plugin-bpmnlint), [Webpack](https://www.npmjs.com/package/bpmnlint-loader)).

## Visual Feedback

[](#visual-feedback)

Integrate the linter via [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) into [bpmn-js](https://github.com/bpmn-io/bpmn-js) and get direct feedback during modeling.

To try out visual validation, checkout the [bpmnlint playground](https://github.com/bpmn-io/bpmnlint-playground).

## Related

[](#related)

-   [bpmnlint-plugin-example](https://github.com/bpmn-io/bpmnlint-plugin-example) - an example plug-in
-   [bpmnlint-playground](https://github.com/bpmn-io/bpmnlint-playground) - a playground to implement new rules with quick visual feedback
-   [bpmnlint-generate-docs-images](https://github.com/bpmn-io/bpmnlint-generate-docs-images) - Generate images for your bpmnlint documentation
-   [bpmn-js-bpmnlint](https://github.com/bpmn-io/bpmn-js-bpmnlint) - integration into [bpmn-js](https://github.com/bpmn-io/bpmn-js)

## License

[](#license)

MIT

## About

Validate BPMN diagrams based on configurable lint rules.

### Topics

[bpmn](/topics/bpmn)[cli](/topics/cli)[hacktoberfest](/topics/hacktoberfest)[linter](/topics/linter)[static-diagram-analysis](/topics/static-diagram-analysis)[validator](/topics/validator)

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

### Code of conduct

[Code of conduct](/bpmn-io/bpmnlint#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/bpmn-io/bpmnlint/activity)

[Custom properties](/bpmn-io/bpmnlint/custom-properties)

### Stars

**173** stars

### Watchers

**10** watching

### Forks

[**48** forks](/bpmn-io/bpmnlint/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fbpmn-io%2Fbpmnlint&report=bpmn-io+%28user%29)

## Releases

## Used by

## Contributors

## Languages

## Footer

[](https://github.com)© 2026 GitHub, Inc.

### Footer navigation

-   [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
-   [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
-   [Security](https://github.com/security)
-   [Status](https://www.githubstatus.com/)
-   [Community](https://github.community/)
-   [Docs](https://docs.github.com/)
-   [Contact](https://support.github.com?tags=dotcom-footer)
-   Manage cookies
-   Do not share my personal information

You can’t perform that action at this time.
```

---

## Assistant (Plan · Claude Sonnet 5 · 7.2s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://bpmn.io/blog/posts/2022-collaborative-modeling.html",
  "format": "markdown"
}
```

**Error:**
```
StatusCode: non 2xx status code (404 GET https://bpmn.io/blog/posts/2022-collaborative-modeling.html)
```

---

## Assistant (Plan · Claude Sonnet 5 · 26.6s)

_Thinking:_



## Research summary

I checked the actual tooling landscape (bpmn.io / bpmn-js, bpmnlint, Camunda) and looked at this repo — it already runs a "spec manager" pattern (specmgr MCP) where humans and an agent both read/write the same markdown artifacts concurrently (create/get/update/validate/parse per domain). The same pattern generalizes to BPMN. Your options fall into three buckets, differing mainly in what "concurrently" means to you.

### A. Turnkey collaborative SaaS platforms (true live multi-cursor editing)
- **Camunda 8 Web Modeler** — browser-based, multi-user real-time collaboration (comments, live cursors), REST API, and it now explicitly markets AI-agent-assisted modeling (Copilot drafts/edits the same diagram a human reviews). Desktop Modeler is free/OSS; the collaborative *web* modeler is part of Camunda 8 (free tier + paid).
- **SAP Signavio**, **Bizagi Modeler** — similar enterprise web modelers with collaboration + REST APIs for programmatic (agent) access. Commercial/SaaS, heavier governance focus.
- Fit: best if you want genuine "both looking at the same canvas at the same time" collaboration out of the box, and don't mind SaaS/commercial licensing and being on their platform.

### B. Open-source toolkit, self-hosted, build your own concurrency
- **bpmn-js** (rendering/editing toolkit for the browser) + **bpmn-moddle** (headless parse/serialize of BPMN 2.0 XML — no UI needed, perfect for an agent) + **bpmnlint** (rule-based validator, runs identically as a CLI/Node API *or* live in the bpmn-js canvas via `bpmn-js-bpmnlint`, so human and agent get the same validation rules). All MIT-licensed, actively maintained by Camunda's bpmn.io team (9.7k★).
- Covers create/change/import/export/validate/parse natively: `importXML`/`saveXML` in bpmn-js, `moddle.fromXML`/`toXML` headless, `bpmnlint` for both strict BPMN-correctness and style rules.
- For *live* concurrency you'd add a CRDT/OT sync layer (e.g. Yjs or ShareDB) in front of bpmn-js's command stack — a known pattern in the bpmn-io community, but it's DIY/integration work, not off-the-shelf.
- Fit: best if you want full control, self-hosting, no vendor lock-in, and are willing to either (a) accept turn-based concurrency, or (b) invest in a CRDT layer for true live co-editing.

### C. File-based "take turns" pattern (matches this repo's existing architecture)
- Treat the `.bpmn` XML file as the shared source of truth, same way specmgr treats `.md` files: a human edits it visually (Camunda Desktop Modeler, a VS Code BPMN extension, or an embedded bpmn-js web page), the agent edits the same file via MCP tools wrapping **bpmn-moddle** (parse/create/update) and **bpmnlint** (validate) — no UI needed on the agent side at all.
- Concurrency is turn-based / git-mediated (like the rest of this docs repo), not live multi-cursor. Conflicts are handled the same way markdown conflicts are today (locking, sequential edits, or git merges).
- Fit: lowest effort, consistent with how every other artifact type (req/uc/adr/...) is already managed here, fully open-source, no new infrastructure.

## Where this leaves you

If "concurrently" means **literally at the same time, same canvas, like Google Docs** → option A (fastest path) or B+CRDT (self-hosted, more work).
If "concurrently" means **both can read/write the shared diagram without stepping on each other over time**, consistent with how req/uc/adr/etc. work in this repo today → option C, built on B's libraries (bpmn-js + bpmn-moddle + bpmnlint), is the natural fit and requires no new paradigm.

A few things to narrow this down:

---

## User

I forgot to add, solution must be:

- FOSS
- local / on-prem on the same system where the OpenCode instance runs

---

## Assistant (Plan · Claude Sonnet 5 · 28.7s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/camunda/camunda-modeler/master/LICENSE",
  "format": "text"
}
```

**Output:**
```
The MIT License (MIT)

Copyright (c) 2015-present Camunda Services GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/camunda/camunda-modeler",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - camunda/camunda-modeler: A modeling solution for BPMN, DMN, and Forms based on bpmn.io. As a companion tool to your favorite IDE it supports you in implementing solutions with Camunda. · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=camunda%2Fcamunda-modeler)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [camunda](/camunda)
2.  [camunda-modeler](/camunda/camunda-modeler)

## Repository navigation

-   [Code](/camunda/camunda-modeler)
-   [Issues601 (601)](/camunda/camunda-modeler/issues)
-   [Pull requests17 (17)](/camunda/camunda-modeler/pulls)
-   [Actions](/camunda/camunda-modeler/actions)
-   [Security and quality1 (1)](/camunda/camunda-modeler/security)
-   [Insights](/camunda/camunda-modeler/pulse)

More items

 [](/camunda/camunda-modeler)

![camunda](https://avatars.githubusercontent.com/u/2443838?s=60&v=4)

**[camunda-modeler](/camunda/camunda-modeler)**

Public

-   [Notifications](/login?return_to=%2Fcamunda%2Fcamunda-modeler)You must be signed in to change notification settings
-   [Fork549 (549)](/login?return_to=%2Fcamunda%2Fcamunda-modeler)
-   [Star1.7k (1.7k)](/login?return_to=%2Fcamunda%2Fcamunda-modeler)You must be signed in to star a repository

## About

A modeling solution for BPMN, DMN, and Forms based on bpmn.io. As a companion tool to your favorite IDE it supports you in implementing solutions with Camunda.

[camunda.com/products/modeler](https://camunda.com/products/modeler)

### Topics

[bpmn](/topics/bpmn)[camunda](/topics/camunda)[desktop-application](/topics/desktop-application)[diagram-editor](/topics/diagram-editor)[dmn](/topics/dmn)[hacktoberfest](/topics/hacktoberfest)[modeling-tool](/topics/modeling-tool)[workflow](/topics/workflow)

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

### Code of conduct

[Code of conduct](/camunda/camunda-modeler#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/camunda/camunda-modeler/activity)

[Custom properties](/camunda/camunda-modeler/custom-properties)

### Stars

**1.7k** stars

### Watchers

**76** watching

### Forks

[**549** forks](/camunda/camunda-modeler/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler&report=camunda+%28user%29)

develop

[Branches](/camunda/camunda-modeler/branches)[Tags](/camunda/camunda-modeler/tags)

[](/camunda/camunda-modeler/branches)[](/camunda/camunda-modeler/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[6,233 Commits](/camunda/camunda-modeler/commits/develop/)

[](/camunda/camunda-modeler/commits/develop/)6,233 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github](/camunda/camunda-modeler/tree/develop/.github ".github")

[.github](/camunda/camunda-modeler/tree/develop/.github ".github")

[app](/camunda/camunda-modeler/tree/develop/app "app")

[app](/camunda/camunda-modeler/tree/develop/app "app")

[build](/camunda/camunda-modeler/tree/develop/build "build")

[build](/camunda/camunda-modeler/tree/develop/build "build")

[client](/camunda/camunda-modeler/tree/develop/client "client")

[client](/camunda/camunda-modeler/tree/develop/client "client")

[docs](/camunda/camunda-modeler/tree/develop/docs "docs")

[docs](/camunda/camunda-modeler/tree/develop/docs "docs")

[resources](/camunda/camunda-modeler/tree/develop/resources "resources")

[resources](/camunda/camunda-modeler/tree/develop/resources "resources")

[tasks](/camunda/camunda-modeler/tree/develop/tasks "tasks")

[tasks](/camunda/camunda-modeler/tree/develop/tasks "tasks")

[test/e2e](/camunda/camunda-modeler/tree/develop/test/e2e "This path skips through empty directories")

[test/e2e](/camunda/camunda-modeler/tree/develop/test/e2e "This path skips through empty directories")

[.codecov.yml](/camunda/camunda-modeler/blob/develop/.codecov.yml ".codecov.yml")

[.codecov.yml](/camunda/camunda-modeler/blob/develop/.codecov.yml ".codecov.yml")

[.editorconfig](/camunda/camunda-modeler/blob/develop/.editorconfig ".editorconfig")

[.editorconfig](/camunda/camunda-modeler/blob/develop/.editorconfig ".editorconfig")

[.fossa.yml](/camunda/camunda-modeler/blob/develop/.fossa.yml ".fossa.yml")

[.fossa.yml](/camunda/camunda-modeler/blob/develop/.fossa.yml ".fossa.yml")

[.gitattributes](/camunda/camunda-modeler/blob/develop/.gitattributes ".gitattributes")

[.gitattributes](/camunda/camunda-modeler/blob/develop/.gitattributes ".gitattributes")

[.gitignore](/camunda/camunda-modeler/blob/develop/.gitignore ".gitignore")

[.gitignore](/camunda/camunda-modeler/blob/develop/.gitignore ".gitignore")

[.snyk](/camunda/camunda-modeler/blob/develop/.snyk ".snyk")

[.snyk](/camunda/camunda-modeler/blob/develop/.snyk ".snyk")

[AGENTS.md](/camunda/camunda-modeler/blob/develop/AGENTS.md "AGENTS.md")

[AGENTS.md](/camunda/camunda-modeler/blob/develop/AGENTS.md "AGENTS.md")

[CHANGELOG.md](/camunda/camunda-modeler/blob/develop/CHANGELOG.md "CHANGELOG.md")

[CHANGELOG.md](/camunda/camunda-modeler/blob/develop/CHANGELOG.md "CHANGELOG.md")

[CLAUDE.md](/camunda/camunda-modeler/blob/develop/CLAUDE.md "CLAUDE.md")

[CLAUDE.md](/camunda/camunda-modeler/blob/develop/CLAUDE.md "CLAUDE.md")

[LICENSE](/camunda/camunda-modeler/blob/develop/LICENSE "LICENSE")

[LICENSE](/camunda/camunda-modeler/blob/develop/LICENSE "LICENSE")

[NOTICE](/camunda/camunda-modeler/blob/develop/NOTICE "NOTICE")

[NOTICE](/camunda/camunda-modeler/blob/develop/NOTICE "NOTICE")

[README.md](/camunda/camunda-modeler/blob/develop/README.md "README.md")

[README.md](/camunda/camunda-modeler/blob/develop/README.md "README.md")

[SECURITY.md](/camunda/camunda-modeler/blob/develop/SECURITY.md "SECURITY.md")

[SECURITY.md](/camunda/camunda-modeler/blob/develop/SECURITY.md "SECURITY.md")

[THIRD\_PARTY\_NOTICES](/camunda/camunda-modeler/blob/develop/THIRD_PARTY_NOTICES "THIRD_PARTY_NOTICES")

[THIRD\_PARTY\_NOTICES](/camunda/camunda-modeler/blob/develop/THIRD_PARTY_NOTICES "THIRD_PARTY_NOTICES")

[dev.js](/camunda/camunda-modeler/blob/develop/dev.js "dev.js")

[dev.js](/camunda/camunda-modeler/blob/develop/dev.js "dev.js")

[electron-builder.json](/camunda/camunda-modeler/blob/develop/electron-builder.json "electron-builder.json")

[electron-builder.json](/camunda/camunda-modeler/blob/develop/electron-builder.json "electron-builder.json")

[eslint.config.mjs](/camunda/camunda-modeler/blob/develop/eslint.config.mjs "eslint.config.mjs")

[eslint.config.mjs](/camunda/camunda-modeler/blob/develop/eslint.config.mjs "eslint.config.mjs")

[package-lock.json](/camunda/camunda-modeler/blob/develop/package-lock.json "package-lock.json")

[package-lock.json](/camunda/camunda-modeler/blob/develop/package-lock.json "package-lock.json")

[package.json](/camunda/camunda-modeler/blob/develop/package.json "package.json")

[package.json](/camunda/camunda-modeler/blob/develop/package.json "package.json")

[renovate.json](/camunda/camunda-modeler/blob/develop/renovate.json "renovate.json")

[renovate.json](/camunda/camunda-modeler/blob/develop/renovate.json "renovate.json")

[tsconfig.json](/camunda/camunda-modeler/blob/develop/tsconfig.json "tsconfig.json")

[tsconfig.json](/camunda/camunda-modeler/blob/develop/tsconfig.json "tsconfig.json")

[webpack.config.js](/camunda/camunda-modeler/blob/develop/webpack.config.js "webpack.config.js")

[webpack.config.js](/camunda/camunda-modeler/blob/develop/webpack.config.js "webpack.config.js")

[webpack.config.license.js](/camunda/camunda-modeler/blob/develop/webpack.config.license.js "webpack.config.license.js")

[webpack.config.license.js](/camunda/camunda-modeler/blob/develop/webpack.config.license.js "webpack.config.license.js")

View all files

## Repository files navigation

-   [README](#)
-   [Code of conduct](#)
-   [Contributing](#)
-   [MIT license](#)
-   [Security](#)

More items

# Camunda Modeler

[](#camunda-modeler)

[![CI](https://github.com/camunda/camunda-modeler/actions/workflows/CI.yml/badge.svg)](https://github.com/camunda/camunda-modeler/actions/workflows/CI.yml)

A desktop application for modeling BPMN diagrams, DMN decisions, and Forms, powered by [bpmn.io](https://bpmn.io/). Use it alongside your favorite IDE to implement solutions with [Camunda](https://camunda.com/).

[![Camunda Modeler](/camunda/camunda-modeler/raw/develop/resources/screenshot.png)](/camunda/camunda-modeler/blob/develop/resources/screenshot.png)

## Resources

[](#resources)

-   [Changelog](/camunda/camunda-modeler/blob/develop/CHANGELOG.md)
-   [Download](https://camunda.com/download/modeler/) (see also [nightly builds](https://downloads.camunda.cloud/release/camunda-modeler/nightly/))
-   [Give Feedback](https://forum.camunda.io/c/bpmn-modeling/)
-   [Report a Bug](https://github.com/camunda/camunda-modeler/issues)
-   [User Documentation](https://docs.camunda.io/docs/components/modeler/desktop-modeler/)

## Building the Application

[](#building-the-application)

Build the app in a Posix environment. On Windows that is Git Bash or WSL. Make sure you have installed all the [necessary tools](https://github.com/nodejs/node-gyp#installation) to install and compile Node.js C++ addons.

# checkout a tag
git checkout main

# install dependencies
npm install

# execute all checks (lint, test and build)
npm run all

# build the application to ./dist
npm run build

### Development Setup

[](#development-setup)

Spin up the application for development, all strings attached:

npm run dev

## Contributing

[](#contributing)

Please checkout our [contributing guidelines](/camunda/camunda-modeler/blob/develop/.github/CONTRIBUTING.md) if you plan to file an issue or pull request.

## Code of Conduct

[](#code-of-conduct)

By participating to this project, please uphold to our [Code of Conduct](https://github.com/camunda/.github/blob/main/.github/CODE_OF_CONDUCT.md).

## License

[](#license)

MIT

Uses [bpmn-js](https://github.com/bpmn-io/bpmn-js), [dmn-js](https://github.com/bpmn-io/dmn-js), and [form-js](https://github.com/bpmn-io/form-js) licensed under the [bpmn.io license](http://bpmn.io/license).

## About

A modeling solution for BPMN, DMN, and Forms based on bpmn.io. As a companion tool to your favorite IDE it supports you in implementing solutions with Camunda.

[camunda.com/products/modeler](https://camunda.com/products/modeler)

### Topics

[bpmn](/topics/bpmn)[camunda](/topics/camunda)[desktop-application](/topics/desktop-application)[diagram-editor](/topics/diagram-editor)[dmn](/topics/dmn)[hacktoberfest](/topics/hacktoberfest)[modeling-tool](/topics/modeling-tool)[workflow](/topics/workflow)

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

### Code of conduct

[Code of conduct](/camunda/camunda-modeler#coc-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/camunda/camunda-modeler/activity)

[Custom properties](/camunda/camunda-modeler/custom-properties)

### Stars

**1.7k** stars

### Watchers

**76** watching

### Forks

[**549** forks](/camunda/camunda-modeler/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fcamunda%2Fcamunda-modeler&report=camunda+%28user%29)

## Releases

## Used by

## Contributors

## Languages

## Footer

[](https://github.com)© 2026 GitHub, Inc.

### Footer navigation

-   [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
-   [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
-   [Security](https://github.com/security)
-   [Status](https://www.githubstatus.com/)
-   [Community](https://github.community/)
-   [Docs](https://docs.github.com/)
-   [Contact](https://support.github.com?tags=dotcom-footer)
-   Manage cookies
-   Do not share my personal information

You can’t perform that action at this time.
```

---

## Assistant (Plan · Claude Sonnet 5 · 9.5s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://bpmn.io/license/",
  "format": "text"
}
```

**Output:**
```
License | bpmn.io
    
    
    

    
    
    
    

    

    
      
    

    

    
      
    
  
  

    
      


    

    







  
    
      
        Toggle navigation
        
        
        
      
      
        
      
    
    
      
        
          
             bpmn-js 
          
          
            Toolkit
            Download
            
            Examples
            Walkthrough
          
        

        
          
             dmn-js 
          
          
            Toolkit
            Download
          
        

        
          
             form-js 
          
          
            Toolkit
            Download
          
        
      
      
        
          Blog
        
        
          Forum
        
        
          
            GitHub
            
              
            
          
        
        
          
            Mastodon
            
              
            
          
        
      
    
  







  

    License
    
    
    
      This license ("bpmn.io License") governs use of our toolkits bpmn-js, dmn-js, form-js, and cmmn-js.
    
    
  



  


  

    Copyright (c) 2014-present Camunda Services GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in the
Software without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

The source code responsible for displaying the bpmn.io project watermark that
links back to https://bpmn.io as part of rendered diagrams MUST NOT be
removed or changed. When this software is being used in a website or application,
the watermark must stay fully visible and not visually overlapped by other elements.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
OR OTHER DEALINGS IN THE SOFTWARE.
  








  

    
      Blog
      Forum
      GitHub
      Mastodon
      Online Demo
      Camunda Modeler
      Roadmap
    

    
      About
      Work with us
      License
      Imprint
      Privacy Policy
      Cookie Preferences
    

    
      bpmn.io is built and maintained by Camunda and contributors.
    

    
      
        
          
        
      
    

    
      Camunda Services GmbH © 2026
```

---

## Assistant (Plan · Claude Sonnet 5 · 28.4s)

_Thinking:_



## Revised options (FOSS + local/on-prem only)

That constraint rules out the SaaS/cloud-collaborative products from before (Camunda 8 Web Modeler, SAP Signavio, Bizagi are cloud or non-FOSS-licensed self-managed). Here's what's left, all runnable entirely on the box where OpenCode runs, no outbound network required:

### 1. bpmn-js + bpmn-moddle + bpmnlint (recommended)
- **bpmn-js** (editor/viewer), **bpmn-moddle** (headless BPMN 2.0 XML parse/serialize), **bpmnlint** (rule-based validator) — all from the bpmn.io/Camunda team.
- Licenses: `bpmnlint` and `bpmn-moddle` are plain **MIT**. `bpmn-js` is under the **"bpmn.io License"** — MIT plus one extra clause: the small "bpmn.io" watermark/link rendered in the canvas must stay visible and can't be removed. Still free/permissive, but worth knowing if you consider that non-negotiable for "pure FOSS."
- Runs 100% locally: a small self-hosted web page (human UI, `npm` deps vendored, no CDN needed) + a Node/CLI layer the agent calls directly.
- Maps cleanly onto the capabilities you asked for:
  - create/change → bpmn-js canvas (human) or `bpmn-moddle` programmatic model edits (agent)
  - import/export → `importXML`/`saveXML` (bpmn-js) or `moddle.fromXML`/`toXML` (headless)
  - validate → `bpmnlint` CLI/API (same rule set usable headless by the agent and live in the canvas via `bpmn-js-bpmnlint`)
  - parse → `bpmn-moddle` gives you a structured object tree, no UI needed
- Concurrency model: turn-based on the shared `.bpmn` XML file, exactly like this repo's existing specmgr pattern (human edits via UI/saves file, agent edits via MCP tool wrapping bpmn-moddle, file-watch/reload or simple locking avoids clobbering). For *live* co-editing you'd add a self-hosted CRDT sync layer (e.g. `y-websocket`, also MIT, just a local Node process) in front of bpmn-js's command stack — doable, but it's integration work you'd build, not off-the-shelf.

### 2. Camunda Desktop Modeler
- MIT licensed, Electron desktop app built on bpmn-js — confirmed FOSS, runs fully offline/local.
- Gives you a polished human-facing UI for free, no DIY canvas needed.
- The agent side still needs `bpmn-moddle`/`bpmnlint` (headless) via MCP tools, operating on the same `.bpmn` file on disk.
- Concurrency: file-based/turn-taking only — it's a single-user desktop app, not designed for simultaneous editors. Needs verification on how gracefully it reloads externally-modified files while open (I'd test this rather than assume).

### 3. Flowable Modeler / jBPM(KIE) bpmn-designer
- Apache-2.0, web-based, self-hostable as a local web app with a REST API.
- These are older Oryx/Signavio-lineage editors: multi-user access works via optimistic locking/versioning on save, not live multi-cursor collaboration — so "concurrently" here means "won't silently overwrite," not "see each other's cursors."
- More moving parts to self-host (Java app server) for less collaboration benefit than option 1; only worth it if you also want their process engines later.

## My read

Given this repo already manages every other artifact type (req/uc/adr/qa/...) through the exact pattern of "shared file on disk, human-and-agent both read/write it via MCP-style tools, turn-based not live," **option 1** (bpmn-js + bpmn-moddle + bpmnlint, self-hosted) is the most consistent fit architecturally, fully FOSS, and gives you create/change/import/export/validate/parse natively without needing a separate desktop app. Camunda Desktop Modeler (option 2) is a reasonable alternative if you'd rather not build the human-facing canvas yourself and don't mind the human using a separate app window instead of something embedded in this toolchain.

Two things would help me turn this into a concrete plan:

---

## User

- I hoped for something like Excalidraw - where an agent can draw the image on the same canvas and a user can see this in realtime.
- Is there a docker container that wraps bpmn-js in a HTTP server?
- Is there an MCP server that wraps bpmn-js so that an agent can understand and use it?

---

## Assistant (Plan · Claude Sonnet 5 · 5.5s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/search?q=bpmn-js+mcp+server&type=repositories",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                   Repository search results · GitHub                                                                

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn-js%2Bmcp%2Bserver%26type%3Drepositories)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn-js%2Bmcp%2Bserver%26type%3Drepositories)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2Fsearch&source=header)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

# repositories Search Results · bpmn-js mcp server

## Filter by

-   -   [Code... (...)results](https://github.com/search?q=bpmn-js+mcp+server&type=code)
    -   [Repositories0 (0)results](https://github.com/search?q=bpmn-js+mcp+server&type=repositories)
    -   [Issues
        
        results](https://github.com/search?q=bpmn-js+mcp+server&type=issues)
    -   [Pull requests
        
        results](https://github.com/search?q=bpmn-js+mcp+server&type=pullrequests)
    -   [Discussions
        
        results](https://github.com/search?q=bpmn-js+mcp+server&type=discussions)
    -   [Users
        
        results](https://github.com/search?q=bpmn-js+mcp+server&type=users)
    -   More

-   [Advanced search](/search/advanced)

Filter:Repositories0 (0)

0 results  (58 ms)

## 0 results

Sort by: Best match

Filter

![js](https://explore-feed.github.com/topics/javascript/javascript.png?size=48)JavaScript

JavaScript (JS) is a lightweight interpreted programming language with first-class functions.

-   [github.com](https://github.com/topics/javascript)
-   [Wikipedia](https://en.wikipedia.org/wiki/JavaScript)
-   [View topic](/topics/js)

![Mona looking through a globe hologram for code](/images/modules/search/light.png)

### Your search did not match any repositories

Try one of the tips below to find more repositories

Search across an organizationSaved searches

You could try an [advanced search](/search/advanced?q=bpmn-js+mcp+server).

You can’t perform that action at this time.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://hub.docker.com/search?q=bpmn-js",
  "format": "markdown"
}
```

**Output:**
```
Explore Docker's Container Image Repository | Docker Hub 

[](/)

Search Docker Hub

K

-   Help
    
-   System theme
    
-   Docker Suite
    

Go back

-   Help
    
-   System theme
    
-   Docker Suite
    

[Sign in](/login)[Sign up](https://app.docker.com/signup)

#### Filter by

###### Products

[Images](/search?q=bpmn-js&type=image)

[Helm Charts](/search?q=bpmn-js&type=helm)

[Sandbox Kits](/search?q=bpmn-js&type=sbx_kit)

[AI Models](/search?q=bpmn-js&type=model)

[Compose](/search?q=bpmn-js&type=compose)

Show more

---

###### Trusted content

[

Docker Hardened Image



](/search?q=bpmn-js&badges=hardened)

[

Docker Official Image



](/search?q=bpmn-js&badges=official)

[

Verified Publisher



](/search?q=bpmn-js&badges=verified_publisher)

[

Sponsored OSS



](/search?q=bpmn-js&badges=open_source)

---

###### Categories

[Networking](/search?q=bpmn-js&categories=Networking)

[Security](/search?q=bpmn-js&categories=Security)

[Languages & frameworks](/search?q=bpmn-js&categories=Languages+%26+frameworks)

[Integration & delivery](/search?q=bpmn-js&categories=Integration+%26+delivery)

[Message queues](/search?q=bpmn-js&categories=Message+queues)

More categories

---

###### Operating Systems

[Linux](/search?q=bpmn-js&operating_system=linux)

[Windows](/search?q=bpmn-js&operating_system=windows)

---

###### Architectures

[x86-64](/search?q=bpmn-js&architecture=amd64)

[ARM 64](/search?q=bpmn-js&architecture=arm64)

[ARM](/search?q=bpmn-js&architecture=arm)

[IBM Z](/search?q=bpmn-js&architecture=s390x)

[PowerPC 64 LE](/search?q=bpmn-js&architecture=ppc64le)

More architectures

1 - 30 of 358 results for **bpmn-js**.

Best match

​

​

image

![](https://www.gravatar.com/avatar/1a51e935bc47e14697c62fe85351b732?s=80&r=g&d=mm)

###### [yuzutech/kroki-bpmn](/r/yuzutech/kroki-bpmn)

[

yuzutech

](/u/yuzutech)

Companion server for Kroki that provides BPMN

16d

1M+

1

image

###### [edgegallery/bpmn-infra](/r/edgegallery/bpmn-infra)

[

edgegallery

](/u/edgegallery)

6y

100K+

image

###### [aic2018g4t4/bpmn](/r/aic2018g4t4/bpmn)

[

aic2018g4t4

](/u/aic2018g4t4)

Advanced Interent Computing WS2018 - Group 4 Topc 4 - BPMN

7y

10K+

image

![](https://www.gravatar.com/avatar/f041586c9b8a7f2b2189357f13f1bf7b?s=80&r=g&d=mm)

###### [imixs/open-bpmn](/r/imixs/open-bpmn)

[

imixs

](/u/imixs)

9m

10K+

1

image

###### [onap/so-bpmn-infra](/r/onap/so-bpmn-infra)

[

onap

](/u/onap)

1m

10K+

image

![](https://www.gravatar.com/avatar/54e8b228770297609dbf04720113f529?s=80&r=g&d=mm)

###### [ibmcom/bai-bpmn-dev](/r/ibmcom/bai-bpmn-dev)

[

ibmcom

](/u/ibmcom)

7y

5.9K

image

###### [pcesdevuser/cbs-bpmn](/r/pcesdevuser/cbs-bpmn)

[

pcesdevuser

](/u/pcesdevuser)

2m

5.9K

image

###### [hightec/bpmn-infra](/r/hightec/bpmn-infra)

[

hightec

](/u/hightec)

5y

9.4K

image

###### [ralphhanna/bpmn-web](/r/ralphhanna/bpmn-web)

[

ralphhanna

](/u/ralphhanna)

docker image for bpmn-server along with demo bpmn-web

2y

3.9K

image

###### [champabpmn/camunda-health-monitor](/r/champabpmn/camunda-health-monitor)

[

champabpmn

](/u/champabpmn)

Lightweight monitoring dashboard for Camunda 7 BPM Platform with real-time health checks and metrics

11m

10K+

image

###### [amcop/bpmn-infra](/r/amcop/bpmn-infra)

[

amcop

](/u/amcop)

5y

7.6K

image

###### [riainsure/bpmn-js-modeler](/r/riainsure/bpmn-js-modeler)

[

riainsure

](/u/riainsure)

5y

10K+

4

image

###### [swerebenchv2/bpmn-io-bpmnlint](/r/swerebenchv2/bpmn-io-bpmnlint)

[

swerebenchv2

](/u/swerebenchv2)

6m

4.9K

image

###### [emaarco/bpmn-to-code-web](/r/emaarco/bpmn-to-code-web)

[

emaarco

](/u/emaarco)

A project to generate process-api's from your bpmn models - serving as a digital twin of your model

4m

3.2K

image

###### [pigstep/vibe-bpmn](/r/pigstep/vibe-bpmn)

[

pigstep

](/u/pigstep)

Create BPMN via XML or ai. Powered by BPMN.IO (Camunda)

5m

2.7K

image

###### [mottoregina/bpmn-frontend](/r/mottoregina/bpmn-frontend)

[

mottoregina

](/u/mottoregina)

18h

10K+

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1442](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1442)

[

swebench

](/u/swebench)

2m

1.2K

image

###### [linkaform/bpmn](/r/linkaform/bpmn)

[

linkaform

](/u/linkaform)

7y

1.8K

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1206](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1206)

[

swebench

](/u/swebench)

2m

1.1K

image

###### [edgegallery/bpmn-infra-x86](/r/edgegallery/bpmn-infra-x86)

[

edgegallery

](/u/edgegallery)

6y

3.1K

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1542](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1542)

[

swebench

](/u/swebench)

2m

1.1K

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1198](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1198)

[

swebench

](/u/swebench)

2m

1.1K

image

###### [tkra/bpmn-analyzer](/r/tkra/bpmn-analyzer)

[

tkra

](/u/tkra)

docker run -p 8080:8080 tkra/bpmn-analyzer

3m

10K+

1

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1196](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1196)

[

swebench

](/u/swebench)

2m

1.1K

image

###### [libable/bpmn\_f88\_api\_uat](/r/libable/bpmn_f88_api_uat)

[

libable

](/u/libable)

2y

1.7K

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1610](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1610)

[

swebench

](/u/swebench)

2m

1.0K

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1119](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1119)

[

swebench

](/u/swebench)

2m

1.0K

image

###### [tkra/rust\_bpmn\_analyzer](/r/tkra/rust_bpmn_analyzer)

[

tkra

](/u/tkra)

docker run -p 8080:8080 tkra/rust\_bpmn\_analyzer

1m

10K+

1

image

![](https://www.gravatar.com/avatar/b67d1243b8ea6d1cbfa565013bf1a11f?s=80&r=g&d=mm)

###### [swebench/sweb.eval.x86\_64.bpmn-io\_1776\_bpmn-js-1382](/r/swebench/sweb.eval.x86_64.bpmn-io_1776_bpmn-js-1382)

[

swebench

](/u/swebench)

2m

1.0K

image

###### [bpmnman/webappdj](/r/bpmnman/webappdj)

[

bpmnman

](/u/bpmnman)

7y

842

-   [](/search?q=bpmn-js)
-   [](/search?q=bpmn-js)
-   1 of 12
    

-   [](/search?q=bpmn-js&page=2)
-   [](/search?q=bpmn-js&page=12)

###### Why

[Overview](https://www.docker.com/why-docker)[What is a Container](https://www.docker.com/resources/what-container)

###### Products

[Product Overview](https://www.docker.com/products)

###### Product Offerings

[Docker Desktop](https://www.docker.com/products/docker-desktop)[Docker Hub](https://www.docker.com/products/docker-hub)

###### Features

[Container Runtime](https://www.docker.com/products/container-runtime)[Developer Tools](https://www.docker.com/products/developer-tools)[Docker App](https://www.docker.com/products/docker-app)[Kubernetes](https://www.docker.com/products/kubernetes)

###### Developers

[Getting Started](https://docs.docker.com/get-started)[Play with Docker](https://www.docker.com/play-with-docker)[Community](https://www.docker.com/docker-community)[Open Source](https://www.docker.com/open-source)[Documentation](https://www.docker.com/docs)

###### Company

[About Us](https://www.docker.com/company)[Resources](https://www.docker.com/resources)[Blog](https://www.docker.com/blog/)[Customers](https://www.docker.com/customers)[Partners](https://www.docker.com/partners)[Newsroom](https://www.docker.com/company/newsroom)[Events and Webinars](https://www.docker.com/events-and-webinars)[Careers](https://www.docker.com/careers)[Contact Us](https://www.docker.com/company/contact)[System Status⁠](https://www.dockerstatus.com)

---

© 2026 Docker, Inc. All rights reserved. | [Terms of Service](https://www.docker.com/legal/docker-terms-service) | [Subscription Service Agreement](https://www.docker.com/legal/docker-subscription-service-agreement) | [Privacy](https://www.docker.com/legal/privacy) | [Legal](https://www.docker.com/legal)

[](https://www.facebook.com/docker.run)[](https://x.com/docker)[](https://www.youtube.com/user/dockerrun)[](https://www.linkedin.com/company/docker)[](https://www.docker.com/feed/)

Cookies Settings

[Archive](/z0fjdcxraf)

Go back
```

---

## Assistant (Plan · Claude Sonnet 5 · 12.9s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://www.npmjs.com/search?q=bpmn%20mcp",
  "format": "markdown"
}
```

**Output:**
```
   bpmn mcp - npm search  

⚠️

npm tokens that bypass 2FA are being restricted — account changes (Aug 2026) and direct publishing (Jan 2027). [Learn how to prepare →](https://github.blog/changelog/2026-07-08-npm-install-time-security-and-gat-bypass2fa-deprecation/)

×

skip to:[content](#main)[package search](#search)[sign in](#signin)

-   [Pro](/products/pro)
-   [Teams](/products/teams)
-   [Pricing](/products)
-   [Documentation](https://docs.npmjs.com)

npm

[](/)

×

Search

[Sign Up](/signup)[Sign In](/login)

# Search results

## 1000+ packages found

Sort by: Default

-   Default
    
-   Most downloaded this week
    
-   Most downloaded this month
    
-   Most dependents
    
-   Recently published
    

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-js

](/package/bpmn-js)

A bpmn 2.0 toolkit and web modeler

-   [bpmn](/search?q=keywords:bpmn)
-   [bpmn-js](/search?q=keywords:bpmn-js)
-   [toolkit](/search?q=keywords:toolkit)
-   [web modeler](/search?q=keywords:"web modeler")
-   [modeler](/search?q=keywords:modeler)
-   [modeling](/search?q=keywords:modeling)
-   [process modeling](/search?q=keywords:"process modeling")

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9jYmM0YmM4M2E0OTU5MWZkZDgyMTRmMjdkMWU4YmZjYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.RdyPcOdTixGCX-Jm2wFBCJgH0rEdGDCEHsBRIMdmwwg)

[alekseymanetov](/~alekseymanetov)

• 18.31.1 • 17 hours ago • 667 dependents • SEE LICENSE IN LICENSEpublished version 18.31.1, 17 hours ago667 dependents licensed under $SEE LICENSE IN LICENSE

1,167,491

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-moddle

](/package/bpmn-moddle)

A moddle wrapper for BPMN 2.0

-   [bpmn](/search?q=keywords:bpmn)
-   [moddle](/search?q=keywords:moddle)
-   [bpmn20](/search?q=keywords:bpmn20)
-   [meta-model](/search?q=keywords:meta-model)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 10.3.1 • a month ago • 183 dependents • MITpublished version 10.3.1, a month ago183 dependents licensed under $MIT

1,713,206

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-js-properties-panel

](/package/bpmn-js-properties-panel)

A simple properties panel for bpmn-js

-   [bpmn-io](/search?q=keywords:bpmn-io)
-   [bpmn-js](/search?q=keywords:bpmn-js)
-   [properties](/search?q=keywords:properties)
-   [properties-panel](/search?q=keywords:properties-panel)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 5.65.2 • 14 days ago • 254 dependents • MITpublished version 5.65.2, 14 days ago254 dependents licensed under $MIT

219,075

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### camunda-bpmn-moddle

](/package/camunda-bpmn-moddle)

Camunda moddle extensions for BPMN 2.0

-   [bpmn](/search?q=keywords:bpmn)
-   [moddle](/search?q=keywords:moddle)
-   [bpmn20](/search?q=keywords:bpmn20)
-   [camunda](/search?q=keywords:camunda)
-   [meta-model](/search?q=keywords:meta-model)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NjI4MDE4MmMxM2Y4YTg4YmI5NmJmMjM0NzJlNTBkYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.zHt0_-nuYG6zGGbzZUsVoV2bBZrdNlc_pXaBnKqcEBY)

[barmac](/~barmac)

• 8.0.2 • 22 days ago • 226 dependents • MITpublished version 8.0.2, 22 days ago226 dependents licensed under $MIT

242,219

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### diagram-js-direct-editing

](/package/diagram-js-direct-editing)

Direct editing support for diagram-js

-   [diagram-js](/search?q=keywords:diagram-js)
-   [diagram-js-plugin](/search?q=keywords:diagram-js-plugin)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 3.6.0 • 21 days ago • 76 dependents • MITpublished version 3.6.0, 21 days ago76 dependents licensed under $MIT

1,141,406

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-auto-layout

](/package/bpmn-auto-layout)

Layout BPMN diagrams, generating missing DI information

-   [bpmn](/search?q=keywords:bpmn)
-   [layout](/search?q=keywords:layout)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NjI4MDE4MmMxM2Y4YTg4YmI5NmJmMjM0NzJlNTBkYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.zHt0_-nuYG6zGGbzZUsVoV2bBZrdNlc_pXaBnKqcEBY)

[barmac](/~barmac)

• 1.3.0 • 7 months ago • 15 dependents • MITpublished version 1.3.0, 7 months ago15 dependents licensed under $MIT

267,081

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### diagram-js

](/package/diagram-js)

A toolbox for displaying and modifying diagrams on the web

-   [modeler](/search?q=keywords:modeler)
-   [modeling](/search?q=keywords:modeling)
-   [canvas](/search?q=keywords:canvas)
-   [diagram-js](/search?q=keywords:diagram-js)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 15.28.1 • 15 days ago • 285 dependents • MITpublished version 15.28.1, 15 days ago285 dependents licensed under $MIT

1,355,690

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### zeebe-bpmn-moddle

](/package/zeebe-bpmn-moddle)

Zeebe moddle extensions for BPMN 2.0

-   [bpmn](/search?q=keywords:bpmn)
-   [moddle](/search?q=keywords:moddle)
-   [bpmn20](/search?q=keywords:bpmn20)
-   [zeebe](/search?q=keywords:zeebe)
-   [meta-model](/search?q=keywords:meta-model)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9jYmM0YmM4M2E0OTU5MWZkZDgyMTRmMjdkMWU4YmZjYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.RdyPcOdTixGCX-Jm2wFBCJgH0rEdGDCEHsBRIMdmwwg)

[alekseymanetov](/~alekseymanetov)

• 2.0.0 • 2 months ago • 21 dependents • MITpublished version 2.0.0, 2 months ago21 dependents licensed under $MIT

194,915

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### min-dash

](/package/min-dash)

Minimum utility toolbelt

-   [lodash](/search?q=keywords:lodash)
-   [utility](/search?q=keywords:utility)
-   [tool](/search?q=keywords:tool)
-   [belt](/search?q=keywords:belt)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 5.1.0 • 3 months ago • 457 dependents • MITpublished version 5.1.0, 3 months ago457 dependents licensed under $MIT

2,919,517

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### @joint/core

](/package/@joint/core)

JavaScript diagramming library

-   [joint](/search?q=keywords:joint)
-   [jointjs](/search?q=keywords:jointjs)
-   [diagram](/search?q=keywords:diagram)
-   [diagrams](/search?q=keywords:diagrams)
-   [chart](/search?q=keywords:chart)
-   [charts](/search?q=keywords:charts)
-   [svg](/search?q=keywords:svg)
-   [flowchart](/search?q=keywords:flowchart)
-   [graph](/search?q=keywords:graph)
-   [visualization](/search?q=keywords:visualization)
-   [visual](/search?q=keywords:visual)
-   [data](/search?q=keywords:data)
-   [dataviz](/search?q=keywords:dataviz)
-   [flow](/search?q=keywords:flow)
-   [View more](/package/@joint/core#keywords)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci83NTFlODExOTc2YTU2NzNhOTdlZmIyYmZiZjQ3MDMxNT9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.r5GRDz1Dzn7gbL_v2NIvd6cSjQCXrS9PuXD1kx44wyo)

[zbynekstara](/~zbynekstara)

• 4.3.3 • 2 months ago • 32 dependents • MPL-2.0published version 4.3.3, 2 months ago32 dependents licensed under $MPL-2.0

205,507

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### camunda-bpmn-js-behaviors

](/package/camunda-bpmn-js-behaviors)

Camunda Platform 7 and 8 behaviors for bpmn-js

-   [bpmn](/search?q=keywords:bpmn)
-   [bpmn20](/search?q=keywords:bpmn20)
-   [camunda](/search?q=keywords:camunda)
-   [zeebe](/search?q=keywords:zeebe)
-   [modeling](/search?q=keywords:modeling)
-   [bpmn-js](/search?q=keywords:bpmn-js)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 1.18.0 • 4 months ago • 11 dependents • MITpublished version 1.18.0, 4 months ago11 dependents licensed under $MIT

162,982

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-js-create-append-anything

](/package/bpmn-js-create-append-anything)

\[!\[CI\](https://github.com/bpmn-io/bpmn-js-create-append-anything/actions/workflows/CI.yml/badge.svg)\](https://github.com/bpmn-io/bpmn-js-create-append-anything/actions/workflows/CI.yml)

-   [bpmn-io](/search?q=keywords:bpmn-io)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9jYmM0YmM4M2E0OTU5MWZkZDgyMTRmMjdkMWU4YmZjYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.RdyPcOdTixGCX-Jm2wFBCJgH0rEdGDCEHsBRIMdmwwg)

[alekseymanetov](/~alekseymanetov)

• 2.1.0 • 2 months ago • 16 dependents • MITpublished version 2.1.0, 2 months ago16 dependents licensed under $MIT

65,772

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-js-color-picker

](/package/bpmn-js-color-picker)

A color picker for bpmn-js

-   [bpmn-js-example](/search?q=keywords:bpmn-js-example)
-   [bpmn-in-color](/search?q=keywords:bpmn-in-color)
-   [bpmn](/search?q=keywords:bpmn)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NjI4MDE4MmMxM2Y4YTg4YmI5NmJmMjM0NzJlNTBkYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.zHt0_-nuYG6zGGbzZUsVoV2bBZrdNlc_pXaBnKqcEBY)

[barmac](/~barmac)

• 0.7.2 • a year ago • 31 dependents • MITpublished version 0.7.2, a year ago31 dependents licensed under $MIT

65,615

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### @bpmn-io/lang-feel

](/package/@bpmn-io/lang-feel)

FEEL language support for the CodeMirror code editor

-   [editor](/search?q=keywords:editor)
-   [code](/search?q=keywords:code)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 4.0.2 • 4 months ago • 1 dependents • MITpublished version 4.0.2, 4 months ago1 dependents licensed under $MIT

269,833

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### @bpmn-io/feel-lint

](/package/@bpmn-io/feel-lint)

Linter for FEEL expressions.

-   [bpmn-io](/search?q=keywords:bpmn-io)
-   [feel](/search?q=keywords:feel)
-   [linter](/search?q=keywords:linter)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9lNDJiNmM3MTY1M2VmYzMxNWVmZjg3YTM0ZTFlMGExNj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NWw6xcGglb2cLHm9PlSzFIbtnxRN_NQCK1A79w6iQtY)

[jarekdanielak](/~jarekdanielak)

• 3.2.0 • 3 months ago • 5 dependents • MITpublished version 3.2.0, 3 months ago5 dependents licensed under $MIT

364,888

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmn-js-element-templates

](/package/bpmn-js-element-templates)

Element templates for bpmn-js

-   [bpmn-io](/search?q=keywords:bpmn-io)
-   [bpmn-js](/search?q=keywords:bpmn-js)
-   [properties](/search?q=keywords:properties)
-   [properties-panel](/search?q=keywords:properties-panel)
-   [element-templates](/search?q=keywords:element-templates)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NjI4MDE4MmMxM2Y4YTg4YmI5NmJmMjM0NzJlNTBkYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.zHt0_-nuYG6zGGbzZUsVoV2bBZrdNlc_pXaBnKqcEBY)

[barmac](/~barmac)

• 2.40.0 • 17 hours ago • 9 dependents • MITpublished version 2.40.0, 17 hours ago9 dependents licensed under $MIT

67,565

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### object-refs

](/package/object-refs)

Minimal bi-directional object references for JavaScript

-   [object](/search?q=keywords:object)
-   [bidirectional](/search?q=keywords:bidirectional)
-   [references](/search?q=keywords:references)
-   [refs](/search?q=keywords:refs)
-   [ref](/search?q=keywords:ref)
-   [property](/search?q=keywords:property)
-   [binding](/search?q=keywords:binding)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 0.4.0 • 3 years ago • 81 dependents • MITpublished version 0.4.0, 3 years ago81 dependents licensed under $MIT

1,164,094

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### bpmnlint

](/package/bpmnlint)

Validate your BPMN diagrams based on configurable lint rules

-   [bpmnlint](/search?q=keywords:bpmnlint)
-   [bpmn](/search?q=keywords:bpmn)
-   [linter](/search?q=keywords:linter)
-   [cli](/search?q=keywords:cli)
-   [validation](/search?q=keywords:validation)
-   [rules](/search?q=keywords:rules)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci82NjI4MDE4MmMxM2Y4YTg4YmI5NmJmMjM0NzJlNTBkYj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.zHt0_-nuYG6zGGbzZUsVoV2bBZrdNlc_pXaBnKqcEBY)

[barmac](/~barmac)

• 12.0.0 • a day ago • 91 dependents • MITpublished version 12.0.0, a day ago91 dependents licensed under $MIT

273,768

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### @bpmn-io/element-template-icon-renderer

](/package/@bpmn-io/element-template-icon-renderer)

A bpmn-js extension to render element templates icons

-   [element-templates](/search?q=keywords:element-templates)
-   [bpmn-js](/search?q=keywords:bpmn-js)
-   [bpmn-js-extension](/search?q=keywords:bpmn-js-extension)

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci84MTVmMDY5MGUzMjRhNzBiZjJmYWNkOGQ4MjgxNTg2OD9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.NUArF-bHTeNYflsPxbKS_FdPUdjHbZ5YVme_Gx1dYHI)

[nikku](/~nikku)

• 1.0.0 • a year ago • 4 dependents • MITpublished version 1.0.0, a year ago4 dependents licensed under $MIT

49,825

[![](https://static-production.npmjs.com/1910ec33cf83ceabb2a74a6c60959a12.svg "public package")

### @bpmn-io/lezer-feel

](/package/@bpmn-io/lezer-feel)

Lezer-based FEEL grammar

![](/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80MTMyMjgzY2U5NDVkN2FlYjE1Nzg3ZGNjYTk1Mzk0Zj9zaXplPTEwMCZkZWZhdWx0PXJldHJvIn0.6qqfkU84yIjSS4ETe9qFOIGpl_z2ojb7ek5vRLYUMrw)

[barinali](/~barinali)

• 3.0.1 • 5 months ago • 7 dependents • MITpublished version 3.0.1, 5 months ago7 dependents licensed under $MIT

537,805

[1](/search?q=bpmn%20mcp&page=0&perPage=20)

[2](/search?q=bpmn%20mcp&page=1&perPage=20)

[3](/search?q=bpmn%20mcp&page=2&perPage=20)

…

[50](/search?q=bpmn%20mcp&page=49&perPage=20)

[»](/search?q=bpmn%20mcp&page=1&perPage=20)

## Footer

[](https://github.com/npm)

[](https://github.com)

### Support

-   [Help](https://docs.npmjs.com)
-   [Advisories](https://github.com/advisories)
-   [Status](http://status.npmjs.org/)
-   [Contact npm](/support)

### Company

-   [About](/about)
-   [Blog](https://github.blog/tag/npm/)
-   [Press](/press)

### Terms & Policies

-   [Policies](/policies/)
-   [Terms of Use](/policies/terms)
-   [Code of Conduct](/policies/conduct)
-   [Privacy](/policies/privacy)
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://hub.docker.com/r/pigstep/vibe-bpmn",
  "format": "markdown"
}
```

**Output:**
```
pigstep/vibe-bpmn - Docker Image 

[](/)

Search Docker Hub

K

-   Help
    
-   System theme
    
-   Docker Suite
    

Go back

-   Help
    
-   System theme
    
-   Docker Suite
    

[Sign in](/login)[Sign up](https://app.docker.com/signup)

1.  [Explore](/search)
2.  /
3.  [pigstep](/u/pigstep)
4.  /
5.  vibe-bpmn
    

## pigstep/vibe-bpmn

By [pigstep](/u/pigstep)

•Updated 5 months ago

Create BPMN via XML or ai. Powered by BPMN.IO (Camunda)

Image

**0**

2.8K

[Overview](/r/pigstep/vibe-bpmn)[Tags](/r/pigstep/vibe-bpmn/tags)

# pigstep/vibe-bpmn repository overview

No overview available

This repository doesn't have an overview

### Tag summary

Recent tags

latest

Recent tags

**Content type**

Image

**Digest**

sha256:873e6f992…

**Size**

104.6 MB

**Last updated**

5 months ago

```bash
docker pull pigstep/vibe-bpmn
```

Copy

###### Why

[Overview](https://www.docker.com/why-docker)[What is a Container](https://www.docker.com/resources/what-container)

###### Products

[Product Overview](https://www.docker.com/products)

###### Product Offerings

[Docker Desktop](https://www.docker.com/products/docker-desktop)[Docker Hub](https://www.docker.com/products/docker-hub)

###### Features

[Container Runtime](https://www.docker.com/products/container-runtime)[Developer Tools](https://www.docker.com/products/developer-tools)[Docker App](https://www.docker.com/products/docker-app)[Kubernetes](https://www.docker.com/products/kubernetes)

###### Developers

[Getting Started](https://docs.docker.com/get-started)[Play with Docker](https://www.docker.com/play-with-docker)[Community](https://www.docker.com/docker-community)[Open Source](https://www.docker.com/open-source)[Documentation](https://www.docker.com/docs)

###### Company

[About Us](https://www.docker.com/company)[Resources](https://www.docker.com/resources)[Blog](https://www.docker.com/blog/)[Customers](https://www.docker.com/customers)[Partners](https://www.docker.com/partners)[Newsroom](https://www.docker.com/company/newsroom)[Events and Webinars](https://www.docker.com/events-and-webinars)[Careers](https://www.docker.com/careers)[Contact Us](https://www.docker.com/company/contact)[System Status⁠](https://www.dockerstatus.com)

---

© 2026 Docker, Inc. All rights reserved. | [Terms of Service](https://www.docker.com/legal/docker-terms-service) | [Subscription Service Agreement](https://www.docker.com/legal/docker-subscription-service-agreement) | [Privacy](https://www.docker.com/legal/privacy) | [Legal](https://www.docker.com/legal)

[](https://www.facebook.com/docker.run)[](https://x.com/docker)[](https://www.youtube.com/user/dockerrun)[](https://www.linkedin.com/company/docker)[](https://www.docker.com/feed/)

Cookies Settings

[Archive](/z0fjdcxraf)

Go back
```

---

## Assistant (Plan · Claude Sonnet 5 · 7.9s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/search?q=bpmn+mcp&type=repositories",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                   Repository search results · GitHub                                                                

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2Fsearch&source=header)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

# repositories Search Results · bpmn mcp

## Filter by

-   -   [Code... (...)results](https://github.com/search?q=bpmn+mcp&type=code)
    -   [Repositories41 (41)results](https://github.com/search?q=bpmn+mcp&type=repositories)
    -   [Issues
        
        results](https://github.com/search?q=bpmn+mcp&type=issues)
    -   [Pull requests
        
        results](https://github.com/search?q=bpmn+mcp&type=pullrequests)
    -   [Discussions
        
        results](https://github.com/search?q=bpmn+mcp&type=discussions)
    -   [Users
        
        results](https://github.com/search?q=bpmn+mcp&type=users)
    -   More

-   ### Languages
    
    -   [
        
        TypeScript
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3ATypeScript&type=repositories)
    -   [
        
        Python
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3APython&type=repositories)
    -   [
        
        JavaScript
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AJavaScript&type=repositories)
    -   [
        
        Java
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AJava&type=repositories)
    -   [
        
        C#
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AC%23&type=repositories)
    -   [
        
        Elixir
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AElixir&type=repositories)
    -   [
        
        HTML
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AHTML&type=repositories)
    -   [
        
        Vue
        
        
        
        ](https://github.com/search?q=bpmn+mcp+language%3AVue&type=repositories)
    -   More languages...
        
    
-   ### Advanced
    
    -   Owner
        
    -   Size
        
    -   Number of followers
        
    -   Number of forks
        
    -   Number of stars
        
    -   Date created
        
    -   Date pushed
        
    -   Topic
        
    -   License
        
    -   Archived
        
    -   [
        
        Public
        
        
        
        ](https://github.com/search?q=bpmn+mcp+is%3Apublic&type=repositories)
    -   [
        
        Private
        
        
        
        ](https://github.com/search?q=bpmn+mcp+is%3Aprivate&type=repositories)

-   [Advanced search](/search/advanced)

Filter:Repositories41 (41)

41 results  (158 ms)

## 41 results

Sort by: Best match

Filter

### 

![](https://github.com/dattmavis.png?size=40)

[dattmavis/*BPMN*\-*MCP*](/dattmavis/BPMN-MCP)

*MCP* server for creating *BPMN* 2.0 workflow diagrams programmatically

-   JavaScript
·-   [15](/dattmavis/BPMN-MCP/stargazers)
·-   Updated
    
    on Feb 5
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/oisee.png?size=40)

[oisee/*mcp*\-*bpmn*](/oisee/mcp-bpmn)

-   TypeScript
·-   [13](/oisee/mcp-bpmn/stargazers)
·-   Updated
    
    on Jun 22, 2025
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/Stieges.png?size=40)

[Stieges/*bpmn*\-generator](/Stieges/bpmn-generator)

Enterprise *BPMN* 2.0 Generator — JSON Logic-Core → ElkJS Layout → OMG-compliant XML + SVG

[svg](/topics/svg)

[workflow](/topics/workflow)

[diagram](/topics/diagram)

[xml](/topics/xml)

[mcp](/topics/mcp)

-   JavaScript
·-   [56](/Stieges/bpmn-generator/stargazers)
·-   Updated
    
    9 days ago
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/lepoco.png?size=40)

[lepoco/*mcp*\-camunda](/lepoco/mcp-camunda)

Tools to interact with the Camunda 7 Community Edition Engine using the Model Context Protocol (*MCP*). Whether you're automating workflows…

[docker](/topics/docker)

[mcp](/topics/mcp)

[bpmn](/topics/bpmn)

[bpm](/topics/bpm)

[camunda](/topics/camunda)

-   C#
·-   [14](/lepoco/mcp-camunda/stargazers)
·-   Updated
    
    on Jul 24, 2025
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/pontasan.png?size=40)

[pontasan/staruml-controller-*bpmn*\-*mcp*](/pontasan/staruml-controller-bpmn-mcp)

-   HTML
·-   [1](/pontasan/staruml-controller-bpmn-mcp/stargazers)
·-   Updated
    
    on Sep 21
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/tietz-innovations.png?size=40)

[tietz-innovations/cursor-ai-*bpmn*\-translator](/tietz-innovations/cursor-ai-bpmn-translator)

A *BPMN* to Natural Language translator *MCP* for Cursor AI

-   Python
·-   [2](/tietz-innovations/cursor-ai-bpmn-translator/stargazers)
·-   Updated
    
    on Mar 18, 2025
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/opencrawling.png?size=40)

[opencrawling/opencrawling](/opencrawling/opencrawling)

Reference Java & Spring implementation of the Open Ingestion Standard (OIS). It provides a secure, decoupled, and vendor-neutral enterpri…

[java](/topics/java)

[crawler](/topics/crawler)

[spring-boot](/topics/spring-boot)

[mcp](/topics/mcp)

[bpmn](/topics/bpmn)

-   Java
·-   [23](/opencrawling/opencrawling/stargazers)
·-   Updated
    
    19 hours ago
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/hewimetall.png?size=40)

[hewimetall/*bpmn*\-engine-*mcp*](/hewimetall/bpmn-engine-mcp)

*mcp* tools *bpmn*

-   [0](/hewimetall/bpmn-engine-mcp/stargazers)
·-   Updated
    
    on Jul 27
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/iamtheavoc1.png?size=40)

[iamtheavoc1/*mcp*\-*bpmn*](/iamtheavoc1/mcp-bpmn)

*MCP* server for *BPMN* 2.0 diagram creation, parsing, validation, analysis, conversion, and auto-layout

-   TypeScript
·-   [0](/iamtheavoc1/mcp-bpmn/stargazers)
·-   Updated
    
    on Mar 24
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/spider-node.png?size=40)

[spider-node/*bpmn*\-*mcp*](/spider-node/bpmn-mcp)

-   TypeScript
·-   [0](/spider-node/bpmn-mcp/stargazers)
·-   Updated
    
    on Aug 14
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dbpmn%2Bmcp%26type%3Drepositories)

Previous[1](https://github.com/search?q=bpmn+mcp&type=repositories&p=1)[2](https://github.com/search?q=bpmn+mcp&type=repositories&p=2)[3](https://github.com/search?q=bpmn+mcp&type=repositories&p=3)[4](https://github.com/search?q=bpmn+mcp&type=repositories&p=4)[5](https://github.com/search?q=bpmn+mcp&type=repositories&p=5)[Next](https://github.com/search?q=bpmn+mcp&type=repositories&p=2)

![Package icon](/images/modules/search/mona-love.png)

## Sponsor open source projects you depend on

Contributors are working behind the scenes to make open source better for everyone—give them the help and recognition they deserve.[Explore sponsorable projects](https://github.com/sponsors/explore)

ProTip! Press the / key to activate the search input again and adjust your query.

![Package icon](/images/modules/search/mona-love.png)

## Sponsor open source projects you depend on

Contributors are working behind the scenes to make open source better for everyone—give them the help and recognition they deserve.[Explore sponsorable projects](https://github.com/sponsors/explore)

ProTip! Press the / key to activate the search input again and adjust your query.

You can’t perform that action at this time.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/search?q=excalidraw+mcp&type=repositories",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                   Repository search results · GitHub                                                                

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2Fsearch&source=header)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

# repositories Search Results · excalidraw mcp

## Filter by

-   -   [Code... (...)results](https://github.com/search?q=excalidraw+mcp&type=code)
    -   [Repositories214 (214)results](https://github.com/search?q=excalidraw+mcp&type=repositories)
    -   [Issues
        
        results](https://github.com/search?q=excalidraw+mcp&type=issues)
    -   [Pull requests
        
        results](https://github.com/search?q=excalidraw+mcp&type=pullrequests)
    -   [Discussions
        
        results](https://github.com/search?q=excalidraw+mcp&type=discussions)
    -   [Users
        
        results](https://github.com/search?q=excalidraw+mcp&type=users)
    -   More

-   ### Languages
    
    -   [
        
        TypeScript
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3ATypeScript&type=repositories)
    -   [
        
        JavaScript
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AJavaScript&type=repositories)
    -   [
        
        Python
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3APython&type=repositories)
    -   [
        
        Shell
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AShell&type=repositories)
    -   [
        
        Dockerfile
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3ADockerfile&type=repositories)
    -   [
        
        Go
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AGo&type=repositories)
    -   [
        
        HCL
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AHCL&type=repositories)
    -   [
        
        HTML
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AHTML&type=repositories)
    -   [
        
        Rust
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3ARust&type=repositories)
    -   [
        
        C#
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+language%3AC%23&type=repositories)
    -   More languages...
        
    
-   ### Advanced
    
    -   Owner
        
    -   Size
        
    -   Number of followers
        
    -   Number of forks
        
    -   Number of stars
        
    -   Date created
        
    -   Date pushed
        
    -   Topic
        
    -   License
        
    -   Archived
        
    -   [
        
        Public
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+is%3Apublic&type=repositories)
    -   [
        
        Private
        
        
        
        ](https://github.com/search?q=excalidraw+mcp+is%3Aprivate&type=repositories)

-   [Advanced search](/search/advanced)

Filter:Repositories214 (214)

214 results  (153 ms)

## 214 results

Sort by: Best match

Filter

### 

![](https://github.com/excalidraw.png?size=40)

[excalidraw/*excalidraw*\-*mcp*](/excalidraw/excalidraw-mcp)

Fast and streamable *Excalidraw* *MCP* App

-   TypeScript
·-   [5.6k](/excalidraw/excalidraw-mcp/stargazers)
·-   Updated
    
    on Mar 24
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/yctimlin.png?size=40)

[yctimlin/*mcp*\_*excalidraw*](/yctimlin/mcp_excalidraw)

*MCP* server and Claude Code skill for *Excalidraw* — programmatic canvas toolkit to create, edit, and export diagrams via AI agents with rea…

-   TypeScript
·-   [2.6k](/yctimlin/mcp_excalidraw/stargazers)
·-   Updated
    
    12 days ago
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/Scofieldfree.png?size=40)

[Scofieldfree/*excalidraw*\-*mcp*](/Scofieldfree/excalidraw-mcp)

*excalidraw* *mcp*

-   TypeScript
·-   [102](/Scofieldfree/excalidraw-mcp/stargazers)
·-   Updated
    
    on Feb 9
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/i-tozer.png?size=40)

[i-tozer/*excalidraw*\-*mcp*](/i-tozer/excalidraw-mcp)

Model Context Protocol (*MCP*) server for *Excalidraw* - Work in Progress

-   JavaScript
·-   [45](/i-tozer/excalidraw-mcp/stargazers)
·-   Updated
    
    on Mar 15, 2025
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/BV-Venky.png?size=40)

[BV-Venky/*excalidraw*\-architect-*mcp*](/BV-Venky/excalidraw-architect-mcp)

Turn your architecture into a living, queryable knowledge graph - and render it as beautiful auto-laid-out *Excalidraw* diagrams. An *MCP* se…

[productivity](/topics/productivity)

[ai](/topics/ai)

[skills](/topics/skills)

[mcp](/topics/mcp)

[architecture](/topics/architecture)

-   Python
·-   [160](/BV-Venky/excalidraw-architect-mcp/stargazers)
·-   Updated
    
    on Aug 25
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/robonuggets.png?size=40)

[robonuggets/*excalidraw*\-skill](/robonuggets/excalidraw-skill)

*Excalidraw* diagramming skill for Claude Code — 10 visual techniques, layout best practices, self-correcting diagrams via *MCP*

-   [85](/robonuggets/excalidraw-skill/stargazers)
·-   Updated
    
    on Apr 10
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/lesleslie.png?size=40)

[lesleslie/*excalidraw*\-*mcp*](/lesleslie/excalidraw-mcp)

Unofficial *Excalidraw* *MCP* Server

-   Python
·-   [15](/lesleslie/excalidraw-mcp/stargazers)
·-   Updated
    
    25 days ago
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/weike-zhang.png?size=40)

[weike-zhang/architecture-canvas](/weike-zhang/architecture-canvas)

Chat with your documents to create and refine editable architecture diagrams. Local workspace, *Excalidraw* canvas, optional Tavily search.

[mcp](/topics/mcp)

[architecture-diagram](/topics/architecture-diagram)

[local-first](/topics/local-first)

[excalidraw](/topics/excalidraw)

[ai-agent](/topics/ai-agent)

-   Python
·-   [160](/weike-zhang/architecture-canvas/stargazers)
·-   Updated
    
    19 days ago
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/0xArtex.png?size=40)

[0xArtex/*excalidraw*\-*mcp*](/0xArtex/excalidraw-mcp)

-   TypeScript
·-   [8](/0xArtex/excalidraw-mcp/stargazers)
·-   Updated
    
    on Mar 3
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

### 

![](https://github.com/beycom.png?size=40)

[beycom/onetool-*mcp*](/beycom/onetool-mcp)

🧿 One *MCP* for developers - no tool tax, no context rot. 100+ tools including Brave, Google, Context7, *Excalidraw*, AWS, Version Checker, E…

[python](/topics/python)

[mcp](/topics/mcp)

[claude](/topics/claude)

[llm](/topics/llm)

[model-context-protocol](/topics/model-context-protocol)

-   Python
·-   [24](/beycom/onetool-mcp/stargazers)
·-   Updated
    
    on Sep 1
    

[Star](/login?return_to=https%3A%2F%2Fgithub.com%2Fsearch%3Fq%3Dexcalidraw%2Bmcp%26type%3Drepositories)

Previous[1](https://github.com/search?q=excalidraw+mcp&type=repositories&p=1)[2](https://github.com/search?q=excalidraw+mcp&type=repositories&p=2)[3](https://github.com/search?q=excalidraw+mcp&type=repositories&p=3)[4](https://github.com/search?q=excalidraw+mcp&type=repositories&p=4)[5](https://github.com/search?q=excalidraw+mcp&type=repositories&p=5)[6](https://github.com/search?q=excalidraw+mcp&type=repositories&p=6)[7](https://github.com/search?q=excalidraw+mcp&type=repositories&p=7)…[22](https://github.com/search?q=excalidraw+mcp&type=repositories&p=22)[Next](https://github.com/search?q=excalidraw+mcp&type=repositories&p=2)

![Package icon](/images/modules/search/mona-love.png)

## Sponsor open source projects you depend on

Contributors are working behind the scenes to make open source better for everyone—give them the help and recognition they deserve.[Explore sponsorable projects](https://github.com/sponsors/explore)

ProTip! Press the / key to activate the search input again and adjust your query.

![Package icon](/images/modules/search/mona-love.png)

## Sponsor open source projects you depend on

Contributors are working behind the scenes to make open source better for everyone—give them the help and recognition they deserve.[Explore sponsorable projects](https://github.com/sponsors/explore)

ProTip! Press the / key to activate the search input again and adjust your query.

You can’t perform that action at this time.
```

---

## Assistant (Plan · Claude Sonnet 5 · 15.1s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/yctimlin/mcp_excalidraw/main/README.md",
  "format": "markdown"
}
```

**Output:**
```
# Excalidraw MCP Server, CLI & Agent Skill

[![CI](https://github.com/yctimlin/mcp_excalidraw/actions/workflows/ci.yml/badge.svg)](https://github.com/yctimlin/mcp_excalidraw/actions/workflows/ci.yml)
[![Docker Build & Push](https://github.com/yctimlin/mcp_excalidraw/actions/workflows/docker.yml/badge.svg)](https://github.com/yctimlin/mcp_excalidraw/actions/workflows/docker.yml)
[![NPM Version](https://img.shields.io/npm/v/mcp-excalidraw-server)](https://www.npmjs.com/package/mcp-excalidraw-server)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**mcp-excalidraw-server** gives AI agents a live [Excalidraw](https://excalidraw.com) canvas they can draw on, look at, refine, and save into your repo. Your agent creates architecture diagrams and flowcharts programmatically, **sees its own work via screenshots**, fixes layout problems, and exports `.excalidraw` files you can commit next to your code.

One canvas, three ways to drive it:

- **Agent Skill + CLI** — recommended for coding agents (Claude Code, Codex CLI, Cursor, OpenCode): `npx -y mcp-excalidraw-server <command>`. Zero config, auto-starts the canvas, composable JSON in/out.
- **MCP Server** — 26 tools over stdio for any Model Context Protocol client (Claude Desktop, Cursor, Codex CLI, Antigravity, ...). Speaks MCP `2026-07-28` (`server/discover`, per-request `_meta` envelope, tool calls without a handshake) and stays compatible with 2025-era clients that open with `initialize`.
- **REST API** — plain HTTP for LangChain and custom frameworks.

Core drawing runs locally (Node ≥ 20, MIT licensed) — no API keys or accounts. Mermaid conversion runs in the local browser canvas; `share` is optional and uploads an encrypted scene to excalidraw.com. The canvas page loads Excalidraw's fonts from the esm.sh CDN.

## Demo

![AI agent drawing an architecture diagram on a live Excalidraw canvas via MCP](demo.gif)

*AI agent creates a complete architecture diagram from a single prompt (4x speed). [Watch full video on YouTube](https://youtu.be/ufW78Amq5qA)*

## Table of Contents

- [Demo](#demo)
- [What It Is](#what-it-is)
- [How We Differ from the Official Excalidraw MCP](#how-we-differ-from-the-official-excalidraw-mcp)
- [What's New](#whats-new)
- [Installation](#installation)
- [Agent Skill](#agent-skill)
- [CLI Reference](#cli-reference)
- [Headless Rendering](#headless-rendering)
- [Configure MCP Clients](#configure-mcp-clients)
  - [Claude Desktop](#claude-desktop)
  - [Claude Code](#claude-code)
  - [Cursor](#cursor)
  - [Codex CLI](#codex-cli)
  - [OpenCode](#opencode)
  - [Antigravity (Google)](#antigravity-google)
- [MCP Tools (26 Total)](#mcp-tools-26-total)
- [Quick Start (From Source / Docker)](#quick-start-from-source--docker)
- [Testing](#testing)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Known Issues / TODO](#known-issues--todo)
- [Development](#development)
- [License](#license)

## What It Is

Ask your agent to *"draw the architecture of this service"* and it produces a real, editable Excalidraw diagram — not a one-shot image. Because the agent can query, screenshot, and update individual elements, it iterates until labels fit, nothing overlaps, and arrows route cleanly; then it exports the result as a `.excalidraw` file that lives in your repo and gets updated when the code changes.

Under the hood there are two processes, one product:

- **Canvas server**: Excalidraw web UI + REST API + WebSocket real-time sync (default `http://127.0.0.1:3000`)
- **A thin front-end of your choice**: the CLI, the MCP stdio server, or raw HTTP — all drive the same canvas

Since v1.1 the canvas server starts itself: canvas-driving CLI commands (and the MCP server on launch) auto-spawn it if nothing is listening. `status` only inspects the current server state. Set `EXCALIDRAW_NO_AUTOSTART=1` to opt out.

## How We Differ from the Official Excalidraw MCP

Excalidraw has an [official MCP](https://github.com/excalidraw/excalidraw-mcp) — a chat widget that streams a diagram inline from a single prompt (the model gets two tools: a format reference and `create_view`). It's great for "draw me a cat" in Claude or ChatGPT. We solve a different problem: giving *coding agents* a persistent canvas workbench.

| | Official Excalidraw MCP | This Project |
|---|---|---|
| **Approach** | Prompt in, diagram out (one-shot widget) | Programmatic element-level control (CLI + 26 MCP tools) |
| **State** | Checkpoints inside the chat widget | Live canvas with real-time sync and optional restart-safe checkpoints |
| **Element CRUD** | Declarative re-send with delete markers | Full create / read / update / delete per element |
| **AI sees the canvas** | No | `describe` (structured text) + `screenshot` (image) |
| **Iterative refinement** | Regenerate from checkpoint | Draw → look → adjust → look again, element by element |
| **Layout tools** | No | align, distribute, group / ungroup, lock, duplicate |
| **File I/O** | No model-facing export | `.excalidraw` export/import — diagrams as repo artifacts |
| **Snapshot & rollback** | Widget-side checkpoints | Named server-side snapshots |
| **Mermaid conversion** | No | `mermaid` / `create_from_mermaid` |
| **Shareable URLs** | Widget-only | `share` / `export_to_excalidraw_url` |
| **Viewport control** | Camera animations | `set_viewport` (zoom-to-fit all or selected elements, center on one element, manual zoom) |
| **Works without MCP** | No | Yes — CLI + agent skill + REST API |
| **Multi-agent** | Single chat | Multiple agents on the same canvas concurrently |

**TL;DR** — The official MCP shows Excalidraw diagrams in your chat. This project gives your coding agent a full Excalidraw workbench: a canvas it can draw on, inspect, refine, and commit to your repo.

## What's New

Current package version: **2.1.2**. The current release line is **v2.1 — Headless Rendering**.

### v2.1.2 — Fixes

- Snapshot restore no longer wipes the canvas; frames restore and import. (#101, thanks @sanjayy0612; #120)
- One label per shape, even across updates and renames. (#121, thanks @sdrshn-nmbr)
- Dropped images survive reload and show up in exports. (#122, thanks @appdesigngeeks)
- Text is no longer clipped when the font loads late. (#123, #124)

### v2.1.1 — Fixes

- Large exports no longer fail with `invalid order key`. (#115, thanks @fernandovmacedo)
- Text and arrows no longer drift on each canvas sync. (#116, thanks @hidinginabunker)
- Library installs work and persist; labels re-wrap on resize. (#113, thanks @lukemariano)

### v2.1 — Headless Rendering

- **Screenshots and image exports no longer need a browser tab.** `screenshot`, `export_to_image` and `get_canvas_screenshot` render inside the canvas server: Excalidraw's own SVG exporter runs under Node (jsdom) and resvg rasterizes to PNG with bundled Excalifont/Virgil/Cascadia/Liberation fonts. Same output as the tab, deterministic (byte-identical for an unchanged scene), a few milliseconds per render, works in CI and Docker. See [Headless Rendering](#headless-rendering).
- **New render options** on the CLI, REST and MCP: `dark`, `scale` (1–4), `padding`, `elementIds` (render a subset), `frameId` (render one frame), `embedFonts`. `--renderer browser` keeps the old tab path.
- **New `render` command**: `npx -y mcp-excalidraw-server render docs/arch.excalidraw --out docs/arch.png` renders a committed file offline — no canvas server at all.
- Shapes created without `width`/`height` now default to 100×100 in exports and renders (matching the canvas) instead of collapsing to 0×0.
- Text stored with `width: 0, height: 0` (scenes from pre-2.0 servers) is re-measured on export instead of exporting invisible. (#107)

### v2.0 — Interchange-Grade Exports & MCP 2026-07-28

- **Breaking: Node >= 20 required** (was 18) — the MCP TypeScript SDK v2 sets the floor. Everything else is backward compatible, including existing MCP client configs.
- **MCP protocol revision 2026-07-28**: modern clients can call tools statelessly without an initialization handshake (`server/discover`, per-request `_meta` envelopes); legacy initialization-based clients keep working unchanged. (#98, thanks @anxkhn)
- **Exports render everywhere now**: `.excalidraw` / `.excalidraw.md` files contain real Excalidraw elements — shape and arrow labels as bound text, live arrow bindings — so they open correctly on excalidraw.com and in the Obsidian Excalidraw plugin instead of losing labels (or being re-saved empty by the plugin). (#93, #95)
- **Byte-stable exports**: deterministic ids, seeds, and key order — re-exporting an unchanged scene is byte-identical, so committed diagrams and vault files never produce phantom git diffs, and Obsidian block references survive re-exports.
- **Obsidian vault fixes**: Windows/CRLF `.excalidraw.md` files import correctly (#94, thanks @cason-miles); `## Text Elements` block references now cover shape labels too.
- **Element fields are never silently dropped**: unknown Excalidraw properties (`containerId`, `textAlign`, `originalText`, ...) pass through the server intact — fixes browser-edited text vanishing after sync. (#92, thanks @junuxyz)
- **Mermaid conversion merges** into the existing canvas instead of replacing it, and each browser tab holds exactly one WebSocket connection (no more doubled labels). (#91)
- **Viewport control**: `set_viewport` gains `scrollToElementIds` (multi-element zoom-to-fit) and `viewportZoomFactor`, with strict single-mode validation and real error reporting. (#86, thanks @acercyc)
- **Dark mode**: the canvas page chrome follows the editor theme and persists it across reloads. (#89, thanks @danielsvane)

### v1.1 — CLI-First

- **First-class CLI**: every capability is now a composable command — `npx -y mcp-excalidraw-server add|query|describe|screenshot|export|import|mermaid|snapshot|arrange|share|...` — JSON on stdout, meaningful exit codes. Also installed as the `excalidraw-canvas` alias.
- **Zero-setup**: canvas-driving CLI commands and the MCP server **auto-start the canvas server** if it isn't running (closes #66). Opt out with `EXCALIDRAW_NO_AUTOSTART=1`.
- **`apply`**: multi-op patches (`{"create":[...],"update":[{"id":"a","set":{...}}],"delete":[...]}`) in a single invocation.
- **`install-skill`**: `npx -y mcp-excalidraw-server install-skill --dir <skills-root>` copies the portable agent skill into the directory your agent chooses (project or global), cleanly replacing older versions.
- **Skill is now CLI-first** and no longer needs a cloned repo or configured MCP server to work.
- **Typed queries**: `query --filter locked=true --filter label.text=API` — booleans, numbers, and nested keys work.
- **Internals**: shared core library (`src/core/`) behind both the CLI and MCP server; canvas `groupIds` are the source of truth for grouping (ungroup now works across restarts); `node-fetch` dropped; MCP version metadata derived from `package.json`; canvas server writes a pidfile and shuts down cleanly.

## Installation

The only prerequisite is **Node.js ≥ 20**.

### Easiest: let your agent install it

Copy this into your coding agent — it installs the portable skill into the project/global skill directory that agent already knows how to use, then verifies it by drawing a test diagram:

```text
Install the Excalidraw canvas toolkit so you can draw diagrams for me:

1. Choose the right skill directory for this agent and scope (project or global).
2. Run: npx -y mcp-excalidraw-server install-skill --dir <that-skills-directory>
3. Read the installed excalidraw-skill/SKILL.md so you know the drawing workflow.
4. Start the canvas with: npx -y mcp-excalidraw-server start
   then tell me I can open http://127.0.0.1:3000 to watch you draw (optional).
5. Draw a small test diagram — two labeled boxes connected by an arrow — take a
   screenshot, and show me the result to confirm everything works.
```

### Manual install

| You are... | Install with | Then |
|---|---|---|
| **Modern coding agent** | `npx -y mcp-excalidraw-server install-skill --dir <skills-root>` | Let the agent choose project/global scope and its skill root |
| **Claude Code shortcut** | `npx -y mcp-excalidraw-server install-skill` | Installs to `~/.claude/skills` for backward compatibility |
| **Codex shortcut** | `npx -y mcp-excalidraw-server install-skill --target codex` | Installs to `~/.codex/skills` for backward compatibility |
| **MCP client user** (Claude Desktop, Cursor, ...) | Add the npx config below | See [Configure MCP Clients](#configure-mcp-clients) |
| **CLI user / scripting** | Nothing — `npx -y mcp-excalidraw-server <command>` | See [CLI Reference](#cli-reference) |
| **Contributor / from source** | `git clone` + `npm ci` + `npm run build` | See [Quick Start (From Source / Docker)](#quick-start-from-source--docker) |

There is no separate server setup: any drawing command auto-starts the local canvas server on `http://127.0.0.1:3000`.

### 60-Second Quick Start (CLI)

No clone, no config:

```bash
# start the canvas (drawing commands auto-start it too) and open it
npx -y mcp-excalidraw-server start
open http://127.0.0.1:3000   # optional: watch live (only mermaid needs the tab)

# draw something
echo '[
  {"id":"api","type":"rectangle","x":100,"y":100,"width":160,"height":80,"text":"API Server","backgroundColor":"#a5d8ff"},
  {"id":"db","type":"rectangle","x":400,"y":100,"width":160,"height":80,"text":"Database","backgroundColor":"#99e9f2"},
  {"type":"arrow","x":0,"y":0,"startElementId":"api","endElementId":"db","text":"SQL"}
]' | npx -y mcp-excalidraw-server add

# let your agent see its work
npx -y mcp-excalidraw-server describe
npx -y mcp-excalidraw-server screenshot --out diagram.png

# diagrams as repo artifacts
mkdir -p docs
npx -y mcp-excalidraw-server export --out docs/architecture.excalidraw

# or straight into an Obsidian vault (.md extension → Obsidian Excalidraw plugin format)
npx -y mcp-excalidraw-server export --out ~/vault/diagrams/architecture.excalidraw.md
```

Give your agent the full playbook:

```bash
npx -y mcp-excalidraw-server install-skill --dir <skills-root>
npx -y mcp-excalidraw-server install-skill --print-source  # inspect bundled source path
```

> **Security note:** The canvas server binds `127.0.0.1` only by default. If you expose it on a network interface (`HOST=0.0.0.0`), put network-level access controls in front — the API has no built-in authentication.

## Agent Skill

The skill at `skills/excalidraw-skill/` teaches agents the full workflow — layout planning, the screenshot-verify-fix quality loop, arrow routing, anti-patterns, snapshots, and file I/O. It works through the CLI (preferred, zero setup), MCP tools (if configured), or raw REST — in that order.

```bash
npx -y mcp-excalidraw-server install-skill --dir <skills-root>
```

The command copies the bundled `excalidraw-skill/` directory into `<skills-root>/excalidraw-skill`. Let your agent choose whether that root should be project-level or global. Re-running `install-skill` upgrades in place — it replaces the target directory, so files removed upstream don't linger.

Where the skill shines:

- **Diagrams as code artifacts**: export `.excalidraw` files into the repo, commit them, re-import + refine when the architecture changes.
- **Obsidian vaults**: export with a `.excalidraw.md` extension and the file opens natively in the [Obsidian Excalidraw plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) — no compatibility-mode warning, block references and sync work; `import` reads both plain and lz-string-compressed vault files back.
- **Self-verifying diagrams**: the agent screenshots its own work and fixes truncation/overlap before calling it done.
- **No-MCP environments**: CI jobs, plain shells, and frameworks get the same capabilities through the CLI.

## CLI Reference

`npx -y mcp-excalidraw-server <command>` or (after `npm i -g mcp-excalidraw-server`) `excalidraw-canvas <command>`.

Conventions: JSON results on stdout — except `describe` (plain text by design) and raw-content output when `--out` is omitted (`export` prints the scene JSON, `screenshot --format svg` prints SVG). Diagnostics on stderr. Exit codes: `0` ok, `1` error, `2` usage, `3` canvas unreachable, `4` browser tab required (only `mermaid` and `screenshot --renderer browser`). Canvas URL from `EXPRESS_SERVER_URL` or `--url`. Canvas-driving commands auto-start the server; `status` only reports current state. Explicit `start` overrides the `EXCALIDRAW_NO_AUTOSTART=1` opt-out (it's user intent, not auto-start).

| Command | Description |
|---------|-------------|
| `start` / `stop` / `status` | Manage the canvas server (detached; `stop` identity-checks the live server via `/health` before signaling) |
| `add [file\|-]` | Batch-create elements from a JSON array (file or stdin); `--one '{...}'` for a single element |
| `apply [file\|-]` | One-call multi-op patch: `{"create":[...],"update":[{"id":"a","set":{...}}],"delete":["id"]}` |
| `get <id>` / `delete <id...>` | Read / remove elements |
| `update <id> --set '{...}'` | Update an element |
| `query` | `--type`, `--bbox x0,y0,x1,y1`, `--filter k=v` (typed, nested keys), `--filter-json '{...}'` |
| `describe` | AI-readable scene summary (plain text) |
| `screenshot` | Render the canvas headless (no browser tab): `--out f.png\|f.svg`, `--format png\|svg`, `--scale 1-4`, `--dark`, `--padding N`, `--no-background`, `--ids a,b`, `--frame <id>`, `--no-embed-fonts`, `--embed-scene` (editable PNG); `--renderer browser` uses an open tab instead |
| `render [file\|-]` | Render a `.excalidraw` / `.excalidraw.md` / embedded-scene PNG file to PNG/SVG offline — no canvas server, same flags as `screenshot` |
| `export [--out f.excalidraw] [--format json\|obsidian]` / `import [file\|-] [--replace]` | Scene file I/O — a `.md` out path writes Obsidian's `.excalidraw.md` format; `import` also reads PNGs with embedded scenes |
| `mermaid [file\|-]` | Mermaid → canvas (browser tab required) |
| `snapshot save\|list\|restore <name>` | Named snapshots |
| `arrange align\|distribute\|group\|ungroup\|lock\|unlock\|duplicate` | Layout ops (`--ids a,b,c`, `--to left\|horizontal\|...`) |
| `share` | Encrypted upload → shareable excalidraw.com URL |
| `clear --yes` | Wipe the canvas |
| `install-skill [--dir <skills-root>]` | Install the portable agent skill |

Labels and arrow bindings use the agent-friendly format everywhere in the CLI: `"text"` on any shape, `"startElementId"`/`"endElementId"` on arrows — normalization is automatic. For a native frame, add a `"type":"frame"` element with a `"name"` and set `"frameId"` on its children.

## Headless Rendering

Since v2.1, `screenshot`, `export_to_image` and `get_canvas_screenshot` render without a browser. Inside the canvas server, the scene is prepared with the canvas tab's own code (label sizing, wrapping and centering, defaults) and Excalidraw's own `exportToSvg` draws it under Node (a small jsdom shim supplies the DOM it expects, and text is measured with the bundled fonts' real glyph widths); [resvg](https://github.com/thx/resvg-js) rasterizes the SVG to PNG. The output is what the Excalidraw canvas draws — same SVG structure as a browser export, text within half a pixel — and it is deterministic: an unchanged scene renders to byte-identical SVG and PNG, so committed images stay diff-clean.

- **Fonts**: Excalifont, Virgil, Cascadia Code and Liberation Sans ship as TTFs in `assets/fonts` (all SIL OFL 1.1; see `assets/fonts/LICENSES.md`). SVGs embed the faces they use, so they look right in browsers, GitHub and editors. Nunito, Lilita One and Comic Shanns render with the closest bundled face for now. Text in other scripts (CJK, emoji) falls back to the machine's fonts, with a warning.
- **Options** (CLI flags / REST body / MCP params): `background`, `dark`, `scale` 1–4 (PNG), `padding`, `elementIds` or `frameId` to render a subset, `embedFonts`, `embedScene` (PNG only, default false). `EXCALIDRAW_RENDER_MAX_DIM` (default 8192) caps the PNG's largest side.
- **`--renderer browser`** asks an open canvas tab to render instead (the pre-2.1 path). Useful for a second opinion; it is slower and the tab's unsynced edits are discarded first.
- **Offline**: `render docs/arch.excalidraw --out docs/arch.png` needs no canvas server at all — a natural fit for CI jobs that keep images next to committed diagrams.
- **Still browser-bound**: Mermaid conversion (`mermaid`, `create_from_mermaid`) and `set_viewport`.

The renderer bundle is built by `npm run build:server` (`dist/render/excalidraw-node.mjs`); `npm run test:render` exercises it without a browser.

## Configure MCP Clients

The MCP server runs over stdio. Since v1.1 the simplest config is `npx` — no clone, no absolute paths, and the canvas auto-starts:

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `EXPRESS_SERVER_URL` | URL of the canvas server | `http://127.0.0.1:3000` |
| `ENABLE_CANVAS_SYNC` | Enable real-time canvas sync | `true` |
| `EXCALIDRAW_NO_AUTOSTART` | Set `1` to disable canvas auto-start | (unset) |
| `EXCALIDRAW_EXPORT_DIR` | Base directory MCP file exports may write to | current working dir |
| `EXCALIDRAW_RENDER_MAX_DIM` | Largest side of a headless PNG, in pixels | `8192` |
| `EXCALIDRAW_DATA_DIR` | Optional local durable-state directory | (unset; in-memory) |
| `PORT` / `HOST` | Canvas server bind address | `3000` / `127.0.0.1` |
| `LOG_LEVEL` | Log verbosity (`error`, `warn`, `info`, `debug`) | `info` |
| `LOG_FILE_PATH` | Log file location | `~/Library/Logs/excalidraw-mcp.log` (macOS), `$XDG_STATE_HOME/excalidraw-mcp/excalidraw.log` (Linux), `%LOCALAPPDATA%\Excalidraw-MCP\excalidraw.log` (Windows) |

#### Durable canvas state

Set `EXCALIDRAW_DATA_DIR` to recover elements, server-known image files, and named snapshots after a canvas-server restart. From a source checkout after `npm run build`:

```bash
EXCALIDRAW_DATA_DIR=/absolute/private/canvas-data \
  node dist/bin.js start
```

When the variable is unset, behavior and API semantics remain in-memory and no durable-state directory is created. When enabled, the directory contains a versioned `canvas-state-v1.json` checkpoint, a `blobs/` directory, and a runtime `canvas-state.lock/` ownership directory. Image payloads are stored once as immutable file-id blobs at a path-safe SHA-256 of each file ID; checkpoints record a separate content SHA-256 and contain references only. A new blob is flushed and atomically published before any checkpoint is allowed to reference it. Each accepted mutation flushes a temporary checkpoint and atomically renames it before the server broadcasts or acknowledges the mutation. Serialization recursively sorts object keys, preserves scene stacking order, and stores file and named-snapshot metadata in stable ID/name order. Invalid JSON, unsupported schemas, non-regular checkpoint paths, missing blobs, and blob-integrity failures stop startup rather than replacing recoverable state with an empty scene.

Two REST rules are stricter in durable mode, and both return `409`: upload an image's file (`POST /api/files`) before the element that references it, and never re-upload a file ID with different content. The canvas tab and `import` already work this way.

If the checkpoint has already been renamed into place but the final directory flush fails, the request fails without a success broadcast and further mutations are refused until restart. The published scene stays in memory so it agrees with the file on disk; the failed request may appear in the recovered scene. On Windows, Node.js does not provide directory fsync, so the store flushes file contents and uses atomic publication without claiming the same directory durability barrier.

The data-directory lock grants one process exclusive ownership of that durable state, including when servers use different ports. It stores one token-specific owner file so stale-lock reclamation cannot delete a newer owner's evidence. The existing pidfile has a separate job: it identifies a listening process for `start` / `stop` lifecycle commands. Local filesystems and one writer are supported; network filesystems, shared multi-writer access, automatic blob garbage collection, databases, and cloud persistence are out of scope.

> **Privacy:** durable state contains the diagram and embedded image payloads. Keep the directory outside repositories and shared folders, restrict its permissions, and mount it as a private writable volume when using containers.

---

### Claude Desktop

Config location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**npx (recommended)**
```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "npx",
      "args": ["-y", "mcp-excalidraw-server"]
    }
  }
}
```

**Local (node)**
```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/absolute/path/to/mcp_excalidraw/dist/index.js"],
      "env": {
        "EXPRESS_SERVER_URL": "http://127.0.0.1:3000",
        "ENABLE_CANVAS_SYNC": "true"
      }
    }
  }
}
```

**Docker**
```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "EXPRESS_SERVER_URL=http://host.docker.internal:3000",
        "-e", "ENABLE_CANVAS_SYNC=true",
        "ghcr.io/yctimlin/mcp_excalidraw:latest"
      ]
    }
  }
}
```

---

### Claude Code

**npx (recommended)**
```bash
claude mcp add excalidraw --scope user -- npx -y mcp-excalidraw-server
```

> Tip: for coding agents, the skill + CLI often beats MCP config entirely — let the agent pick its skill root, then run `npx -y mcp-excalidraw-server install-skill --dir <skills-root>`.

**Local (node)** - User-level (available across all projects):
```bash
claude mcp add excalidraw --scope user \
  -e EXPRESS_SERVER_URL=http://127.0.0.1:3000 \
  -e ENABLE_CANVAS_SYNC=true \
  -- node /absolute/path/to/mcp_excalidraw/dist/index.js
```

**Docker**
```bash
claude mcp add excalidraw --scope user \
  -- docker run -i --rm \
  -e EXPRESS_SERVER_URL=http://host.docker.internal:3000 \
  -e ENABLE_CANVAS_SYNC=true \
  ghcr.io/yctimlin/mcp_excalidraw:latest
```

**Manage servers:**
```bash
claude mcp list              # List configured servers
claude mcp remove excalidraw # Remove a server
```

---

### Cursor

Config location: `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` for global config)

**npx (recommended)**
```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "npx",
      "args": ["-y", "mcp-excalidraw-server"]
    }
  }
}
```

**Docker**
```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-e", "EXPRESS_SERVER_URL=http://host.docker.internal:3000",
        "-e", "ENABLE_CANVAS_SYNC=true",
        "ghcr.io/yctimlin/mcp_excalidraw:latest"
      ]
    }
  }
}
```

---

### Codex CLI

**npx (recommended)**
```bash
codex mcp add excalidraw -- npx -y mcp-excalidraw-server
```

**Docker**
```bash
codex mcp add excalidraw \
  -- docker run -i --rm \
  -e EXPRESS_SERVER_URL=http://host.docker.internal:3000 \
  -e ENABLE_CANVAS_SYNC=true \
  ghcr.io/yctimlin/mcp_excalidraw:latest
```

**Manage servers:**
```bash
codex mcp list              # List configured servers
codex mcp remove excalidraw # Remove a server
```

---

### OpenCode

Config location: `~/.config/opencode/opencode.json` or project-level `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "excalidraw": {
      "type": "local",
      "command": ["npx", "-y", "mcp-excalidraw-server"],
      "enabled": true
    }
  }
}
```

---

### Antigravity (Google)

Config location: `~/.gemini/antigravity/mcp_config.json`

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "npx",
      "args": ["-y", "mcp-excalidraw-server"]
    }
  }
}
```

---

### Notes

- **Docker networking**: Use `host.docker.internal` to reach the canvas server running on your host machine. On Linux, you may need `--add-host=host.docker.internal:host-gateway` or use `172.17.0.1`. The Docker MCP image sets `EXCALIDRAW_NO_AUTOSTART=1` (it has no frontend build) — run the canvas as its own container.
- **In-memory storage**: The canvas server stores elements in memory. Restarting the server clears all elements — use `export` / `snapshot` for persistence.

## MCP Tools (26 Total)

| Category | Tools |
|---|---|
| **Element CRUD** | `create_element`, `get_element`, `update_element`, `delete_element`, `query_elements`, `batch_create_elements`, `duplicate_elements` |
| **Layout** | `align_elements`, `distribute_elements`, `group_elements`, `ungroup_elements`, `lock_elements`, `unlock_elements` |
| **Scene Awareness** | `describe_scene`, `get_canvas_screenshot` |
| **File I/O** | `export_scene`, `import_scene`, `export_to_image`, `export_to_excalidraw_url`, `create_from_mermaid` |
| **State Management** | `clear_canvas`, `snapshot_scene`, `restore_snapshot` |
| **Viewport** | `set_viewport` |
| **Design Guide** | `read_diagram_guide` |
| **Resources** | `get_resource` |

Full schemas are discoverable via `tools/list` or in `skills/excalidraw-skill/references/cheatsheet.md`.

Viewport group focus can tune framing with `viewportZoomFactor`:

```json
{
  "scrollToElementIds": ["id1", "id2", "id3"],
  "viewportZoomFactor": 0.85
}
```

`scrollToElementIds` zooms to fit every requested element, while `scrollToElementId` centers one element without changing the current zoom. Specify only one viewport mode per request. `viewportZoomFactor` accepts values greater than 0 and at most 1.

## Quick Start (From Source / Docker)

From source (Node >= 20):

```bash
npm ci
npm run build
PORT=3000 npm run canvas          # canvas server (terminal 1)
node dist/index.js                # MCP server over stdio (terminal 2, usually launched by your MCP client)
node dist/bin.js status           # or drive the CLI straight from the build
```

Docker canvas server:
```bash
docker run -d -p 3000:3000 --name mcp-excalidraw-canvas ghcr.io/yctimlin/mcp_excalidraw-canvas:latest
```

MCP server image: `ghcr.io/yctimlin/mcp_excalidraw:latest` (stdio; point `EXPRESS_SERVER_URL` at the canvas container).

## Testing

### CLI Smoke Test

```bash
npx -y mcp-excalidraw-server start
npx -y mcp-excalidraw-server status
npx -y mcp-excalidraw-server add --one '{"type":"rectangle","x":100,"y":100,"width":300,"height":200}'
npx -y mcp-excalidraw-server describe
```

### Canvas Smoke Test (HTTP)

```bash
curl http://127.0.0.1:3000/health
```

### Regression Checks

`npm test` builds the server and runs four suites, each also available on its own:

```bash
npm test
npm run test:mcp      # MCP stdio wire protocol (see below)
npm run test:bind     # default loopback bind, duplicate-start refusal
npm run test:render   # headless renderer, export order keys, scene-prep stability
npm run test:state    # atomic import and snapshot restore, sync validation
```

### Canvas Browser Regression Tests

These Chromium tests build the app and start an isolated localhost server. They
cover frame reload/reconnect, mixed scenes, failed-load sync protection, stale
responses, clearing/deletion, Mermaid imports, SVG export, dropped images, and
text measurement after fonts load. They refuse to reuse an existing server; set
`CANVAS_TEST_PORT` if port 51910 is occupied.

```bash
npx playwright install chromium
npm run type-check:frontend
npm run test:canvas
```

### MCP Stdio Wire Test

Drives `dist/index.js` with raw JSON-RPC frames and checks both protocol eras:
`server/discover`, tool calls sent without any handshake, refusal of unsupported
protocol revisions and malformed `_meta` envelopes, and the legacy `initialize`
path.

```bash
npm run test:mcp
```

### MCP Smoke Test (MCP Inspector)

List tools:
```bash
npx @modelcontextprotocol/inspector --cli \
  -e EXPRESS_SERVER_URL=http://127.0.0.1:3000 \
  -e ENABLE_CANVAS_SYNC=true -- \
  node dist/index.js --method tools/list
```

Create a rectangle:
```bash
npx @modelcontextprotocol/inspector --cli \
  -e EXPRESS_SERVER_URL=http://127.0.0.1:3000 \
  -e ENABLE_CANVAS_SYNC=true -- \
  node dist/index.js --method tools/call --tool-name create_element \
  --tool-arg type=rectangle --tool-arg x=100 --tool-arg y=100 \
  --tool-arg width=300 --tool-arg height=200
```

### Frontend Screenshots (agent-browser)

If you use `agent-browser` for UI checks:
```bash
agent-browser install
agent-browser open http://127.0.0.1:3000
agent-browser wait --load networkidle
agent-browser screenshot /tmp/canvas.png
```

## FAQ

### How is this different from the official Excalidraw MCP?

The [official Excalidraw MCP](https://github.com/excalidraw/excalidraw-mcp) is a chat widget: you prompt, it streams a diagram into the conversation (the model gets two tools). This project is a **workbench for coding agents**: a persistent local canvas with element-level create/read/update/delete, layout tools, screenshots the model can see, snapshots, and `.excalidraw` file I/O — driveable via CLI, MCP, or REST. See the [full comparison table](#how-we-differ-from-the-official-excalidraw-mcp).

### Which AI tools does it work with?

Claude Code, Claude Desktop, Cursor, Codex CLI, OpenCode, and Google Antigravity are documented below — but any agent that can run shell commands can use the CLI, any MCP client can use the MCP server, and anything else (LangChain, custom apps) can use the REST API.

### Can the AI actually see the diagram it drew?

Yes — that's the core feature. `describe` returns a structured text summary (ids, positions, labels, connections) and `screenshot` returns a rendered PNG. Agents use both to catch truncated labels, overlaps, and bad arrow routing, then fix them element by element.

### Do I need a browser open?

No. Screenshots and PNG/SVG exports render headless inside the canvas server (see [Headless Rendering](#headless-rendering)), and everything else — creating, querying, updating elements, `.excalidraw` files — never needed one. Only two things still need an open tab: Mermaid conversion (it lays out in the browser) and viewport control (it moves a camera). The CLI exits with code `4` and tells you when that is the case. Opening the URL is still the way for a human to watch the agent draw.

### Are my diagrams persistent?

By default the canvas is in-memory (restart = blank canvas). Set `EXCALIDRAW_DATA_DIR` for automatic local restart recovery of elements, server-known image files, and named snapshots. Portable, reviewable artifacts should still be exported as `.excalidraw` files and committed to your repo when appropriate.

### Are excalidraw.com share links private?

`share` encrypts the scene locally with AES-GCM before uploading; the decryption key is only in the URL fragment, which excalidraw.com's server never sees. Anyone you give the full link to can view the diagram.

### Does it need an API key or cloud service?

No API key is required. Core drawing runs locally under MIT license. Outbound traffic is limited to the canvas page loading Excalidraw's fonts from the esm.sh CDN and the optional `share` upload to excalidraw.com. The CLI, MCP server and headless renderer make no other network calls.

### Can I use it without configuring MCP?

Yes — that's the recommended path for coding agents: `npx -y mcp-excalidraw-server install-skill --dir <skills-root>` and the agent drives everything through the CLI. MCP configuration is only needed for chat clients like Claude Desktop.

## Troubleshooting

- **CLI exit code 3** (canvas unreachable): the server is not running for an inspecting command such as `status`, auto-start is disabled (`EXCALIDRAW_NO_AUTOSTART=1`), or `EXPRESS_SERVER_URL` points at a non-loopback host. Run `start` explicitly or fix the env.
- **CLI exit code 4** (browser required): only `mermaid` and `screenshot --renderer browser` need an open tab — open `http://127.0.0.1:3000` in a browser and retry, or drop `--renderer browser` to render headless.
- **Headless PNG shows boxes instead of CJK/emoji text**: the bundled fonts cover Latin scripts; for other scripts resvg falls back to the machine's fonts (a warning is printed). Install a CJK font on the machine running the canvas server.
- **Canvas not updating**: confirm `EXPRESS_SERVER_URL` points at the running canvas server (`status` shows the URL in use).
- **Canvas page shows plain fonts offline**: the page loads Excalidraw's hand-drawn fonts from the esm.sh CDN, so without internet access it falls back to system fonts. Headless screenshots and `render` use the bundled fonts and are unaffected.
- **Something else looks wrong**: the server log has the details; its location is in [Environment Variables](#environment-variables) (`LOG_FILE_PATH`).

## Known Issues / TODO

- [x] **Optional persistent storage**: set `EXCALIDRAW_DATA_DIR` for atomic local restart recovery; the default remains in-memory.
- [ ] **Mermaid conversion requires a browser**: `mermaid` / `create_from_mermaid` lay out the diagram in the frontend. Image export and screenshots are headless since v2.1.
- [ ] **Canvas page fonts come from a CDN**: serving them from the canvas server would make the page work fully offline.

Contributions welcome!

## Development

```bash
npm run type-check
npm run build
npm run cli -- status      # run the CLI from the local build
npm run sync:skills        # after editing skills/excalidraw-skill, sync the repo-local agent copy
```

Bug reports and pull requests are welcome on [GitHub issues](https://github.com/yctimlin/mcp_excalidraw/issues). If this project helps you, a ⭐ helps others find it.

## License

[MIT](LICENSE) © [yctimlin](https://github.com/yctimlin) — not affiliated with the Excalidraw team. [Excalidraw](https://github.com/excalidraw/excalidraw) is its own MIT-licensed project; this toolkit builds on it with love.

**Links:** [npm package](https://www.npmjs.com/package/mcp-excalidraw-server) · [GitHub](https://github.com/yctimlin/mcp_excalidraw) · [Issues](https://github.com/yctimlin/mcp_excalidraw/issues) · [Demo video](https://youtu.be/ufW78Amq5qA)

If you're interested in what comes next, follow me on X: [@ycalintim](https://x.com/ycalintim).

```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/excalidraw/excalidraw-mcp/main/README.md",
  "format": "markdown"
}
```

**Output:**
```
# Excalidraw MCP App Server

MCP server that streams hand-drawn Excalidraw diagrams with smooth viewport camera control and interactive fullscreen editing.

![Demo](docs/demo.gif)

## Install

Works with any client that supports [MCP Apps](https://modelcontextprotocol.io/docs/extensions/apps) — Claude, ChatGPT, VS Code, Goose, and others. If something doesn't work, please [open an issue](https://github.com/antonpk1/excalidraw-mcp-app/issues).

### Remote (recommended)

### `https://mcp.excalidraw.com`

For apps that don't yet have an official integration, you can add a custom MCP / connector (naming can vary between apps).

### Local

**Option A: Download Extension**

1. Download `excalidraw-mcp-app.mcpb` from [Releases](https://github.com/antonpk1/excalidraw-mcp-app/releases)
2. Double-click to install in Claude Desktop

**Option B: Build from Source**

```bash
git clone https://github.com/excalidraw/excalidraw-mcp.git
cd excalidraw-mcp-app
pnpm install && pnpm run build
```

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "excalidraw": {
      "command": "node",
      "args": ["/path/to/excalidraw-mcp-app/dist/index.js", "--stdio"]
    }
  }
}
```

Restart Claude Desktop.

## Usage

Example prompts:
- "Draw a cute cat using excalidraw"
- "Draw an architecture diagram showing a user connecting to an API server which talks to a database"

## What are MCP Apps and how can I build one?

Text responses can only go so far. Sometimes users need to interact with data, not just read about it. [MCP Apps](https://github.com/modelcontextprotocol/ext-apps/) is an official Model Context Protocol extension that lets servers return interactive HTML interfaces (data visualizations, forms, dashboards) that render directly in the chat.

- **Getting started for humans**: [documentation](https://modelcontextprotocol.io/docs/extensions/apps)
- **Getting started for AIs**: [skill](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/create-mcp-app/SKILL.md)

## Contributing

PRs welcome! See [Local](#local) above for build instructions.

### Deploy your own instance

You can deploy your own copy to Vercel in a few clicks:

1. Fork this repo
2. Go to [vercel.com/new](https://vercel.com/new) and import your fork
3. No environment variables needed — just deploy
4. Your server will be at `https://your-project.vercel.app/mcp`

### Release checklist

<details>
<summary>For maintainers</summary>

```bash
# 1. Bump version in manifest.json and package.json
# 2. Build and pack
pnpm run build && mcpb pack .

# 3. Create GitHub release
gh release create v0.3.0 excalidraw-mcp-app.mcpb --title "v0.3.0" --notes "What changed"

# 4. Deploy to Vercel
vercel --prod
```

</details>

## Credits

Built with [Excalidraw](https://github.com/excalidraw/excalidraw) — a virtual whiteboard for sketching hand-drawn like diagrams.

## License

MIT

```

---

## Assistant (Plan · Claude Sonnet 5 · 9.4s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/dattmavis/BPMN-MCP/main/README.md",
  "format": "markdown"
}
```

**Output:**
```
# BPMN-MCP

A Model Context Protocol (MCP) server for creating and manipulating BPMN 2.0 workflow diagrams programmatically. This server enables AI assistants and other tools to generate, edit, and export business process diagrams in the standard BPMN format.

![BPMN Diagram Example](./docs/images/bpmn.png)

## Features

- **Create BPMN Diagrams**: Generate new workflow diagrams from scratch
- **Add Process Elements**: Insert events, tasks, gateways, and subprocesses
- **Connect Elements**: Create sequence flows between workflow components
- **Export Formats**: Save diagrams as BPMN 2.0 XML or SVG
- **Import Support**: Load and modify existing BPMN XML files
- **Smart Hints**: Get helpful nudges to ensure complete workflows with proper connections

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/dattmavis/BPMN-MCP.git
cd BPMN-MCP
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### For Claude Desktop

Add the following to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "bpmn": {
      "command": "node",
      "args": ["/absolute/path/to/BPMN-MCP/dist/index.js"]
    }
  }
}
```

Replace `/absolute/path/to/BPMN-MCP` with the actual path where you cloned this repository.

### For Other AI Tools

This MCP server works with any tool that supports the Model Context Protocol. Configure it to run:
```bash
node /path/to/BPMN-MCP/dist/index.js
```

## Usage

Once configured, you can ask your AI assistant to create BPMN diagrams. Here are some example requests:

![Full Output Example](./docs/images/full-output.png)

### Creating a Simple Workflow

```
Create a BPMN diagram for an order processing workflow with these steps:
1. Order Received (start event)
2. Validate Order (user task)
3. Process Payment (service task)
4. Order Complete (end event)

Connect them with sequence flows.
```

![Query Example](./docs/images/query.png)

### Creating a Workflow with Decision Points

```
Create a BPMN diagram for customer support ticket routing:
- Start: Ticket Received
- Task: Categorize Ticket
- Gateway: Check Priority
  - If High: Escalate to Senior Support
  - If Normal: Assign to Support Team
- Both paths lead to: Ticket Resolved (end)
```

## Available Tools

The MCP server provides these tools:

### `create_bpmn_diagram`
Creates a new BPMN diagram and returns a diagram ID.

### `add_bpmn_element`
Adds an element to the diagram. Supported types:
- Events: `bpmn:StartEvent`, `bpmn:EndEvent`, `bpmn:IntermediateCatchEvent`, `bpmn:IntermediateThrowEvent`
- Tasks: `bpmn:Task`, `bpmn:UserTask`, `bpmn:ServiceTask`, `bpmn:ScriptTask`, `bpmn:ManualTask`, `bpmn:BusinessRuleTask`, `bpmn:SendTask`, `bpmn:ReceiveTask`
- Gateways: `bpmn:ExclusiveGateway`, `bpmn:ParallelGateway`, `bpmn:InclusiveGateway`, `bpmn:EventBasedGateway`
- Other: `bpmn:SubProcess`

### `connect_bpmn_elements`
Creates a sequence flow between two elements.

### `export_bpmn_xml`
Exports the diagram as BPMN 2.0 XML format.

### `export_bpmn_svg`
Exports the diagram as SVG for visualization.

### `list_bpmn_elements`
Lists all elements in a diagram.

### `import_bpmn_xml`
Imports an existing BPMN XML file for editing.

## Example Output

The server generates standard BPMN 2.0 XML files that can be opened in:
- [Camunda Modeler](https://camunda.com/download/modeler/)
- [bpmn.io](https://bpmn.io/)
- Any BPMN 2.0 compliant tool

Example XML output:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                   xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                   xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                   xmlns:di="http://www.omg.org/spec/DD/20100524/DI">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:startEvent id="Event_1" name="Start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Process">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:endEvent id="Event_2" name="End">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="Event_1" targetRef="Task_1" />
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Event_2" />
  </bpmn:process>
  <!-- Diagram information omitted for brevity -->
</bpmn:definitions>
```

## Development

### Running in Development Mode

```bash
npm run watch
```

This will rebuild the project automatically when source files change.

### Testing

You can test the server manually using the MCP protocol:

```bash
node dist/index.js
```

Then send JSON-RPC requests via stdin. Example:
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
```

## Technical Details

### Architecture

- **Runtime**: Node.js with TypeScript
- **BPMN Engine**: bpmn-js (headless mode with jsdom)
- **Protocol**: Model Context Protocol (MCP)
- **Output**: BPMN 2.0 XML standard

### Smart Workflow Hints

The server includes helpful hints to ensure complete diagrams:
- Reminds you to connect elements when adding tasks/events
- Warns when exporting diagrams with disconnected elements
- Suggests using `connect_bpmn_elements` to create proper workflows

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions

## Related Projects

- [bpmn-js](https://bpmn.io/toolkit/bpmn-js/) - BPMN 2.0 rendering toolkit
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol specification

```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/iamtheavoc1/mcp-bpmn/main/README.md",
  "format": "markdown"
}
```

**Error:**
```
StatusCode: non 2xx status code (404 GET https://raw.githubusercontent.com/iamtheavoc1/mcp-bpmn/main/README.md)
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/oisee/mcp-bpmn/main/README.md",
  "format": "markdown"
}
```

**Output:**
```
# MCP-BPMN Server

A Model Context Protocol (MCP) server that enables AI agents to create, manipulate, and manage BPMN 2.0 (Business Process Model and Notation) diagrams programmatically.

## 🎯 Overview

MCP-BPMN provides a standardized interface for AI assistants to work with business process diagrams. It generates valid BPMN 2.0 XML files that can be viewed and edited in any BPMN-compliant tool (VS Code BPMN Editor, Camunda Modeler, etc.).

### Key Features

- ✅ **Complete BPMN 2.0 Support**: Events, activities, gateways, pools, and sequences
- ✅ **Mermaid to BPMN Conversion**: Bootstrap BPMN diagrams from Mermaid flowcharts
- ✅ **Smart Auto-Layout**: Automatic positioning with branch handling for gateways
- ✅ **File Persistence**: Save diagrams locally for editing in visual tools
- ✅ **Proper Visual Rendering**: Accurate waypoint calculation for connections
- ✅ **Enterprise-Ready**: Clean API design following BPMN standards
- ✅ **No Browser Dependencies**: Server-side XML generation

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/mcp-bpmn.git
cd mcp-bpmn

# Install dependencies
npm install

# Build the project
npm run build

# Run tests (optional)
npm test
```

### Configuration

#### For Claude Desktop

Add to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-bpmn": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-bpmn/dist/server/index.js"]
    }
  }
}
```

#### For Other MCP Clients

Use the compiled CommonJS bundle:

```bash
node dist/server/bundle.cjs
```

## 📚 API Reference

### Stateful Context Management

MCP-BPMN uses a stateful API design where you work with one diagram at a time. All operations apply to the current diagram context, eliminating the need for processId parameters.

### Creation Tools

#### `new_bpmn`
Create a new BPMN process or collaboration diagram and set it as the current context.

```javascript
{
  name: "Order Processing",
  type: "process" // or "collaboration" (optional, defaults to "process")
}
```

#### `new_from_mermaid`
Create a new BPMN diagram from Mermaid code and set it as the current context.

```javascript
{
  name: "My Process",
  mermaidCode: "graph TD\n  A[Start] --> B[Task] --> C[End]"
}
```

### File Operations

#### `open_bpmn`
Open an existing BPMN file and set it as the current context.

```javascript
{
  filename: "my-process.bpmn"
}
```

#### `open_mermaid_file`
Open and convert a Mermaid file to BPMN, setting it as the current context.

```javascript
{
  filename: "my-flowchart.mmd"
}
```

#### `save`
Save the current diagram to its file (requires filename to be set).

```javascript
{}
```

#### `save_as`
Save the current diagram with a new filename.

```javascript
{
  filename: "my-process.bpmn"
}
```

#### `close`
Close the current diagram and clear the context.

```javascript
{}
```

#### `current`
Get information about the current diagram.

```javascript
{}
```

### Element Manipulation Tools

#### `add_event`
Add events (start, end, intermediate, boundary) to the current diagram.

```javascript
{
  eventType: "start", // start, end, intermediate-throw, intermediate-catch, boundary
  name: "Order Received",
  eventDefinition: "message", // optional: message, timer, error, signal, etc.
  position: { x: 100, y: 200 } // optional
}
```

#### `add_activity`
Add activities (tasks, subprocesses) to the current diagram.

```javascript
{
  activityType: "userTask", // task, userTask, serviceTask, scriptTask, etc.
  name: "Review Order",
  position: { x: 250, y: 200 }, // optional
  properties: { assignee: "reviewer" } // optional
}
```

#### `add_gateway`
Add gateways for branching logic to the current diagram.

```javascript
{
  gatewayType: "exclusive", // exclusive, parallel, inclusive, eventBased
  name: "Payment Check",
  position: { x: 400, y: 200 } // optional
}
```

#### `connect`
Connect two elements with a sequence flow in the current diagram.

```javascript
{
  sourceId: "StartEvent_1",
  targetId: "UserTask_1",
  label: "Start Flow", // optional
  condition: "amount > 1000" // optional, for conditional flows
}
```

#### `add_pool`
Add a pool (participant) to a collaboration diagram.

```javascript
{
  name: "Customer",
  position: { x: 100, y: 100 }, // optional
  size: { width: 600, height: 250 } // optional
}
```

#### `add_lane`
Add a lane to a pool (not yet fully implemented).

```javascript
{
  poolId: "Participant_1",
  name: "Sales Department",
  position: "bottom" // optional
}
```

### Query and Manipulation Tools

#### `list_elements`
List all elements in the current diagram.

```javascript
{
  elementType: "bpmn:Task" // optional filter
}
```

#### `get_element`
Get details of a specific element.

```javascript
{
  elementId: "UserTask_1"
}
```

#### `update_element`
Update element properties.

```javascript
{
  elementId: "UserTask_1",
  name: "Updated Task Name",
  properties: { assignee: "john.doe" }
}
```

#### `delete_element`
Delete an element and its connections.

```javascript
{
  elementId: "Task_1"
}
```

### Utility Tools

#### `export`
Export the current diagram as BPMN 2.0 XML.

```javascript
{
  format: "xml", // only xml is currently supported
  formatted: true // optional, defaults to true
}
```

#### `validate`
Validate the current diagram structure.

```javascript
{}
```

#### `auto_layout`
Apply automatic layout to position elements in the current diagram.

```javascript
{
  algorithm: "horizontal" // currently only horizontal is supported
}
```

### File Management Tools

#### `list_diagrams`
List all saved BPMN diagrams.

```javascript
{}
```

#### `delete_diagram_file`
Delete a saved diagram file.

```javascript
{
  filename: "old-process.bpmn"
}
```

#### `get_diagrams_path`
Get the storage path for diagrams.

```javascript
{}
```

## 🔄 Context Management

The MCP-BPMN server uses a stateful design where you work with one diagram at a time:

1. **Create or Open**: Start by creating a new diagram (`new_bpmn`, `new_from_mermaid`) or opening an existing one (`open_bpmn`, `open_mermaid_file`)
2. **Manipulate**: All operations (`add_event`, `connect`, etc.) apply to the current diagram
3. **Save**: Save your work with `save` or `save_as`
4. **Close**: Close the current diagram with `close`

If you try to perform operations without a current context, you'll get a helpful error message:
```
No current context. Please create a diagram first with:
  - new_bpmn(name) to create a new BPMN diagram
  - new_from_mermaid(name, mermaidCode) to convert from Mermaid
  - open_bpmn(filename) to open an existing BPMN file
  - open_mermaid_file(filename) to convert a Mermaid file
```

## 💡 Examples

### Example 1: Creating an Approval Process from Scratch

```javascript
// Step 1: Create a new process (sets it as current context)
await new_bpmn({ name: "Approval Workflow" });

// Step 2: Add elements (all operations apply to current diagram)
await add_event({ eventType: "start", name: "Request Received" });
await add_activity({ activityType: "userTask", name: "Review Request" });
await add_gateway({ gatewayType: "exclusive", name: "Approved?" });
await add_activity({ activityType: "serviceTask", name: "Process Approval" });
await add_activity({ activityType: "userTask", name: "Handle Rejection" });
await add_event({ eventType: "end", name: "Complete" });

// Step 3: Connect elements
await connect({ sourceId: "StartEvent_1", targetId: "UserTask_1" });
await connect({ sourceId: "UserTask_1", targetId: "ExclusiveGateway_1" });
await connect({ sourceId: "ExclusiveGateway_1", targetId: "ServiceTask_1", label: "Yes" });
await connect({ sourceId: "ExclusiveGateway_1", targetId: "UserTask_2", label: "No" });
await connect({ sourceId: "ServiceTask_1", targetId: "EndEvent_1" });
await connect({ sourceId: "UserTask_2", targetId: "EndEvent_1" });

// Step 4: Apply auto-layout for proper positioning
await auto_layout();

// Step 5: Save and export the diagram
await save_as({ filename: "approval-workflow.bpmn" });
const xml = await export();
```

### Example 2: Bootstrap from Mermaid (Recommended for Lower Token Usage)

```javascript
// Step 1: Create from Mermaid syntax (much more concise!)
await new_from_mermaid({ 
  name: "Approval Workflow",
  mermaidCode: `
    graph TD
      A((Request Received)) --> B[Review Request]
      B --> C{Approved?}
      C -->|Yes| D[Process Approval]
      C -->|No| E[Handle Rejection]
      D --> F((Complete))
      E --> F
  `
});

// Step 2: Apply auto-layout (Mermaid conversion includes basic layout)
await auto_layout();

// Step 3: Make additional edits if needed
await update_element({ 
  elementId: "UserTask_1", 
  properties: { assignee: "reviewer" }
});

// Step 4: Save and export
await save_as({ filename: "approval-workflow.bpmn" });
const xml = await export();
```

### Example 3: Working with Multiple Diagrams

```javascript
// Create first diagram
await new_bpmn({ name: "Process A" });
await add_event({ eventType: "start" });
await add_activity({ activityType: "task", name: "Task A" });
await save_as({ filename: "process-a.bpmn" });

// Create second diagram (automatically closes the first)
await new_bpmn({ name: "Process B" });
await add_event({ eventType: "start" });
await add_activity({ activityType: "task", name: "Task B" });
await save_as({ filename: "process-b.bpmn" });

// Go back to first diagram
await open_bpmn({ filename: "process-a.bpmn" });
await add_event({ eventType: "end" });
await save();

// Check current diagram info
const info = await current();
console.log(info); // Shows: { name: "Process A", filename: "process-a.bpmn", ... }
```

## 🗂️ File Storage

BPMN diagrams are automatically saved to your local filesystem:

- **Unix/Linux/Mac**: `~/mcp-bpmn/`
- **Windows**: `%USERPROFILE%\mcp-bpmn\`

Custom path via environment variable:
```bash
export MCP_BPMN_DIAGRAMS_PATH=/custom/path
```

Files are named: `{ProcessId}_{ProcessName}.bpmn`

## 🏗️ Architecture

### Technology Stack
- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment  
- **MCP SDK** - Model Context Protocol implementation
- **Jest** - Testing framework

### Key Components
- `SimpleBpmnEngine` - Core BPMN XML generation without browser dependencies
- `DiagramContext` - Stateful context management for current diagram
- `AutoLayout` - Smart positioning algorithm with branch handling
- `BpmnRequestHandler` - MCP request processing
- `MermaidConverter` - Mermaid to BPMN conversion
- `TypeMappings` - BPMN element type conversions
- `IdGenerator` - Consistent ID generation

### Project Structure

```
mcp-bpmn/
├── src/
│   ├── core/           # Core BPMN engine
│   ├── server/         # MCP server implementation
│   ├── utils/          # Utilities (layout, ID generation)
│   ├── types/          # TypeScript type definitions
│   └── config/         # Configuration
├── tests/
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
├── dist/              # Compiled output
└── docs/              # Documentation
```

## 🧪 Development

### Available Scripts

```bash
npm run build        # Build TypeScript
npm run build:bundle # Build CommonJS bundle
npm run build:watch  # Build with watch mode
npm test            # Run all tests
npm run test:unit   # Run unit tests only
npm run test:e2e    # Run end-to-end tests
npm run lint        # Run ESLint
npm run dev         # Development mode with hot reload
npm start           # Start the MCP server
```

### Testing

The project includes comprehensive test coverage:
- **Unit Tests**: Core functionality testing
- **Integration Tests**: Handler and tool testing
- **E2E Tests**: Full MCP protocol testing

Run tests with:
```bash
npm test                    # All tests
npm run test:coverage       # With coverage report
npm run test:watch         # Watch mode
```

## 📈 Performance

- **Fast XML Generation**: Direct XML string building
- **Efficient Layout**: O(n) complexity for standard flows
- **Minimal Dependencies**: No browser or heavy libraries
- **Bundled Size**: ~48KB CommonJS bundle

## 🐛 Known Limitations

- SVG export not yet implemented (XML only)
- Vertical layout algorithm pending
- Lanes within pools not fully implemented
- Complex gateway merging patterns need manual positioning

## 🚧 Roadmap

- [ ] SVG export support
- [ ] Vertical and radial layout algorithms
- [ ] Enhanced BPMN validation framework
- [x] Mermaid diagram import/export (Completed!)
- [ ] Natural language to BPMN conversion
- [ ] Integration with Camunda/Activiti engines
- [ ] Subprocess expansion support
- [ ] Message flow between pools
- [ ] BPMN execution simulation

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript with strict mode
- ESLint configuration provided
- Jest for testing
- Conventional commits

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/mcp-bpmn/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/mcp-bpmn/discussions)
- **Documentation**: See `/docs` folder for detailed guides

## 🙏 Acknowledgments

- Built on the [Model Context Protocol](https://modelcontextprotocol.io/) specification
- Inspired by [bpmn-js](https://github.com/bpmn-io/bpmn-js) for BPMN standards
- Thanks to the Anthropic team for MCP development
```

---

## Assistant (Plan · Claude Sonnet 5 · 38.5s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/Stieges/bpmn-generator/main/README.md",
  "format": "markdown"
}
```

**Error:**
```
StatusCode: non 2xx status code (404 GET https://raw.githubusercontent.com/Stieges/bpmn-generator/main/README.md)
```

---

## Assistant (Plan · Claude Sonnet 5 · 3.6s)

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/Stieges/bpmn-generator",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - Stieges/bpmn-generator: Enterprise BPMN 2.0 Generator — JSON Logic-Core → ElkJS Layout → OMG-compliant XML + SVG · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2FStieges%2Fbpmn-generator)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2FStieges%2Fbpmn-generator)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=Stieges%2Fbpmn-generator)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [Stieges](/Stieges)
2.  [bpmn-generator](/Stieges/bpmn-generator)

## Repository navigation

-   [Code](/Stieges/bpmn-generator)
-   [Issues24 (24)](/Stieges/bpmn-generator/issues)
-   [Pull requests3 (3)](/Stieges/bpmn-generator/pulls)
-   [Actions](/Stieges/bpmn-generator/actions)
-   [Projects](/Stieges/bpmn-generator/projects)
-   [Security and quality](/Stieges/bpmn-generator/security)
-   [Insights](/Stieges/bpmn-generator/pulse)

More items

 [](/Stieges/bpmn-generator)

![Stieges](https://avatars.githubusercontent.com/u/63148384?s=60&v=4)

**[bpmn-generator](/Stieges/bpmn-generator)**

Public

-   [Notifications](/login?return_to=%2FStieges%2Fbpmn-generator)You must be signed in to change notification settings
-   [Fork12 (12)](/login?return_to=%2FStieges%2Fbpmn-generator)
-   [Star56 (56)](/login?return_to=%2FStieges%2Fbpmn-generator)You must be signed in to star a repository

## About

Enterprise BPMN 2.0 Generator — JSON Logic-Core → ElkJS Layout → OMG-compliant XML + SVG

### Topics

[bpmn](/topics/bpmn)[bpmn2](/topics/bpmn2)[diagram](/topics/diagram)[elkjs](/topics/elkjs)[mcp](/topics/mcp)[process-modeling](/topics/process-modeling)[svg](/topics/svg)[workflow](/topics/workflow)[xml](/topics/xml)

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

### Contributing

[Contributing](#contributing-ov-file)

### Security policy

[Security policy](#security-ov-file)

[Activity](/Stieges/bpmn-generator/activity)

### Stars

**56** stars

### Watchers

**2** watching

### Forks

[**12** forks](/Stieges/bpmn-generator/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2FStieges%2Fbpmn-generator&report=Stieges+%28user%29)

master

[Branches](/Stieges/bpmn-generator/branches)[Tags](/Stieges/bpmn-generator/tags)

[](/Stieges/bpmn-generator/branches)[](/Stieges/bpmn-generator/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[448 Commits](/Stieges/bpmn-generator/commits/master/)

[](/Stieges/bpmn-generator/commits/master/)448 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github](/Stieges/bpmn-generator/tree/master/.github ".github")

[.github](/Stieges/bpmn-generator/tree/master/.github ".github")

[docs](/Stieges/bpmn-generator/tree/master/docs "docs")

[docs](/Stieges/bpmn-generator/tree/master/docs "docs")

[references](/Stieges/bpmn-generator/tree/master/references "references")

[references](/Stieges/bpmn-generator/tree/master/references "references")

[rules](/Stieges/bpmn-generator/tree/master/rules "rules")

[rules](/Stieges/bpmn-generator/tree/master/rules "rules")

[scripts](/Stieges/bpmn-generator/tree/master/scripts "scripts")

[scripts](/Stieges/bpmn-generator/tree/master/scripts "scripts")

[tests](/Stieges/bpmn-generator/tree/master/tests "tests")

[tests](/Stieges/bpmn-generator/tree/master/tests "tests")

[.gitignore](/Stieges/bpmn-generator/blob/master/.gitignore ".gitignore")

[.gitignore](/Stieges/bpmn-generator/blob/master/.gitignore ".gitignore")

[AGENTS.md](/Stieges/bpmn-generator/blob/master/AGENTS.md "AGENTS.md")

[AGENTS.md](/Stieges/bpmn-generator/blob/master/AGENTS.md "AGENTS.md")

[CHANGELOG.md](/Stieges/bpmn-generator/blob/master/CHANGELOG.md "CHANGELOG.md")

[CHANGELOG.md](/Stieges/bpmn-generator/blob/master/CHANGELOG.md "CHANGELOG.md")

[CLAUDE.md](/Stieges/bpmn-generator/blob/master/CLAUDE.md "CLAUDE.md")

[CLAUDE.md](/Stieges/bpmn-generator/blob/master/CLAUDE.md "CLAUDE.md")

[COMPATIBILITY.md](/Stieges/bpmn-generator/blob/master/COMPATIBILITY.md "COMPATIBILITY.md")

[COMPATIBILITY.md](/Stieges/bpmn-generator/blob/master/COMPATIBILITY.md "COMPATIBILITY.md")

[CONTRIBUTING.md](/Stieges/bpmn-generator/blob/master/CONTRIBUTING.md "CONTRIBUTING.md")

[CONTRIBUTING.md](/Stieges/bpmn-generator/blob/master/CONTRIBUTING.md "CONTRIBUTING.md")

[EVALUATION.md](/Stieges/bpmn-generator/blob/master/EVALUATION.md "EVALUATION.md")

[EVALUATION.md](/Stieges/bpmn-generator/blob/master/EVALUATION.md "EVALUATION.md")

[LICENSE](/Stieges/bpmn-generator/blob/master/LICENSE "LICENSE")

[LICENSE](/Stieges/bpmn-generator/blob/master/LICENSE "LICENSE")

[README.md](/Stieges/bpmn-generator/blob/master/README.md "README.md")

[README.md](/Stieges/bpmn-generator/blob/master/README.md "README.md")

[ROADMAP.md](/Stieges/bpmn-generator/blob/master/ROADMAP.md "ROADMAP.md")

[ROADMAP.md](/Stieges/bpmn-generator/blob/master/ROADMAP.md "ROADMAP.md")

[SECURITY.md](/Stieges/bpmn-generator/blob/master/SECURITY.md "SECURITY.md")

[SECURITY.md](/Stieges/bpmn-generator/blob/master/SECURITY.md "SECURITY.md")

[SKILL.md](/Stieges/bpmn-generator/blob/master/SKILL.md "SKILL.md")

[SKILL.md](/Stieges/bpmn-generator/blob/master/SKILL.md "SKILL.md")

[THIRD-PARTY-NOTICES.md](/Stieges/bpmn-generator/blob/master/THIRD-PARTY-NOTICES.md "THIRD-PARTY-NOTICES.md")

[THIRD-PARTY-NOTICES.md](/Stieges/bpmn-generator/blob/master/THIRD-PARTY-NOTICES.md "THIRD-PARTY-NOTICES.md")

View all files

## Repository files navigation

-   [README](#)
-   [Contributing](#)
-   [MIT license](#)
-   [Security](#)

More items

# BPMN Generator

[](#bpmn-generator)

[![CI](https://github.com/Stieges/bpmn-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Stieges/bpmn-generator/actions/workflows/ci.yml) [![License: MIT](https://camo.githubusercontent.com/fdf2982b9f5d7489dcf44570e714e3a15fce6253e0cc6b5aa61a075aac2ff71b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c6963656e73652d4d49542d79656c6c6f772e737667)](/Stieges/bpmn-generator/blob/master/LICENSE)

BPMN 2.0 diagram generator — converts natural language process descriptions or structured JSON into OMG-compliant BPMN 2.0.2 XML files and SVG previews (ISO/IEC 19510:2013). Also generates DMN 1.3 decision models (opt-in, see [DMN Support](#dmn-support-opt-in)) and enumerates the scenarios a process admits (see [Scenario Enumeration](#scenario-enumeration-opt-in)).

### What's new in 4.0

[](#whats-new-in-40)

4.0 changes the default output: lane compaction, edge-label repair, the bend rule, node labels that avoid flows and the repair of flows through foreign shapes are all on by default, and boundary events face their target. Rule profiles, HTTP inputs and outbound URLs are hardened, and several options were removed or renamed (`dynamicLaneHeader`, `visualRefinement.enabled`, the wrapping keys). Every default change names its rollback switch. The migration notes are the **Breaking** section of the top entry in [CHANGELOG.md](/Stieges/bpmn-generator/blob/master/CHANGELOG.md); read it before upgrading.

## Why this one

[](#why-this-one)

Three things you can verify in the repo, not just claim:

1.  **Multi-pool collaborations with lanes and message flows render fully.** The closest open-source comparable (`bpmn-auto-layout@1.3.0`, used by [BPMN Assistant](https://github.com/jtlicardo/bpmn-assistant)) silently drops every participant after the first plus all inter-pool message flows ([data](/Stieges/bpmn-generator/blob/master/EVALUATION.md#bpmn-auto-layout-comparison)). Our pipeline renders all participants and all message flows.
2.  **Strict JSON Schema gate at every HTTP API entry.** LLM output cannot reach the layout engine with malformed Logic-Core — `ajv` draft-2020-12 rejects it at the boundary ([scripts/bpmn/schema-gate.js](/Stieges/bpmn-generator/blob/master/scripts/bpmn/schema-gate.js)).
3.  **Native Claude Code MCP server.** Exposed as a [Skill](/Stieges/bpmn-generator/blob/master/SKILL.md) and via [`scripts/mcp-bpmn-server.js`](/Stieges/bpmn-generator/blob/master/scripts/mcp-bpmn-server.js). The LLM never touches coordinates — it emits Logic-Core JSON, the pipeline handles layout deterministically.

Reproduce the comparison: `cd scripts && node bench/compare-bpmn-auto-layout.mjs` — produces [tests/bench/auto-layout-comparison.md](/Stieges/bpmn-generator/blob/master/tests/bench/auto-layout-comparison.md) + side-by-side HTML.

See [EVALUATION.md](/Stieges/bpmn-generator/blob/master/EVALUATION.md) for the full benchmark, the competitor matrix, and honest notes about where ProMoAI and BPMN Assistant are stronger.

### Visual examples

[](#visual-examples)

[![simple approval workflow](/Stieges/bpmn-generator/raw/master/docs/screenshots/01-simple-approval.svg)](/Stieges/bpmn-generator/blob/master/docs/screenshots/01-simple-approval.svg)  
Single-pool linear flow + exclusive gateway

[![multi-pool collaboration](/Stieges/bpmn-generator/raw/master/docs/screenshots/02-multi-pool-collaboration.svg)](/Stieges/bpmn-generator/blob/master/docs/screenshots/02-multi-pool-collaboration.svg)  
Two pools, three lanes, message flows — what bpmn-auto-layout drops

[![multi-lane single pool](/Stieges/bpmn-generator/raw/master/docs/screenshots/03-multi-lane-pool.svg)](/Stieges/bpmn-generator/blob/master/docs/screenshots/03-multi-lane-pool.svg)  
One pool, four lanes (Frontend / Backend / Ops / QA)

[![expanded subprocess](/Stieges/bpmn-generator/raw/master/docs/screenshots/04-expanded-subprocess.svg)](/Stieges/bpmn-generator/blob/master/docs/screenshots/04-expanded-subprocess.svg)  
Expanded subprocess with inner activities

Full gallery: [docs/screenshots/](/Stieges/bpmn-generator/blob/master/docs/screenshots). All SVGs regenerated from fixtures by the pipeline with default options (lane compaction and label repair on) — they reflect current output, not stale marketing screenshots.

### How we compare (verified)

[](#how-we-compare-verified)

Capability

This generator

ProMoAI

BPMN Assistant

BPMN-Chatbot

Multi-pool with lanes + message flows

**✅ verified**

✅

❌ (bpmn-auto-layout limitation)

?

Strict JSON Schema input gate (ajv)

**✅**

n/a

partial

partial

Soundness check

WF-Net (3 rules, opt-in)

POWL by construction

none

none

Configurable rule engine

**42 BPMN rules, 5 layers, JSON profiles**

limited

none

none

MCP server

**✅**

❌

❌

❌

Stack

Node.js / ES Modules

Python / Streamlit

Python + Vue.js

React + OpenAI

License

MIT

GPL-3.0

MIT-ish

unclear

Paper

none (engineering)

IJCAI-24, EMMSAD 2024

arXiv 2509.24592

CEUR-WS Vol-3758

Each ✅ on our row links back to a fixture, a benchmark, or a source file. See [EVALUATION.md](/Stieges/bpmn-generator/blob/master/EVALUATION.md) for cell-by-cell evidence and honest notes on where competitors are stronger (ProMoAI's mathematical soundness guarantee, BPMN Assistant's web UI).

## What It Does

[](#what-it-does)

You describe a business process — either as free text or as a structured JSON (Logic-Core) — and the generator produces:

-   A **BPMN 2.0 XML file** (.bpmn) that opens in [bpmn.io](https://bpmn.io), Camunda Modeler, or any standard-compliant tool
-   An **SVG preview** with all BPMN symbols, lanes, pools, and edge routing
-   A **validation report** covering structural correctness, naming conventions, and complexity metrics

The output is structurally valid and OMG-compliant. It handles pools, lanes, gateways, boundary events, sub-processes, message flows, and loop markers correctly — things that LLMs typically get wrong when generating BPMN XML directly.

### Realistic Expectations

[](#realistic-expectations)

This tool produces a **solid first draft**, not a finished diagram. Expect to refine:

-   **Layout** — Auto-layout handles most cases well (happy-path alignment, orthogonal routing, lane partitioning), but complex processes with many cross-lane edges or feedback loops may need manual adjustment in a BPMN editor
-   **Labels & naming** — The LLM generates reasonable names, but domain-specific terminology may need correction
-   **Edge cases** — Unusual gateway patterns, deeply nested sub-processes, or very large diagrams (30+ activities) can produce suboptimal visual results
-   **Business logic** — The generator models what you describe; it doesn't validate whether your process makes business sense

Think of it as going from **0% → 80%** in seconds. The remaining 20% is domain expertise that requires human judgment.

## Pipeline

[](#pipeline)

```
User Text → [Phase 1] Intent Extraction (LLM → JSON Logic-Core)
          → [Phase 2] Validation (42 BPMN rules, 5 layers; deadlock detection in the opt-in WF layer)
          → [Phase 3] Auto-Layout (ElkJS Sugiyama layered algorithm + routing repair passes)
          → [Phase 4] Serialization → BPMN 2.0 XML + SVG
```

The LLM **never** handles coordinates. Layout is 100% algorithmic. Two integrity passes run on every generate call and report separately from the rule engine: the Petri-net translation check (NC01–NC06, `result.netDiagnostics`) and the post-layout diagram check (DI01–DI11, `result.diagnostics`) — a green rule engine says nothing about the drawing.

## Quick Start

[](#quick-start)

cd scripts/
npm install          # installs runtime + dev dependencies (Node >=20)

# Generate from JSON Logic-Core:
node bpmn/pipeline.js my-process.json my-process

# From stdin:
echo '{ ... }' | node bpmn/pipeline.js - output

# Import existing BPMN:
node bpmn/import.js existing.bpmn extracted.json

# DOT export (Graphviz):
node bpmn/pipeline.js my-process.json my-process --dot

# DOT import → Logic-Core JSON:
node bpmn/pipeline.js graph.dot output --import-dot

# Run tests:
npm test

**Output:** `output.bpmn` (BPMN 2.0 XML) + `output.svg` (vector preview)

**Flags** of `node bpmn/pipeline.js <input.json | -> [output-basename]`:

Flag

Effect

`--dot`

Also write a Graphviz DOT export

`--import-dot`

Treat the input as DOT and write Logic-Core JSON

`--doc`

Also write a Markdown documentation companion

`--strict`

Write nothing on any unresolved warning (rule engine, diagram integrity, serialization)

`--optimize`

Enable the opt-in Optimization Advisory layer

`--refine`

Switch every visual-refinement pass on (lane compaction and label repair already are by default)

`--no-refine`

Switch every visual-refinement pass off (mutually exclusive with `--refine`)

`--wrap`

Wrap long chains (> 20 nodes) into rows with ELK; independent of `--refine`

`--drill-down`

Emit the parent diagram plus one diagram per expanded subprocess

`--no-bend-rule` / `--bend-rule`

Switch the bend rule off / force it on (on by default)

`--no-label-avoidance` / `--label-avoidance`

Switch off / force on moving event and gateway labels off flows (on by default)

`--no-foreign-shape-repair` / `--foreign-shape-repair`

Switch off / force on re-routing flows that run through a foreign shape (on by default)

All CLI examples in this README run from `scripts/`, like the Quick Start. The CLI also gates on the two integrity passes: an ERROR from the diagram check (DI) or the net check (NC) aborts, and `--strict` makes their warnings fatal too (NC INFO findings are printed, never fatal).

### Install as a package

[](#install-as-a-package)

`bpmn-generator` (directory `scripts/`) exports `.` (`runPipeline` and the pipeline modules), `./import` (`bpmnToLogicCore`), `./validate` (`validateLogicCore`), `./orchestrator` (`orchestrate`) and `./ontology` (the vocabulary, see below). The package also ships the CLIs (`bpmn/`, `dmn/`, `scenarios/`), the HTTP and MCP servers and `config.json`. The `rules/` profiles live outside the package: in an npm install, MCP profile names are refused and file profiles are read by path.

## Usage as Claude Code Skill

[](#usage-as-claude-code-skill)

### In a specific project

[](#in-a-specific-project)

Copy `SKILL.md` to `.claude/skills/operative/bpmn-prozess-erstellen.md` and adjust the relative paths for `references/` and `scripts/` to match where you placed those directories.

### As a portable .skill file

[](#as-a-portable-skill-file)

`cd scripts && npm run build:skill` produces `bpmn-generator.skill` at the repo root (gitignored — rebuild on demand, not committed). The ZIP can be shared with other projects and contains everything needed:

-   `SKILL.md` — Skill definition
-   `references/` — schemas, prompt templates, the modelling, DMN, CLI, round-trip and redesign guides SKILL.md links to, the inline template
-   `scripts/` — the modules the CLIs named in `SKILL.md` and its reference files import (`bpmn/pipeline.js`, `bpmn/import.js`, `bpmn/redesign-cli.js`, `dmn/pipeline.js`, `dmn/import.js`, `scenarios/pipeline.js` and their import closure), `config.json`, `package.json`

The bundle holds what the skill runs and nothing else: the orchestrator, the HTTP and MCP servers and `agents/` need a checkout or the npm package, `robustness/` a checkout. The build walks the imports from every entry point and aborts if one reaches a module it does not bundle. `npm install --omit=dev` inside the unpacked `scripts/` is still required.

## Module Architecture

[](#module-architecture)

The subsystems and their key files. The full per-module inventory, with every module's dependencies, is the **Architecture** section of [CLAUDE.md](/Stieges/bpmn-generator/blob/master/CLAUDE.md) — kept in one place so it cannot drift in three.

```
scripts/
├── bpmn/         Core BPMN pipeline (runs on every generate call)
│                 pipeline.js (runPipeline + CLI) · validate.js / rules.js (42 BPMN rules) ·
│                 workflow-net.js + net-check.js (Petri net, NC01–NC06) · topology.js ·
│                 layout.js (ElkJS) · coordinates.js · edge-simplify.js, orthogonal-router.js,
│                 bend-rule.js (routing repair) · visual-refinement.js · di-check.js (DI01–DI11) ·
│                 bpmn-xml.js · svg.js · icons.js · dot.js · import.js / moddle-import.js
│                 (BPMN → Logic-Core) · schema-gate.js · types.js · constants.js ·
│                 optimize.js (O01–O04, opt-in) · scenario-rules.js (SC01, SC06)
│                 redesign-cli.js, redesign.js, redesign-core.js — redesign toolbox (opt-in)
├── dmn/          DMN 1.3 pipeline (opt-in; runPipeline reaches only the table text)
│                 pipeline.js (runDmnPipeline + CLI) · rules.js (19 DMN rules) · layout.js ·
│                 coordinates.js · di-check.js (DD01–DD03) · dmn-xml.js · svg.js + pathmap.js
│                 (DRD SVG) · table.js, table-text.js, table-svg.js, table-html.js, doc.js
│                 (decision tables) · load-decisions.js · import.js +
│                 import-scope.js (DMN → Decision-Core, IM01–IM09) · scenario-rules.js (SC04, SC05)
├── scenarios/    Scenario enumeration (opt-in): pipeline.js (runScenarioPipeline + CLI),
│                 enumerate.js, collaboration.js, decision-table.js, bridge.js, format.js
├── cross/        Cross-notation: rules.js (SC02, SC03 — decisionRef ↔ DMN), decision-doc.js
│                 (a Business Rule Task's decision table in its documentation)
├── shared/       Format-independent core: utils.js (config), ontology.js, rule-profile.js,
│                 rule-catalog.js, resource-paths.js, geometry.js, text-layout.js, outbound-url.js (SSRF guard),
│                 safe-text.js, entry-point.js, version.js
├── agents/       Multi-agent orchestration: modeler.js, reviewer.js, layout.js, compliance.js,
│                 chat.js, prompt-sections.js, llm-provider.js
├── robustness/   Synthetic-data + benchmarking subsystem (see its README.md)
├── orchestrator.js           Multi-agent state machine + CLI
├── http-server.js            HTTP API (8 endpoints)
├── mcp-bpmn-server.js        MCP server (4 tools)
├── audit.js, delivery.js     Audit log, webhook delivery + dead letter
├── evaluate-slm.js, prepare-training-data.js   SLM evaluation and training-data prep
├── config.json               Externalized constants (shapes, colors, gaps, switches)
└── package.json              Runtime deps: elkjs, bpmn-moddle, dmn-moddle, @modelcontextprotocol/sdk, ajv, ajv-formats
```

Run `cd scripts && npm test` for the current test count (Jest, ES Modules) — it changes often enough that a number here would go stale immediately; CI enforces it stays green.

The import graph is acyclic. `dmn/` never imports `bpmn/`; `bpmn/` imports only `cross/decision-doc.js` (from `pipeline.js`, for the `decisions` option — no rule module of another notation is in `runPipeline`'s import closure); `shared/` imports neither; `scenarios/` and `cross/` are the only places the two notations meet.

## Repo Structure

[](#repo-structure)

```
bpmn-generator/
├── README.md, CHANGELOG.md, ROADMAP.md   Overview, version history, roadmap
├── SKILL.md                              Claude Code skill definition
├── CLAUDE.md, AGENTS.md                  Instructions for coding agents
├── CONTRIBUTING.md, SECURITY.md          Contribution guide, threat model + dependency policy
├── COMPATIBILITY.md, EVALUATION.md       bpmn.io compatibility report, benchmark + competitor matrix
├── LICENSE, THIRD-PARTY-NOTICES.md       MIT license, dependency licenses
├── .github/                              CI workflows and the docs gate
├── references/
│   ├── input-schema.json                 Logic-Core JSON Schema (draft 2020-12); prose in logic-core-schema.md
│   ├── decision-core-schema.json         Decision-Core (DMN) JSON Schema
│   ├── ontology.jsonld                   Vocabulary + rule catalog (node types, markers, rules, layers)
│   ├── rule-profile-schema.json          Schema every rule profile must pass
│   ├── api-reference.md, api-schema.json HTTP/MCP reference and the response contract
│   ├── fachliches-regelwerk.md           Rule documentation (authoritative catalog, per-rule sources)
│   ├── omg-compliance.md                 OMG BPMN 2.0.2 compliance mapping
│   ├── prompt-template.md                LLM prompt templates + few-shot patterns
│   ├── inline-template.md                HTML template for browser-side ElkJS
│   ├── omg-spec/                         Normative DMN 1.3 XSDs
│   └── review-set/                       Third-party fixtures for visual review (sources and licenses in its README)
├── rules/                                Rule profiles (default, strict, DMN default/best-practice; custom/)
├── scripts/                              Pipeline modules (see above)
├── docs/                                 Screenshots and guides
└── tests/
    ├── fixtures/                         Test inputs (Logic-Core, Decision-Core) + golden files
    └── bench/                            Benchmark outputs (e.g. the bpmn-auto-layout comparison)
```

## Rule Engine

[](#rule-engine)

42 BPMN rules across 5 layers with configurable severity via JSON profiles (2 are registered as placeholders; SC01 and SC06 run in the scenario pipeline and are not profile-switchable yet). The authoritative catalog lives in [`references/fachliches-regelwerk.md`](/Stieges/bpmn-generator/blob/master/references/fachliches-regelwerk.md); this README does not duplicate per-rule descriptions.

Layer

Severity

Rules

Examples

Soundness

ERROR

S01-S17

Start/End events, deadlocks, boundary events

Style

WARNING

M01-M13 (M05/M06 severity=OFF)

Naming conventions, gateway labels

Pragmatics

INFO

P01-P03

Complexity metrics

Workflow-Net

ERROR/WARNING

WF01-WF03 (opt-in); SC01, SC06 (scenario pipeline)

Liveness, boundedness, deadlock-freedom (opt-in)

Optimization

ADVISORY

O01-O04

Redesign opportunities — `optimize`/`soll` mode only (opt-in); each names a transform in the redesign toolbox

Two more rule sets exist beside it: 19 DMN rules, 3 layers (see [DMN Support](#dmn-support-opt-in)) and 2 cross-notation rules, 1 layer (SC02/SC03, see [Scenario Enumeration](#scenario-enumeration-opt-in)).

**Profiles** (`rules/*.json`) switch layers and rules and override severities. How each interface takes one:

Interface

`ruleProfile`

CLI

none — the CLI runs the built-in defaults (no profile)

Library

`runPipeline(lc, { ruleProfile: '../rules/strict-profile.json' })` (a path) or an inline object

HTTP

an inline object only; it may raise soundness rules, never disable the soundness layer or lower one of its rules

MCP

a profile *name* resolved inside the repository's `rules/` (refused in an npm install, which has no `rules/`)

Every profile passes a size/depth bound and `references/rule-profile-schema.json` before a rule reads it. A profile file that is not JSON, an unknown severity, or `ADVISORY` outside the optimization layer refuses the profile; an unknown rule id or layer is a warning. The WF layer is opt-in: it runs only when a profile enables `workflow_net` (`rules/default-profile.json` leaves it off). See [`references/fachliches-regelwerk.md`](/Stieges/bpmn-generator/blob/master/references/fachliches-regelwerk.md) for full rule documentation.

## Programmatic API

[](#programmatic-api)

import { runPipeline } from 'bpmn-generator';   // in a checkout: './bpmn/pipeline.js'

const logicCore \= { nodes: \[...\], edges: \[...\] };
const result \= await runPipeline(logicCore);

// result.bpmnXml    — BPMN 2.0 XML string (or null on validation error)
// result.svg        — SVG string
// result.coordMap   — coordinate map
// result.diagnostics — post-layout DI integrity, DI01–DI11 ({ ok, issues }) — separate from
//                       validation, since the rule engine never sees a coordinate
// result.netDiagnostics — Petri-net translation integrity, NC01–NC06 ({ ok, issues }; null when
//                       validation failed) — whether the net the WF rules judge is the model
// result.validation — { errors, warnings, advisories, metrics, xmlWarnings }
//                       xmlWarnings comes from re-parsing the generated XML through bpmn-moddle —
//                       it is what --strict's serialization check gates on

Individual modules can be imported directly:

import { validateLogicCore } from './bpmn/validate.js';
import { generateBpmnXml } from './bpmn/bpmn-xml.js';
import { generateSvg } from './bpmn/svg.js';
import { logicCoreToDot, dotToLogicCore } from './bpmn/dot.js';

### Reading the ontology from another package

[](#reading-the-ontology-from-another-package)

The vocabulary (`references/ontology.jsonld`) is exported as `bpmn-generator/ontology`. Node cannot `import` a `.jsonld` file (`ERR_UNKNOWN_FILE_EXTENSION`); resolve the path and parse it as plain JSON:

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path \= fileURLToPath(import.meta.resolve('bpmn-generator/ontology'));
const ontology \= JSON.parse(readFileSync(path, 'utf8'));   // CommonJS: require.resolve(...)

## Features

[](#features)

-   **Multi-pool collaborations** with message flows
-   **All BPMN 2.0 task types** (User, Service, Script, Send, Receive, Manual, Business Rule)
-   **Call Activity, Sub-Process, Transaction** with correct rendering
-   **Expanded sub-processes** with inline children
-   **Boundary events** (timer, error, message, signal, escalation — interrupting/non-interrupting)
-   **All gateway types** with correct `gatewayDirection` (Diverging/Converging/Mixed)
-   **Loop/multi-instance markers** (standard loop, parallel MI, sequential MI)
-   **Data objects**, data stores, text annotations, groups, associations
-   **Collapsed pools** (black-box participants)
-   **Roles and systems on an activity** (`role` → BPMN `performer`/`resource`, `system` → extension element; data only, the drawing is unchanged) — to *show* roles and systems as lanes or pools today, see [docs/roles-and-systems.md](/Stieges/bpmn-generator/blob/master/docs/roles-and-systems.md)
-   **Round-tripping** (BPMN XML → Logic-Core JSON → BPMN XML)
-   **DOT format** (Graphviz export + import for visualization)
-   **Inline mode** (browser-side ElkJS rendering without Node.js)
-   **Configurable rule engine** (42 BPMN rules, 5 layers, JSON profiles — 2 registered as placeholders)
-   **Integrity checks on every run** — Petri-net translation (NC01–NC06) and post-layout diagram geometry (DI01–DI11), reported apart from the rule engine
-   **Routing repair** — fewest-bends rule, crossing repair with an obstacle-aware orthogonal router, re-routing of flows through foreign shapes, event and gateway labels kept off flows
-   **Ontology** — node types, markers and the rule catalog in one JSON-LD file ([`references/ontology.jsonld`](/Stieges/bpmn-generator/blob/master/references/ontology.jsonld)), exported as `bpmn-generator/ontology`
-   **Redesign toolbox** (5 deterministic process transforms with preview/apply, no LLM — see [Redesign Toolbox](#redesign-toolbox-opt-in))
-   **DMN 1.3** decision models with DRD layout, DRD and decision-table SVG, decision tables as Markdown/HTML, and an importer with a loss report — see [DMN Support](#dmn-support-opt-in)
-   **Scenario enumeration** over BPMN processes and DMN decision tables — see [Scenario Enumeration](#scenario-enumeration-opt-in)
-   **OMG BPMN 2.0.2 compliant** XML output (ISO/IEC 19510:2013)
-   **BPMN-in-Color** (bioc: namespace — per-node fill/stroke in XML + SVG)
-   **Documentation View** (SVG tooltips + `--doc` Markdown companion)
-   **Happy-Path Y-Leveling** (post-layout alignment, opt-in via `layout.happyPathLeveling`)
-   **Visual refinement** (lane compaction and edge-label repair on by default, `--no-refine` switches them off — see below)
-   **MCP Server** (generate, validate, import, orchestrate as MCP tools)
-   **bpmn.io compatible** (verified with bpmn-js viewer)

### Visual Refinement

[](#visual-refinement)

Post-layout coordinate transforms that polish BPMN diagrams without changing semantics. Each refinement pass has its own switch; both are on by default. `--refine` switches every pass on, `--no-refine` every pass off (the two are mutually exclusive). `--no-refine` restores the uncompacted lane geometry, not the pre-4.0 output as a whole: edge-label placement changed in every mode (labels beside their flow, message flows carry a label of their own, the SVG label backdrop is gone) and cannot be switched back.

-   **`laneCompaction`** — `compactLanes`: reduces lane padding. Lanes keep their lane names whole in bpmn.io (`laneLabelFloor`) and sequence flows are kept `laneLineClearance` px off the lane separators. Diagrams with lanes or an expanded subprocess come out up to 29 % smaller in area (10–29 % on the seven golden fixtures; some diagrams are unchanged).
-   **`edgeLabelCollisionRepair`** — edge label collision repair via bbox-nudge; it only moves labels, never a route.
-   **Bend rule and node labels that avoid flows** are layout switches, not refinement passes, and are on by default (`layout.bendRule`, `layout.nodeLabelsAvoidFlows` in `scripts/config.json`): fewer bends, flows entering activities and events in flow direction, event and gateway labels moved off flows. Switch off per call with CLI `--no-bend-rule` / `--no-label-avoidance` (`--bend-rule` / `--label-avoidance` force a pass on; each pair is mutually exclusive), the booleans `bendRule` / `nodeLabelsAvoidFlows` on `POST /api/v1/generate`, `POST /api/v1/orchestrate` and the MCP tools `generate_bpmn` and `orchestrate_bpmn` (schema `$defs/LayoutSwitchOption` in [`references/api-schema.json`](/Stieges/bpmn-generator/blob/master/references/api-schema.json); anything but a boolean is a `schema_error`), or `runPipeline(lc, { bendRule: false, nodeLabelsAvoidFlows: false })`. Project-wide, see the next paragraph.
-   **Repair of flows through a foreign shape** is a layout switch too, on by default (`layout.foreignShapeRepair`): a sequence flow that runs through a task, event or gateway that is neither its source nor its target is re-routed, trading at most one crossing per shape. Switch off per call with CLI `--no-foreign-shape-repair` (`--foreign-shape-repair` forces it on), the boolean `foreignShapeRepair` on the same HTTP endpoints and MCP tools, or `runPipeline(lc, { foreignShapeRepair: false })`.
-   **ELK wrapping** is not a refinement pass but its own layout-level switch (opt-in): row wrapping of wide pipelines (> 20 nodes) via `layout.elkWrapping` (`off`/`auto`/`always`), `--wrap` or `runPipeline(lc, { elkWrapping: 'auto' })`; if ELK fails with wrapping on, the layout is retried without it and `validation.infos` says so.

**Configure (defaults shown, `scripts/config.json`):**

{
  "visualRefinement": {
    "laneCompaction": true,
    "minLaneHeight": 80,
    "laneLineClearance": 10,
    "laneLabelFloor": true,
    "edgeLabelCollisionRepair": true,
    "edgeLabelMaxShift": 25
  }
}

**Project-wide without editing the package:** set the environment variable `BPMN_CONFIG` to a JSON file; it is merged over the shipped `scripts/config.json` one level deep, so it only needs the keys it changes. For example, to switch off the three layout switches:

{ "layout": { "bendRule": false, "nodeLabelsAvoidFlows": false, "foreignShapeRepair": false } }

This gives the routes from before the bend rule, with one exception that no switch restores: a boundary event whose outgoing flow leads to a target above its host sits on the host's top edge (#91).

BPMN\_CONFIG=./my-bpmn-config.json node bpmn/pipeline.js input.json output

The variable is read once, when the generator is loaded (CLI, HTTP server, MCP server or library import).

`minLaneHeight` is the height floor for an empty lane, `laneLineClearance` the distance in px that a re-routed leg keeps from lane separators, `laneLabelFloor` keeps a lane tall enough for its longest label word, and `edgeLabelMaxShift` is the farthest in px a label may be nudged.

**Or per-call:**

const result \= await runPipeline(logicCore, { visualRefinement: { laneCompaction: false } });

`visualRefinement` is `true`, `false` or an object with the keys `laneCompaction` and `edgeLabelCollisionRepair` (booleans); any other key or a non-boolean value is rejected (`TypeError` in the library, `schema_error` over HTTP and MCP). The same option is accepted by `POST /api/v1/generate`, `POST /api/v1/orchestrate` and the MCP tools `generate_bpmn` and `orchestrate_bpmn` (schema `$defs/VisualRefinementOption` in [`references/api-schema.json`](/Stieges/bpmn-generator/blob/master/references/api-schema.json)); `validate_bpmn` has no geometry and ignores it. Omitted, the `config.json` defaults apply.

## Multi-Agent Orchestration

[](#multi-agent-orchestration)

The orchestrator chains 4 agents in a feedback loop until the diagram is valid and compliant:

```
Modeler (LLM) → Reviewer → Layout/Pipeline → Compliance → Done
   ↑               │              │
   └───────────────┘              │  (Review loop: max 3)
   ↑                              │
   └──────────────────────────────┘  (Layout loop: max 2)
```

# Review-only (no LLM needed):
node orchestrator.js --input logic-core.json --output /tmp/result

# Full cycle with LLM (text → BPMN):
node orchestrator.js --text "Process description..." \\
  --api-url https://api.example.com/v1 --api-key KEY --model gpt-4.1 \\
  --output /tmp/result

import { orchestrate } from './orchestrator.js';

// Without LLM — review + generate + compliance only:
const result \= await orchestrate(logicCoreJson);

// With LLM — full text-to-BPMN cycle:
const result \= await orchestrate('Process description...', { llmProvider });

## MCP Server

[](#mcp-server)

The BPMN Generator can be used as an MCP (Model Context Protocol) server, exposing four tools:

Tool

Description

Optional parameters (besides the required input)

`generate_bpmn`

Logic-Core JSON → BPMN 2.0 XML + SVG

`mode`, `ruleProfile` (a name), `poolOrder`, `drillDown`, `include`, `visualRefinement`, `bendRule`, `nodeLabelsAvoidFlows`, `foreignShapeRepair`

`validate_bpmn`

Validate Logic-Core without generating output

`mode`, `ruleProfile`

`import_bpmn`

BPMN 2.0 XML → Logic-Core JSON

—

`orchestrate_bpmn`

Multi-agent review + generate + compliance

`mode`, `ruleProfile`, `visualRefinement`, `bendRule`, `nodeLabelsAvoidFlows`, `foreignShapeRepair`

Every Logic-Core argument passes the same JSON Schema gate as the HTTP API. Parameter details: [references/api-reference.md](/Stieges/bpmn-generator/blob/master/references/api-reference.md).

### Configuration

[](#configuration)

Add to your `claude_desktop_config.json`:

{
  "mcpServers": {
    "bpmn-generator": {
      "command": "node",
      "args": \["/path/to/scripts/mcp-bpmn-server.js"\]
    }
  }
}

## HTTP API

[](#http-api)

The BPMN Generator also provides an HTTP API for multi-user access (CI/CD pipelines, web apps, external systems):

Method

Path

Description

`POST`

`/api/v1/generate`

Logic-Core JSON → BPMN 2.0 XML + SVG

`POST`

`/api/v1/validate`

Validate Logic-Core without generating output

`POST`

`/api/v1/import`

BPMN 2.0 XML → Logic-Core JSON

`POST`

`/api/v1/orchestrate`

Multi-agent review + generate + compliance

`POST`

`/api/v1/chat`

Discovery conversation (pre-generation)

`POST`

`/api/v1/telemetry`

Frontend event log (best-effort)

`GET`

`/api/v1/config`

Frontend bootstrap (env-key status)

`GET`

`/health`

Health check (uptime, version)

See [references/api-reference.md](/Stieges/bpmn-generator/blob/master/references/api-reference.md) for full request/response schemas and error codes.

### Start

[](#start)

PORT=3000 node http-server.js        # from scripts/; BPMN\_API\_KEY is required when NODE\_ENV=production

### Request

[](#request)

curl -X POST http://localhost:3000/api/v1/generate \\
  -H 'Content-Type: application/json' \\
  -d '{"logicCore": {...}, "clientId": "my-app", "callbackUrl": "https://..."}'

Optional fields on `/api/v1/generate`: `mode` (`document`/`optimize`), `poolOrder` (`auto`/`declared`), `ruleProfile` (inline object), `visualRefinement`, `bendRule`, `nodeLabelsAvoidFlows`, `foreignShapeRepair`, `callbackUrl` (async delivery with retry), `clientId` (audit), `correlationId` (tracking, `^[A-Za-z0-9_-]{1,64}$`). The other endpoints take a subset; [references/api-reference.md](/Stieges/bpmn-generator/blob/master/references/api-reference.md) lists them per endpoint.

### Security defaults

[](#security-defaults)

Variable

Effect

`BPMN_API_KEY`

API key, sent as the `X-API-Key` header and compared in constant time. Required when `NODE_ENV=production` — the server refuses to start without it; optional in development

`LLM_BASE_URL_ALLOWLIST`

Comma-separated origins a client may name as `llmConfig.baseUrl`; empty (default) refuses every client `baseUrl` with a `400`. Without one the server's `OPENAI_BASE_URL` / `OPENAI_API_KEY` / `OPENAI_MODEL` apply

`LLM_EXTRA_BODY`

JSON object of extra request fields for the server's own LLM endpoint, e.g. `{"chat_template_kwargs":{"enable_thinking":false}}` to switch a thinking model off. Never taken from a client's `llmConfig`; a value that is not a JSON object fails the request

`TRUST_PROXY_HOPS`

Number of trusted reverse proxies; the rate limit then keys on the address they recorded in `X-Forwarded-For`. Set it only when the server is reachable exclusively through those proxies

`AUDIT_LOG_PATH`

Audit log file (default below)

`DEAD_LETTER_PATH`

Dead-letter directory (default below)

`BPMN_CONFIG`

JSON file merged over `config.json` (see [Visual Refinement](#visual-refinement))

Fixed limits: 10 MB request body, 30 requests per minute per client. Every Logic-Core input passes the JSON Schema gate; `callbackUrl` and an allowlisted `baseUrl` pass an SSRF guard (http/https only, no credentials, internal and special-purpose addresses refused, connection pinned to the checked address, redirects never followed). See [SECURITY.md](/Stieges/bpmn-generator/blob/master/SECURITY.md) for the threat model.

### Observability

[](#observability)

-   **Audit log:** `<os.tmpdir>/bpmn-generator/audit/bpmn-generator.jsonl` by default, or `AUDIT_LOG_PATH` (append-only JSON Lines, metadata only). `npm run demo` writes it to an `audit/` directory next to the server instead
-   **Dead letter:** `<os.tmpdir>/bpmn-generator/dead-letter/` by default, or `DEAD_LETTER_PATH` — one `<uuid>.json` per failed callback delivery

## Redesign Toolbox (opt-in)

[](#redesign-toolbox-opt-in)

Five deterministic transforms of a Logic-Core model, no LLM: `parallelize`, `mergeTasks`, `relane`, `reorderKnockouts`, `isolateException`. Each optimization advisory (O01–O04, `--optimize`) names the transform that addresses it. Preview is the default; nothing is written without `--apply`, and a transform that would break soundness or touch a protected node refuses (non-zero exit, no file).

# Preview: is the transform feasible, and why (not)?
node bpmn/redesign-cli.js input.json parallelize --nodes task\_a,task\_b

# Apply and write (default output: input.soll.json, or -o out.json)
node bpmn/redesign-cli.js input.json relane --node task\_a --lane Backoffice --apply

Required options per transform: `mergeTasks` `--nodes` + `--name`, `relane` `--node` + `--lane`, `reorderKnockouts` `--nodes` + `--order`, `isolateException` `--end`, `--attach-to`, `--marker`, `--cancel-activity true|false`; `--policy '{"protectNodes":[…],"protectLanes":[…]}'` protects elements from any transform. Run the CLI without arguments for the full usage text (German).

## Scenario Enumeration (opt-in)

[](#scenario-enumeration-opt-in)

`scripts/scenarios/` enumerates every distinct path a token can take through a process or a collaboration (cycles bounded per backward edge, parallel interleavings collapsed to one canonical order), resolves each BPMN `decisionRef` against DMN decision tables, and analyzes those tables for gaps and overlaps. Output is a JSON and a Markdown view, grouped around the happy path.

# Logic-Core → output.scenarios.json + output.scenarios.md
node scenarios/pipeline.js input.json output

# With DMN decisions (Decision-Core JSON or DMN XML, comma-separated, routed by content)
node scenarios/pipeline.js input.json output --decisions table.dmn,other.json

# Abort (no files written) on any finding, an incomplete enumeration or a lossy DMN import
node scenarios/pipeline.js input.json output --strict

It reports six rules, SC01–SC06: a branch no scenario takes (SC01), a `decisionRef` that resolves to no or to several DMN decisions (SC02/SC03, the cross-notation rule set), a decision-table gap or an overlap under hit policy UNIQUE (SC04/SC05), and improper completion (SC06). The scenario pipeline takes no rule profile, so these rules are not profile-switchable yet. Bounds live in `config.json → scenarios`.

## DMN Support (opt-in)

[](#dmn-support-opt-in)

Alongside the BPMN pipeline, `scripts/dmn/` generates DMN 1.3 decision models: JSON Decision-Core → schema gate → rule engine → ElkJS DRD (Decision Requirements Diagram) layout → coordinate mapping → diagram integrity check → DMN 1.3 XML + DMNDI (via `dmn-moddle`) and the DRD as SVG, drawn from the same coordinates as the DMNDI, the way dmn.io draws it. Output validates against the normative `DMN13.xsd`.

This is a separate, sibling subsystem — `dmn/` never imports from `bpmn/`, and `runPipeline` reaches it only for the opt-in `decisions` option (the decision table as text, never a DMN rule). It has its own rule engine (19 DMN rules, 3 layers — see the "DMN rule set" section of [`CLAUDE.md`](/Stieges/bpmn-generator/blob/master/CLAUDE.md) for the layer breakdown), its own CLI, and its own test coverage.

# JSON Decision-Core → DMN 1.3 XML + DRD SVG
node dmn/pipeline.js input.json output-basename

# Plus the decision tables as Markdown, SVG and HTML (output.md, output.tables.svg, output.tables.html)
node dmn/pipeline.js input.json output --doc

# A Business Rule Task's decision table into its BPMN documentation (JSON or .dmn, by content)
node bpmn/pipeline.js process.json output --decisions decision.json

# Enable the opt-in best\_practice rule layer
node dmn/pipeline.js input.json output --best-practice

# Abort (no files written) on any unresolved warning
node dmn/pipeline.js input.json output --strict

# DMN 1.3 XML -> Decision-Core JSON (loss report on stderr; --strict aborts on a lossy import)
node dmn/import.js input.dmn output.json

Currently covers Decision-Core validation, DRD layout, and DMN 1.3 serialization (Stages 1-4 of the DMN integration), plus import of DMN XML back to Decision-Core with a structured loss report. The importer reads no DMNDI, so every diagram is reported (IM06) and even a file this generator wrote imports as not lossless; `--strict` therefore suits foreign files. The tool surface (MCP, HTTP) is not yet implemented — see [ROADMAP.md](/Stieges/bpmn-generator/blob/master/ROADMAP.md) for what's still open.

## Known Limitations


...3351 bytes truncated...

The tool call succeeded but the output was truncated. Full output saved to: /home/user/.local/share/opencode/tool-output/tool_1624cb939001NKh4juee6RpQha
Use the Task tool to have explore agent process this file with Grep and Read (with offset/limit). Do NOT read the full file yourself - delegate to save context.
```

---

## Assistant (Plan · Claude Sonnet 5 · 46.9s)

_Thinking:_



## Findings

### 1. Is there an Excalidraw-style live canvas for BPMN?

**No, not that I could find — this is a gap in the ecosystem, not a solved problem.**

The Excalidraw side has this exact pattern productionized: `yctimlin/mcp_excalidraw` (2.6k★, MIT) runs two local processes — a **canvas server** (Excalidraw web UI + REST API + WebSocket real-time sync, `http://127.0.0.1:3000`) and a thin **MCP/CLI client** that drives it. Every agent tool call (`create_element`, `update_element`, ...) is broadcast over the WebSocket to any open browser tab, so a human watching the page sees the agent's edits appear live — no API keys, no cloud, Node ≥ 20 only.

I searched specifically for a BPMN equivalent of that architecture (canvas server + WS sync + MCP) and found none. The existing BPMN+MCP projects (next section) are all **headless XML/SVG generators** — the human only sees the result after the agent finishes, by opening the exported file in a separate viewer. Nobody has built "mcp-excalidraw-server, but for bpmn-js" yet, even though the underlying piece (bpmn-js's `commandStack` already emits change events you could broadcast the same way) is technically straightforward to bolt on.

**If true live co-editing is a hard requirement**, the realistic path is to build this yourself using bpmn-js + bpmn-moddle + bpmnlint, following the `mcp_excalidraw` blueprint (canvas server with WS broadcast of commandStack events; MCP tools as a thin client). That's a genuine build, not a drop-in install.

### 2. Docker container wrapping bpmn-js in an HTTP server?

**Nothing trustworthy/maintained.** I found one image, `pigstep/vibe-bpmn` ("Create BPMN via XML or ai. Powered by BPMN.IO") — but it has 2.8K pulls, zero stars, and no README/overview at all on Docker Hub, so I can't vouch for what it actually runs or how current it is. I'd treat it as an unverified hobby image, not a recommendation.

Camunda doesn't ship one either: the FOSS **Desktop Modeler** is an Electron app (not HTTP-servable), and the collaborative **Web Modeler** only exists inside Camunda 8 Self-Managed, which is not a pure-FOSS license. A bare bpmn-js-as-a-container is simple to build yourself (the bpmn-js demo/modeler starter app behind nginx or Caddy is a ~15-line Dockerfile) — but there's no credible off-the-shelf image to point you at today.

### 3. Is there an MCP server that wraps bpmn-js for agents?

**Yes, several — all headless, none live-canvas.** Ranked by apparent maturity:

| Project | Stars | License | What it actually is |
|---|---|---|---|
| **Stieges/bpmn-generator** | 56★, active (9 days ago) | MIT | Most engineered of the lot: LLM emits a JSON "Logic-Core" → 42-rule validator → ElkJS deterministic layout → BPMN 2.0 XML/SVG via bpmn-moddle. Ships both an MCP server (`generate_bpmn`, `validate_bpmn`, `import_bpmn`, `orchestrate_bpmn`) **and** an HTTP API. Round-trips existing BPMN XML back to JSON. Verified bpmn.io/bpmn-js compatible, but it's a generator/pipeline, not a bpmn-js-driven live canvas. |
| **dattmavis/BPMN-MCP** | 15★ | MIT | Actually runs bpmn-js headless via jsdom; tools for create/add/connect/export XML+SVG/import. No visual UI at all. |
| **oisee/mcp-bpmn** | 13★ | MIT | Pure server-side XML generation, explicitly "no browser dependencies," stateful one-diagram-at-a-time context, decent tool surface (add_event/add_activity/add_gateway/connect/validate/auto_layout/export). |
| **lepoco/mcp-camunda** | 14★ | — | Different problem: talks to a *running Camunda 7 engine* (deploy/start/query instances) — not a modeling tool. |
| iamtheavoc1/mcp-bpmn, spider-node/bpmn-mcp, hewimetall/bpmn-engine-mcp | 0★ each | — | Too immature/undocumented to recommend (one even 404s on its own README). |

None of these give an agent "sight" of the diagram the way Excalidraw's `describe`/`screenshot` tools do, and none sync to a browser a human has open.

## Where this leaves you

Given FOSS + local + "both work on the same canvas live," you're choosing between:

1. **Lower the bar on "live"**: pick the most mature headless option (**Stieges/bpmn-generator**, or **bpmn-moddle/bpmnlint** built directly into your own MCP tools) for the agent side, paired with Camunda Desktop Modeler or a self-hosted bpmn-js page for the human, and accept turn-based (reload-to-see) concurrency on the shared `.bpmn` file — this is buildable today, this week, with existing parts.
2. **Build the live-canvas bridge**: use `yctimlin/mcp_excalidraw`'s architecture as a literal blueprint — a small Node canvas-server hosting bpmn-js + WebSocket broadcast of commandStack changes, with an MCP layer on top (reusing bpmn-moddle for import/export and bpmnlint for validate) — to get genuine real-time human+agent co-editing. This is a real engineering effort (days, not minutes), since no FOSS project currently does it for BPMN.

Before I turn either of these into a concrete implementation plan:

---

## User

examine if and how I could use an OpenCode v2 plugin to implement this functionality (in stages):

1. have agent change BPMN XML and then load into UI for the user to see
2. have agent to draw / update XML BPMN in real-time in a browser for the user to see and interact

---

## Assistant (Plan · Claude Sonnet 5 · 8.5s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/plugins/",
  "format": "markdown"
}
```

**Output:**
```
Plugins | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/v2/docs)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

[New OpenCode v2 is now available →](https://opencode.ai/v2)

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](https://opencode.ai/v2/docs/console/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Console](https://opencode.ai/v2/docs/console/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [Policies](/docs/policies/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [References](/docs/references/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Use a plugin](#use-a-plugin)
    -   [From local files](#from-local-files)
    -   [From npm](#from-npm)
    -   [How plugins are installed](#how-plugins-are-installed)
    -   [Load order](#load-order)
-   [Create a plugin](#create-a-plugin)
    -   [Dependencies](#dependencies)
    -   [Basic structure](#basic-structure)
    -   [TypeScript support](#typescript-support)
    -   [Events](#events)
-   [Examples](#examples)
    -   [Send notifications](#send-notifications)
    -   [.env protection](#env-protection)
    -   [Inject environment variables](#inject-environment-variables)
    -   [Custom tools](#custom-tools)
    -   [Logging](#logging)
    -   [Compaction hooks](#compaction-hooks)

## On this page

-   [Overview](#_top)
-   [Use a plugin](#use-a-plugin)
    -   [From local files](#from-local-files)
    -   [From npm](#from-npm)
    -   [How plugins are installed](#how-plugins-are-installed)
    -   [Load order](#load-order)
-   [Create a plugin](#create-a-plugin)
    -   [Dependencies](#dependencies)
    -   [Basic structure](#basic-structure)
    -   [TypeScript support](#typescript-support)
    -   [Events](#events)
-   [Examples](#examples)
    -   [Send notifications](#send-notifications)
    -   [.env protection](#env-protection)
    -   [Inject environment variables](#inject-environment-variables)
    -   [Custom tools](#custom-tools)
    -   [Logging](#logging)
    -   [Compaction hooks](#compaction-hooks)

# Plugins

Write your own plugins to extend OpenCode.

Plugins allow you to extend OpenCode by hooking into various events and customizing behavior. You can create plugins to add new features, integrate with external services, or modify OpenCode’s default behavior.

For examples, check out the [plugins](/docs/ecosystem#plugins) created by the community.

---

## [Use a plugin](#use-a-plugin)

There are two ways to load plugins.

---

### [From local files](#from-local-files)

Place JavaScript or TypeScript files in the plugin directory.

-   `.opencode/plugins/` - Project-level plugins
-   `~/.config/opencode/plugins/` - Global plugins

Files in these directories are automatically loaded at startup.

---

### [From npm](#from-npm)

Specify npm packages in your config file.

opencode.json

```
{  "$schema": "https://opencode.ai/config.json",  "plugin": ["opencode-helicone-session", "opencode-wakatime", "@my-org/custom-plugin"]}
```

Both regular and scoped npm packages are supported.

Browse available plugins in the [ecosystem](/docs/ecosystem#plugins).

---

### [How plugins are installed](#how-plugins-are-installed)

**npm plugins** are installed automatically using Bun at startup. Packages and their dependencies are cached in `~/.cache/opencode/node_modules/`.

**Local plugins** are loaded directly from the plugin directory. To use external packages, you must create a `package.json` within your config directory (see [Dependencies](#dependencies)), or publish the plugin to npm and [add it to your config](/docs/config#plugins).

---

### [Load order](#load-order)

Plugins are loaded from all sources and all hooks run in sequence. The load order is:

1.  Global config (`~/.config/opencode/opencode.json`)
2.  Project config (`opencode.json`)
3.  Global plugin directory (`~/.config/opencode/plugins/`)
4.  Project plugin directory (`.opencode/plugins/`)

Duplicate npm packages with the same name and version are loaded once. However, a local plugin and an npm plugin with similar names are both loaded separately.

---

## [Create a plugin](#create-a-plugin)

A plugin is a **JavaScript/TypeScript module** that exports one or more plugin functions. Each function receives a context object and returns a hooks object.

---

### [Dependencies](#dependencies)

Local plugins and custom tools can use external npm packages. Add a `package.json` to your config directory with the dependencies you need.

.opencode/package.json

```
{  "dependencies": {    "shescape": "^2.1.0"  }}
```

OpenCode runs `bun install` at startup to install these. Your plugins and tools can then import them.

.opencode/plugins/my-plugin.ts

```
import { escape } from "shescape"
export const MyPlugin = async (ctx) => {  return {    "tool.execute.before": async (input, output) => {      if (input.tool === "shell") {        output.args.command = escape(output.args.command)      }    },  }}
```

---

### [Basic structure](#basic-structure)

.opencode/plugins/example.js

```
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {  console.log("Plugin initialized!")
  return {    // Hook implementations go here  }}
```

The plugin function receives:

-   `project`: The current project information.
-   `directory`: The current working directory.
-   `worktree`: The git worktree path.
-   `client`: An opencode SDK client for interacting with the AI.
-   `$`: Bun’s [shell API](https://bun.com/docs/runtime/shell) for executing commands.

---

### [TypeScript support](#typescript-support)

For TypeScript plugins, you can import types from the plugin package:

my-plugin.ts

```
import type { Plugin } from "@opencode-ai/plugin"
export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {  return {    // Type-safe hook implementations  }}
```

---

### [Events](#events)

Plugins can subscribe to events as seen below in the Examples section. Here is a list of the different events available.

#### [Command Events](#command-events)

-   `command.executed`

#### [File Events](#file-events)

-   `file.edited`
-   `file.watcher.updated`

#### [Installation Events](#installation-events)

-   `installation.updated`

#### [LSP Events](#lsp-events)

-   `lsp.client.diagnostics`
-   `lsp.updated`

#### [Message Events](#message-events)

-   `message.part.removed`
-   `message.part.updated`
-   `message.removed`
-   `message.updated`

#### [Permission Events](#permission-events)

-   `permission.asked`
-   `permission.replied`

#### [Server Events](#server-events)

-   `server.connected`

#### [Session Events](#session-events)

-   `session.created`
-   `session.compacted`
-   `session.deleted`
-   `session.diff`
-   `session.error`
-   `session.idle`
-   `session.status`
-   `session.updated`

#### [Shell Events](#shell-events)

-   `shell.env`

#### [Tool Events](#tool-events)

-   `tool.execute.after`
-   `tool.execute.before`

#### [TUI Events](#tui-events)

-   `tui.prompt.append`
-   `tui.command.execute`
-   `tui.toast.show`

---

## [Examples](#examples)

Here are some examples of plugins you can use to extend opencode.

---

### [Send notifications](#send-notifications)

Send notifications when certain events occur:

.opencode/plugins/notification.js

```
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {  return {    event: async ({ event }) => {      // Send notification on session completion      if (event.type === "session.idle") {        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`      }    },  }}
```

We are using `osascript` to run AppleScript on macOS. Here we are using it to send notifications.

Note

If you’re using the OpenCode desktop app, it can send system notifications automatically when a response is ready or when a session errors.

---

### [.env protection](#env-protection)

Prevent opencode from reading `.env` files:

.opencode/plugins/env-protection.js

```
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {  return {    "tool.execute.before": async (input, output) => {      if (input.tool === "read" && output.args.filePath.includes(".env")) {        throw new Error("Do not read .env files")      }    },  }}
```

---

### [Inject environment variables](#inject-environment-variables)

Inject environment variables into all shell execution (AI tools and user terminals):

.opencode/plugins/inject-env.js

```
export const InjectEnvPlugin = async () => {  return {    "shell.env": async (input, output) => {      output.env.MY_API_KEY = "secret"      output.env.PROJECT_ROOT = input.cwd    },  }}
```

---

### [Custom tools](#custom-tools)

Plugins can also add custom tools to opencode:

.opencode/plugins/custom-tools.ts

```
import { type Plugin, tool } from "@opencode-ai/plugin"
export const CustomToolsPlugin: Plugin = async (ctx) => {  return {    tool: {      mytool: tool({        description: "This is a custom tool",        args: {          foo: tool.schema.string(),        },        async execute(args, context) {          const { directory, worktree } = context          return `Hello ${args.foo} from ${directory} (worktree: ${worktree})`        },      }),    },  }}
```

The `tool` helper creates a custom tool that opencode can call. It takes a Zod schema function and returns a tool definition with:

-   `description`: What the tool does
-   `args`: Zod schema for the tool’s arguments
-   `execute`: Function that runs when the tool is called

Your custom tools will be available to opencode alongside built-in tools.

Note

If a plugin tool uses the same name as a built-in tool, the plugin tool takes precedence.

---

### [Logging](#logging)

Use `client.app.log()` instead of `console.log` for structured logging:

.opencode/plugins/my-plugin.ts

```
export const MyPlugin = async ({ client }) => {  await client.app.log({    body: {      service: "my-plugin",      level: "info",      message: "Plugin initialized",      extra: { foo: "bar" },    },  })}
```

Levels: `debug`, `info`, `warn`, `error`. See [SDK documentation](https://opencode.ai/docs/sdk) for details.

---

### [Compaction hooks](#compaction-hooks)

Customize the context included when a session is compacted:

.opencode/plugins/compaction.ts

```
import type { Plugin } from "@opencode-ai/plugin"
export const CompactionPlugin: Plugin = async (ctx) => {  return {    "experimental.session.compacting": async (input, output) => {      // Inject additional context into the compaction prompt      output.context.push(`## Custom Context
Include any state that should persist across compaction:- Current task status- Important decisions made- Files being actively worked on`)    },  }}
```

The `experimental.session.compacting` hook fires before the LLM generates a continuation summary. Use it to inject domain-specific context that the default compaction prompt would miss.

You can also replace the compaction prompt entirely by setting `output.prompt`:

.opencode/plugins/custom-compaction.ts

```
import type { Plugin } from "@opencode-ai/plugin"
export const CustomCompactionPlugin: Plugin = async (ctx) => {  return {    "experimental.session.compacting": async (input, output) => {      // Replace the entire compaction prompt      output.prompt = `You are generating a continuation prompt for a multi-agent swarm session.
Summarize:1. The current task and its status2. Which files are being modified and by whom3. Any blockers or dependencies between agents4. The next steps to complete the work
Format as a structured prompt that a new agent can use to resume work.`    },  }}
```

When `output.prompt` is set, it completely replaces the default compaction prompt. The `output.context` array is ignored in this case.

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/plugins.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: Oct 20, 2026
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/",
  "format": "markdown"
}
```

**Output:**
```
Intro | AI coding agent built for the terminalIntro | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/v2/docs)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

[New OpenCode v2 is now available →](https://opencode.ai/v2)

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](https://opencode.ai/v2/docs/console/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Console](https://opencode.ai/v2/docs/console/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [Policies](/docs/policies/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [References](/docs/references/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Install](#install)
-   [Configure](#configure)
-   [Initialize](#initialize)
-   [Usage](#usage)
    -   [Ask questions](#ask-questions)
    -   [Add features](#add-features)
    -   [Make changes](#make-changes)
    -   [Undo changes](#undo-changes)
-   [Customize](#customize)

## On this page

-   [Overview](#_top)
-   [Install](#install)
-   [Configure](#configure)
-   [Initialize](#initialize)
-   [Usage](#usage)
    -   [Ask questions](#ask-questions)
    -   [Add features](#add-features)
    -   [Make changes](#make-changes)
    -   [Undo changes](#undo-changes)
-   [Customize](#customize)

# Intro

Get started with OpenCode.

Note

OpenCode 1 and OpenCode 2 both use the `opencode` command and cannot be installed side by side under their default command. See the [OpenCode 2 docs](https://opencode.ai/v2/docs/) to migrate to V2.

[**OpenCode**](/) is an open source AI coding agent. It’s available as a terminal-based interface, desktop app, or IDE extension.

![OpenCode TUI with the opencode theme](/docs/_astro/screenshot.CQjBbRyJ_1dLadc.webp)

Let’s get started.

---

#### [Prerequisites](#prerequisites)

To use OpenCode in your terminal, you’ll need:

1.  A modern terminal emulator like:
    
    -   [WezTerm](https://wezterm.org), cross-platform
    -   [Alacritty](https://alacritty.org), cross-platform
    -   [Ghostty](https://ghostty.org), Linux and macOS
    -   [Kitty](https://sw.kovidgoyal.net/kitty/), Linux and macOS
2.  API keys for the LLM providers you want to use.
    

---

## [Install](#install)

The easiest way to install OpenCode 1 is through the install script. These installation methods provide the `opencode` binary and can conflict with or replace an OpenCode 2 installation.

Terminal window

```
curl -fsSL https://opencode.ai/install | bash
```

You can also install it with the following commands:

-   **Using Node.js**
    
    -   [npm](#tab-panel-0)
    -   [Bun](#tab-panel-1)
    -   [pnpm](#tab-panel-2)
    -   [Yarn](#tab-panel-3)
    
    Terminal window
    
    ```
    npm install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    bun install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    pnpm install -g opencode-ai
    ```
    
    Terminal window
    
    ```
    yarn global add opencode-ai
    ```
    
-   **Using Homebrew on macOS and Linux**
    
    Terminal window
    
    ```
    brew install anomalyco/tap/opencode
    ```
    
    > We recommend using the OpenCode tap for the most up to date releases. The official `brew install opencode` formula is maintained by the Homebrew team and is updated less frequently.
    
-   **Installing on Arch Linux**
    
    Terminal window
    
    ```
    sudo pacman -S opencode           # Arch Linux (Stable)paru -S opencode-bin              # Arch Linux (Latest from AUR)
    ```
    

#### [Windows](#windows)

Recommended: Use WSL

For the best experience on Windows, we recommend using [Windows Subsystem for Linux (WSL)](/docs/windows-wsl). It provides better performance and full compatibility with OpenCode’s features.

-   **Using Chocolatey**
    
    Terminal window
    
    ```
    choco install opencode
    ```
    
-   **Using Scoop**
    
    Terminal window
    
    ```
    scoop install opencode
    ```
    
-   **Using NPM**
    
    Terminal window
    
    ```
    npm install -g opencode-ai
    ```
    
-   **Using Mise**
    
    Terminal window
    
    ```
    mise use -g github:anomalyco/opencode
    ```
    
-   **Using Docker**
    
    Terminal window
    
    ```
    docker run -it --rm ghcr.io/anomalyco/opencode
    ```
    

Support for installing OpenCode on Windows using Bun is currently in progress.

You can also grab the binary from the [Releases](https://github.com/anomalyco/opencode/releases).

---

## [Configure](#configure)

With OpenCode you can use any LLM provider by configuring their API keys.

If you are new to using LLM providers, we recommend using [OpenCode Zen](https://opencode.ai/v2/docs/console/). It’s a curated list of models that have been tested and verified by the OpenCode team.

1.  Run the `/connect` command in the TUI, select opencode, and head to [opencode.ai/auth](https://opencode.ai/auth).
    
    ```
    /connect
    ```
    
2.  Sign in, add your billing details, and copy your API key.
    
3.  Paste your API key.
    
    ```
    ┌ API key││└ enter
    ```
    

Alternatively, you can select one of the other providers. [Learn more](/docs/providers#directory).

---

## [Initialize](#initialize)

Now that you’ve configured a provider, you can navigate to a project that you want to work on.

Terminal window

```
cd /path/to/project
```

And run OpenCode.

Terminal window

```
opencode
```

Next, initialize OpenCode for the project by running the following command.

```
/init
```

This will get OpenCode to analyze your project and create an `AGENTS.md` file in the project root.

Tip

You should commit your project’s `AGENTS.md` file to Git.

This helps OpenCode understand the project structure and the coding patterns used.

---

## [Usage](#usage)

You are now ready to use OpenCode to work on your project. Feel free to ask it anything!

If you are new to using an AI coding agent, here are some examples that might help.

---

### [Ask questions](#ask-questions)

You can ask OpenCode to explain the codebase to you.

Tip

Use the `@` key to fuzzy search for files in the project.

```
How is authentication handled in @packages/functions/src/api/index.ts
```

This is helpful if there’s a part of the codebase that you didn’t work on.

---

### [Add features](#add-features)

You can ask OpenCode to add new features to your project. Though we first recommend asking it to create a plan.

1.  **Create a plan**
    
    OpenCode has a *Plan mode* that disables its ability to make changes and instead suggest *how* it’ll implement the feature.
    
    Switch to it using the **Tab** key. You’ll see an indicator for this in the lower right corner.
    
    ```
    <TAB>
    ```
    
    Now let’s describe what we want it to do.
    
    ```
    When a user deletes a note, we'd like to flag it as deleted in the database.Then create a screen that shows all the recently deleted notes.From this screen, the user can undelete a note or permanently delete it.
    ```
    
    You want to give OpenCode enough details to understand what you want. It helps to talk to it like you are talking to a junior developer on your team.
    
    Tip
    
    Give OpenCode plenty of context and examples to help it understand what you want.
    
2.  **Iterate on the plan**
    
    Once it gives you a plan, you can give it feedback or add more details.
    
    ```
    We'd like to design this new screen using a design I've used before.[Image #1] Take a look at this image and use it as a reference.
    ```
    
    Tip
    
    Drag and drop images into the terminal to add them to the prompt.
    
    OpenCode can scan any images you give it and add them to the prompt. You can do this by dragging and dropping an image into the terminal.
    
3.  **Build the feature**
    
    Once you feel comfortable with the plan, switch back to *Build mode* by hitting the **Tab** key again.
    
    ```
    <TAB>
    ```
    
    And asking it to make the changes.
    
    ```
    Sounds good! Go ahead and make the changes.
    ```
    

---

### [Make changes](#make-changes)

For more straightforward changes, you can ask OpenCode to directly build it without having to review the plan first.

```
We need to add authentication to the /settings route. Take a look at how this ishandled in the /notes route in @packages/functions/src/notes.ts and implementthe same logic in @packages/functions/src/settings.ts
```

You want to make sure you provide a good amount of detail so OpenCode makes the right changes.

---

### [Undo changes](#undo-changes)

Let’s say you ask OpenCode to make some changes.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

But you realize that it is not what you wanted. You **can undo** the changes using the `/undo` command.

```
/undo
```

OpenCode will now revert the changes you made and show your original message again.

```
Can you refactor the function in @packages/functions/src/api/index.ts?
```

From here you can tweak the prompt and ask OpenCode to try again.

Tip

You can run `/undo` multiple times to undo multiple changes.

Or you **can redo** the changes using the `/redo` command.

```
/redo
```

---

## [Customize](#customize)

And that’s it! You are now a pro at using OpenCode.

To make it your own, we recommend [picking a theme](/docs/themes), [customizing the keybinds](/docs/keybinds), [configuring code formatters](/docs/formatters), [creating custom commands](/docs/commands), or playing around with the [OpenCode config](/docs/config).

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/index.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: Oct 20, 2026
```

---

## Assistant (Plan · Claude Sonnet 5 · 5.8s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/v2/docs/",
  "format": "markdown"
}
```

**Output:**
```
# Intro

OpenCode is an open source AI coding agent. It’s available as a terminal-based interface, desktop app, or web app.


## CLI

<CodeTabs
  id="install"
  label="Install method"
  tabs={[
    { label: "curl", code: "curl -fsSL https://opencode.ai/v2/install | bash" },
    { label: "homebrew", code: "brew install anomalyco/tap/opencode-v2" },
    { label: "npm", code: "npm install -g @opencode/cli" },
    { label: "bun", code: "bun install -g --trust @opencode/cli" },
    { label: "pnpm", code: "pnpm add -g --allow-build=@opencode/cli @opencode/cli" },
    { label: "yarn", code: "yarn global add @opencode/cli" },
    { label: "vite+", code: "vp install -g @opencode/cli" },
    { label: "aur", code: "paru -S opencode-beta" },
    { label: "mise", code: "mise use -g opencode" },
  ]}
/>

The npm package uses a postinstall script to select the native `opencode` binary for your platform. The Bun and pnpm commands
explicitly allow the required script; Vite+ requires no additional flag. The mise command requires mise 2026.10.9 or later;
older versions install OpenCode 1.

Windows package managers are not supported.


Download a standalone CLI binary for your platform.

- **macOS:** [Apple silicon](https://opencode.ai/update/api/latest/cli/opencode/opencode-darwin-arm64.zip) · [Intel](https://opencode.ai/update/api/latest/cli/opencode/opencode-darwin-x64.zip) · [Intel (baseline)](https://opencode.ai/update/api/latest/cli/opencode/opencode-darwin-x64-baseline.zip)
- **Windows:** [ARM64](https://opencode.ai/update/api/latest/cli/opencode/opencode-windows-arm64.zip) · [x64](https://opencode.ai/update/api/latest/cli/opencode/opencode-windows-x64.zip) · [x64 (baseline)](https://opencode.ai/update/api/latest/cli/opencode/opencode-windows-x64-baseline.zip)
- **Linux (glibc):** [ARM64](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-arm64.tar.gz) · [x64](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-x64.tar.gz) · [x64 (baseline)](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-x64-baseline.tar.gz)
- **Linux (musl):** [ARM64](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-arm64-musl.tar.gz) · [x64](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-x64-musl.tar.gz) · [x64 (baseline)](https://opencode.ai/update/api/latest/cli/opencode/opencode-linux-x64-baseline-musl.tar.gz)

## Desktop

Download the latest OpenCode Desktop build for your platform.

- **macOS:** [Apple silicon](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-mac-arm64.dmg) · [Intel](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-mac-x64.dmg)
- **Windows:** [x64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-win-x64.exe) · [ARM64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-win-arm64.exe)
- **Linux (.deb):** [x64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-amd64.deb) · [ARM64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-arm64.deb)
- **Linux (.rpm):** [x64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-x86_64.rpm) · [ARM64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-aarch64.rpm)
- **Linux (AppImage):** [x64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-x86_64.AppImage) · [ARM64](https://opencode.ai/update/api/latest/desktop/opencode/opencode-desktop-linux-arm64.AppImage)


## Web

Access the OpenCode web interface with the `opencode pair` command.

```bash
$ opencode pair

  Open a link to connect. Links work once and expire in 5 minutes.

  http://127.0.0.1:49374/auth/connect/...
```

## Docker

Docker images use versioned tags, for example `ghcr.io/anomalyco/opencode:2.0.0`.

---

## Connect

OpenCode has built-in support for many LLM providers. You can connect to them
directly [in the TUI](/cli/providers) with `/connect`.

See [Providers](/providers) to configure custom providers.

If you'd like easy access to all the best coding models you can try out
[OpenCode Console](/console).

You can also try [OpenCode Go](/console/go), a $10/month subscription
plan that grants you access to the best coding models.

---

## Customize

Make OpenCode your own by editing the [OpenCode config](/config), [loading plugins](/plugins), [connecting MCP
servers](/mcp-servers), or [creating commands](/commands). For terminal interface themes and keybindings, see [CLI
settings](/cli/config).

---

## Learn

If you are interested in an indepth course on OpenCode Boot.dev has created an excellent [AI Coding with
OpenCode](https://www.boot.dev/courses/learn-ai-coding) course in consultation with our team. All the information in the course is
free to read and watch, though some interactive features may require payment.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/server/",
  "format": "markdown"
}
```

**Output:**
```
Server | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/v2/docs)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

[New OpenCode v2 is now available →](https://opencode.ai/v2)

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](https://opencode.ai/v2/docs/console/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Console](https://opencode.ai/v2/docs/console/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [Policies](/docs/policies/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [References](/docs/references/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
    -   [Usage](#usage)
    -   [Authentication](#authentication)
    -   [How it works](#how-it-works)
-   [Spec](#spec)
-   [APIs](#apis)
    -   [Global](#global)
    -   [Project](#project)
    -   [Path & VCS](#path--vcs)
    -   [Instance](#instance)
    -   [Config](#config)
    -   [Provider](#provider)
    -   [Sessions](#sessions)
    -   [Messages](#messages)
    -   [Commands](#commands)
    -   [Files](#files)
    -   [Tools (Experimental)](#tools-experimental)
    -   [LSP, Formatters & MCP](#lsp-formatters--mcp)
    -   [Agents](#agents)
    -   [Logging](#logging)
    -   [TUI](#tui)
    -   [Auth](#auth)
    -   [Events](#events)
    -   [Docs](#docs)

## On this page

-   [Overview](#_top)
    -   [Usage](#usage)
    -   [Authentication](#authentication)
    -   [How it works](#how-it-works)
-   [Spec](#spec)
-   [APIs](#apis)
    -   [Global](#global)
    -   [Project](#project)
    -   [Path & VCS](#path--vcs)
    -   [Instance](#instance)
    -   [Config](#config)
    -   [Provider](#provider)
    -   [Sessions](#sessions)
    -   [Messages](#messages)
    -   [Commands](#commands)
    -   [Files](#files)
    -   [Tools (Experimental)](#tools-experimental)
    -   [LSP, Formatters & MCP](#lsp-formatters--mcp)
    -   [Agents](#agents)
    -   [Logging](#logging)
    -   [TUI](#tui)
    -   [Auth](#auth)
    -   [Events](#events)
    -   [Docs](#docs)

# Server

Interact with opencode server over HTTP.

The `opencode serve` command runs a headless HTTP server that exposes an OpenAPI endpoint that an opencode client can use.

---

### [Usage](#usage)

Terminal window

```
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

#### [Options](#options)

Flag

Description

Default

`--port`

Port to listen on

`4096`

`--hostname`

Hostname to listen on

`127.0.0.1`

`--mdns`

Enable mDNS discovery

`false`

`--mdns-domain`

Custom domain name for mDNS service

`opencode.local`

`--cors`

Additional browser origins to allow

`[]`

`--cors` can be passed multiple times:

Terminal window

```
opencode serve --cors http://localhost:5173 --cors https://app.example.com
```

---

### [Authentication](#authentication)

Set `OPENCODE_SERVER_PASSWORD` to protect the server with HTTP basic auth. The username defaults to `opencode`, or set `OPENCODE_SERVER_USERNAME` to override it. This applies to both `opencode serve` and `opencode web`.

Terminal window

```
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

---

### [How it works](#how-it-works)

When you run `opencode` it starts a TUI and a server. Where the TUI is the client that talks to the server. The server exposes an OpenAPI 3.1 spec endpoint. This endpoint is also used to generate an [SDK](/docs/sdk).

Tip

Use the opencode server to interact with opencode programmatically.

This architecture lets opencode support multiple clients and allows you to interact with opencode programmatically.

You can run `opencode serve` to start a standalone server. If you have the opencode TUI running, `opencode serve` will start a new server.

---

#### [Connect to an existing server](#connect-to-an-existing-server)

When you start the TUI it randomly assigns a port and hostname. You can instead pass in the `--hostname` and `--port` [flags](/docs/cli). Then use this to connect to its server.

The [`/tui`](#tui) endpoint can be used to drive the TUI through the server. For example, you can prefill or run a prompt. This setup is used by the OpenCode [IDE](/docs/ide) plugins.

---

## [Spec](#spec)

The server publishes an OpenAPI 3.1 spec that can be viewed at:

```
http://<hostname>:<port>/doc
```

For example, `http://localhost:4096/doc`. Use the spec to generate clients or inspect request and response types. Or view it in a Swagger explorer.

---

## [APIs](#apis)

The opencode server exposes the following APIs.

---

### [Global](#global)

Method

Path

Description

Response

`GET`

`/global/health`

Get server health and version

`{ healthy: true, version: string }`

`GET`

`/global/event`

Get global events (SSE stream)

Event stream

---

### [Project](#project)

Method

Path

Description

Response

`GET`

`/project`

List all projects

[`Project[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/project/current`

Get the current project

[`Project`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

---

### [Path & VCS](#path--vcs)

Method

Path

Description

Response

`GET`

`/path`

Get the current path

[`Path`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/vcs`

Get VCS info for the current project

[`VcsInfo`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

---

### [Instance](#instance)

Method

Path

Description

Response

`POST`

`/instance/dispose`

Dispose the current instance

`boolean`

---

### [Config](#config)

Method

Path

Description

Response

`GET`

`/config`

Get config info

[`Config`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`PATCH`

`/config`

Update config

[`Config`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/config/providers`

List providers and default models

`{ providers:` [Provider\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, default: { [key: string]: string } }`

---

### [Provider](#provider)

Method

Path

Description

Response

`GET`

`/provider`

List all providers

`{ all:` [Provider\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, default: {...}, connected: string[] }`

`GET`

`/provider/auth`

Get provider authentication methods

`{ [providerID: string]:` [ProviderAuthMethod\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}`

`POST`

`/provider/{id}/oauth/authorize`

Authorize a provider using OAuth

[`ProviderAuthAuthorization`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`POST`

`/provider/{id}/oauth/callback`

Handle OAuth callback for a provider

`boolean`

---

### [Sessions](#sessions)

Method

Path

Description

Notes

`GET`

`/session`

List all sessions

Returns [`Session[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`POST`

`/session`

Create a new session

body: `{ parentID?, title? }`, returns [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/session/status`

Get session status for all sessions

Returns `{ [sessionID: string]:` [SessionStatus](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}`

`GET`

`/session/:id`

Get session details

Returns [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`DELETE`

`/session/:id`

Delete a session and all its data

Returns `boolean`

`PATCH`

`/session/:id`

Update session properties

body: `{ title? }`, returns [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/session/:id/children`

Get a session’s child sessions

Returns [`Session[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`POST`

`/session/:id/init`

Analyze app and create `AGENTS.md`

body: `{ messageID, providerID, modelID }`, returns `boolean`

`POST`

`/session/:id/fork`

Fork an existing session at a message

body: `{ messageID? }`, returns [`Session`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`POST`

`/session/:id/abort`

Abort a running session

Returns `boolean`

`GET`

`/session/:id/diff`

Get the diff for this session

query: `messageID?`, returns [`FileDiff[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`POST`

`/session/:id/summarize`

Summarize the session

body: `{ providerID, modelID }`, returns `boolean`

`POST`

`/session/:id/revert`

Revert a message

body: `{ messageID, partID? }`, returns `boolean`

`POST`

`/session/:id/unrevert`

Restore all reverted messages

Returns `boolean`

`POST`

`/session/:id/permissions/:permissionID`

Respond to a permission request

body: `{ response, remember? }`, returns `boolean`

---

### [Messages](#messages)

Method

Path

Description

Notes

`GET`

`/session/:id/message`

List messages in a session

query: `limit?`, returns `{ info:` [Message](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Part\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}[]`

`POST`

`/session/:id/message`

Send a message and wait for response

body: `{ messageID?, model?, agent?, noReply?, system?, tools?, parts }`, returns `{ info:` [Message](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Part\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}`

`GET`

`/session/:id/message/:messageID`

Get message details

Returns `{ info:` [Message](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Part\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}`

`POST`

`/session/:id/prompt_async`

Send a message asynchronously (no wait)

body: same as `/session/:id/message`, returns `204 No Content`

`POST`

`/session/:id/command`

Execute a slash command

body: `{ messageID?, agent?, model?, command, arguments }`, returns `{ info:` [Message](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Part\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}`

`POST`

`/session/:id/shell`

Run a shell command

body: `{ agent, model?, command }`, returns `{ info:` [Message](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`, parts:` [Part\[\]](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)`}`

---

### [Commands](#commands)

Method

Path

Description

Response

`GET`

`/command`

List all commands

[`Command[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

---

### [Files](#files)

Method

Path

Description

Response

`GET`

`/find?pattern=<pat>`

Search for text in files

Array of match objects with `path`, `lines`, `line_number`, `absolute_offset`, `submatches`

`GET`

`/find/file?query=<q>`

Find files and directories by name

`string[]` (paths)

`GET`

`/find/symbol?query=<q>`

Find workspace symbols

[`Symbol[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/file?path=<path>`

List files and directories

[`FileNode[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/file/content?path=<p>`

Read a file

[`FileContent`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/file/status`

Get status for tracked files

[`File[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

#### [`/find/file` query parameters](#findfile-query-parameters)

-   `query` (required) — search string (fuzzy match)
-   `type` (optional) — limit results to `"file"` or `"directory"`
-   `directory` (optional) — override the project root for the search
-   `limit` (optional) — max results (1–200)
-   `dirs` (optional) — legacy flag (`"false"` returns only files)

---

### [Tools (Experimental)](#tools-experimental)

Method

Path

Description

Response

`GET`

`/experimental/tool/ids`

List all tool IDs

[`ToolIDs`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/experimental/tool?provider=<p>&model=<m>`

List tools with JSON schemas for a model

[`ToolList`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

---

### [LSP, Formatters & MCP](#lsp-formatters--mcp)

Method

Path

Description

Response

`GET`

`/lsp`

Get LSP server status

[`LSPStatus[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/formatter`

Get formatter status

[`FormatterStatus[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

`GET`

`/mcp`

Get MCP server status

`{ [name: string]:` [MCPStatus](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts) `}`

`POST`

`/mcp`

Add MCP server dynamically

body: `{ name, config }`, returns MCP status object

---

### [Agents](#agents)

Method

Path

Description

Response

`GET`

`/agent`

List all available agents

[`Agent[]`](https://github.com/anomalyco/opencode/blob/dev/packages/sdk/js/src/gen/types.gen.ts)

---

### [Logging](#logging)

Method

Path

Description

Response

`POST`

`/log`

Write log entry. Body: `{ service, level, message, extra? }`

`boolean`

---

### [TUI](#tui)

Method

Path

Description

Response

`POST`

`/tui/append-prompt`

Append text to the prompt

`boolean`

`POST`

`/tui/open-help`

Open the help dialog

`boolean`

`POST`

`/tui/open-sessions`

Open the session selector

`boolean`

`POST`

`/tui/open-themes`

Open the theme selector

`boolean`

`POST`

`/tui/open-models`

Open the model selector

`boolean`

`POST`

`/tui/submit-prompt`

Submit the current prompt

`boolean`

`POST`

`/tui/clear-prompt`

Clear the prompt

`boolean`

`POST`

`/tui/execute-command`

Execute a command (`{ command }`)

`boolean`

`POST`

`/tui/show-toast`

Show toast (`{ title?, message, variant }`)

`boolean`

`GET`

`/tui/control/next`

Wait for the next control request

Control request object

`POST`

`/tui/control/response`

Respond to a control request (`{ body }`)

`boolean`

---

### [Auth](#auth)

Method

Path

Description

Response

`PUT`

`/auth/:id`

Set authentication credentials. Body must match provider schema

`boolean`

---

### [Events](#events)

Method

Path

Description

Response

`GET`

`/event`

Server-sent events stream. First event is `server.connected`, then bus events

Server-sent events stream

---

### [Docs](#docs)

Method

Path

Description

Response

`GET`

`/doc`

OpenAPI 3.1 specification

HTML page with OpenAPI spec

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/server.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: Oct 20, 2026
```

---

## Assistant (Plan · Claude Sonnet 5 · 5.8s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/custom-tools/",
  "format": "markdown"
}
```

**Output:**
```
Custom Tools | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/v2/docs)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

[New OpenCode v2 is now available →](https://opencode.ai/v2)

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](https://opencode.ai/v2/docs/console/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Console](https://opencode.ai/v2/docs/console/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [Policies](/docs/policies/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [References](/docs/references/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Creating a tool](#creating-a-tool)
    -   [Location](#location)
    -   [Structure](#structure)
    -   [Arguments](#arguments)
    -   [Context](#context)
-   [Examples](#examples)
    -   [Write a tool in Python](#write-a-tool-in-python)

## On this page

-   [Overview](#_top)
-   [Creating a tool](#creating-a-tool)
    -   [Location](#location)
    -   [Structure](#structure)
    -   [Arguments](#arguments)
    -   [Context](#context)
-   [Examples](#examples)
    -   [Write a tool in Python](#write-a-tool-in-python)

# Custom Tools

Create tools the LLM can call in opencode.

Custom tools are functions you create that the LLM can call during conversations. They work alongside opencode’s [built-in tools](/docs/tools) like `read`, `write`, and `shell`.

---

## [Creating a tool](#creating-a-tool)

Tools are defined as **TypeScript** or **JavaScript** files. However, the tool definition can invoke scripts written in **any language** — TypeScript or JavaScript is only used for the tool definition itself.

---

### [Location](#location)

They can be defined:

-   Locally by placing them in the `.opencode/tools/` directory of your project.
-   Or globally, by placing them in `~/.config/opencode/tools/`.

---

### [Structure](#structure)

The easiest way to create tools is using the `tool()` helper which provides type-safety and validation.

.opencode/tools/database.ts

```
import { tool } from "@opencode-ai/plugin"
export default tool({  description: "Query the project database",  args: {    query: tool.schema.string().describe("SQL query to execute"),  },  async execute(args) {    // Your database logic here    return `Executed query: ${args.query}`  },})
```

The **filename** becomes the **tool name**. The above creates a `database` tool.

---

#### [Multiple tools per file](#multiple-tools-per-file)

You can also export multiple tools from a single file. Each export becomes **a separate tool** with the name **`<filename>_<exportname>`**:

.opencode/tools/math.ts

```
import { tool } from "@opencode-ai/plugin"
export const add = tool({  description: "Add two numbers",  args: {    a: tool.schema.number().describe("First number"),    b: tool.schema.number().describe("Second number"),  },  async execute(args) {    return (args.a + args.b).toString()  },})
export const multiply = tool({  description: "Multiply two numbers",  args: {    a: tool.schema.number().describe("First number"),    b: tool.schema.number().describe("Second number"),  },  async execute(args) {    return (args.a * args.b).toString()  },})
```

This creates two tools: `math_add` and `math_multiply`.

---

#### [Name collisions with built-in tools](#name-collisions-with-built-in-tools)

Custom tools are keyed by tool name. If a custom tool uses the same name as a built-in tool, the custom tool takes precedence.

For example, this file replaces the built-in `shell` tool:

.opencode/tools/shell.ts

```
import { tool } from "@opencode-ai/plugin"
export default tool({  description: "Restricted shell wrapper",  args: {    command: tool.schema.string(),  },  async execute(args) {    return `blocked: ${args.command}`  },})
```

Note

Prefer unique names unless you intentionally want to replace a built-in tool. If you want to disable a built in tool but not override it, use [permissions](/docs/permissions).

---

### [Arguments](#arguments)

You can use `tool.schema`, which is just [Zod](https://zod.dev), to define argument types.

```
args: {  query: tool.schema.string().describe("SQL query to execute")}
```

You can also import [Zod](https://zod.dev) directly and return a plain object:

```
import { z } from "zod"
export default {  description: "Tool description",  args: {    param: z.string().describe("Parameter description"),  },  async execute(args, context) {    // Tool implementation    return "result"  },}
```

---

### [Context](#context)

Tools receive context about the current session:

.opencode/tools/project.ts

```
import { tool } from "@opencode-ai/plugin"
export default tool({  description: "Get project information",  args: {},  async execute(args, context) {    // Access context information    const { agent, sessionID, messageID, directory, worktree } = context    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Directory: ${directory}, Worktree: ${worktree}`  },})
```

Use `context.directory` for the session working directory. Use `context.worktree` for the git worktree root.

---

## [Examples](#examples)

### [Write a tool in Python](#write-a-tool-in-python)

You can write your tools in any language you want. Here’s an example that adds two numbers using Python.

First, create the tool as a Python script:

.opencode/tools/add.py

```
import sys
a = int(sys.argv[1])b = int(sys.argv[2])print(a + b)
```

Then create the tool definition that invokes it:

.opencode/tools/python-add.ts

```
import { tool } from "@opencode-ai/plugin"import path from "path"
export default tool({  description: "Add two numbers using Python",  args: {    a: tool.schema.number().describe("First number"),    b: tool.schema.number().describe("Second number"),  },  async execute(args, context) {    const script = path.join(context.worktree, ".opencode/tools/add.py")    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()    return result.trim()  },})
```

Here we are using the [`Bun.$`](https://bun.com/docs/runtime/shell) utility to run the Python script.

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/custom-tools.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: Oct 20, 2026
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/docs/ecosystem/",
  "format": "markdown"
}
```

**Output:**
```
Ecosystem | OpenCode     [Skip to content](#_top)

  [![](/docs/_astro/logo-dark.DOStV66V.svg) ![](/docs/_astro/logo-light.B0yzR0O5.svg) OpenCode](/docs/)

[app.header.home](/)[app.header.docs](/v2/docs)

[](https://github.com/anomalyco/opencode)[](https://opencode.ai/discord)

Search CtrlK

Cancel

[New OpenCode v2 is now available →](https://opencode.ai/v2)

-   [Intro](/docs/)
-   [Config](/docs/config/)
-   [Providers](/docs/providers/)
-   [Network](/docs/network/)
-   [Enterprise](/docs/enterprise/)
-   [Troubleshooting](/docs/troubleshooting/)
-   [Windows](/docs/windows-wsl)
-   Usage
    
    -   [Go](https://opencode.ai/v2/docs/console/go/)
    -   [TUI](/docs/tui/)
    -   [CLI](/docs/cli/)
    -   [Web](/docs/web/)
    -   [IDE](/docs/ide/)
    -   [Console](https://opencode.ai/v2/docs/console/)
    -   [GitHub](/docs/github/)
    -   [GitLab](/docs/gitlab/)
    
-   Configure
    
    -   [Tools](/docs/tools/)
    -   [Rules](/docs/rules/)
    -   [Agents](/docs/agents/)
    -   [Models](/docs/models/)
    -   [Themes](/docs/themes/)
    -   [Keybinds](/docs/keybinds/)
    -   [Commands](/docs/commands/)
    -   [Formatters](/docs/formatters/)
    -   [Permissions](/docs/permissions/)
    -   [Policies](/docs/policies/)
    -   [LSP Servers](/docs/lsp/)
    -   [MCP servers](/docs/mcp-servers/)
    -   [ACP Support](/docs/acp/)
    -   [Agent Skills](/docs/skills/)
    -   [References](/docs/references/)
    -   [Custom Tools](/docs/custom-tools/)
    
-   Develop
    
    -   [SDK](/docs/sdk/)
    -   [Server](/docs/server/)
    -   [Plugins](/docs/plugins/)
    -   [Ecosystem](/docs/ecosystem/)
    

[GitHub](https://github.com/anomalyco/opencode)[Discord](https://opencode.ai/discord)

Select theme DarkLightAuto   Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文

On this page

-   [Overview](#_top)
-   [Plugins](#plugins)
-   [Projects](#projects)
-   [Agents](#agents)

## On this page

-   [Overview](#_top)
-   [Plugins](#plugins)
-   [Projects](#projects)
-   [Agents](#agents)

# Ecosystem

Projects and integrations built with OpenCode.

A collection of community projects built on OpenCode.

Note

Want to add your OpenCode related project to this list? Submit a PR.

You can also check out [awesome-opencode](https://github.com/awesome-opencode/awesome-opencode) and [opencode.cafe](https://opencode.cafe), a community that aggregates the ecosystem and community.

---

## [Plugins](#plugins)

Name

Description

[opencode-daytona](https://github.com/daytona/integrations/tree/main/packages/opencode-plugin)

Automatically run OpenCode sessions in isolated Daytona sandboxes with git sync and live previews

[opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session)

Automatically inject Helicone session headers for request grouping

[opencode-type-inject](https://github.com/nick-vi/opencode-type-inject)

Auto-inject TypeScript/Svelte types into file reads with lookup tools

[opencode-openai-codex-auth](https://github.com/numman-ali/opencode-openai-codex-auth)

Use your ChatGPT Plus/Pro subscription instead of API credits

[opencode-gemini-auth](https://github.com/jenslys/opencode-gemini-auth)

Use your existing Gemini plan instead of API billing

[opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)

Use Antigravity’s free models instead of API billing

[opencode-devcontainers](https://github.com/athal7/opencode-devcontainers)

Multi-branch devcontainer isolation with shallow clones and auto-assigned ports

[opencode-google-antigravity-auth](https://github.com/shekohex/opencode-google-antigravity-auth)

Google Antigravity OAuth Plugin, with support for Google Search, and more robust API handling

[opencode-dynamic-context-pruning](https://github.com/Tarquinen/opencode-dynamic-context-pruning)

Optimize token usage by pruning obsolete tool outputs

[opencode-vibeguard](https://github.com/inkdust2021/opencode-vibeguard)

Redact secrets/PII into VibeGuard-style placeholders before LLM calls; restore locally

[opencode-websearch-cited](https://github.com/ghoulr/opencode-websearch-cited.git)

Add native websearch support for supported providers with Google grounded style

[opencode-pty](https://github.com/shekohex/opencode-pty.git)

Enables AI agents to run background processes in a PTY, send interactive input to them.

[opencode-shell-strategy](https://github.com/JRedeker/opencode-shell-strategy)

Instructions for non-interactive shell commands - prevents hangs from TTY-dependent operations

[opencode-wakatime](https://github.com/angristan/opencode-wakatime)

Track OpenCode usage with Wakatime

[opencode-md-table-formatter](https://github.com/franlol/opencode-md-table-formatter/tree/main)

Clean up markdown tables produced by LLMs

[opencode-morph-fast-apply](https://github.com/JRedeker/opencode-morph-fast-apply)

10x faster code editing with Morph Fast Apply API and lazy edit markers

[opencode-morph-plugin](https://github.com/morphllm/opencode-morph-plugin)

Fast Apply editing, WarpGrep codebase search, and context compaction via Morph

[oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)

Background agents, pre-built LSP/AST/MCP tools, curated agents, Claude Code compatible

[opencode-notificator](https://github.com/panta82/opencode-notificator)

Desktop notifications and sound alerts for OpenCode sessions

[opencode-notifier](https://github.com/mohak34/opencode-notifier)

Desktop notifications and sound alerts for permission, completion, and error events

[opencode-zellij-namer](https://github.com/24601/opencode-zellij-namer)

AI-powered automatic Zellij session naming based on OpenCode context

[opencode-skillful](https://github.com/zenobi-us/opencode-skillful)

Allow OpenCode agents to lazy load prompts on demand with skill discovery and injection

[opencode-supermemory](https://github.com/supermemoryai/opencode-supermemory)

Persistent memory across sessions using Supermemory

[@plannotator/opencode](https://github.com/backnotprop/plannotator/tree/main/apps/opencode-plugin)

Interactive plan review with visual annotation and private/offline sharing

[@openspoon/subtask2](https://github.com/spoons-and-mirrors/subtask2)

Extend opencode /commands into a powerful orchestration system with granular flow control

[opencode-scheduler](https://github.com/different-ai/opencode-scheduler)

Schedule recurring jobs using launchd (Mac) or systemd (Linux) with cron syntax

[opencode-conductor](https://github.com/derekbar90/opencode-conductor)

Protocol-Driven Workflow: Automation of the Context -> Spec -> Plan -> Implement lifecycle.

[micode](https://github.com/vtemian/micode)

Structured Brainstorm → Plan → Implement workflow with session continuity

[octto](https://github.com/vtemian/octto)

Interactive browser UI for AI brainstorming with multi-question forms

[opencode-background-agents](https://github.com/kdcokenny/opencode-background-agents)

Claude Code-style background agents with async delegation and context persistence

[opencode-notify](https://github.com/kdcokenny/opencode-notify)

Native OS notifications for OpenCode – know when tasks complete

[opencode-workspace](https://github.com/kdcokenny/opencode-workspace)

Bundled multi-agent orchestration harness – 16 components, one install

[opencode-worktree](https://github.com/kdcokenny/opencode-worktree)

Zero-friction git worktrees for OpenCode

[opencode-sentry-monitor](https://github.com/stolinski/opencode-sentry-monitor)

Trace and debug your AI agents with Sentry AI Monitoring

[opencode-firecrawl](https://github.com/firecrawl/opencode-firecrawl)

Web scraping, crawling, and search via the Firecrawl CLI

[opencode-jfrog-plugin](https://github.com/jfrog/opencode-jfrog-plugin)

JFrog Plugin for seamless integration of Opencode users to JFrog platform

[opencode-goal-plugin](https://github.com/willytop8/OpenCode-goal-plugin)

Session-scoped `/goal` workflow that keeps objectives in context and auto-continues until complete

[opencode-tavily](https://github.com/tavily-ai/opencode-tavily)

Web search, extraction, crawling, and deep research via the Tavily CLI

[opencode-supabase](https://github.com/supabase-community/opencode-supabase)

Supabase plugin for OpenCode: account login, Management API tools, bundled Supabase agent skills, and guided Supabase MCP setup.

---

## [Projects](#projects)

Name

Description

[kimaki](https://kimaki.dev)

Discord bot to control OpenCode sessions, built on the SDK

[opencode.nvim](https://github.com/NickvanDyke/opencode.nvim)

Neovim plugin for editor-aware prompts, built on the API

[portal](https://github.com/hosenur/portal)

Mobile-first web UI for OpenCode over Tailscale/VPN

[opencode plugin template](https://github.com/zenobi-us/opencode-plugin-template/)

Template for building OpenCode plugins

[opencode.nvim](https://github.com/sudo-tee/opencode.nvim)

Neovim frontend for opencode - a terminal-based AI coding agent

[ai-sdk-provider-opencode-sdk](https://github.com/ben-vargas/ai-sdk-provider-opencode-sdk)

Vercel AI SDK provider for using OpenCode via @opencode-ai/sdk

[OpenChamber](https://github.com/btriapitsyn/openchamber)

Web / Desktop App and VS Code Extension for OpenCode

[OpenCode-Obsidian](https://github.com/mtymek/opencode-obsidian)

Obsidian plugin that embeds OpenCode in Obsidian’s UI

[OpenWork](https://github.com/different-ai/openwork)

An open-source alternative to Claude Cowork, powered by OpenCode

[ocx](https://github.com/kdcokenny/ocx)

OpenCode extension manager with portable, isolated profiles.

[CodeNomad](https://github.com/NeuralNomadsAI/CodeNomad)

Desktop, Web, Mobile and Remote Client App for OpenCode

---

## [Agents](#agents)

Name

Description

[Agentic](https://github.com/Cluster444/agentic)

Modular AI agents and commands for structured development

[opencode-agents](https://github.com/darrenhinde/opencode-agents)

Configs, prompts, agents, and plugins for enhanced workflows

[Edit page](https://github.com/anomalyco/opencode/edit/dev/packages/web/src/content/docs/ecosystem.mdx)[Found a bug? Open an issue](https://github.com/anomalyco/opencode/issues/new)[Join our Discord community](https://opencode.ai/discord) Select language EnglishالعربيةBosanskiDanskDeutschEspañolFrançaisItaliano日本語한국어Norsk BokmålPolskiPortuguês (Brasil)РусскийไทยTürkçe简体中文繁體中文 

© [Anomaly](https://anoma.ly)

Last updated: Oct 20, 2026
```

---

## Assistant (Plan · Claude Sonnet 5 · 6.0s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/vtemian/octto",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - vtemian/octto: Interactive brainstorming UI for OpenCode agents - multi-question forms, decisions, and real-time feedback · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fvtemian%2Foctto)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fvtemian%2Foctto)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=vtemian%2Foctto)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [vtemian](/vtemian)
2.  [octto](/vtemian/octto)

## Repository navigation

-   [Code](/vtemian/octto)
-   [Issues3 (3)](/vtemian/octto/issues)
-   [Pull requests1 (1)](/vtemian/octto/pulls)
-   [Actions](/vtemian/octto/actions)
-   [Projects](/vtemian/octto/projects)
-   [Security and quality](/vtemian/octto/security)
-   [Insights](/vtemian/octto/pulse)

More items

 [](/vtemian/octto)

![vtemian](https://avatars.githubusercontent.com/u/639771?s=60&v=4)

**[octto](/vtemian/octto)**

Public

-   [Notifications](/login?return_to=%2Fvtemian%2Foctto)You must be signed in to change notification settings
-   [Fork30 (30)](/login?return_to=%2Fvtemian%2Foctto)
-   [Star525 (525)](/login?return_to=%2Fvtemian%2Foctto)You must be signed in to star a repository

## About

Interactive brainstorming UI for OpenCode agents - multi-question forms, decisions, and real-time feedback

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

[Activity](/vtemian/octto/activity)

### Stars

**525** stars

### Watchers

**1** watching

### Forks

[**30** forks](/vtemian/octto/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fvtemian%2Foctto&report=vtemian+%28user%29)

main

[Branches](/vtemian/octto/branches)[Tags](/vtemian/octto/tags)

[](/vtemian/octto/branches)[](/vtemian/octto/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[247 Commits](/vtemian/octto/commits/main/)

[](/vtemian/octto/commits/main/)247 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github](/vtemian/octto/tree/main/.github ".github")

[.github](/vtemian/octto/tree/main/.github ".github")

[.opencode](/vtemian/octto/tree/main/.opencode ".opencode")

[.opencode](/vtemian/octto/tree/main/.opencode ".opencode")

[e2e](/vtemian/octto/tree/main/e2e "e2e")

[e2e](/vtemian/octto/tree/main/e2e "e2e")

[src](/vtemian/octto/tree/main/src "src")

[src](/vtemian/octto/tree/main/src "src")

[tests](/vtemian/octto/tree/main/tests "tests")

[tests](/vtemian/octto/tree/main/tests "tests")

[.dockerignore](/vtemian/octto/blob/main/.dockerignore ".dockerignore")

[.dockerignore](/vtemian/octto/blob/main/.dockerignore ".dockerignore")

[.envrc](/vtemian/octto/blob/main/.envrc ".envrc")

[.envrc](/vtemian/octto/blob/main/.envrc ".envrc")

[.gitignore](/vtemian/octto/blob/main/.gitignore ".gitignore")

[.gitignore](/vtemian/octto/blob/main/.gitignore ".gitignore")

[ARCHITECTURE.md](/vtemian/octto/blob/main/ARCHITECTURE.md "ARCHITECTURE.md")

[ARCHITECTURE.md](/vtemian/octto/blob/main/ARCHITECTURE.md "ARCHITECTURE.md")

[CHANGELOG.md](/vtemian/octto/blob/main/CHANGELOG.md "CHANGELOG.md")

[CHANGELOG.md](/vtemian/octto/blob/main/CHANGELOG.md "CHANGELOG.md")

[CLAUDE.md](/vtemian/octto/blob/main/CLAUDE.md "CLAUDE.md")

[CLAUDE.md](/vtemian/octto/blob/main/CLAUDE.md "CLAUDE.md")

[CODE\_STYLE.md](/vtemian/octto/blob/main/CODE_STYLE.md "CODE_STYLE.md")

[CODE\_STYLE.md](/vtemian/octto/blob/main/CODE_STYLE.md "CODE_STYLE.md")

[LICENSE](/vtemian/octto/blob/main/LICENSE "LICENSE")

[LICENSE](/vtemian/octto/blob/main/LICENSE "LICENSE")

[README.md](/vtemian/octto/blob/main/README.md "README.md")

[README.md](/vtemian/octto/blob/main/README.md "README.md")

[biome.json](/vtemian/octto/blob/main/biome.json "biome.json")

[biome.json](/vtemian/octto/blob/main/biome.json "biome.json")

[bun.lock](/vtemian/octto/blob/main/bun.lock "bun.lock")

[bun.lock](/vtemian/octto/blob/main/bun.lock "bun.lock")

[eslint.config.js](/vtemian/octto/blob/main/eslint.config.js "eslint.config.js")

[eslint.config.js](/vtemian/octto/blob/main/eslint.config.js "eslint.config.js")

[flake.lock](/vtemian/octto/blob/main/flake.lock "flake.lock")

[flake.lock](/vtemian/octto/blob/main/flake.lock "flake.lock")

[flake.nix](/vtemian/octto/blob/main/flake.nix "flake.nix")

[flake.nix](/vtemian/octto/blob/main/flake.nix "flake.nix")

[lefthook.yml](/vtemian/octto/blob/main/lefthook.yml "lefthook.yml")

[lefthook.yml](/vtemian/octto/blob/main/lefthook.yml "lefthook.yml")

[package.json](/vtemian/octto/blob/main/package.json "package.json")

[package.json](/vtemian/octto/blob/main/package.json "package.json")

[tsconfig.eslint.json](/vtemian/octto/blob/main/tsconfig.eslint.json "tsconfig.eslint.json")

[tsconfig.eslint.json](/vtemian/octto/blob/main/tsconfig.eslint.json "tsconfig.eslint.json")

[tsconfig.json](/vtemian/octto/blob/main/tsconfig.json "tsconfig.json")

[tsconfig.json](/vtemian/octto/blob/main/tsconfig.json "tsconfig.json")

View all files

## Repository files navigation

-   [README](#)
-   [MIT license](#)

More items

# octto

[](#octto)

An interactive browser UI for AI brainstorming. Stop typing in terminals. Start clicking in browsers.

octto-showcase.mp4

When you describe your idea, octto opens an interactive UI:

-   Click options instead of typing
-   See all questions at once
-   Answer in any order
-   Watch follow-ups appear instantly
-   Review the final plan visually

**10 minutes of terminal typing → 2 minutes of clicking.**

## Quick Start

[](#quick-start)

Add to `~/.config/opencode/opencode.json`:

{ "plugin": \["octto"\] }

Select the **octto** agent:

```
I want to add a caching layer to the API
```

A browser window opens. Click your answers. Done.

## The Interactive UI

[](#the-interactive-ui)

### Rich Question Types

[](#rich-question-types)

No more typing everything. Pick from 14 visual input types:

Type

What You See

`pick_one`

Radio buttons

`pick_many`

Checkboxes

`confirm`

Yes/No buttons

`slider`

Draggable range

`rank`

Drag to reorder

`rate`

Star rating

`thumbs`

Thumbs up/down

`show_options`

Cards with pros/cons

`show_diff`

Side-by-side code diff

`ask_code`

Syntax-highlighted editor

`ask_text`

Text input (when needed)

`ask_image`

Image upload

`ask_file`

File upload

`emoji_react`

Emoji picker

### Live Updates

[](#live-updates)

-   Questions appear as you answer previous ones
-   Progress indicator shows remaining questions
-   Completed answers visible for context
-   Final plan rendered as reviewable sections

### Parallel Branches

[](#parallel-branches)

Your request is split into 2-4 exploration branches. All initial questions appear at once:

```
         ┌─ Branch 1: [question card]
Request ─┼─ Branch 2: [question card]
         └─ Branch 3: [question card]
                ↓
        Answer any, in any order
```

Each branch goes as deep as needed. Some finish in 2 questions, others take 4.

## How It Works Behind the Scenes

[](#how-it-works-behind-the-scenes)

### 3 Agents

[](#3-agents)

Agent

Job

**bootstrapper**

Splits your request into branches

**probe**

Decides if a branch needs more questions

**octto**

Orchestrates the session

### The Flow

[](#the-flow)

1.  Bootstrapper creates 2-4 branches from your request
2.  Each branch gets an initial question → all shown in browser
3.  You answer (click, not type)
4.  Probe agent evaluates: more questions or done?
5.  Repeat until all branches complete
6.  Final plan shown for approval
7.  Design saved to `docs/plans/`

## Configuration

[](#configuration)

Optional `~/.config/opencode/octto.json`:

{
  "model": "anthropic/claude-sonnet-4",
  "port": 3000,
  "agents": {
    "probe": { "model": "openai/gpt-4o" }
  }
}

### Options

[](#options)

Option

Type

Default

Description

`model`

string

\-

Override the model for **all** agents at once

`port`

number

`0` (random)

Fixed port for the browser UI server

`agents`

object

\-

Per-agent overrides (model, temperature, etc.)

`fragments`

object

\-

Custom instructions injected into agent prompts

> **Precedence**: per-agent `agents.<name>.model` > top-level `model` > built-in default

### Fragments

[](#fragments)

Inject custom instructions into agent prompts. Useful for customizing agent behavior per-project or globally.

**Global config** (`~/.config/opencode/octto.json`):

{
  "fragments": {
    "octto": \["Always suggest 3 implementation approaches"\],
    "probe": \["Include emoji in every question"\],
    "bootstrapper": \["Focus on technical feasibility"\]
  }
}

**Project config** (`.octto/fragments.json` in your project root):

{
  "octto": \["This project uses React - focus on component patterns"\],
  "probe": \["Ask about testing strategy for each feature"\]
}

Fragments are merged: global fragments load first, project fragments append. Each fragment becomes a bullet point in a `<user-instructions>` block prepended to the agent's system prompt.

### Environment Variables

[](#environment-variables)

Variable

Description

`OCTTO_PORT`

Override port (takes precedence over config file)

For Docker workflows, set a fixed port:

OCTTO\_PORT=3000 opencode

## Development

[](#development)

bun install
bun run build
bun test

## License

[](#license)

MIT

## About

Interactive brainstorming UI for OpenCode agents - multi-question forms, decisions, and real-time feedback

### Resources

[Readme](#readme-ov-file)

[MIT license](#MIT-1-ov-file)

[Activity](/vtemian/octto/activity)

### Stars

**525** stars

### Watchers

**1** watching

### Forks

[**30** forks](/vtemian/octto/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fvtemian%2Foctto&report=vtemian+%28user%29)

## Releases

## Packages

## Contributors

## Languages

## Footer

[](https://github.com)© 2026 GitHub, Inc.

### Footer navigation

-   [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
-   [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
-   [Security](https://github.com/security)
-   [Status](https://www.githubstatus.com/)
-   [Community](https://github.community/)
-   [Docs](https://docs.github.com/)
-   [Contact](https://support.github.com?tags=dotcom-footer)
-   Manage cookies
-   Do not share my personal information

You can’t perform that action at this time.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://raw.githubusercontent.com/backnotprop/plannotator/main/apps/opencode-plugin/README.md",
  "format": "markdown"
}
```

**Output:**
```
# @plannotator/opencode

**Annotate plans. Not in the terminal.**

Interactive Plan Review for OpenCode. Select the exact parts of the plan you want to change—mark for deletion, add a comment, or suggest a replacement. Feedback flows back to your agent automatically.

Obsidian users can auto-save approved plans to Obsidian as well. [See details](#obsidian-integration)

<table>
<tr>
<td align="center">
<strong>Watch Demo</strong><br><br>
<a href="https://youtu.be/_N7uo0EFI-U">
<img src="https://img.youtube.com/vi/_N7uo0EFI-U/maxresdefault.jpg" alt="Watch Demo" width="600" />
</a>
</td>
</tr>
</table>

## Install

### OpenCode 2

Install stable OpenCode 2 with `npm install -g @opencode/cli`, then add Plannotator to the V2 `plugins` field:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    {
      "package": "@plannotator/opencode@latest",
      "options": {
        "workflow": "plan-agent",
        "planningAgents": ["plan"]
      }
    }
  ]
}
```

Restart OpenCode 2 and verify that `plannotator` appears in `opencode2 plugin list`.

To update, run the [install script](https://plannotator.ai/docs/getting-started/installation/) again and restart OpenCode 2. The script clears OpenCode 2's cached copy of the plugin, so the restart loads the latest `@plannotator/opencode`.

Plannotator builds against the stable `@opencode/plugin` API and checks its installed package against a real stable OpenCode 2 host in CI. The core `submit_plan` review flow and native slash commands are supported. Capability checks preserve fallbacks for older V2 builds:

- **Slash commands.** Stable OpenCode 2 supports native command execution (anomalyco/opencode issue #2185, PR #44765). Capability is detected from the command draft OpenCode hands the plugin: `ctx.command.transform` exists on both generations, and only the newer draft has `add`. On a host that has it, Plannotator registers `/plannotator-review`, `/plannotator-annotate`, and `/plannotator-last` itself and runs the same machinery OpenCode 1 uses, so your raw arguments reach the CLI unchanged and nothing is routed through the model. On an older host it registers nothing and the commands run from their markdown definitions, which ask the agent to run the `plannotator` CLI and relay its output; that path works but costs a model turn and depends on the agent following the instruction.
- **Command precedence.** OpenCode activates its own config-command loader after package plugins, and the last definition to claim a name wins, so the markdown stubs the installer writes to `~/.config/opencode/commands` would otherwise shadow the native definitions on every normal install. Plannotator re-registers the three names shortly after startup so its own definitions are the ones that run. If that reclaim cannot run, the stubs keep the names and the commands still work through the model-mediated fallback.
- **Agent switching.** `ctx.session.switchAgent` arrived with the same plugin API generation. On a host that exposes it, an agent switch chosen in the review UI is applied to the session. On an older host the plan is still approved and a warning is written to the server log; switch to `build` manually before implementation.
- **Ask this session.** In code review, annotate and `/plannotator-last`, Ask AI is answered by your OpenCode 2 session, and it is the only Ask AI option there. In plan review the session is waiting for your decision, so it gives a quick answer from its context only. Remote sessions and OpenCode 1 use a separate provider you pick.
- **Cancellation.** Stable V2 tool execution exposes an abort signal, but Plannotator's V2 adapter does not yet forward it to the review server or CLI child. Cancelling a turn cannot stop that review immediately.
- **Session URLs.** OpenCode 2 has a TUI plugin entry point, but it is separate from the server plugin Plannotator registers, so there is no toast to show and the plugin's own console output is discarded by the host unless you start it with `OPENCODE_PRINT_LOGS=1`. Instead, on a host whose plugin API exposes `session.synthetic`, Plannotator posts the URL into the session transcript as a `Plannotator session ready: <url>` notice, injected with `resume: false` so it appears without waking a model turn. The notice is for you, not the model: Plannotator removes it from every model request, so after a plan decision the model reads the decision, not the URL line. This covers every way a session opens: the three slash commands and the `submit_plan` plan review, whether the review runs on the embedded runtime or the CLI. That is the link to open for a remote session, which gets no browser opened for it. On an older host without `session.synthetic` the URL only reaches that discarded console output, so run with `OPENCODE_PRINT_LOGS=1` there.

### OpenCode 1

Add to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

Restart OpenCode. By default, the `submit_plan` tool is available to OpenCode's `plan` agent, not to `build` or other primary agents.

> **OpenCode 1 slash commands:** Run the install script to get `/plannotator-review`, `/plannotator-annotate`, and `/plannotator-last`:
> ```bash
> curl -fsSL https://plannotator.ai/install.sh | bash
> ```
> This also clears cached plugin versions for both OpenCode 1 and OpenCode 2. To update the plugin later, run the install script again and restart OpenCode.

## Workflow Modes

The examples below use the OpenCode 1 config shape. OpenCode 2 places the same option keys under the plugin entry's `options` object shown above. In V2, `manual` registers no `submit_plan`, so it leaves the slash commands and the `plannotator` tool, which every mode registers on OpenCode 2 once you turn it on. The slash commands need a host with native command execution and are inactive on one without it.

- **`plan-agent`** (default): `submit_plan` is available to OpenCode's built-in `plan` agent plus any extra agents listed in `planningAgents`. This keeps Plannotator integrated with OpenCode plan mode without nudging `build` to call it.
- **`manual`**: `submit_plan` is not registered. Use `/plannotator-last`, `/plannotator-annotate`, and `/plannotator-review` when you want Plannotator. On OpenCode 2 the agent can still open a review with the `plannotator` tool.
- **`user-managed`**: `submit_plan` is registered but no prompts or agent permissions are modified. You manage which agents can call `submit_plan` via OpenCode's native agent configuration.
- **`all-agents`**: legacy broad behavior. Primary agents can see and call `submit_plan`.

Default config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "workflow": "plan-agent",
      "planningAgents": ["plan"]
    }]
  ]
}
```

Runtime selection is automatic. In Bun-hosted OpenCode, Plannotator uses the embedded server bundled with the plugin. In Node-hosted or wrapped OpenCode environments, the plugin falls back to the installed `plannotator` CLI and sends the result back through OpenCode. You can force the fallback while debugging:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "runtime": "cli"
    }]
  ]
}
```

If you use other OpenCode plugins, keep everything in one `plugin` array and attach Plannotator's options directly to the Plannotator entry:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "workflow": "plan-agent",
      "planningAgents": ["plan", "sisyphus"]
    }],
    "@tarquinen/opencode-dcp@latest",
    "octto",
    "oh-my-opencode-slim"
  ]
}
```

Do not put `{ "workflow": "plan-agent" }` as its own item in the `plugin` array. OpenCode plugin entries must be either a plugin string or a two-item array like `[pluginName, options]`.

Restore the old broad behavior:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "workflow": "all-agents"
    }]
  ]
}
```

Use commands only:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "workflow": "manual"
    }]
  ]
}
```

Register the tool but manage prompts and permissions yourself:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    ["@plannotator/opencode@latest", {
      "workflow": "user-managed"
    }]
  ]
}
```

## How It Works

1. The configured planning agent calls `submit_plan` → Plannotator opens in your browser
2. Select text → annotate (delete, replace, comment)
3. **Approve** → Agent proceeds with implementation
4. **Request changes** → Annotations sent back as structured feedback

## Features

- **Visual annotations**: Select text, choose an action, see feedback in the sidebar
- **Local by default**: Plans, annotations, drafts, history, and configuration stay local. Every app load checks GitHub for updates without sending plan content, and there is currently no opt-out setting; URL annotation, hosted PR review, AI, sharing, and Workspaces use the network when selected.
- **Legacy link sharing**: Small markdown shares use compressed, unencrypted URL fragments. Larger and raw HTML shares can use client-encrypted short links. Workspaces is the primary direction for team sharing.
- **Plan Diff**: See what changed when the agent revises a plan after feedback
- **Annotate last message**: Run `/plannotator-last` to annotate the agent's most recent response
- **Annotate files, folders, and URLs**: Run `/plannotator-annotate` when you want manual review of an artifact
- **The `plannotator` tool (OpenCode 2, off by default)**: ask the agent to "open notes.md in Plannotator" and it opens the review itself, without waiting on it. Your feedback comes back later as a message that names the review's session id (`pn-…`). The agent can also list the reviews it opened in this session and close one it no longer needs; your unsent comments stay saved as a draft. The tool is off by default: turn it on with `PLANNOTATOR_AGENT_TOOL=1` or `{ "agentTool": true }` in `~/.plannotator/config.json` (the environment variable wins in both directions). OpenCode reads it when it starts.
- **The `plannotator_inbox` tool (off by default)**: the agent writes to your Plannotator Inbox and reads your answers there: `send_message` (a question, a note, files to annotate as attachments), `read_thread`, `search` (messages by their words), `wait_for_reply`, the project's decisions and guided reviews, as your Inbox offers them when OpenCode starts. On OpenCode 2, pressing Send on a reply wakes the session that sent the message: the reply is queued as its own turn once the session is idle, never steered into a running one, and the thread shows "Delivered to OpenCode". On OpenCode 1 the agent has the tool but is not woken; it reads replies with `read_thread` or `wait_for_reply`. The tool appears only when an Inbox is installed (you ran `plannotator inbox` once) and the `inboxTool` setting is on for OpenCode. It is off by default, because OpenCode sends every tool's full definition with each request. Turn it on with `export PLANNOTATOR_INBOX_TOOL=1`, or with `{ "inboxTool": { "opencode": true } }` in `~/.plannotator/config.json` (the Inbox's Settings writes this key; the environment variable wins). OpenCode reads it when it starts.
- **Obsidian integration**: Auto-save approved plans to your vault with frontmatter and tags

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PLANNOTATOR_REMOTE` | Set to `1` / `true` for remote mode, `0` / `false` for local mode, or leave unset for SSH auto-detection. Uses a fixed port in remote mode; browser-opening behavior depends on the environment. |
| `PLANNOTATOR_PORT` | Fixed port to use. Default: random locally, `19432` for remote sessions. |
| `PLANNOTATOR_BROWSER` | Custom browser to open plans in. macOS: app name or path. Linux/Windows: executable path. `none` (also `false`, `0`, `off`, `no`, `true`, `1`, `:`) opens no browser at all; the session URL is always printed. |
| `PLANNOTATOR_SHARE_URL` | Custom share portal URL for self-hosting. Default: `https://share.plannotator.ai`. |
| `PLANNOTATOR_PASTE_URL` | Custom paste service URL for self-hosting. Default: `https://plannotator-paste.plannotator.workers.dev`. |
| `PLANNOTATOR_PLAN_TIMEOUT_SECONDS` | Timeout for `submit_plan` review wait. Default: `345600` (96h). Set `0` to disable timeout. |
| `PLANNOTATOR_INBOX_TOOL` | Set to `1` to give the agent the `plannotator_inbox` tool when an Inbox is installed, `0` to keep it out. Wins over `inboxTool` in `~/.plannotator/config.json`. Default: off. |
| `PLANNOTATOR_BIN` | Override the CLI path used by the OpenCode plugin's CLI runtime fallback. Default: `plannotator` on `PATH`. |

## Devcontainer / Docker

Works in containerized environments. Set the env vars and forward the port:

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

If nothing opens automatically, open `http://localhost:9999` when `submit_plan` is called.

See [devcontainer.md](./devcontainer.md) for full setup details.

## Obsidian Integration

Save approved plans directly to your Obsidian vault.

1. Open Settings in Plannotator UI
2. Enable "Obsidian Integration" and select your vault
3. Approved plans save automatically with:
   - Human-readable filenames: `Title - Jan 2, 2026 2-30pm.md`
   - YAML frontmatter (`created`, `source`, `tags`)
   - Auto-extracted tags from plan title and code languages
   - Backlink to `[[Plannotator Plans]]` for graph view
  
<img width="1190" height="730" alt="image" src="https://github.com/user-attachments/assets/5036a3ea-e5e8-426c-882d-0a1d991c1625" />


## Links

- [Website](https://plannotator.ai)
- [GitHub](https://github.com/backnotprop/plannotator)
- [Claude Code Plugin](https://github.com/backnotprop/plannotator/tree/main/apps/hook)

## License

Copyright 2025 backnotprop Licensed under [MIT](../../LICENSE-MIT) or [Apache-2.0](../../LICENSE-APACHE).

```

---

## Assistant (Plan · Claude Sonnet 5 · 61.1s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/v2/docs/plugins/",
  "format": "markdown"
}
```

**Output:**
```
# Plugins

Add published packages, versioned packages, scoped packages, or local plugin directories to `opencode.json(c)`.

## Configure

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "opencode-acme-plugin",
    "opencode-acme-plugin@1.2.0",
    "@acme/opencode-plugin",
    "./plugins/local",
    "../shared/plugin.ts",
    "/absolute/path/plugin.ts",
    "file:///home/me/plugins/local",
    {
      "package": "@acme/opencode-plugin",
      "options": {
        "agent": "reviewer",
        "strict": true,
      },
    },
  ],
}
```

Relative paths resolve from the config file containing the entry. Plugin arrays from applicable config files are applied
from lowest to highest precedence instead of replacing one another.

```text
~/.config/opencode/opencode.jsonc
./opencode.jsonc
./.opencode/opencode.jsonc
```

## Discover

OpenCode also loads direct `.ts` and `.js` files and immediate plugin package directories from every discovered
`.opencode/plugins/` directory.

```text
.opencode/
└── plugins/
    ├── concise.ts
    ├── reviewer.js
    └── acme-package/
```

Global plugins use the same discovery layout under the OpenCode config directory.

```text
~/.config/opencode/plugins/
```

A `plugins/` directory beside a project-root `opencode.json(c)` is not discovered automatically; configure its files
explicitly or move it under `.opencode/`.

```jsonc title="opencode.jsonc"
{
  "plugins": ["./plugins/local"]
}
```

## Control

Plugin entries are processed in order. Prefix an ID or wildcard with `-` to disable it, use `*` for every plugin, and
use `.*` to match an ID prefix. A later ID re-enables a plugin.

```jsonc title="opencode.jsonc"
{
  "plugins": ["*", "-opencode.provider.*", "opencode.provider.openai", "-acme.reviewer"]
}
```

Two built-in plugins ignore removals so that a repository cannot switch off
[policy](/policies) enforcement: `opencode.config.policy` and
`opencode.provider.opencode`, the Console connection that delivers organization
policy.

## Manage

Install, list, check, update, or remove global package plugins with the CLI.

```sh
opencode plugin add opencode-acme-plugin@1.2.0
opencode plugin list
opencode plugin list --builtin
opencode plugin check
opencode plugin update
opencode plugin update opencode-acme-plugin
opencode plugin remove opencode-acme-plugin@1.2.0
```

`plugin check` checks server and TUI-only package plugins for updates. `plugin update` updates every outdated package;
pass a configured package target to check or update only that package. Local plugins and exact package revisions are skipped.

Package installation accepts npm names with versions, tags, or ranges, plus npm-compatible Git package specifications.
Git repositories can use hosted shortcuts, HTTPS, or SSH, including private repositories available through your existing
Git credentials.

```sh
opencode plugin add @acme/opencode-plugin@latest
opencode plugin add github:acme/opencode-plugin
opencode plugin add git+ssh://git@github.com/acme/opencode-plugin.git#main
opencode plugin add 'github:acme/plugins#main::path:packages/opencode-plugin'
```

Branches, tags, complete commit hashes, and npm's `::path:` repository-subdirectory selectors are supported. Configure
local paths directly; tarball and npm alias targets are not accepted by `plugin add`.

## Reload

Changes under watched config directories reload automatically. Server startup loads cached package plugins immediately,
installs missing packages in the background, and checks unpinned npm and Git plugins for updates without changing the
installed package. Exact npm versions and full Git commit hashes stay pinned. Changes to unwatched local dependencies may
still require restarting OpenCode.

```sh
touch .opencode/plugins/concise/index.ts
opencode service restart
```

## Terminal

CLI-only plugins are configured separately and remain active when connected to a remote server.

```json title="cli.json"
{
  "plugins": ["opencode-acme-cli"]
}
```

<Card title="Build a plugin" href="/build/plugins">
  Create plugins that add tools, hooks, integrations, commands, agents, and other behavior.
</Card>
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/v2/docs/config/",
  "format": "markdown"
}
```

**Output:**
```
# Config

Create `opencode.jsonc` in your project to configure OpenCode. Add the schema for editor validation, then set only the options you need.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
}
```

You can also ask OpenCode to update this file for you.

## Format

OpenCode supports JSON and JSONC. Use JSONC when you want comments or trailing commas.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  // Use this model by default.
  "model": "anthropic/claude-sonnet-4-5",
}
```

## Locations

Put managed, machine-wide settings in the system configuration directory:

| Platform | Directory                               |
| -------- | --------------------------------------- |
| macOS    | `/Library/Application Support/opencode` |
| Linux    | `/etc/opencode`                         |
| Windows  | `%ProgramData%\opencode`                |

The system directory works like the global directory. Besides
`opencode.json(c)`, it loads `agents/`, `commands/`, `skills/`, and `plugins/`
for every user on the machine:

```text
/etc/opencode/
├── opencode.json
├── agents/review.md
├── commands/release.md
└── skills/deploy/SKILL.md
```

On macOS, OpenCode also reads managed preferences that MDM tools deploy for the
`ai.opencode.managed` domain. A user-specific profile replaces the
machine-wide one:

```text
/Library/Managed Preferences/<user>/ai.opencode.managed.plist
/Library/Managed Preferences/ai.opencode.managed.plist
```

Managed settings have the highest precedence, so users and projects cannot
override the values they set, and managed preferences override the system
directory. Settings alone cannot stop users from adding providers, MCP servers,
agents, or plugins; use [policies](/policies#precedence) in managed
configuration to enforce restrictions.

Put user settings for every project in the global configuration:

```text
~/.config/opencode/opencode.json(c)
```

Put project settings in either of these files:

```text
/home/user/projects/my-app/opencode.json(c)
/home/user/projects/my-app/.opencode/opencode.json(c)
```

OpenCode searches from the current directory to the filesystem root. It first
merges direct `opencode.json(c)` files from the farthest directory to the
closest, then merges files inside `.opencode` directories in the same order.
This means every discovered `.opencode` config overrides every direct config.
Use one form throughout a directory tree unless you need that behavior.

For example, start OpenCode from `/home/user/projects/acme/packages/web`:

```text
/etc/opencode/opencode.json
~/.config/opencode/opencode.json

/home/user/projects/acme/
├── opencode.json
└── packages/
    └── web/
        ├── opencode.json
        └── src/
```

OpenCode applies these files from lowest to highest precedence:

1. `~/.config/opencode/opencode.json`
2. `/home/user/projects/acme/opencode.json`
3. `/home/user/projects/acme/packages/web/opencode.json`
4. `/etc/opencode/opencode.json`

The package config overrides matching settings from the repository config,
which overrides the global config. The system config overrides all of them.
Settings that do not conflict are preserved. [Policies](/policies#precedence)
from global and project files evaluate in the reverse order, and system
policies outrank all of them.

## Schema

The complete OpenCode configuration schema is available at
[opencode.ai/config.json](https://opencode.ai/config.json).

Add the `$schema` field to your configuration file to enable validation and
autocomplete in editors that support JSON Schema:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json"
}
```

Use the schema as the source of truth for available fields, accepted values,
and nested configuration shapes.

### Shell

Set the shell used by the terminal and shell tools.

```jsonc
{
  "shell": "/bin/zsh",
}
```

### Model

Set the default model in `provider/model` format. The root default currently
does not retain a `#variant`; agent and command model references can select one.

```jsonc
{
  "model": "anthropic/claude-sonnet-4-5",
}
```

See the [models guide](/models) for model selection and local models.

### Agent

Choose the primary agent used when a session does not select one explicitly.

```jsonc
{
  "default_agent": "build",
}
```

See the [agents guide](/agents) for built-in and custom
agents.

### Updates

Control update checks from the global config. Set `update` to `"disable"` to
skip them, `"notify"` to show available updates before installing them, or
`"auto"` to install updates automatically. When omitted, `update` defaults to `"notify"`.

Automatic installation does not restart a running server. Restart it manually to activate the installed update.
Project-level values are ignored.

```jsonc
{
  "update": "notify",
}
```

### Username

Set a username. OpenCode accepts this field but does not display it in
conversations.

```jsonc
{
  "username": "alice",
}
```

### Permissions

Define ordered rules that allow, deny, or ask before an agent uses a tool on a
matching resource.

```jsonc
{
  "permissions": [
    {
      "action": "shell",
      "resource": "git push *",
      "effect": "ask",
    },
  ],
}
```

See the [permissions guide](/permissions) for rule matching and available actions.

### Policies

Allow or deny use of a provider, hard-deny a permission check, or block an MCP
server, skill, or plugin, with ordered statements that broader configuration can
override.

```jsonc
{
  "policies": [
    { "action": "provider.use", "resource": "*", "effect": "deny" },
    { "action": "provider.use", "resource": "anthropic", "effect": "allow" },
    { "action": "tool.use", "resource": "shell:git push *", "effect": "deny" },
  ],
}
```

See the [policies guide](/policies) for matching, precedence across configuration
files, and Console-managed policy.

### Agents

Override built-in agents or define specialized agents with their own model,
instructions, mode, and permissions.

```jsonc
{
  "agents": {
    "reviewer": {
      "description": "Review changes without editing files",
      "mode": "subagent",
      "system": "Focus on correctness, security, and missing tests.",
      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" }],
    },
  },
}
```

See the [agents guide](/agents) for all agent options and file-based agents.

### Snapshots

Enable or disable filesystem snapshots used by undo and revert behavior.

```jsonc
{
  "snapshots": false,
}
```

See the [snapshots guide](/snapshots) for undo and redo behavior.

### Watcher

Ignore files and directories that should not trigger filesystem updates.

```jsonc
{
  "watcher": {
    "ignore": ["dist/**", "coverage/**"],
  },
}
```

### Formatter

Format files after the `write`, `edit`, or `patch` tools change them. Set
`formatter` to `true` to enable available built-in formatters.

```jsonc
{
  "formatter": true,
}
```

See the [formatters guide](/formatters) for built-ins and custom formatters.

### Media

Control how oversized images loaded by the `read` tool are resized or rejected
before they are sent to a model.

```jsonc
{
  "media": {
    "image": {
      "auto_resize": true,
      "max_width": 2000,
      "max_height": 2000,
      "max_base64_bytes": 5242880,
    },
  },
}
```

See the [attachments guide](/attachments) for image processing and limits.

### Output

Set the maximum number of lines and bytes retained from a tool result.

```jsonc
{
  "tool_output": {
    "max_lines": 2000,
    "max_bytes": 51200,
  },
}
```

### Search

Choose how OpenCode searches the web. Use `"random"` to select an available
provider automatically.

```jsonc
{
  "websearch": {
    "provider": "random",
  },
}
```

See the [websearch guide](/websearch) for providers, credentials, selection,
rate limits, and disabling search.

### MCP

Configure local and remote Model Context Protocol servers. Global
`mcp.timeout` values apply to servers defined in configuration files; each
server's `timeout` overrides them.

```jsonc
{
  "mcp": {
    "servers": {
      "playwright": {
        "type": "local",
        "command": ["bunx", "@playwright/mcp"],
      },
    },
  },
}
```

See the [MCP guide](/mcp-servers) for remote servers, OAuth, environment variables, and timeouts.

### Compaction

Control automatic context compaction and how much recent context it preserves.

```jsonc
{
  "compaction": {
    "auto": true,
    "keep": {
      "tokens": 15000,
    },
    "buffer": 20000,
  },
}
```

Local summaries remain the default. Opt into native provider compaction for both
automatic and manual requests with a provider or model policy:

```jsonc
{
  "providers": {
    "openai": {
      "settings": { "compaction": { "type": "native" } },
      "models": {
        "gpt-4.1": { "settings": { "compaction": { "type": "summary" } } },
      },
    },
  },
}
```

A model setting overrides the provider setting. Automatic compaction uses the
selected model's usable input budget. Provider checkpoints keep recent user messages within the same
`compaction.keep.tokens` budget that local summaries use for their retained tail.
Top-level `compaction.auto: false` disables new automatic compaction without
discarding installed checkpoints. See the [compaction guide](/compaction) for
budgeting and overflow recovery.

### Warming

Keep recently active model sessions warm with periodic transient requests.
Warming is disabled by default; set it to `true` to use the four-minute idle
interval and 30-minute active window.

```jsonc
{
  "warming": {
    "prompt": "Do not perform any work. Reply with exactly: OK",
    "interval": "4 minutes",
    "duration": "30 minutes",
  },
}
```

See the [warming guide](/warming) for request behavior, customization,
and cost considerations.

### Skills

Add directories or URLs that OpenCode should search for agent skills.

```jsonc
{
  "skills": ["./team-skills", "https://example.com/.well-known/skills/"],
}
```

See the [skills guide](/skills) for skill structure and automatic discovery under `.opencode/skills/`.

### Commands

Define reusable slash commands as named prompt templates.

```jsonc
{
  "commands": {
    "review": {
      "description": "Review the current changes",
      "template": "Review the current diff for correctness and missing tests.",
    },
  },
}
```

See the [commands guide](/commands) for arguments, models, agents, and file-based commands.

### Instructions

Declare additional instruction files, globs, or HTTP(S) URLs. OpenCode loads
them alongside discovered `AGENTS.md` files.

```jsonc
{
  "instructions": ["CONTRIBUTING.md", "docs/guidelines/*.md"],
}
```

See the [instructions guide](/instructions) for project instructions and `AGENTS.md`.

### References

Make local directories or Git repositories available as named supporting
context.

```jsonc
{
  "references": {
    "docs": {
      "path": "../product-docs",
      "description": "Product behavior and terminology",
    },
    "effect": {
      "repository": "Effect-TS/effect",
      "branch": "main",
    },
  },
}
```

See the [references guide](/references) for shorthand, visibility, and path resolution.

### Worktrees

Set the parent directory for new local worktrees. OpenCode appends the requested or generated worktree name.

```jsonc
{
  "worktree": {
    "directory": "../worktrees",
  },
}
```

Relative paths resolve against the project's saved canonical checkout. This applies to global and project
configuration alike; absolute paths are used as-is, and `~/` resolves
against the user's home directory.

For example, this global configuration places new worktrees under each project's own `.lane/trees/` directory:

```jsonc
{
  "worktree": {
    "directory": ".lane/trees",
  },
}
```

Without this setting, creation uses the server's data directory under `worktree/<first-six-project-ID-characters>`.
Worktree creation and refresh load configuration from the project's saved canonical checkout, including when other
clones share its project ID. Changing it does not move existing worktrees.

Git is the built-in default. A [plugin](/build/plugins#worktrees) that registers a strategy automatically becomes the
default in that plugin runtime. Project operations use the canonical checkout's runtime. Strategy-specific options
belong to that plugin, not the `worktree` config object.

### Plugins

Load plugins from packages or local plugin directories. Use the object form when a plugin
accepts options.

```jsonc
{
  "plugins": [
    "opencode-example-plugin",
    {
      "package": "./plugins/local",
      "options": {
        "enabled": true,
      },
    },
  ],
}
```

See the [plugins guide](/plugins) for plugin loading and configuration.

### Providers

Configure providers and add or override their models, request settings,
headers, and model variants.

```jsonc
{
  "providers": {
    "openai": {
      "models": {
        "gpt-5.2-custom": {
          "modelID": "gpt-5.2",
          "name": "GPT-5.2 Custom",
          "limit": {
            "context": 200000,
            "output": 32000,
          },
        },
      },
    },
  },
}
```

Provider `settings.transport: "websocket"` selects its session WebSocket.

See the [providers guide](/providers) for credentials, custom endpoints, provider packages, the WebSocket transport, and model configuration.

## Variables

You can use variable substitution in your config files to reference environment variables and file contents. Place references inside JSON strings.

### Env vars

Use `{env:VARIABLE_NAME}` to substitute environment variables:

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{env:OPENCODE_MODEL}",
  "providers": {
    "anthropic": {
      "settings": {
        "apiKey": "{env:ANTHROPIC_API_KEY}",
      },
    },
  },
}
```

If the environment variable is not set, it will be replaced with an empty string.

### Files

Use `{file:path/to/file}` to substitute the contents of a file:

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "providers": {
    "openai": {
      "settings": {
        "apiKey": "{file:~/.secrets/openai-key}",
      },
    },
  },
}
```

File paths can be:

- Relative to the config file directory
- Absolute, or starting with `~/` for your home directory

If the file does not exist, it will be replaced with an empty string.

These are useful for:

- Keeping sensitive data like API keys in separate files.
- Sharing common configuration snippets across multiple config files.

## Experimental

<Callout type="warning">
  Experimental settings may change, break, or be removed in any release without notice. Don't rely on them for stable
  workflows.
</Callout>

All experimental settings live under the `experimental` key:

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "experimental": {
    "todo": true,
    "subagent_depth": 2,
    "portable_shell_scanner": true,
    "location_idle_timeout": "4 hours",
  },
}
```

### Todos

Set `todo` to `true` to give agents a `todowrite` tool for tracking multi-step work. Defaults to `false`.

### Subagent depth

`subagent_depth` sets how deeply subagents can start their own subagents. Defaults to `1`, so a subagent cannot
start another subagent.

### Portable shell scanner

Set `portable_shell_scanner` to `true` to replace the default tree-sitter shell scanner used by permission checks.
Defaults to `false`. See [Permissions](/permissions#scanner) for how it behaves.

### Location idle timeout

`location_idle_timeout` controls how long a project location can go without session activity before OpenCode unloads
its services. It takes a duration such as `"2 hours"` and defaults to `"60 minutes"`. Running sessions and background
jobs keep a location loaded. Set it to `false` to never unload idle locations. Project config can override the global
value.

```jsonc
{
  "experimental": {
    "location_idle_timeout": false,
  },
}
```

### Deprecated policies

`experimental.policies` is deprecated. Use top-level [`policies`](/policies) instead. The old key still works and
merges into `policies`.
```

---

## Assistant (Plan · Claude Sonnet 5 · 8.2s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/v2/docs/build/plugins/",
  "format": "markdown"
}
```

**Output:**
```
# Overview

Plugins can modify OpenCode's behavior and add new features. To change the terminal UI, build a [CLI
plugin](/build/plugins/cli).

Migrating an existing OpenCode 1 plugin? Follow the [V1 plugin migration guide](/build/plugins/migrate-v1).

```ts title=".opencode/plugins/example/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  async setup(ctx) {
    await ctx.storage.set("loaded", true)
  },
})
```

Plugins under `.opencode/plugins/` are loaded automatically, like the local example above. To load published packages
or plugin directories from other locations, add them to `plugins` in `opencode.json(c)`:

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "opencode-acme-plugin",
    "opencode-acme-plugin@1.2.0",
    "@acme/opencode-plugin",
    "./plugins/local",
    "../shared/plugin",
    "/absolute/path/plugin",
    "file:///home/me/plugins/local",
    {
      "package": "@acme/opencode-plugin",
      "options": {
        "agent": "reviewer",
        "strict": true,
      },
    },
  ],
}
```

See [Configure plugins](/plugins) for more loading and configuration options.

## Lifecycle

`setup` runs when the plugin loads. It may return a cleanup function that runs when the plugin unloads.

```ts
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  setup(ctx) {
    console.log(`loaded in OpenCode ${ctx.app.version}`)
    return () => console.log("unloaded")
  },
})
```

### Context

The plugin context is essentially an [OpenCode server client](/build/client).
Its read and action methods use the same inputs and responses as the client. It
adds plugin-only methods for transforms, runtime hooks, reloads, registrations,
and plugin options.

```ts
setup(ctx) {
  console.log(ctx.app.version)
}
```

`ctx.location` describes the location where this plugin instance is loaded. It
includes `directory`, optional `workspaceID`, and `project` metadata (`id`,
`directory`, and `canonical`). It is available in both Promise and Effect plugins.
This is the plugin instance's location, not the location of every session it can
access or event it receives.

```ts
setup(ctx) {
  console.log(ctx.location.directory)
  console.log(ctx.location.project.canonical)
}
```

### Options

Pass plugin options with the object form in `opencode.json(c)`.

```jsonc title="opencode.jsonc"
{
  "plugins": [
    {
      "package": "./plugins/company",
      "options": {
        "strict": true,
      },
    },
  ],
}
```

Read those values from `ctx.options` during `setup`.

```ts title="plugins/company/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company",
  setup(ctx) {
    const strict = ctx.options.strict === true
  },
})
```

## Transforms

Transforms are synchronous edits to OpenCode's domain state, and each builds on earlier registrations in its domain.
Registry reads such as `ctx.model.list()` reflect every registration so far, including during plugin setup;
startup batching only coalesces update notifications and never delays what a read returns. Resource status APIs still
report the state of running resources: a registered definition does not mean its connection or other resource work has
completed.

Sources contribute providers and immutable model definitions through `ctx.provider.transform`.

```ts title="plugins/models/index.ts"
import { Model, Plugin, Provider } from "@opencode/plugin"

export default Plugin.define({
  id: "company.models",
  async setup(ctx) {
    const providerID = Provider.ID.make("acme")
    const models = [{ ...Model.Info.default(providerID, Model.ID.make("reasoner")), name: "Acme Reasoner" }]
    await ctx.provider.transform((editor) => {
      editor.add({
        info: {
          ...Provider.Info.empty(providerID),
          name: "Acme",
          activation: "enabled",
          package: "@opencode/ai/providers/openai-compatible",
          settings: { baseURL: "http://127.0.0.1:8000/v1" },
        },
        models,
      })
    })

    const available = await ctx.model.list()
  },
})
```

Any registration, removal, or `reload()` marks the registry changed; the next read rebuilds it by replaying every
active transform in registration order onto a fresh value. Keep transforms cheap and repeatable. A value you have
already read is never modified by later rebuilds.

After provider transforms and availability are resolved, OpenCode materializes the active providers' models and replays
every model transform in order. A model policy can inspect the whole candidate collection, including newly refreshed
sources.

```ts title="plugins/model-budget/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company.model-budget",
  async setup(ctx) {
    await ctx.model.transform((editor) => {
      editor
        .list()
        .filter((model) => model.cost.some((tier) => tier.output > 20))
        .forEach((model) => {
          editor.remove(model.providerID, model.id)
        })
    })
  },
})
```

Captured inputs are not watched automatically. Load external data before the synchronous callback, then call
`reload()` after those inputs change. Here, `loadFromSource()` returns
`{ info: Provider.Info, models: readonly Model.Info[] }` entries.

```ts title="plugins/models/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company.models",
  async setup(ctx) {
    const source = { providers: await loadFromSource() }

    await ctx.provider.transform((editor) => {
      source.providers.forEach((provider) => editor.add(provider))
    })

    const refresh = async () => {
      source.providers = await loadFromSource()
      await ctx.provider.reload()
    }

    const timer = setInterval(() => void refresh().catch(console.error), 60_000)
    return () => clearInterval(timer)
  },
})
```

Provider changes invalidate the whole active model result, so the output-price policy still filters the refreshed models.
Use `ctx.model.reload()` when only an input captured by a model transform changes.

## API

### Agent

Read all agents or fetch one by ID.

```ts
const agents = await ctx.agent.list()
const build = await ctx.agent.get({ agentID: "build" })
```

Register a transform to inspect, update, remove, or select the default agent.

```ts
await ctx.agent.transform((editor) => {
  const agents = editor.list()
  const build = editor.get("build")

  editor.default("build")
  editor.update("build", (agent) => {
    agent.description = "Builds features and fixes bugs"
  })
  editor.remove("legacy")
})
```

Reload agents after external state used by a transform changes.

```ts
await ctx.agent.reload()
```

#### Reference

Schema: [`Agent.Info`](/api#schema-Agent.Info)

```ts
interface AgentContext {
  list(input?: AgentListInput, requestOptions?: RequestOptions): Promise<AgentListOutput>
  get(input: AgentGetInput, requestOptions?: RequestOptions): Promise<AgentGetOutput>
  transform(callback: (editor: AgentEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface AgentEditor {
  list(): readonly AgentInfo[]
  get(id: string): AgentInfo | undefined
  default(id: string | undefined): void
  update(id: string, update: (agent: AgentInfo) => void): void
  remove(id: string): void
}

interface Registration {
  dispose(): Promise<void>
}
```

### Providers

Read available providers or inspect one provider's metadata by ID.

```ts
const providers = await ctx.provider.list()
const provider = await ctx.provider.get({ providerID: "anthropic" })
```

Provider transforms edit provider settings and source definitions. Editor reads include inactive providers and expose
immutable definitions; `models.update` edits an owned copy of a source model.

```ts
await ctx.provider.transform((editor) => {
  editor.update("anthropic", (provider) => {
    provider.headers = { ...provider.headers, "x-company": "engineering" }
  })
  editor.models.update("anthropic", "claude-sonnet-4-5", (model) => {
    model.name = "Team Sonnet"
  })
  editor.models.remove("anthropic", "legacy-model")
  editor.remove("legacy-provider")
})
```

Replace a provider's source inventory with `models.set`, then reload after the captured definitions change.

```ts
const source = { models: await loadModels() }
await ctx.provider.transform((editor) => {
  editor.models.set("acme", source.models)
})

source.models = await loadModels()
await ctx.provider.reload()
```

For account-specific discovery, pass the connection used to load the inventory as `sourceConnection`. OpenCode excludes
that provider while another connection is selected, until your plugin publishes its refreshed inventory.

```ts
const connection = await ctx.integration.connection.active("acme")
if (!connection) return
const inventory = await loadInventory(connection)
await ctx.provider.transform((editor) => {
  editor.add({ info: inventory.provider, models: inventory.models, sourceConnection: connection })
})
```

#### Reference

Schemas: [`Provider.Info`](/api#schema-Provider.Info), [`Model.Info`](/api#schema-Model.Info)

```ts
interface ProviderDomain extends ProviderApi {
  transform(callback: (editor: ProviderEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ProviderRecord {
  readonly provider: Provider.Info
  readonly models: ReadonlyMap<string, Model.Info>
  readonly sourceConnection?: ConnectionInfo
}

interface ProviderEditor {
  list(): readonly ProviderRecord[]
  get(providerID: string): ProviderRecord | undefined
  add(input: { info: Provider.Info; models: readonly Model.Info[]; sourceConnection?: ConnectionInfo }): void
  update(providerID: string, update: (provider: DeepMutable<Provider.Info>) => void): void
  remove(providerID: string): void
  readonly models: {
    set(providerID: string, models: readonly Model.Info[]): void
    update(providerID: string, modelID: string, update: (model: DeepMutable<Model.Info>) => void): void
    remove(providerID: string, modelID: string): void
  }
}
```

### Models

Read available models and the default selection.

```ts
const models = await ctx.model.list()
const selected = await ctx.model.default()
```

Model transforms edit the entire active-provider candidate collection. Disabled candidates remain editable until all
transforms finish; `update` can add a model only under an available provider.

```ts
await ctx.model.transform((editor) => {
  editor.list("anthropic").forEach((model) => {
    editor.update(model.providerID, model.id, (draft) => {
      draft.enabled = draft.capabilities.tools
    })
  })
  editor.default.set("anthropic", "claude-sonnet-4-5")
  editor.remove("anthropic", "legacy-model")
})
```

Callbacks edit raw model overrides. Provider defaults are merged once when OpenCode commits the result; unchanged reads
reuse that result. `editor.provider` exposes immutable source definitions, including inactive templates, rather than
model-transform output.

```ts
await ctx.model.transform((editor) => {
  const source = editor.provider.get("anthropic")?.models.get("claude-sonnet-4-5")
  if (!source) return
  editor.update("anthropic", source.id, (model) => {
    model.limit.context = Math.min(model.limit.context, source.limit.context)
  })
})

await ctx.model.reload()
```

#### Reference

Schema: [`Model.Info`](/api#schema-Model.Info)

```ts
interface ModelDomain extends ModelApi {
  transform(callback: (editor: ModelEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ModelEditor {
  list(providerID?: string): readonly DeepMutable<Model.Info>[]
  get(providerID: string, modelID: string): DeepMutable<Model.Info> | undefined
  update(providerID: string, modelID: string, update: (model: DeepMutable<Model.Info>) => void): void
  remove(providerID: string, modelID: string): void
  readonly default: {
    get(): { providerID: string; modelID: string } | undefined
    set(providerID: string, modelID: string): void
  }
  readonly provider: {
    list(): readonly ProviderRecord[]
    get(providerID: string): ProviderRecord | undefined
  }
}
```

### Commands

Read the commands available at a location.

```ts
const commands = await ctx.command.list()
```

Register commands with a transform. The executor receives the session, prompt attachments, and requested delivery mode.

```ts
await ctx.command.transform((editor) => {
  editor.add({
    name: "security-review",
    description: "Review changes for security issues",
    execute: async ({ sessionID, prompt, delivery }) => {
      await ctx.session.prompt({
        ...prompt,
        sessionID,
        text: `Review these changes for security issues.\n\n${prompt.text}`,
        delivery,
      })
    },
  })
})
```

Reload commands after external state used by a transform changes.

```ts
await ctx.command.reload()
```

#### Reference

Schemas: [`Command.Info`](/api#schema-Command.Info),
[`Session.Inbox.Delivery`](/api#schema-Session.Inbox.Delivery)

```ts
interface CommandContext {
  list(input?: CommandListInput, requestOptions?: RequestOptions): Promise<CommandListOutput>
  transform(callback: (editor: CommandEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface CommandEditor {
  add(definition: CommandDefinition): void
}

interface CommandDefinition {
  name: string
  description?: string
  execute(input: CommandInvocation): Promise<void>
}

interface CommandInvocation {
  sessionID: string
  prompt: PromptInput
  delivery: "steer" | "queue"
}
```

### Integrations

Read integrations and inspect active credentials.

```ts
const integrations = await ctx.integration.list()
const github = await ctx.integration.get({ integrationID: "github" })
const connection = await ctx.integration.connection.active("github")
const credential = connection ? await ctx.integration.connection.resolve(connection) : undefined
```

Connect integrations with an API key.

```ts
await ctx.integration.connect.key({
  integrationID: "github",
  key: process.env.GITHUB_TOKEN!,
})
```

Start, inspect, complete, or cancel an OAuth connection attempt.

```ts
const attempt = await ctx.integration.oauth.connect({ integrationID: "github", methodID: "oauth" })
const status = await ctx.integration.oauth.status({ integrationID: "github", attemptID: attempt.data.attemptID })
await ctx.integration.oauth.complete({ integrationID: "github", attemptID: attempt.data.attemptID, code })
await ctx.integration.oauth.cancel({ integrationID: "github", attemptID: attempt.data.attemptID })
```

Command-based connections expose the same start, status, and cancel flow.

```ts
const attempt = await ctx.integration.command.connect({ integrationID: "acme", methodID: "cli" })
const status = await ctx.integration.command.status({ integrationID: "acme", attemptID: attempt.data.attemptID })
await ctx.integration.command.cancel({ integrationID: "acme", attemptID: attempt.data.attemptID })
```

Register a transform to inspect integrations and manage their authentication methods.

```ts
await ctx.integration.transform((editor) => {
  const integrations = editor.list()
  const acme = editor.get("acme")

  editor.update("acme", (integration) => {
    integration.name = "Acme"
  })
  editor.method.update({
    integrationID: "acme",
    method: { id: "cli", type: "command", label: "Sign in with Acme CLI", command: ["acme", "login"] },
  })

  const methods = editor.method.list("acme")
  const legacy = methods.find((method) => method.type === "command" && method.id === "legacy")
  if (legacy) editor.method.remove("acme", legacy)
  editor.remove("legacy")
})
```

Reload integrations after external state used by a transform changes.

```ts
await ctx.integration.reload()
```

#### Reference

Schemas: [`Integration.Info`](/api#schema-Integration.Info), [`Integration.Method`](/api#schema-Integration.Method),
[`Connection.Info`](/api#schema-Connection.Info), [`Form.Answer`](/api#schema-Form.Answer)

```ts
interface IntegrationContext {
  list(input?: IntegrationListInput, requestOptions?: RequestOptions): Promise<IntegrationListOutput>
  get(input: IntegrationGetInput, requestOptions?: RequestOptions): Promise<IntegrationGetOutput>
  connect: {
    key(input: IntegrationConnectKeyInput, requestOptions?: RequestOptions): Promise<void>
  }
  oauth: {
    connect(
      input: IntegrationOauthConnectInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationOauthConnectOutput>
    status(input: IntegrationOauthStatusInput, requestOptions?: RequestOptions): Promise<IntegrationOauthStatusOutput>
    complete(input: IntegrationOauthCompleteInput, requestOptions?: RequestOptions): Promise<void>
    cancel(input: IntegrationOauthCancelInput, requestOptions?: RequestOptions): Promise<void>
  }
  command: {
    connect(
      input: IntegrationCommandConnectInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationCommandConnectOutput>
    status(
      input: IntegrationCommandStatusInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationCommandStatusOutput>
    cancel(input: IntegrationCommandCancelInput, requestOptions?: RequestOptions): Promise<void>
  }
  transform(callback: (editor: IntegrationEditor) => void): Promise<Registration>
  reload(): Promise<void>
  connection: {
    active(integrationID: string): Promise<ConnectionInfo | undefined>
    resolve(connection: ConnectionInfo): Promise<CredentialValue | undefined>
  }
}

interface IntegrationEditor {
  list(): readonly IntegrationRef[]
  get(id: string): IntegrationRef | undefined
  update(id: string, update: (integration: IntegrationRef) => void): void
  remove(id: string): void
  method: {
    list(integrationID: string): readonly IntegrationMethod[]
    update(input: IntegrationMethodRegistration): void
    remove(integrationID: string, method: IntegrationMethod): void
  }
}
```

### Credentials

Make a saved credential the active one for its integration.

```ts
await ctx.credential.activate({ credentialID })
```

#### Reference

```ts
interface CredentialContext {
  activate(input: CredentialActivateInput, requestOptions?: RequestOptions): Promise<void>
}
```

### MCP

List MCP servers and their current connection state.

```ts
const servers = await ctx.mcp.list()
```

Plugins manage MCP servers only through transforms. Use `editor.set` to add or replace a server, `editor.update` to
change its configuration, and `editor.remove` to remove it. Inspect configuration with `editor.list` and `editor.get`.

```ts
await ctx.mcp.transform((editor) => {
  const servers = editor.list()
  const docs = editor.get("docs")
  editor.set("docs", { type: "remote", url: "https://mcp.example.com" })
  editor.update("docs", (server) => {
    server.disabled = false
  })
  editor.remove("legacy")
})
```

Set `disabled: true` in a transform to disable a server and disconnect it, or `disabled: false` to enable it and allow
OpenCode to connect. OpenCode reconciles server lifecycle from the transformed configuration.

Call `reload()` after external state used by a transform changes to reapply transforms and reconcile the servers.

```ts
await ctx.mcp.reload()
```

#### Reference

Schemas: [`Mcp.Server`](/api#schema-Mcp.Server), [`Mcp.LocalConfigEncoded`](/api#schema-Mcp.LocalConfigEncoded),
[`Mcp.RemoteConfigEncoded`](/api#schema-Mcp.RemoteConfigEncoded)

```ts
interface MCPContext {
  list(input?: McpListInput, requestOptions?: RequestOptions): Promise<McpListOutput>
  transform(callback: (editor: MCPEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface MCPEditor {
  list(): readonly (readonly [string, McpServerConfig])[]
  get(name: string): McpServerConfig | undefined
  set(name: string, config: McpServerConfig): void
  update(name: string, update: (config: McpServerConfig) => void): void
  remove(name: string): void
}
```

### Plugins

List the plugins currently active for a location.

```ts
const plugins = await ctx.plugin.list()
```

#### Reference

Schemas: [`Plugin.Info`](/api#schema-Plugin.Info), [`Plugin.Source`](/api#schema-Plugin.Source)

```ts
interface PluginContext {
  list(input?: PluginListInput, requestOptions?: RequestOptions): Promise<PluginListOutput>
}
```

### References

Read the references available at a location.

```ts
const references = await ctx.reference.list()
```

Register a transform to inspect, add, or remove local and Git references. `get(name)` returns the current configured source,
or `undefined` when the name is absent.

```ts
await ctx.reference.transform((editor) => {
  const references = editor.list()
  editor.add("handbook", { type: "local", path: "/workspace/docs/handbook" })
  editor.add("standards", { type: "git", repository: "https://github.com/acme/standards", branch: "main" })
  const handbook = editor.get("handbook")
  editor.remove("legacy")
})
```

Reload references after external state used by a transform changes.

```ts
await ctx.reference.reload()
```

#### Reference

Schemas: [`Reference.Info`](/api#schema-Reference.Info), [`Reference.LocalSource`](/api#schema-Reference.LocalSource),
[`Reference.GitSource`](/api#schema-Reference.GitSource)

```ts
interface ReferenceContext {
  list(input?: ReferenceListInput, requestOptions?: RequestOptions): Promise<ReferenceListOutput>
  transform(callback: (editor: ReferenceEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ReferenceEditor {
  list(): readonly (readonly [string, ReferenceLocalSource | ReferenceGitSource])[]
  get(name: string): ReferenceLocalSource | ReferenceGitSource | undefined
  add(name: string, source: ReferenceLocalSource | ReferenceGitSource): void
  remove(name: string): void
}
```

### Generate

Generate text with a selected model without creating a session, invoking tools, or adding to session history.

```ts
const review = await ctx.generate.text({
  model: { providerID: "anthropic", id: "claude-sonnet-4-6" },
  prompt: "Review this proposed action.",
})
```

### Permissions

Ask for permission before performing an action. `assert` evaluates the session's [permission rules](/permissions),
including saved approvals, and prompts the user when a rule resolves to `ask`. It resolves once the action is allowed.

```ts
execute: async (input, context) => {
  await ctx.permission.assert({
    sessionID: context.sessionID,
    agent: context.agent,
    source: { type: "tool", messageID: context.messageID, id: context.id },
    action: "deploy",
    resources: [input.environment],
    save: [input.environment],
  })
  return { content: await deploy(input.environment) }
}
```

- `action` and `resources` are matched against the rules. Any `deny` blocks the action; otherwise any `ask` prompts.
- `save` lists the patterns stored when the user chooses to always allow.
- `agent` selects whose rules apply and defaults to the session's agent. `source` attaches the prompt to a tool call.
- `metadata` passes extra detail to permission prompts and `evaluate` hooks.

A deny rule or a rejection with feedback rejects with a `Tool.Error` that carries the reason, so the model sees it and
continues. A plain rejection ends the current step. Let these errors propagate rather than returning them as tool
output.

Inspect or resolve pending permission requests.

```ts
const pending = await ctx.permission.list({ sessionID })
const request = await ctx.permission.get({ sessionID, requestID })
await ctx.permission.reply({ sessionID, requestID, reply: "once" })
```

Replace the session-scoped permission rules. They are evaluated after the agent's rules, and the
last matching rule wins. Child sessions inherit the rules in effect when they are created.

```ts
await ctx.session.update({
  sessionID,
  permissions: [{ action: "edit", resource: "/path/to/original/checkout/**", effect: "deny" }],
})
```

### Sessions

Create or read a session.

```ts
const created = await ctx.session.create({ title: "Review" })
const session = await ctx.session.get({ sessionID })
const messages = await ctx.session.context({ sessionID })
```

List sessions a page at a time. To get the next page, pass `cursor.next` back as `cursor`. The cursor remembers your
filters, so you don't need to repeat them.

```ts
const page = await ctx.session.list({ directory: ctx.location.directory, limit: 20 })
const next = page.cursor.next ? await ctx.session.list({ cursor: page.cursor.next, limit: 20 }) : undefined
```

Change the agent or model used by subsequent requests.

```ts
await ctx.session.switchAgent({ sessionID, agent: "build" })
await ctx.session.switchModel({ sessionID, model: { providerID: "anthropic", id: "claude-sonnet-4-5" } })
```

Send user prompts, transient generation requests, commands, or synthetic messages.

```ts
const prompt = await ctx.session.prompt({ sessionID, text: "Review the current changes" })
const generated = await ctx.session.generate({ sessionID, prompt: "Summarize this project" })
const command = await ctx.session.command({ sessionID, command: "review", arguments: "--staged" })
const synthetic = await ctx.session.synthetic({ sessionID, text: "Deployment completed" })
```

Rename, interrupt, or wait for a session.

```ts
await ctx.session.update({ sessionID, title: "Review" })
await ctx.session.interrupt({ sessionID, continue: false })
await ctx.session.wait({ sessionID })
```

Remove a temporary session with `remove`. Removal stops active execution and recursively deletes child sessions.

```ts
await ctx.session.remove({ sessionID })
```

Request compaction with `compact`. It returns the admitted inbox item, not a completed summary; compaction runs at
the next step boundary by default. Pass `delivery: "queue"` to preserve queue order instead.

```ts
const compaction = await ctx.session.compact({ sessionID })
```

#### Reference

Schemas: [`Session.Info`](/api#schema-Session.Info), [`Model.Ref`](/api#schema-Model.Ref),
[`Session.Inbox.User`](/api#schema-Session.Inbox.User), [`Session.Inbox.Synthetic`](/api#schema-Session.Inbox.Synthetic)

```ts
interface SessionContext {
  create(input?: SessionCreateInput, requestOptions?: RequestOptions): Promise<SessionInfo>
  get(input: SessionGetInput, requestOptions?: RequestOptions): Promise<SessionInfo>
  remove(input: SessionRemoveInput, requestOptions?: RequestOptions): Promise<void>
  context(input: SessionContextInput, requestOptions?: RequestOptions): Promise<readonly SessionMessageInfo[]>
  switchAgent(input: SessionSwitchAgentInput, requestOptions?: RequestOptions): Promise<void>
  switchModel(input: SessionSwitchModelInput, requestOptions?: RequestOptions): Promise<void>
  update(input: SessionUpdateInput, requestOptions?: RequestOptions): Promise<void>
  move(input: SessionMoveInput, requestOptions?: RequestOptions): Promise<void>
  prompt(input: SessionPromptInput, requestOptions?: RequestOptions): Promise<SessionInboxUser>
  generate(input: SessionGenerateInput, requestOptions?: RequestOptions): Promise<{ text: string }>
  command(input: SessionCommandInput, requestOptions?: RequestOptions): Promise<SessionInboxUser>
  compact(input: SessionCompactInput, requestOptions?: RequestOptions): Promise<SessionInboxCompaction>
  synthetic(input: SessionSyntheticInput, requestOptions?: RequestOptions): Promise<SessionInboxSynthetic>
  interrupt(input: SessionInterruptInput, requestOptions?: RequestOptions): Promise<void>
  wait(input: SessionWaitInput, requestOptions?: RequestOptions): Promise<void>
}
```

### Skills

Read the skills available at a location.

```ts
const skills = await ctx.skill.list()
```

Register a transform to inspect, add, update, or remove skills. `get(id)` returns the current editor entry, or `undefined`
when the skill is absent.

```ts
await ctx.skill.transform((editor) => {
  const skills = editor.list()
  editor.add({
    id: "review",
    name: "Review",
    description: "Review the current changes",
    path: "/workspace/.opencode/skills/review/SKILL.md",
    content: "Review the current changes for correctness and missing tests.",
  })
  const review = editor.get("review")
  editor.update("review", (skill) => {
    skill.autoinvoke = true
  })
  editor.remove("legacy")
})
```

Reload skills after external state used by a transform changes.

```ts
await ctx.skill.reload()
```

#### Reference

Schema: [`Skill.Info`](/api#schema-Skill.Info)

```ts
interface SkillContext {
  list(input?: SkillListInput, requestOptions?: RequestOptions): Promise<SkillListOutput>
  transform(callback: (editor: SkillEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface SkillEditor {
  list(): readonly SkillInfo[]
  get(id: string): SkillInfo | undefined
  add(skill: SkillInfo): void
  update(id: string, update: (skill: SkillInfo) => void): void
  remove(id: string): void
}
```

### Storage

Store, read, or remove durable JSON values scoped to the plugin.

```ts
await ctx.storage.set("settings", { strict: true })
const settings = await ctx.storage.get("settings")
await ctx.storage.remove("settings")
```

Scan keys by prefix with optional cursor pagination.

```ts
const page = await ctx.storage.scan({ prefix: "cache/", limit: 100 })
const next = page.next
```

#### Reference

```ts
interface StorageContext {
  get(key: string): Promise<Json | undefined>
  set(key: string, value: Json): Promise<void>
  remove(key: string): Promise<void>
  scan(options: StorageScanOptions): Promise<StorageScanResult>
}

interface StorageScanOptions {
  prefix: string
  after?: string
  limit?: number
}

interface StorageScanResult {
  entries: readonly { key: string; value: Json }[]
  next?: string
}
```

### Tools

Read the tools currently registered, after every transform, outside of a transform callback. Each tool has an `id`
containing its effective name.

```ts
const tools = await ctx.tool.list()
const read = tools.find((tool) => tool.id === "read")
```

Register, update, and remove tools with a synchronous transform, including in Promise plugins. Load external data
before registering or reloading. A later valid registration overrides the same effective tool name.

```ts
const registration = await ctx.tool.transform((editor) => {
  editor.namespace({
    name: "acme",
    description: "Customer account tools",
  })
  editor.add({
    name: "greeting",
    description: "Create a greeting",
    input: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
      additionalProperties: false,
    },
    options: { namespace: "acme", codemode: true },
    execute: async (input, context) => {
      await context.progress({ status: "greeting" })
      return { content: `Hello ${(input as { name: string }).name}!` }
    },
  })
})
```

Promise tool executors receive `context.signal`. Pass it to cancellable work such as `fetch` so stopping the Session
also stops the underlying operation.

```ts
execute: async ({ url }, context) => {
  const response = await fetch(url, { signal: context.signal })
  return { content: await response.text() }
}
```

Call `reload()` after changing source data captured by the callback. Reload replays the active transforms without
changing their order; it does not rerun plugin setup.

```ts
await ctx.tool.reload()
```

Use `list()` and `get()` to inspect tools currently in the editor. Tools have an `id` containing their effective name,
and `get()` returns `undefined` when that ID is not present. Use `update` and `remove` with the effective tool name,
including its namespace (`acme_greeting` above). Dots in
namespaces and unsupported characters in tool names become `_`. Missing names are ignored; creating a tool requires
`add` with a complete definition. Updates preserve the name and namespace. Assign new schemas or options to replace
them rather than mutating nested values. Invalid updates are logged and leave the previous definition intact.

```ts
await ctx.tool.transform((editor) => {
  editor.update("acme_greeting", (tool) => {
    tool.description = "Greet the user by name"
  })
  editor.remove("acme_obsolete")
})
```

Updates and removals replay in order with additions, including after MCP catalog refreshes. Disposing their
registration removes those changes and rebuilds from the remaining transforms.

Dispose a registration to remove its transform and rebuild from the remaining transforms, revealing any earlier
definition it overrode. Disposal is idempotent, and unloading the plugin also disposes its registrations.

```ts
await registration.dispose()
```

Each model request captures a stable, executable tool snapshot. Later transforms, reloads, and disposal affect future
snapshots, not the definitions, Code Mode namespace descriptions, or executors already captured. Executors that close
over mutable plugin data still observe that data; capture a value inside the transform when it must remain tied to
that definition.

#### Reference

Schemas: [`Tool.Content`](/api#schema-Tool.Content), [`Tool.TextContent`](/api#schema-Tool.TextContent),
[`Tool.FileContent`](/api#schema-Tool.FileContent)

```ts
interface ToolContext {
  list(): Promise<readonly (ToolInfo & { readonly id: string })[]>
  transform(callback: (editor: ToolEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ToolEditor {
  list(): readonly (ToolInfo & { readonly id: string })[]
  get(id: string): (ToolInfo & { readonly id: string }) | undefined
  namespace(namespace: { name: string; description: string }): void
  add(tool: ToolInfo): void
  update(id: string, update: (tool: Types.Mutable<ToolInfo>) => void): void
  remove(id: string): void
}
```

### VCS

Read repository information, working-copy status, or file diffs.

```ts
const info = await ctx.vcs.get()
const branches = await ctx.vcs.branches({ search: "feature", limit: 10 })
const changes = await ctx.vcs.status()
const diff = await ctx.vcs.diff({ mode: "working", context: 3 })
```

Register a location-scoped VCS provider with a transform. A provider matching the detected repository type is selected
automatically; use `editor.default.set` to select a different provider.

```ts
await ctx.vcs.transform((editor) => {
  editor.add({
    id: "custom",
    name: "Custom VCS",
    info: async () => ({ branch: { current: "feature", default: "main" } }),
    branches: async (input, { signal }) => readBranches(input, signal),
    status: async (scope, { signal }) => readStatus(scope.worktree, signal),
    diff: async (input, { signal }) => readDiff(input, signal),
  })
  editor.default.set("custom")
})
```

Provider callbacks receive the current location, working-copy root, canonical project root, and optional repository
store. Diff callbacks also receive the selected mode, requested context, and output byte budget. Repository discovery
continues to use OpenCode's built-in Git and Mercurial detectors.

Providers can optionally implement `init(scope, { signal })` to create a repository in `scope.worktree`. Initialization
selects the provider by ID (Git by default), not by the detected repository type. Register a provider with `init` even
when the location has no repository yet; OpenCode checks that the directory exists and has no repository before calling
it, then rediscovers the project. New repository formats still need discovery support beyond this callback.

#### Reference

Schemas: [`Vcs.Info`](/api#schema-Vcs.Info), [`Vcs.FileStatus`](/api#schema-Vcs.FileStatus),
[`FileDiff.Info`](/api#schema-FileDiff.Info)

```ts
interface VcsContext {
  get(input?: VcsGetInput, requestOptions?: RequestOptions): Promise<VcsGetOutput>
  branches(input?: VcsBranchesInput, requestOptions?: RequestOptions): Promise<VcsBranchesOutput>
  status(input?: VcsStatusInput, requestOptions?: RequestOptions): Promise<VcsStatusOutput>
  diff(input: VcsDiffInput, requestOptions?: RequestOptions): Promise<VcsDiffOutput>
  transform(callback: (editor: VcsEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface VcsEditor {
  add(definition: VcsDefinition): void
  default: {
    get(): string | undefined
    set(providerID: string): void
  }
}

interface VcsDefinition {
  init?(scope: VcsScope, context: { signal: AbortSignal }): Promise<void>
  // Existing info, branches, status, and diff callbacks are required.
}
```

### Worktrees

Register a local worktree strategy using the normal plugin lifecycle. The implementation module in this example owns
option validation and the backend's `create`, `remove`, and `list` operations.

```ts title="plugins/worktrees/index.ts"
import { Plugin } from "@opencode/plugin"
import { makeStrategy } from "./strategy"

export default Plugin.define({
  id: "company.worktrees",
  async setup(ctx) {
    const strategy = makeStrategy(ctx.options)
    await ctx.worktree.transform((editor) => {
      editor.add(strategy)
    })
  },
})
```

Load the plugin through `plugins` and configure the common destination separately:

```jsonc title="opencode.jsonc"
{
  "worktree": { "directory": "../worktrees" },
  "plugins": [{ "package": "./plugins/worktrees", "options": {} }],
}
```

- Adding a strategy selects it automatically. The last active registration wins; no strategy-selection config is needed.
- Disposing its registration or unloading the plugin restores the previous implementation, ultimately the bundled Git strategy.
- `reload()` replays transforms after captured inputs change; it does not rerun plugin setup.
- Creation failures do not retry through Git. Existing worktrees retain their recorded owner even when the default changes.
- Strategies manage local directories. Remote workspace provisioning is not part of this interface.

#### Operations

The plugin context exposes the same project-based worktree operations as the client. Every operation requires a
`projectID`. `list` reads only saved inventory, including known checkouts of the same project; it does not load
configuration, start plugins, or discover filesystem changes.

```ts
const projectID = ctx.location.project.id
const created = await ctx.worktree.create({ projectID, name: "task" })
const inventory = await ctx.worktree.list({ projectID })
await ctx.worktree.refresh({ projectID })
await ctx.worktree.remove({ projectID, directory: created.directory, force: false })
```

Create loads configuration and plugins from the project's saved `canonical` directory and uses their selected strategy.
It accepts an optional parent `directory`, source `from`, starting `branch`, and `name`.
The source defaults to the canonical checkout, and a `from` override must belong to that project. Choosing a source
does not change the configuration root.
A supplied starting ref must be supported by the selected strategy;
Rift's native snapshot operation, for example, has no ref-selection option.

Create and refresh wait for the canonical checkout's plugins to activate. Calls made during that checkout's plugin
setup see registrations made so far and do not wait for their own activation.

Remove loads the canonical configuration and activates its plugins, then uses the worktree's recorded strategy rather
than the currently selected default. An unavailable recorded owner produces an error. The worktree's destination can
be elsewhere:

```ts
await ctx.worktree.remove({
  directory: "/worktrees/task",
  projectID,
  force: false,
})
```

Missing owners fail removal rather than falling back to Git. A strategy can throw `new Worktree.OperationError({
message: "Uncommitted changes", forceRequired: true })`, importing `Worktree` from `@opencode/plugin`, to request
force confirmation without depending on Core or Git errors.

Refresh loads canonical configuration and asks all available strategies to find worktrees across known checkout roots.
It combines results, preserves recorded ownership, and prunes missing directories. A failed discovery source is logged
while other sources continue. Existing directories remain saved even if no available strategy reports them. Observe
`worktree.updated` and call `list` again to read changed inventory.

```ts
await ctx.worktree.refresh({ projectID })
```

#### Reference

Implementations receive a suggested destination after naming and collision handling. Return the actual directory from
`create`; it may differ when a backend requires its own layout. OpenCode resolves the returned path and uses it for
inventory, startup commands, and the API result. The returned directory must exist.

Strategies choosing another destination handle naming collisions there. OpenCode still creates the suggested parent
directory before calling the strategy. `list` must report only directories the strategy owns, plus any repository roots.

```ts
interface WorktreeDefinition {
  readonly id: string
  create(
    input: { sourceDirectory: string; directory: string; branch?: string },
    context: { signal: AbortSignal },
  ): Promise<{ directory: string }>
  remove(input: { directory: string; force: boolean }, context: { signal: AbortSignal }): Promise<void>
  list(
    sourceDirectory: string,
    context: { signal: AbortSignal },
  ): Promise<readonly { directory: string; type: "root" | "worktree" }[]>
}

interface WorktreeEditor {
  add(definition: WorktreeDefinition): void
}

interface WorktreeDomain extends WorktreeApi {
  transform(callback: (editor: WorktreeEditor) => void): Promise<Registration>
  reload(): Promise<void>
}
```

Promise callbacks must cooperate with `signal` cancellation. Effect callbacks return Effects and use Effect interruption
instead. Registrations remain scoped to the plugin runtime; project operations use the canonical checkout's registry.
Core configuration adapters feed directory settings into that registry.

### Websearch

List websearch providers or run a query through the selected provider.

```ts
const providers = await ctx.websearch.providers()
const results = await ctx.websearch.query({ query: "OpenCode plugins", providerID: "internal" })
```

Register a provider and select the default provider with a transform.

```ts
await ctx.websearch.transform((editor) => {
  editor.add({
    id: "internal",
    name: "Internal search",
    execute: async ({ query }, { signal }) => {
      const response = await fetch(`https://search.example.com?q=${encodeURIComponent(query)}`, { signal })
      const result = await response.json()
      return [{ url: result.url, title: result.title, content: result.content, time: {} }]
    },
  })
  editor.default.set("internal")
})
```

Disable websearch by selecting `false`, or reload providers after external state changes.

```ts
await ctx.websearch.transform((editor) => editor.default.set(false))
await ctx.websearch.reload()
```

#### Reference

Schemas: [`WebSearch.Provider`](/api#schema-WebSearch.Provider), [`WebSearch.Result`](/api#schema-WebSearch.Result)

```ts
interface WebSearchContext {
  providers(input?: WebsearchProvidersInput, requestOptions?: RequestOptions): Promise<WebsearchProvidersOutput>
  query(input: WebsearchQueryInput, requestOptions?: RequestOptions): Promise<WebsearchQueryOutput>
  transform(callback: (editor: WebSearchEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface WebSearchEditor {
  add(provider: WebSearchDefinition): void
  default: {
    get(): string | false | undefined
    set(providerID: string | false): void
  }
}
```

### Events

Subscribe to the connected server's public event stream. Abort the stream during plugin cleanup.

```ts
const controller = new AbortController()
void (async () => {
  for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
    console.log(event.type)
  }
})()
return () => controller.abort()
```

#### Reference

Schema: [`V2EventEncoded`](/api#schema-V2EventEncoded)

```ts
interface EventContext {
  subscribe(options?: { signal?: AbortSignal }): AsyncIterable<OpenCodeEvent>
}
```

## Hooks

Hooks intercept live operations. Register a hook on its domain and dispose the
returned registration when it is no longer needed.

```ts
const registration = await ctx.session.hook("context", () => {})
await registration.dispose()
```

Multiple plugins can register the same hook. OpenCode runs them in plugin order,
so later hooks see changes made by earlier hooks.

### Sessions

Session hooks intercept prompt admission, model calls, native HTTP, and retries.

#### Prompt admission

Intercept incoming user prompts before attachment and skill resolution and durable inbox admission:

```ts
await ctx.session.hook("prompt", (event) => {
  event.prompt.text = event.prompt.text.replaceAll("company-secret", "[redacted]")
  event.prompt.files ??= []
  event.prompt.files.push({ uri: "file:///project/policy.md" })
  event.metadata = { ...event.metadata, source: "company-policy" }
  event.delivery = "queue"
})
```

The hook receives an owned, mutable draft:

- `prompt` contains `text`, `files`, agent mentions in `agents`, and selected `skills`.
- `metadata` contains application-defined admission metadata.
- `delivery` is `"steer"` by default and can be changed to `"queue"`.
- Session and message IDs are readonly; a hook cannot redirect admission.

Files and skills added by a hook follow the normal resolution and validation
path. When rewriting text, update or remove attachment `mention` offsets that no
longer match. Agent mentions do not switch the session's active agent.

Prompt hooks run under these conditions:

- Hooks run in registration order after the session's location plugins are ready.
- Commands that submit through `session.prompt` run the hook.
- Synthetic messages, shell messages, compaction controls, and move controls do not.
- The hook runs once during admission, not before every model call.
- Provider scoping is unavailable because model resolution happens after admission.

Edits become the canonical persisted user input. If preparation fails or is
interrupted, OpenCode does not admit the prompt.

Keep prompt hooks retry-safe. They are not an exactly-once side-effect boundary:

- Retrying an ID already pending or delivered returns the original admission without rerunning hooks.
- Concurrent submissions can run hooks more than once, but only the first successful admission wins.
- Prompt hooks transform input and do not expose a typed rejection API.

#### Model requests

Modify assembled system instructions, messages, tools, or request options immediately before model dispatch. Each
kind of request a session issues has its own hook, so a plugin can treat the agent loop and auxiliary requests
differently:

- `context` runs for the agent loop, including tool-driven continuations.
- `compaction` runs for checkpoint summaries. `messages` is the transcript being summarized; OpenCode appends its
  summary prompt after hooks run. Set `result` to record the compaction yourself and skip the model call; it takes the
  same fields as a completed compaction message.
- `generate` runs for transient `ctx.session.generate` calls.
- `title` runs for title generation. It has no `agent` or `tools`. Set `result` to supply the title yourself.

```ts
await ctx.session.hook("context", (event) => {
  event.system.push({ type: "text", text: "Keep the review focused on correctness." })
  delete event.tools.write
  event.options.temperature = 0.2
  event.options.maxTokens = 8_000
})

await ctx.session.hook("compaction", async (event) => {
  event.result = { summary: await summarize(event.messages) }
})
```

Changes affect only the outgoing model call, not persisted history or configuration. A hook that should apply to
every request must register for each kind.

Request overrides follow these rules:

- `options` starts empty for each model call; it does not contain resolved model settings.
- Typed keys are generation settings; any other key is passed to the selected protocol as a provider option.
- Hooks run in registration order and see overrides made by earlier hooks.
- Request overrides take precedence over model defaults, which take precedence over route defaults.
- Provider option objects merge recursively; arrays and scalar values replace earlier values.
- Deleting an override or setting it to `undefined` falls back to configured defaults rather than removing them.
- Raw HTTP body overlays apply after protocol lowering and can override the resulting fields.

#### Provider options

Provider options use the selected protocol's semantic option names, not raw HTTP body fields. Scope provider-specific
settings to the matching provider. For example, OpenAI Responses uses `reasoningEffort`:

```ts
await ctx.session.hook(
  "context",
  (event) => {
    event.options.reasoningEffort = "high"
  },
  { providerID: "openai" },
)
```

Generation options depend on the selected protocol and model:

- `maxTokens` is the semantic output-token limit.
- Gemini supports `topK`; OpenAI Responses does not expose it.

#### Model request

Modify model request settings and optionally scope the hook to one provider. The event carries the same `kind`
as the HTTP hooks below.

```ts
await ctx.session.hook(
  "model.request",
  (event) => {
    event.headers["x-plugin"] = "review"
  },
  { providerID: "anthropic" },
)
```

#### Native HTTP

Modify native provider requests or responses. Their bodies are one-shot streams; clone or replace a body before reading
it.

Both hooks run for every request a session issues. `event.kind` says which flow issued it: `"primary"` for the agent
loop, `"compaction"` for checkpoint summaries, `"title"` for title generation, and `"generate"` for transient
`ctx.session.generate` calls. Use it instead of the agent ID to tell auxiliary requests apart.

```ts
await ctx.session.hook("http.request", (event) => {
  event.request.headers.set("x-session-id", event.sessionID)
  if (event.kind === "title") event.request.headers.set("x-priority", "background")
})

await ctx.session.hook("http.response", (event) => {
  event.response = new Response(event.response.body, {
    status: event.response.status,
    headers: { ...Object.fromEntries(event.response.headers), "x-plugin": "review" },
  })
})
```

#### Native WebSocket (experimental)

Providers that stream over a WebSocket open one connection per session and reuse it across requests, so
`http.request` and `http.response` never see that traffic. The `experimental.ws.handshake` hook runs once per model
call before the connection is selected. It carries the same `sessionID`, `agent`, `model`, and `kind` as the HTTP
hooks, plus the connection `url` and `headers`. Changing `url` or `headers` changes which socket the request uses, so a
rotated bearer token reopens the connection.

HTTP hooks still run for every HTTP request, including the request a WebSocket route falls back to.

```ts
await ctx.session.hook(
  "experimental.ws.handshake",
  async (event) => {
    event.headers.authorization = `Bearer ${await mintToken(event.url)}`
    delete event.headers["api-key"]
  },
  { providerID: "azure" },
)
```

`experimental.ws.send` and `experimental.ws.receive` expose the frames themselves, the WebSocket counterpart of
editing an HTTP request or response body. `send` runs after the provider driver builds an outbound frame and before it

...9499 bytes truncated...

The tool call succeeded but the output was truncated. Full output saved to: /home/user/.local/share/opencode/tool-output/tool_162526ed6001b1CZ0M38mVKX1k
Use the Task tool to have explore agent process this file with Grep and Read (with offset/limit). Do NOT read the full file yourself - delegate to save context.
```

**Tool: webfetch**

**Input:**
```json
{
  "url": "https://opencode.ai/v2/docs/build/",
  "format": "markdown"
}
```

**Output:**
```
# Intro

OpenCode is used by millions every day. Build on top of it to create your own
applications, integrations, and agent experiences without starting from
scratch.

We also offer Effect APIs for [plugins](/build/plugins/effect),
[clients](/build/client/effect), and [embedded apps](/build/sdk/effect).

<CardGroup cols={1}>
  <Card title="Extend OpenCode" href="/build/plugins">
    Build plugins that add tools, integrations, commands, agents, and custom behavior while keeping the rest of OpenCode
    intact.
  </Card>
  <Card title="Run it as a server" href="/build/client">
    Connect to OpenCode with the same client used by the TUI and desktop app, then build any interface, workflow, or
    agent experience around it.
  </Card>
  <Card title="Embed it" href="/build/sdk">
    Embed OpenCode directly into your application and build a completely custom agent, interface, or developer product
    around it.
  </Card>
</CardGroup>
```

---

## Assistant (Plan · Claude Sonnet 5 · 103.7s)

_Thinking:_



**Tool: task**

**Input:**
```json
{
  "description": "Extract OpenCode v2 plugin hook details",
  "prompt": "A web-fetch tool call output was truncated and saved to this file:\n/home/user/.local/share/opencode/tool-output/tool_162526ed6001b1CZ0M38mVKX1k\n\nThis file contains the back half of the OpenCode v2 plugin-authoring documentation page (https://opencode.ai/v2/docs/build/plugins/), picking up from the \"Hooks\" section (we already have everything up through \"Native WebSocket (experimental)\" under Session hooks).\n\nPlease read this file (use Read tool, it may be large, read in chunks with offset/limit, don't worry about reading all of it if it's huge, focus on the sections described below) and report back, as plain text/markdown in your final message, the following information VERBATIM (quote the relevant code blocks and surrounding explanation, don't paraphrase code):\n\n1. Any \"File\" hooks/events (e.g. file edited, file watcher) - full section text and code examples.\n2. Any \"Tool\" hooks (e.g. tool.execute.before/after equivalent) - full section text and code examples, especially anything about intercepting or wrapping custom tool execution.\n3. Any mention of plugins being able to run a background HTTP server, open a browser, serve a web UI, \"webview\", \"ui\", \"iframe\", or similar browser-facing capability - full text.\n4. The complete \"Examples\" section at the end of the page if present (full text, all code blocks).\n5. Any section about \"TUI\" hooks or client-side/UI hooks.\n6. The table of contents / full list of hook names available (anything following the pattern ctx.X.hook(\"name\", ...)) across all domains (session, tool, file, etc.) - just enumerate every hook name you find with a one-line description.\n\nReturn this information as complete, verbatim text in your final response so it can be used directly without further lookups.",
  "subagent_type": "explore"
}
```

**Output:**
```
<task id="ses_e9dad3948ffeFJz0E87b2vLKlT" state="completed">
<task_result>
# Report: OpenCode V2 Plugin Docs — Back Half (from "Hooks" section onward)

## Summary of findings

I read the entire saved file (1823 lines, the back half of the page starting around the "Hooks" section). Here are the results for each of your six requests:

---

### 1. "File" hooks/events (file edited, file watcher, etc.)

**NOT FOUND.** I searched the entire file content for any "File" domain, "file.edited", "file watcher", or similar hook/event, and there is no such section anywhere in this document. The closest matches are incidental uses of the word "file" (e.g., `file:///project/policy.md` as a URI in a prompt attachment example, and "file diffs" under the VCS section description), but there is no dedicated File hooks/events domain in this plugin-authoring page.

---

### 2. "Tool" hooks (tool.execute.before/after equivalent)

Found under **Hooks > Tools** (full section, verbatim):

> ### Tools
>
> Inspect or replace tool input before execution.
>
> ```ts
> await ctx.tool.hook("execute.before", (event) => {
>   if (event.tool === "read") console.log(event.input)
> })
> ```
>
> Inspect successful results or failures after execution.
>
> ```ts
> await ctx.tool.hook("execute.after", (event) => {
>   if (event.status === "completed") event.result = { ...event.result, metadata: { observed: true } }
>   if (event.status === "error") console.error(event.error.message)
> })
> ```
>
> #### Reference
>
> ```ts
> interface ToolHooks {
>   "execute.before": ToolExecuteBefore
>   "execute.after": ToolExecuteCompleted | ToolExecuteFailed
> }
>
> interface ToolHookContext {
>   hook<Name extends keyof ToolHooks>(
>     name: Name,
>     callback: (event: ToolHooks[Name]) => Promise<void> | void,
>   ): Promise<Registration>
> }
> ```

Additionally, there is a separate **"Tools" API/Transform section** (earlier in the doc, lines 957–1062) that covers registering/wrapping **custom** tool execution (not a hook on existing tools, but the mechanism for defining your own tool's execute function, which can itself intercept/wrap behavior). Full verbatim text:

> ### Tools
>
> Read the tools currently registered, after every transform, outside of a transform callback. Each tool has an `id`
> containing its effective name.
>
> ```ts
> const tools = await ctx.tool.list()
> const read = tools.find((tool) => tool.id === "read")
> ```
>
> Register, update, and remove tools with a synchronous transform, including in Promise plugins. Load external data
> before registering or reloading. A later valid registration overrides the same effective tool name.
>
> ```ts
> const registration = await ctx.tool.transform((editor) => {
>   editor.namespace({
>     name: "acme",
>     description: "Customer account tools",
>   })
>   editor.add({
>     name: "greeting",
>     description: "Create a greeting",
>     input: {
>       type: "object",
>       properties: { name: { type: "string" } },
>       required: ["name"],
>       additionalProperties: false,
>     },
>     options: { namespace: "acme", codemode: true },
>     execute: async (input, context) => {
>       await context.progress({ status: "greeting" })
>       return { content: `Hello ${(input as { name: string }).name}!` }
>     },
>   })
> })
> ```
>
> Promise tool executors receive `context.signal`. Pass it to cancellable work such as `fetch` so stopping the Session
> also stops the underlying operation.
>
> ```ts
> execute: async ({ url }, context) => {
>   const response = await fetch(url, { signal: context.signal })
>   return { content: await response.text() }
> }
> ```
>
> Call `reload()` after changing source data captured by the callback. Reload replays the active transforms without
> changing their order; it does not rerun plugin setup.
>
> ```ts
> await ctx.tool.reload()
> ```
>
> Use `list()` and `get()` to inspect tools currently in the editor. Tools have an `id` containing their effective name,
> and `get()` returns `undefined` when that ID is not present. Use `update` and `remove` with the effective tool name,
> including its namespace (`acme_greeting` above). Dots in
> namespaces and unsupported characters in tool names become `_`. Missing names are ignored; creating a tool requires
> `add` with a complete definition. Updates preserve the name and namespace. Assign new schemas or options to replace
> them rather than mutating nested values. Invalid updates are logged and leave the previous definition intact.
>
> ```ts
> await ctx.tool.transform((editor) => {
>   editor.update("acme_greeting", (tool) => {
>     tool.description = "Greet the user by name"
>   })
>   editor.remove("acme_obsolete")
> })
> ```
>
> Updates and removals replay in order with additions, including after MCP catalog refreshes. Disposing their
> registration removes those changes and rebuilds from the remaining transforms.
>
> Dispose a registration to remove its transform and rebuild from the remaining transforms, revealing any earlier
> definition it overrode. Disposal is idempotent, and unloading the plugin also disposes its registrations.
>
> ```ts
> await registration.dispose()
> ```
>
> Each model request captures a stable, executable tool snapshot. Later transforms, reloads, and disposal affect future
> snapshots, not the definitions, Code Mode namespace descriptions, or executors already captured. Executors that close
> over mutable plugin data still observe that data; capture a value inside the transform when it must remain tied to
> that definition.
>
> #### Reference
>
> Schemas: [`Tool.Content`](/api#schema-Tool.Content), [`Tool.TextContent`](/api#schema-Tool.TextContent),
> [`Tool.FileContent`](/api#schema-Tool.FileContent)
>
> ```ts
> interface ToolContext {
>   list(): Promise<readonly (ToolInfo & { readonly id: string })[]>
>   transform(callback: (editor: ToolEditor) => void): Promise<Registration>
>   reload(): Promise<void>
> }
>
> interface ToolEditor {
>   list(): readonly (ToolInfo & { readonly id: string })[]
>   get(id: string): (ToolInfo & { readonly id: string }) | undefined
>   namespace(namespace: { name: string; description: string }): void
>   add(tool: ToolInfo): void
>   update(id: string, update: (tool: Types.Mutable<ToolInfo>) => void): void
>   remove(id: string): void
> }
> ```

---

### 3. Background HTTP server / browser / webview / UI / iframe capability

**NOT FOUND.** There is no mention anywhere in this file of plugins running a background HTTP server, opening a browser, serving a web UI, "webview", "iframe", or similar browser-facing capability. 

The only "server" mentions in the whole file relate to:
- "OpenCode server client" (describing the plugin context itself, line 64)
- MCP (Model Context Protocol) servers that plugins can register/manage (lines 610–656) — these are MCP tool servers, not a plugin-hosted HTTP/web server
- "Subscribe to the connected server's public event stream" (Events section, line 1307) — this is the plugin *connecting to* OpenCode's own server, not hosting one
- The V1 `server()` function name in the "Support V1" compatibility section (this is just the V1 plugin API's setup function name, unrelated to web servers)

No references to "UI" (other than "terminal UI" / CLI plugin mention) or "iframe"/"webview" exist in this content at all.

---

### 4. Complete "Examples" section

**NOT FOUND.** There is no section titled "Examples" anywhere in this file. The document's final two sections are "## Publish" and "## Support V1" (verbatim below), and there is nothing after that.

> ## Publish
>
> A package plugin uses the same default export as a local plugin. A minimal
> manifest is:
>
> ```json title="package.json"
> {
>   "name": "opencode-acme-plugin",
>   "version": "1.0.0",
>   "type": "module",
>   "exports": {
>     ".": "./src/index.ts",
>     "./rpc": "./src/rpc.ts"
>   },
>   "dependencies": {
>     "@opencode/plugin": "latest"
>   }
> }
> ```
>
> The `./rpc` export is optional; include it when publishing a shared
> [RPC contract](/build/plugins/rpc) for other plugins and clients to import
> without loading your implementation.
>
> Use versions compatible with the OpenCode release you target and test the
> installed package, not only a workspace-linked copy. Publish a compatible
> plugin update when you adopt a newer API contract.
>
> ## Support V1
>
> A plugin can support V1 and V2 from the same package entrypoint. Default export
> one object with a V1 `server()` function and a V2 `setup()` function:
>
> ```ts title="src/index.ts"
> import { Plugin } from "@opencode/plugin"
>
> export default {
>   ...Plugin.define({
>     id: "example",
>     async setup(ctx) {
>       await ctx.tool.hook("execute.before", () => {
>         console.log("A tool is about to run")
>       })
>     },
>   }),
>   async server() {
>     return {
>       "tool.execute.before": async () => {
>         console.log("A tool is about to run")
>       },
>     }
>   },
> }
> ```
>
> - V1 calls `server()` and uses the returned hooks.
> - V2 reads the default export's `id` and `setup()` (or `effect()` for Effect plugins), ignoring `server()`.
> - Keep each implementation on its own API; sharing an export does not translate V1 hooks into V2 hooks.
> - Spread `Plugin.define(...)` into the exported object so it type-checks the V2 definition separately from `server()`.
>
> The V1 object form is supported in OpenCode `1.18.29`. Older V1 releases may
> expect function exports instead; test the installed package with the oldest V1

(Note: the file is truncated exactly at line 1823/1824, cutting off mid-sentence: "...test the installed package with the oldest V1" — the final sentence is incomplete because the saved tool output file itself ends there.)

---

### 5. "TUI" hooks or client-side/UI hooks section

**NOT FOUND.** There is no "TUI" section, and no client-side/UI-specific hooks domain in this file. The only CLI/TUI-related mention is a one-line pointer at the very top of the whole page (which is in the *front* half, included here only because it appeared in my read window): "To change the terminal UI, build a [CLI plugin](/build/plugins/cli)." This just links out to a separate CLI plugin doc page — it is not itself a TUI hooks section.

---

### 6. Complete enumeration of all `ctx.X.hook("name", ...)` calls found in this file

**Session hooks** (`ctx.session.hook(...)`) — intercept prompt admission, model calls, native HTTP/WebSocket, and retries:

| Hook name | Description |
|---|---|
| `prompt` | Intercept incoming user prompts before attachment/skill resolution and durable inbox admission (can rewrite text, files, skills, delivery mode). |
| `context` | Modify assembled system instructions, messages, tools, or request options for the agent loop, including tool-driven continuations. |
| `compaction` | Runs for checkpoint summaries; can inspect `messages` being summarized and set `result` to skip the model call. |
| `generate` | Runs for transient `ctx.session.generate` calls (same shape as `context`). |
| `title` | Runs for title generation; no `agent`/`tools` fields; can set `result` to supply the title directly. |
| `model.request` | Modify model request settings (e.g. headers) and optionally scope to one provider; carries same `kind` as HTTP hooks. |
| `http.request` | Modify native provider HTTP requests before they're sent (e.g. add headers). |
| `http.response` | Modify native provider HTTP responses after they're received. |
| `experimental.ws.handshake` | (Experimental) Runs once per model call before a WebSocket connection is selected; can modify `url`/`headers`. |
| `experimental.ws.send` | (Experimental) Runs after an outbound WebSocket frame is built, before it's written; can rewrite `frame`. |
| `experimental.ws.receive` | (Experimental) Runs on each inbound WebSocket frame before the driver observes it; can rewrite `frame`. |
| `retry` | Override the retry decision (retry/no-retry, delay) for a provider failure after OpenCode proposes its own policy. |

**Permission hooks** (`ctx.permission.hook(...)`):

| Hook name | Description |
|---|---|
| `evaluate` | Review permission decisions after configured rules are evaluated and before an action runs or a prompt is published; can change `effect` (allow/ask/deny) and `message`. |

**Shell hooks** (`ctx.shell.hook(...)`):

| Hook name | Description |
|---|---|
| `create.before` | Modify shell commands, working directories, timeouts, executables, or environment variables before execution. |

**Tool hooks** (`ctx.tool.hook(...)`):

| Hook name | Description |
|---|---|
| `execute.before` | Inspect or replace tool input before execution. |
| `execute.after` | Inspect successful results (`ToolExecuteCompleted`) or failures (`ToolExecuteFailed`) after execution; can mutate `result` or inspect `error`. |

**No other `ctx.X.hook(...)` calls appear in this file.** (All other domains like Agent, Provider, Model, Command, Integration, MCP, Reference, Worktree, Websearch, Tool-as-registry use `.transform()` / `.reload()` / direct API calls — not `.hook()` — and are registry/transform mechanisms rather than live-intercept hooks. Only Session, Permission, Shell, and Tool expose a `.hook()` method in this document.)
</task_result>
</task>
```

---

## Assistant (Plan · Claude Sonnet 5 · 83.3s)

_Thinking:_



## Can an OpenCode v2 plugin do this? Yes — and there's already production precedent for exactly this shape.

I checked the OpenCode v2 plugin API docs (`/v2/docs/build/plugins/`) and two real community plugins that already do "agent drives a thing, human watches/interacts with it live in a browser":

- **octto** (525★, MIT) — on a custom tool call, opens a local browser UI that updates live as the agent asks questions and the user clicks answers.
- **@plannotator/opencode** — on `submit_plan`, starts an embedded local server, opens the browser, and the human's annotations flow back to the agent.

Neither capability (serving HTTP, opening a browser) is a documented OpenCode primitive — plugins just do it with plain Bun/Node code inside `setup()`. That's good news: it means nothing is blocked, but it also means **you own that plumbing yourself** (port management, process lifecycle, cross-platform "open browser", cleanup). The relevant v2 plugin API surface:

| Capability | v2 API |
|---|---|
| Plugin lifecycle (start a server, keep state, clean up) | `Plugin.define({ id, setup(ctx) { ...; return cleanupFn } })` |
| Register custom tools for the agent | `ctx.tool.transform(editor => editor.add({ name, description, input: <JSON Schema>, execute }))` — note: **raw JSON Schema**, not Zod (that's the v1 `tool()` helper, different API) |
| Intercept every tool call (e.g. to broadcast a change after any `bpmn_*` tool runs) | `ctx.tool.hook("execute.before" \| "execute.after", ...)` |
| Persist state across calls/restarts (e.g. "server already running on port X") | `ctx.storage.get/set/remove` |
| Push a message into the chat (e.g. "open http://localhost:PORT") | `ctx.session.prompt` / `ctx.session.synthetic` |
| Gate a risky action behind user confirmation | `ctx.permission.assert` |

One gap I should flag: v1 had a `file.edited` plugin event; I could not find an equivalent in the v2 docs page. If you want the plugin to notice when *you* hand-edit the `.bpmn` file on disk outside the canvas session, that needs verifying/testing rather than assuming — worst case, the plugin treats its in-memory model as the source of truth while a canvas session is open, and only re-reads from disk on an explicit import.

---

## Stage 1 — agent edits BPMN XML, then loads it into a UI for the user to see

This is the low-risk version — turn-based, no live sync.

- **Core libraries** (all MIT, all local): **bpmn-moddle** (parse/serialize BPMN 2.0 XML), **bpmnlint** (validate).
- **Plugin**, registering custom tools via `ctx.tool.transform`: `bpmn_create`, `bpmn_add_element`, `bpmn_connect`, `bpmn_import`, `bpmn_export`, `bpmn_validate` — each mutates an in-memory/on-disk `.bpmn` document (same shape as the existing `oisee/mcp-bpmn` / `dattmavis/BPMN-MCP` tool surfaces I found earlier, just reimplemented as native OpenCode tools instead of a separate MCP server).
- A `bpmn_preview` tool: writes the current XML to disk, serves it via a small `Bun.serve()` static server (a self-contained page bundling **bpmn-js** as a *viewer*), and opens the user's default browser pointed at it (`xdg-open`/`open`/`start`, same trick plannotator uses via `PLANNOTATOR_BROWSER`).
- `ctx.storage` remembers whether a preview server/tab is already open so repeated calls reuse it instead of spawning duplicates.

This is buildable with high confidence — it's a straightforward combination of well-known, well-documented pieces.

## Stage 2 — agent draws/updates in real time, user sees it live and can interact

This extends Stage 1 into the `mcp-excalidraw-server` architecture, but hosted *inside* the OpenCode plugin process instead of as a separate process:

- The plugin's `setup()` starts **one persistent canvas server** (`Bun.serve`, HTTP + native WebSocket upgrade — no extra dependency needed since OpenCode already runs on Bun) holding the canonical BPMN model in memory (via bpmn-moddle) for the life of the project/session.
- The served page runs full **bpmn-js** (editor, not viewer).
- Every `bpmn_*` tool call mutates the canonical model, then (via a `ctx.tool.hook("execute.after", ...)` scoped to the bpmn namespace) broadcasts the change over the WebSocket to every open tab — the user watches it appear, like Excalidraw.
- The browser's bpmn-js listens to its own `commandStack.changed` and sends user edits back over the same socket — the server re-validates (bpmnlint) and updates the canonical model, so the agent's next tool call sees the human's edits too. This closes the loop both directions.
- Write-through to the `.bpmn` file on disk (debounced) keeps the diagram a normal, git-trackable artifact.

This is more build effort (real-time sync, conflict handling, client-side bpmn-js wiring) but every individual piece — plugin custom tools, tool hooks, Bun.serve, bpmn-js/bpmn-moddle/bpmnlint — is proven technology; nothing here is speculative, it's integration work.

---

Before I turn either of these into a concrete, step-by-step implementation plan, a few things would shape it a lot:

---

## User

1. why would I need both : bpmn-moddle and bpmnlint?
2. what are the pros and cons of an MCP server vs an OpenCode v2 plugin for the desired functionality?

---

## Assistant (Plan · Claude Sonnet 5 · 67.8s)

_Thinking:_



## 1. Why both bpmn-moddle and bpmnlint?

They solve two completely different problems, and one depends on the other:

- **bpmn-moddle** is the **parser/serializer**. It reads BPMN 2.0 XML into a JS object tree (and writes it back out) according to the BPMN meta-model — it knows what a `bpmn:Task`, `bpmn:SequenceFlow`, `bpmn:StartEvent` etc. look like structurally, handles namespaces and extension elements. Think of it as "XML ⇄ object tree, schema-aware." It has **no opinion on whether the diagram makes sense** — a process with a floating, disconnected gateway and no start event parses and serializes just fine.
- **bpmnlint** is the **semantic/style linter**, and it runs *on the tree bpmn-moddle produces* — it does not parse XML itself. Its own README example is literally:
  ```js
  const { rootElement: definitions } = await moddle.fromXML(xmlStr);
  const reports = linter.lint(definitions);
  ```
  It checks modeling-quality rules: "process is missing a start/end event," "sequence flow is missing a condition," "element is missing a label," etc. — configurable via `bpmnlint:recommended`/`bpmnlint:correctness`/custom plugins. Think ESLint, but the AST it lints is a BPMN diagram instead of JS.

So: **moddle gives you parse/import/export/create**; **bpmnlint gives you validate** in any meaningful sense. Since your original requirements explicitly listed "validate" as its own capability (not just "produces well-formed XML"), you need bpmnlint on top of moddle to actually deliver on that — moddle alone would let you claim "validated" while still emitting a structurally-valid-but-semantically-broken diagram. One upside: bpmn-js already depends on bpmn-moddle internally, so if you're building the Stage 2 canvas, moddle is already in your tree for free — bpmnlint is the one piece you're adding specifically for validation.

## 2. MCP server vs. OpenCode v2 plugin

| | MCP server | OpenCode v2 plugin |
|---|---|---|
| **Process model** | Separate process (stdio or network), extra moving part to start/restart/monitor | Runs inside the OpenCode server/TUI process — one process, shared memory/closures |
| **Portability** | Reusable from any MCP client (Claude Desktop, Cursor, Claude Code, VS Code...) | OpenCode-only |
| **Live-canvas architecture** | Needs two processes even internally (a canvas-server for the browser + the MCP stdio process as a thin client) — exactly `mcp-excalidraw-server`'s shape | One process: the canvas server, the canonical model, and the tool implementations can share state directly, no IPC |
| **Deep host integration** | Only sees the tool calls routed to it; can't hook other tools, push chat messages, or use the permission UI | `ctx.tool.hook("execute.after")` to auto-broadcast after any `bpmn_*` call; `ctx.storage` for persisted state; `ctx.session.synthetic` to drop "open http://localhost:PORT" into the chat; `ctx.permission.assert` to reuse OpenCode's own confirm-before-destructive-action UI |
| **Install/config** | Add to `mcp.servers` in `opencode.json`, keep the command alive | Drop a file in `.opencode/plugins/` or one line in `opencode.json`'s `plugins` array |
| **API stability** | MCP protocol itself is a stable, cross-vendor spec | v2 plugin API is newer; several hooks are explicitly marked `experimental` in the docs — more exposure to breakage across OpenCode releases |
| **Isolation/ops** | Crash/leak stays contained to that process; independently restartable/inspectable (`curl`, logs) | A bug in your plugin is a bug in your live OpenCode session; harder to isolate/restart in place |
| **Existing precedent for exactly this UX** | The BPMN-MCP projects I found (dattmavis, oisee, Stieges/bpmn-generator) are all headless — none built the live-canvas part | **octto** (525★) and **plannotator** are OpenCode plugins, and they're the two real examples of "agent opens a local browser UI, user interacts live" — nobody solved this as an MCP server |

Neither option gives you "serve HTTP"/"open a browser" as a blessed primitive — that's plain Bun/Node code either way, so it's not a differentiator.

**My read:** since you explicitly framed this around OpenCode v2, and the strongest real-world precedent for the "agent draws, human watches/interacts live" UX was itself built as OpenCode plugins rather than MCP servers, the **plugin route fits Stage 2 better** — single process, native broadcast-after-tool-call hook, native way to surface the canvas URL in chat. MCP is the better call only if you also want this usable outside OpenCode, or want to start from an existing community project (Stieges/bpmn-generator is the most mature headless option) rather than writing custom tools from scratch. A hybrid is also possible — plannotator itself ships a V1/V2 plugin *and* a CLI fallback behind one shared backend — but that's extra engineering worth deferring until Stage 1 is working.

Given that, a couple of decisions before I draft the concrete plan:

---

## User

I do not see your decisions. Stuck?

---

## Assistant (Plan · Claude Sonnet 5 · 305.6s)

_Thinking:_



You're right, I trailed off — sorry. Here are the actual decisions I need from you before drafting the implementation plan:

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "Which architecture should the plan target?",
      "header": "Architecture",
      "options": [
        {
          "label": "OpenCode v2 plugin only (Recommended)",
          "description": "Single process, native tool hooks, matches the octto/plannotator precedent for live browser UIs. OpenCode-only."
        },
        {
          "label": "MCP server only",
          "description": "Reusable from any MCP client (Claude Desktop, Cursor, etc.), separate process to manage, more plumbing for the live-canvas case."
        },
        {
          "label": "Hybrid (shared core + both adapters)",
          "description": "Write the BPMN model/canvas-server logic as a plain local module, then thin MCP and plugin adapters on top. More upfront engineering, most flexible later."
        }
      ]
    },
    {
      "question": "How much should the first implementation pass cover?",
      "header": "Scope",
      "options": [
        {
          "label": "Stage 1 only (Recommended)",
          "description": "Turn-based: agent edits BPMN XML via tools, then a preview tool opens/reloads a browser viewer. Lower risk, fast to land."
        },
        {
          "label": "Go straight for Stage 2",
          "description": "Build the full live-canvas with two-way WebSocket sync in one pass. More work, higher risk, but gets to the real target faster."
        }
      ]
    },
    {
      "question": "Where should this live?",
      "header": "Location",
      "options": [
        {
          "label": "Project-local in this docs repo (Recommended)",
          "description": "e.g. .opencode/plugins/bpmn/ — simplest, auto-loaded, scoped to this repo, easy to iterate on."
        },
        {
          "label": "Separate standalone package",
          "description": "A new repo/npm package you could reuse across projects or eventually publish, like octto/plannotator do. More setup overhead now."
        }
      ]
    },
    {
      "question": "For Stage 2, how much editing capability should the browser canvas expose to the user?",
      "header": "Editing depth",
      "options": [
        {
          "label": "Basic drag/drop/connect only (Recommended for v1)",
          "description": "Default bpmn-js editing: move, resize, connect, delete elements. No extra dependency."
        },
        {
          "label": "Basic + properties panel",
          "description": "Also lets the user edit names, IDs, and element attributes via bpmn-js-properties-panel (MIT, extra dependency)."
        }
      ]
    },
    {
      "question": "Any objection to the bpmn.io License's watermark requirement (a small non-removable 'bpmn.io' link must stay visible on the rendered canvas)?",
      "header": "License caveat",
      "options": [
        {
          "label": "No objection, fine for an internal/local tool (Recommended)",
          "description": "This is a local, non-public tool, so a visible attribution link in the corner is a non-issue."
        },
        {
          "label": "This is a blocker",
          "description": "Would need to explore alternatives to bpmn-js's renderer, which significantly narrows the FOSS options already surveyed."
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Which architecture should the plan target?"="If I can, I want to stay independent of OC as much as possible. If I lose critical functionality with an MCP, I could reconsider and go for a plugin. In what language do I write an OC plugin? the MCP porotocol would be language agnostic.", "How much should the first implementation pass cover?"="Stage 1 only (Recommended)", "Where should this live?"="we need a separate repo and project for this. So, we need a "write up" (maybe a combination of DEC, REQ and QA) that I can transfer to the new repo and have an agent create a specifiction for it", "For Stage 2, how much editing capability should the browser canvas expose to the user?"="I want to reuse the existing bpmn-js lib if possible that already supports all operations like drag/drop ...", "Any objection to the bpmn.io License's watermark requirement (a small non-removable 'bpmn.io' link must stay visible on the rendered canvas)?"="explain". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · Claude Sonnet 5 · 54.7s)

_Thinking:_



Good answers — let me clarify the one open point and then check this repo's existing spec conventions (read-only) before drafting the write-up.

**Tool: specmgr_list_req**

**Input:**
```json
{
  "max_results": 5
}
```

**Output:**
```
{
  "total": 0,
  "offset": 0,
  "max_results": 5,
  "truncated": false,
  "results": [],
  "error_count": 0
}
```

**Tool: specmgr_list_dec**

**Input:**
```json
{
  "max_results": 5
}
```

**Output:**
```
{
  "total": 0,
  "offset": 0,
  "max_results": 5,
  "truncated": false,
  "results": [],
  "error_count": 0
}
```

**Tool: specmgr_list_qa**

**Input:**
```json
{
  "max_results": 5
}
```

**Output:**
```
{
  "total": 1,
  "offset": 0,
  "max_results": 5,
  "truncated": false,
  "results": [
    {
      "id": "6dfe1a2f-6102-4460-8d28-efe1053e9a4e",
      "title": "Open Design Decisions for New specmgr Artifact Types (CR, ARC, SET/SyRS, Plan/VVP, Validation)",
      "status": "draft",
      "ref": "qa-6dfe1a2f-6102-4460-8d28-efe1053e9a4e-open-design-decisions-for-new-specmgr-artifact-types-cr-arc",
      "path": "/home/user/src/docs/docs/qa/qa-6dfe1a2f-6102-4460-8d28-efe1053e9a4e-open-design-decisions-for-new-specmgr-artifact-types-cr-arc.md",
      "error": null
    }
  ],
  "error_count": 0
}
```

**Tool: specmgr_get_req_template**

**Input:**
```json
{}
```

**Output:**
```
---
created: '2025-01-07T08:15:42.617Z'
id: deaddead-dead-dead-dead-deaddeaddead
status: draft
type: req
updated: '2025-01-20T03:27:27.459Z'
version: 1.0.0
---

# Level 1 Heading is the Title of the Requirement

This is the requirement statement. Write it formal and concise and use ASD-STE100 writing style.

## Description

This is a description of the requirement statement that gives more context. Use only if necessary.

## Characteristics

1. A numbered list with ISO 25010:2023 main characteristics
2. Must have at least one characteristic

## Level

<!-- RFC 2119 Requirement Keyword. Mandatory. -->
MUST

## Priority

<!-- A number between 0 and 99. Lower number is higher priority. -->
50

## Tags

- An optional bullet list
- This can contain tag of different domains

## Source

Where does this requirement come from? This can be a document reference, an interest group or something else. Mandatory.

## Related Artifacts

### Requirements

- REQ 00000000-0000-4000-8000-000000000001: title of the related requirement

### Decisions

- DEC 00000000-0000-4000-8000-000000000002: title of the related decision

### Goals

- GOL 00000000-0000-4000-8000-000000000003: title of the related goal

### Risks

- RSK 00000000-0000-4000-8000-000000000004: title of the related risk

## More Information

This optional section can contain additional information. There is no defined format for this section.

## Notes

This optional section can contain additional notes. There is no defined format for this section.

```

**Tool: specmgr_get_dec_template**

**Input:**
```json
{}
```

**Output:**
```
---
created: '2025-04-14T07:52:19.384Z'
id: deadbeef-dead-dead-dead-deadbeefdead
status: draft
type: dec
updated: '2025-04-14T16:38:05.221Z'
version: 1.0.0
---

# Level 1 Heading is the Title of the Decision

## Context and Problem Statement

The situation and the problem this decision addresses.

## Decision Drivers

The requirements, constraints, and stakeholder interests that shape this decision.

## Considered Options

A free-form summary of the options that were weighed.

## Decision Outcome

The chosen option and the reason for it, as a lead paragraph.

### Consequences

What follows from the chosen outcome.

### Confirmation

How the outcome was or will be confirmed.

## Roles and Responsibilities

### Accountable

The single owner ultimately answerable for this decision.

### Responsible

- A bullet list naming those who carry out the decision or its consequences.

### Support

- A bullet list naming those who provide resources or assistance. Optional; may be empty.

### Consulted

- A bullet list naming those whose opinions were sought. Optional; may be empty.

### Informed

- A bullet list naming those kept up to date on the decision. Optional; may be empty.

## Tags

- A bullet list of free-form labels for grouping/filtering decisions. Optional.

## Source

The origin/authority of this decision, e.g. an issue, a meeting, or a stakeholder request.

## Related Artifacts

### Requirements

- REQ 00000000-0000-4000-8000-000000000001: title of the related requirement

### Decisions

- DEC 00000000-0000-4000-8000-000000000002: title of the related decision

### Goals

- GOL 00000000-0000-4000-8000-000000000003: title of the related goal

### Risks

- RSK 00000000-0000-4000-8000-000000000004: title of the related risk

## Pros and Cons

### Option 1: name of the first option

The pros and cons of the first option.

## More Information

This optional section can contain additional information. There is no defined format for this section.

## Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

### 2026-08-27 09:14:27.512Z - Created

A lead paragraph describing this update.

```

**Tool: specmgr_get_qa_template**

**Input:**
```json
{}
```

**Output:**
```
---
created: '2025-09-07T08:15:42.517Z'
id: deaddead-cafe-cafe-cafe-deaddeadcafe
status: draft
type: qa
updated: '2025-09-20T17:29:44.902Z'
version: 1.0.0
---

# Level 1 Heading is the Title of the Q&A Document

## General

### Introduction

Free-form markdown (prose, lists, code blocks, ...) framing the interview:
who was interviewed, when, and why. Mandatory, but a single sentence like
this one is sufficient.

### Raw Requirements

Free-form, pre-existing raw requirement notes (e.g. from a wiki page or an
earlier document), preserved verbatim for traceability. Mandatory section,
but may simply note that none existed yet.

## Elicitation Context

<!-- An optional HTML comment giving context for this Q&A pair, such as when/by whom it was elicited. -->

> **0.0010**: An optional block quote holding the interviewer's question.

An optional free-form prose answer, immediately following the question's
block quote, with no heading of its own.

> **0.0020**: A second question whose answer has not been given yet.

TODO: answer pending

## Functional Suitability

<!-- An optional HTML comment giving context for this Q&A pair, such as when/by whom it was elicited. -->

> **1.0010**: An optional block quote holding the interviewer's question.
> Categories may stay empty (zero pairs), or hold several pairs one after
> another -- each pair is just an optional comment, a question block quote,
> and a free-form answer, with no heading of its own.

An optional free-form prose answer, immediately following the question's
block quote, with no heading of its own.

> **1.0020**: A second, adjacent question can follow directly after the
> first pair's answer prose, with no heading in between.

Its own free-form prose answer.

> **1.0030**: A third question whose answer has not been given yet.

TODO: answer pending

## Performance Efficiency

> **2.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Compatibility

> **3.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Interaction Capability

> **4.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Reliability

> **5.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Security

> **6.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Maintainability

> **7.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Flexibility

> **8.0010**: A question whose answer has not been given yet.

TODO: answer pending

## Safety

> **9.0010**: A question whose answer has not been given yet.

TODO: answer pending

## More Information

This optional section can contain additional information. There is no defined format for this section.

```

---

## Assistant (Plan · Claude Sonnet 5 · 45.0s)

_Thinking:_



### License caveat, explained

The bpmn.io License (what bpmn-js, dmn-js, form-js ship under) is MIT plus exactly one extra clause:

> "The source code responsible for displaying the bpmn.io project watermark that links back to https://bpmn.io as part of rendered diagrams MUST NOT be removed or changed... the watermark must stay fully visible and not visually overlapped by other elements."

In practice this means: bpmn-js renders a small "powered by bpmn.io" link in the corner of the canvas by default, and the license says you can't delete it, hide it with CSS, or cover it with another element. That's the entire obligation — no fee, no registration, no extra license key, nothing else restricted (you can still fork it, modify the rest, embed it, etc.). Camunda's enterprise customers can reportedly get a contractual waiver to remove it, but that's irrelevant for FOSS/local use.

For a tool only you (and this conversation's "user") open locally, this is a non-issue in practice — it's a tiny attribution link nobody but you will ever see. I'd mark it as **accepted, not a blocker**, unless you have a specific reason to want a watermark-free canvas (e.g. you intend to screenshot it into something public-facing later).

### On "independent of OC" and language

MCP itself is protocol-agnostic — you could write the server in Python, Go, Rust, C#, etc. (e.g. `lepoco/mcp-camunda` from my earlier research is C#). **But** the only mature, FOSS, actively-maintained BPMN 2.0 parsing/linting/rendering stack is the bpmn-io one (bpmn-moddle, bpmnlint, bpmn-js) — and that's JavaScript/TypeScript only. There's no equivalent-depth BPMN library in Python/Go/Rust I found in this research. So practically:

- **"Independent of OpenCode"**: fully achievable — a Node/TypeScript MCP server in its own repo is a completely standard, portable MCP server; OpenCode is just one of many clients that can connect to it (same as `asdste100`/`specmgr` here).
- **"Independent of Node/JS as an implementation language"**: a separate, much bigger ask — it would mean either reimplementing BPMN XML parsing/validation yourself in another language, or shelling out to a Node subprocess from whatever language hosts the MCP server (which mostly just relocates the JS dependency rather than removing it).

My assumption going forward: you mean the former (not locked to OpenCode), and the implementation will be Node/TypeScript. Flag me if that's wrong.

With that settled: **MCP server, Node/TypeScript, Stage 1 scope only, bpmn-js as a Viewer (not full Modeler, since Stage 1 only displays — Stage 2 later would upgrade to full bpmn-js Modeler + properties-panel for the live/interactive case).**

### Before I draft the DEC/REQ/QA write-up

Since I can't write files in plan mode (and the target is a repo that doesn't exist yet), I'll draft the full content as markdown directly in my response, matching this repo's exact REQ/DEC/QA templates, for you to copy into the new repo once it exists (or have me create them here via `specmgr_create_*` once you're ready, if you'd rather stage them here first and export). Before I write all of it out, does this breakdown look right?

- **1 DEC**: "Use a Node/TypeScript MCP server (not an OpenCode plugin) built on bpmn-js/bpmn-moddle/bpmnlint for agent-driven BPMN modeling" — with the MCP-vs-plugin-vs-hybrid options we discussed.
- **~8 REQs**, one requirement each: create, change, import, export, validate (bpmnlint), parse (bpmn-moddle), FOSS, local/on-prem-only, MCP-host-portability, and Stage-1 browser-preview capability.
- **1 QA**: the elicitation record of this whole conversation (BPMN tool landscape, Excalidraw precedent, license caveat, MCP vs plugin tradeoffs) organized under the QA template's ISO 25010 headings, so the new repo's agent has full rationale without re-deriving it.

---

## User

I created a new folder here: ~/src/biz.dfch.BpmnMcp

---

## Assistant (Plan · Claude Sonnet 5 · 10.8s)

_Thinking:_



**Tool: bash**

**Input:**
```json
{
  "command": "ls -la ~/src/biz.dfch.BpmnMcp 2>&1; echo \"---git---\"; git -C ~/src/biz.dfch.BpmnMcp status 2>&1; echo \"---find---\"; find ~/src/biz.dfch.BpmnMcp -maxdepth 3 2>&1"
}
```

**Output:**
```
total 36
drwxrwxr-x  5 user user 4096 Oct 22 09:08 .
drwxrwxr-x 57 user user 4096 Oct 22 09:07 ..
drwxrwxr-x  6 user user 4096 Oct 22 09:07 .git
-rw-rw-r--  1 user user  109 Oct 22 09:07 .gitignore
-rw-rw-r--  1 user user    5 Oct 22 09:07 .python-version
drwxrwxr-x  4 user user 4096 Oct 22 09:08 .venv
-rw-rw-r--  1 user user    0 Oct 22 09:07 README.md
-rw-rw-r--  1 user user  399 Oct 22 09:07 pyproject.toml
drwxrwxr-x  3 user user 4096 Oct 22 09:07 src
-rw-rw-r--  1 user user  137 Oct 22 09:08 uv.lock
---git---
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.gitignore
	.python-version
	README.md
	pyproject.toml
	src/
	uv.lock

nothing added to commit but untracked files present (use "git add" to track)
---find---
/home/user/src/biz.dfch.BpmnMcp
/home/user/src/biz.dfch.BpmnMcp/.git
/home/user/src/biz.dfch.BpmnMcp/.git/config
/home/user/src/biz.dfch.BpmnMcp/.git/refs
/home/user/src/biz.dfch.BpmnMcp/.git/refs/tags
/home/user/src/biz.dfch.BpmnMcp/.git/refs/heads
/home/user/src/biz.dfch.BpmnMcp/.git/HEAD
/home/user/src/biz.dfch.BpmnMcp/.git/info
/home/user/src/biz.dfch.BpmnMcp/.git/info/exclude
/home/user/src/biz.dfch.BpmnMcp/.git/objects
/home/user/src/biz.dfch.BpmnMcp/.git/objects/info
/home/user/src/biz.dfch.BpmnMcp/.git/objects/pack
/home/user/src/biz.dfch.BpmnMcp/.git/description
/home/user/src/biz.dfch.BpmnMcp/.git/hooks
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/push-to-checkout.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/post-update.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/sendemail-validate.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-rebase.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/fsmonitor-watchman.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-commit.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/applypatch-msg.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-applypatch.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-receive.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/update.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/prepare-commit-msg.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-merge-commit.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/commit-msg.sample
/home/user/src/biz.dfch.BpmnMcp/.git/hooks/pre-push.sample
/home/user/src/biz.dfch.BpmnMcp/README.md
/home/user/src/biz.dfch.BpmnMcp/src
/home/user/src/biz.dfch.BpmnMcp/src/biz_dfch_bpmnmcp
/home/user/src/biz.dfch.BpmnMcp/src/biz_dfch_bpmnmcp/__init__.py
/home/user/src/biz.dfch.BpmnMcp/.venv
/home/user/src/biz.dfch.BpmnMcp/.venv/.lock
/home/user/src/biz.dfch.BpmnMcp/.venv/bin
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.bat
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/python3.13
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/python3
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.fish
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.csh
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/python
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/biz-dfch-bpmnmcp
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/pydoc.bat
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate_this.py
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.xsh
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.nu
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/deactivate.bat
/home/user/src/biz.dfch.BpmnMcp/.venv/bin/activate.ps1
/home/user/src/biz.dfch.BpmnMcp/.venv/pyvenv.cfg
/home/user/src/biz.dfch.BpmnMcp/.venv/lib64
/home/user/src/biz.dfch.BpmnMcp/.venv/lib
/home/user/src/biz.dfch.BpmnMcp/.venv/lib/python3.13
/home/user/src/biz.dfch.BpmnMcp/.venv/CACHEDIR.TAG
/home/user/src/biz.dfch.BpmnMcp/.venv/.gitignore
/home/user/src/biz.dfch.BpmnMcp/pyproject.toml
/home/user/src/biz.dfch.BpmnMcp/uv.lock
/home/user/src/biz.dfch.BpmnMcp/.python-version
/home/user/src/biz.dfch.BpmnMcp/.gitignore

```

---

## Assistant (Plan · Claude Sonnet 5 · 51.9s)

_Thinking:_



**Tool: webfetch**

**Input:**
```json
{
  "url": "https://github.com/sartography/SpiffWorkflow",
  "format": "markdown"
}
```

**Output:**
```
                                                                                                          GitHub - sartography/SpiffWorkflow: A powerful workflow engine implemented in pure Python · GitHub                                             

[Skip to content](#start-of-content)     

    

           

## Navigation Menu

[](/)

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsartography%2FSpiffWorkflow)

Appearance settings

-   Platform
    
    -   AI CODE CREATION
        
        -   [GitHub CopilotWrite better code with AI](https://github.com/features/copilot)
        -   [GitHub Copilot appDirect agents from issue to merge](https://github.com/features/ai/github-app)
        -   [MCP RegistryIntegrate external tools](https://github.com/mcp)
        
    -   DEVELOPER WORKFLOWS
        
        -   [ActionsAutomate any workflow](https://github.com/features/actions)
        -   [CodespacesInstant dev environments](https://github.com/features/codespaces)
        -   [IssuesPlan and track work](https://github.com/features/issues)
        -   [Code ReviewManage code changes](https://github.com/features/code-review)
        -   [Code QualityEnforce quality at merge](https://github.com/features/code-quality)
        
    -   APPLICATION SECURITY
        
        -   [GitHub Advanced SecurityFind and fix vulnerabilities](https://github.com/security/advanced-security)
        -   [Code securitySecure your code as you build](https://github.com/security/advanced-security/code-security)
        -   [Secret protectionStop leaks before they start](https://github.com/security/advanced-security/secret-protection)
        
    -   EXPLORE
        
        -   [Why GitHub](https://github.com/why-github)
        -   [Documentation](https://docs.github.com)
        -   [Blog](https://github.blog)
        -   [Changelog](https://github.blog/changelog)
        -   [Marketplace](https://github.com/marketplace)
        
    
    [View all features](https://github.com/features)
    
-   Solutions
    
    -   BY COMPANY SIZE
        
        -   [Enterprises](https://github.com/enterprise)
        -   [Small and medium teams](https://github.com/team)
        -   [Startups](https://github.com/enterprise/startups)
        -   [Nonprofits](https://github.com/solutions/industry/nonprofits)
        
    -   BY USE CASE
        
        -   [App Modernization](https://github.com/solutions/use-case/app-modernization)
        -   [DevSecOps](https://github.com/solutions/use-case/devsecops)
        -   [DevOps](https://github.com/solutions/use-case/devops)
        -   [CI/CD](https://github.com/solutions/use-case/ci-cd)
        -   [View all use cases](https://github.com/solutions/use-case)
        
    -   BY INDUSTRY
        
        -   [Healthcare](https://github.com/solutions/industry/healthcare)
        -   [Financial services](https://github.com/solutions/industry/financial-services)
        -   [Manufacturing](https://github.com/solutions/industry/manufacturing)
        -   [Government](https://github.com/solutions/industry/government)
        -   [View all industries](https://github.com/solutions/industry)
        
    
    [View all solutions](https://github.com/solutions)
    
-   Resources
    
    -   EXPLORE BY TOPIC
        
        -   [AI](https://github.com/resources/articles?topic=ai)
        -   [Software Development](https://github.com/resources/articles?topic=software-development)
        -   [DevOps](https://github.com/resources/articles?topic=devops)
        -   [Security](https://github.com/resources/articles?topic=security)
        -   [View all topics](https://github.com/resources/articles)
        
    -   EXPLORE BY TYPE
        
        -   [Customer stories](https://github.com/customer-stories)
        -   [Events & webinars](https://github.com/resources/events)
        -   [Ebooks & reports](https://github.com/resources/whitepapers)
        -   [Business insights](https://github.com/solutions/executive-insights)
        -   [GitHub Skills](https://skills.github.com)
        
    -   SUPPORT & SERVICES
        
        -   [Documentation](https://docs.github.com)
        -   [Customer support](https://support.github.com)
        -   [Community forum](https://github.com/orgs/community/discussions)
        -   [Trust center](https://github.com/trust-center)
        -   [Partners](https://github.com/partners)
        
    
    [View all resources](https://github.com/resources)
    
-   Open Source
    
    -   COMMUNITY
        
        -   [GitHub SponsorsFund open source developers](https://github.com/open-source/sponsors)
        
    -   PROGRAMS
        
        -   [Security Lab](https://securitylab.github.com)
        -   [Maintainer Community](https://maintainers.github.com)
        -   [GitHub Stars](https://stars.github.com)
        -   [Archive Program](https://archiveprogram.github.com)
        
    -   REPOSITORIES
        
        -   [Topics](https://github.com/topics)
        -   [Trending](https://github.com/trending)
        -   [Collections](https://github.com/collections)
        
    
-   Enterprise
    
    -   ENTERPRISE SOLUTIONS
        
        -   [Enterprise platformAI-powered developer platform](https://github.com/enterprise)
        
    -   AVAILABLE ADD-ONS
        
        -   [GitHub Advanced SecurityEnterprise-grade security features](https://github.com/security/advanced-security)
        -   [Copilot for BusinessEnterprise-grade AI features](https://github.com/features/copilot/copilot-business)
        -   [Premium SupportEnterprise-grade 24/7 support](https://github.com/enterprise/premium-support)
        
    
-   [Pricing](https://github.com/pricing)

Search/

[Sign in](/login?return_to=https%3A%2F%2Fgithub.com%2Fsartography%2FSpiffWorkflow)

[Sign up](/signup?ref_cta=Sign+up&ref_loc=header+logged+out&ref_page=%2F%3Cuser-name%3E%2F%3Crepo-name%3E&source=header-repo&source_repo=sartography%2FSpiffWorkflow)

Appearance settings

You signed in with another tab or window. Reload to refresh your session. You signed out in another tab or window. Reload to refresh your session. You switched accounts on another tab or window. Reload to refresh your session. Dismiss alert

                   

1.  [sartography](/sartography)
2.  [SpiffWorkflow](/sartography/SpiffWorkflow)

## Repository navigation

-   [Code](/sartography/SpiffWorkflow)
-   [Issues7 (7)](/sartography/SpiffWorkflow/issues)
-   [Pull requests1 (1)](/sartography/SpiffWorkflow/pulls)
-   [Actions](/sartography/SpiffWorkflow/actions)
-   [Projects](/sartography/SpiffWorkflow/projects)
-   [Wiki](/sartography/SpiffWorkflow/wiki)
-   [Security and quality](/sartography/SpiffWorkflow/security)
-   [Insights](/sartography/SpiffWorkflow/pulse)

More items

 [](/sartography/SpiffWorkflow)

![sartography](https://avatars.githubusercontent.com/u/43791153?s=60&v=4)

**[SpiffWorkflow](/sartography/SpiffWorkflow)**

Public

-   [Notifications](/login?return_to=%2Fsartography%2FSpiffWorkflow)You must be signed in to change notification settings
-   [Fork347 (347)](/login?return_to=%2Fsartography%2FSpiffWorkflow)
-   [Star1.9k (1.9k)](/login?return_to=%2Fsartography%2FSpiffWorkflow)You must be signed in to star a repository

## About

A powerful workflow engine implemented in pure Python

### Topics

[bpmn](/topics/bpmn)[bpmn-engine](/topics/bpmn-engine)[python](/topics/python)[spiff-workflow](/topics/spiff-workflow)[workflow](/topics/workflow)[workflow-specification](/topics/workflow-specification)[workflowpatterns](/topics/workflowpatterns)

### Resources

[Readme](#readme-ov-file)

[LGPL-3.0 license](#LGPL-3.0-1-ov-file)

Cite this repository

[Activity](/sartography/SpiffWorkflow/activity)

[Custom properties](/sartography/SpiffWorkflow/custom-properties)

### Stars

**1.9k** stars

### Watchers

**90** watching

### Forks

[**347** forks](/sartography/SpiffWorkflow/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fsartography%2FSpiffWorkflow&report=sartography+%28user%29)

main

[Branches](/sartography/SpiffWorkflow/branches)[Tags](/sartography/SpiffWorkflow/tags)

[](/sartography/SpiffWorkflow/branches)[](/sartography/SpiffWorkflow/tags)

Go to file

Code

Open more actions menu

## Latest commit

## History

[2,254 Commits](/sartography/SpiffWorkflow/commits/main/)

[](/sartography/SpiffWorkflow/commits/main/)2,254 Commits

## Folders and files

Name

Name

Last commit message

Last commit date

[.github/workflows](/sartography/SpiffWorkflow/tree/main/.github/workflows "This path skips through empty directories")

[.github/workflows](/sartography/SpiffWorkflow/tree/main/.github/workflows "This path skips through empty directories")

[SpiffWorkflow](/sartography/SpiffWorkflow/tree/main/SpiffWorkflow "SpiffWorkflow")

[SpiffWorkflow](/sartography/SpiffWorkflow/tree/main/SpiffWorkflow "SpiffWorkflow")

[docs](/sartography/SpiffWorkflow/tree/main/docs "docs")

[docs](/sartography/SpiffWorkflow/tree/main/docs "docs")

[graphics](/sartography/SpiffWorkflow/tree/main/graphics "graphics")

[graphics](/sartography/SpiffWorkflow/tree/main/graphics "graphics")

[scripts](/sartography/SpiffWorkflow/tree/main/scripts "scripts")

[scripts](/sartography/SpiffWorkflow/tree/main/scripts "scripts")

[tests](/sartography/SpiffWorkflow/tree/main/tests "tests")

[tests](/sartography/SpiffWorkflow/tree/main/tests "tests")

[.editorconfig](/sartography/SpiffWorkflow/blob/main/.editorconfig ".editorconfig")

[.editorconfig](/sartography/SpiffWorkflow/blob/main/.editorconfig ".editorconfig")

[.flake8](/sartography/SpiffWorkflow/blob/main/.flake8 ".flake8")

[.flake8](/sartography/SpiffWorkflow/blob/main/.flake8 ".flake8")

[.gitignore](/sartography/SpiffWorkflow/blob/main/.gitignore ".gitignore")

[.gitignore](/sartography/SpiffWorkflow/blob/main/.gitignore ".gitignore")

[.readthedocs.yaml](/sartography/SpiffWorkflow/blob/main/.readthedocs.yaml ".readthedocs.yaml")

[.readthedocs.yaml](/sartography/SpiffWorkflow/blob/main/.readthedocs.yaml ".readthedocs.yaml")

[.tool-versions](/sartography/SpiffWorkflow/blob/main/.tool-versions ".tool-versions")

[.tool-versions](/sartography/SpiffWorkflow/blob/main/.tool-versions ".tool-versions")

[.travis.yml](/sartography/SpiffWorkflow/blob/main/.travis.yml ".travis.yml")

[.travis.yml](/sartography/SpiffWorkflow/blob/main/.travis.yml ".travis.yml")

[AUTHORS](/sartography/SpiffWorkflow/blob/main/AUTHORS "AUTHORS")

[AUTHORS](/sartography/SpiffWorkflow/blob/main/AUTHORS "AUTHORS")

[CITATION.cff](/sartography/SpiffWorkflow/blob/main/CITATION.cff "CITATION.cff")

[CITATION.cff](/sartography/SpiffWorkflow/blob/main/CITATION.cff "CITATION.cff")

[CONTRIB](/sartography/SpiffWorkflow/blob/main/CONTRIB "CONTRIB")

[CONTRIB](/sartography/SpiffWorkflow/blob/main/CONTRIB "CONTRIB")

[COPYING](/sartography/SpiffWorkflow/blob/main/COPYING "COPYING")

[COPYING](/sartography/SpiffWorkflow/blob/main/COPYING "COPYING")

[Dockerfile](/sartography/SpiffWorkflow/blob/main/Dockerfile "Dockerfile")

[Dockerfile](/sartography/SpiffWorkflow/blob/main/Dockerfile "Dockerfile")

[Makefile](/sartography/SpiffWorkflow/blob/main/Makefile "Makefile")

[Makefile](/sartography/SpiffWorkflow/blob/main/Makefile "Makefile")

[README.md](/sartography/SpiffWorkflow/blob/main/README.md "README.md")

[README.md](/sartography/SpiffWorkflow/blob/main/README.md "README.md")

[RELEASE\_NOTES.md](/sartography/SpiffWorkflow/blob/main/RELEASE_NOTES.md "RELEASE_NOTES.md")

[RELEASE\_NOTES.md](/sartography/SpiffWorkflow/blob/main/RELEASE_NOTES.md "RELEASE_NOTES.md")

[pyproject.toml](/sartography/SpiffWorkflow/blob/main/pyproject.toml "pyproject.toml")

[pyproject.toml](/sartography/SpiffWorkflow/blob/main/pyproject.toml "pyproject.toml")

[uv.lock](/sartography/SpiffWorkflow/blob/main/uv.lock "uv.lock")

[uv.lock](/sartography/SpiffWorkflow/blob/main/uv.lock "uv.lock")

View all files

## Repository files navigation

-   [README](#)
-   [LGPL-3.0 license](#)

More items

## SpiffWorkflow

[](#spiffworkflow)

[![Logo](/sartography/SpiffWorkflow/raw/main/graphics/logo_med.png)](/sartography/SpiffWorkflow/blob/main/graphics/logo_med.png)

Spiff Workflow is a workflow engine implemented in pure Python. It is based on the excellent work of the Workflow Patterns initiative. In 2020 and 2021, extensive support was added for BPMN / DMN processing.

## Motivation

[](#motivation)

We created SpiffWorkflow to support the development of low-code business applications in Python. Using BPMN will allow non-developers to describe complex workflow processes in a visual diagram, coupled with a powerful python script engine that works seamlessly within the diagrams. SpiffWorkflow can parse these diagrams and execute them. The ability for businesses to create clear, coherent diagrams that drive an application has far reaching potential. While multiple tools exist for doing this in Java, we believe that wide adoption of the Python Language, and it's ease of use, create a winning strategy for building Low-Code applications.

## Build status

[](#build-status)

[![SpiffWorkflow](https://github.com/sartography/SpiffWorkflow/actions/workflows/tests.yaml/badge.svg)](https://github.com/sartography/SpiffWorkflow/actions/workflows/tests.yaml) [![Documentation](https://camo.githubusercontent.com/81760b96208335a8303d4d07df57e111280789ec2ca06b99590953cd913ff22b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f646f63732d73706966662e776f726b732d626c7565)](https://spiff.works/docs/spiffworkflow/) [![Issues](https://camo.githubusercontent.com/fd3f7003b28bc218ef7ce3687980eb53d150a4ce937fb7ca49ad648499c47d24/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732f736172746f6772617068792f7370696666776f726b666c6f77)](https://github.com/sartography/SpiffWorkflow/issues) [![Pull Requests](https://camo.githubusercontent.com/517b97a2ddc8b432e6a468cd2ad7f3c4fc08a067bb509bdd077d76efebf326cd/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6973737565732d70722f736172746f6772617068792f7370696666776f726b666c6f77)](https://github.com/sartography/SpiffWorkflow/pulls)

## Code style

[](#code-style)

[![PEP8](https://camo.githubusercontent.com/e759dabee98743e65c1f59b0410fe063e96d6c8a330793754586d23533522f9c/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f64652532307374796c652d706570382d6f72616e67652e737667)](https://www.python.org/dev/peps/pep-0008/)

## Dependencies

[](#dependencies)

We've worked to minimize external dependencies. We rely on [lxml](https://lxml.de/) for parsing XML Documents, and that's it!

## Features

[](#features)

-   **BPMN** - support for parsing BPMN diagrams, including the more complex components, like pools and lanes, multi-instance tasks, sub-workflows, timer events, signals, messages, boudary events and looping.
-   **DMN** - We have a baseline implementation of DMN that is well integrated with our Python Execution Engine.
-   **Python Workflows** - We've retained support for building workflows directly in code, or running workflows based on a internal json data structure.

*A complete list of the latest features is available with our [release notes](https://github.com/sartography/SpiffWorkflow/releases/tag/1.0) for version 1.0.*

## Code Examples and Documentation

[](#code-examples-and-documentation)

Detailed documentation is available on [spiff.works](https://spiff.works/docs/spiffworkflow/). Also, checkout our [example application](https://github.com/sartography/spiff-example-cli), which we reference extensively from the Documentation.

## Installation

[](#installation)

```
pip install spiffworkflow
```

## Tests

[](#tests)

Standard environment:

```
pip install -e .[dev]
make tests
make tests-par
make tests-cov
```

Using `uv`:

uv sync --extra dev
make RUN='uv run' tests
make RUN='uv run' tests-par
make RUN='uv run' tests-cov

## Support

[](#support)

You can find us on Discord at [https://discord.gg/BYHcc7PpUC](https://discord.gg/BYHcc7PpUC)

Commercial support for SpiffWorkflow is available from [Sartography](https://sartography.com)

## Contribute

[](#contribute)

Pull Requests are and always will be welcome!

Please check your formatting, assure that all tests are passing, and include any additional tests that can demonstrate the new code you created is working as expected. If applicable, please reference the issue number in your pull request.

## Credits and Thanks

[](#credits-and-thanks)

Samuel Abels (@knipknap) for creating SpiffWorkflow and maintaining it for over a decade.

Matthew Hampton (@matthewhampton) for his initial contributions around BPMN parsing and execution.

The University of Virginia for allowing us to take on the mammoth task of building a general-purpose workflow system for BPMN, and allowing us to contribute that back to the open source community. In particular, we would like to thank [Ron Hutchins](https://www.linkedin.com/in/ron-hutchins-b19603123/), for his trust and support. Without him our efforts would not be possible.

Bruce Silver, the author of BPMN Quick and Easy Using Method and Style, whose work we referenced extensively as we made implementation decisions and educated ourselves on the BPMN and DMN standards.

The BPMN.js library, without which we would not have the tools to effectively build out our models, embed an editor in our application, and pull this mad mess together.

Kelly McDonald (@w4kpm) who dove deeper into the core of SpiffWorkflow than anyone else, and was instrumental in helping us get some of these major enhancements working correctly.

Thanks also to the many contributions from our community. Large and small. From Ziad (@ziadsawalha) in the early days to Elizabeth (@essweine) more recently. It is good to be a part of this long lived and strong community.

## License

[](#license)

GNU LESSER GENERAL PUBLIC LICENSE

## About

A powerful workflow engine implemented in pure Python

### Topics

[bpmn](/topics/bpmn)[bpmn-engine](/topics/bpmn-engine)[python](/topics/python)[spiff-workflow](/topics/spiff-workflow)[workflow](/topics/workflow)[workflow-specification](/topics/workflow-specification)[workflowpatterns](/topics/workflowpatterns)

### Resources

[Readme](#readme-ov-file)

[LGPL-3.0 license](#LGPL-3.0-1-ov-file)

Cite this repository

[Activity](/sartography/SpiffWorkflow/activity)

[Custom properties](/sartography/SpiffWorkflow/custom-properties)

### Stars

**1.9k** stars

### Watchers

**90** watching

### Forks

[**347** forks](/sartography/SpiffWorkflow/forks)

[Report repository](/contact/report-content?content_url=https%3A%2F%2Fgithub.com%2Fsartography%2FSpiffWorkflow&report=sartography+%28user%29)

## Releases

## Packages

## Used by

## Contributors

## Languages

## Footer

[](https://github.com)© 2026 GitHub, Inc.

### Footer navigation

-   [Terms](https://docs.github.com/site-policy/github-terms/github-terms-of-service)
-   [Privacy](https://docs.github.com/site-policy/privacy-policies/github-privacy-statement)
-   [Security](https://github.com/security)
-   [Status](https://www.githubstatus.com/)
-   [Community](https://github.community/)
-   [Docs](https://docs.github.com/)
-   [Contact](https://support.github.com?tags=dotcom-footer)
-   Manage cookies
-   Do not share my personal information

You can’t perform that action at this time.
```

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/user/src/biz.dfch.BpmnMcp/pyproject.toml"
}
```

**Output:**
```
<path>/home/user/src/biz.dfch.BpmnMcp/pyproject.toml</path>
<type>file</type>
<content>
1: [project]
2: name = "biz-dfch-bpmnmcp"
3: version = "0.1.0"
4: description = "Add your description here"
5: readme = "README.md"
6: authors = [
7:     { name = "Ronald Rink", email = "8310360+dfch@users.noreply.github.com" }
8: ]
9: requires-python = ">=3.13"
10: dependencies = []
11: 
12: [project.scripts]
13: biz-dfch-bpmnmcp = "biz_dfch_bpmnmcp:main"
14: 
15: [build-system]
16: requires = ["uv_build>=0.12.1,<0.13.0"]
17: build-backend = "uv_build"

(End of file - total 17 lines)
</content>
```

---

## Assistant (Plan · Claude Sonnet 5 · 48.3s)

_Thinking:_



I found your scaffold — it's a **Python** project (`uv`, Python 3.13, `biz-dfch-bpmnmcp`), which changes the picture from what we'd been assuming (Node/TypeScript). Worth surfacing before I lock in the DEC.

## The Python vs. JS tension, concretely

I checked the one serious pure-Python BPMN project, **SpiffWorkflow** (1.9k★, LGPL-3.0, pure Python, `lxml`-based):

- It parses BPMN 2.0 XML into a Python object model and is a full **execution engine** (it runs the process, not just models it) — genuinely mature for "parse" and execution-style validity checks.
- Telling detail from its own credits: *"The BPMN.js library, without which we would not have the tools to effectively build out our models, embed an editor in our application, and pull this mad mess together."* — even SpiffWorkflow's own maintainers, building the most serious Python BPMN project that exists, still reach for **bpmn-js (JS)** the moment they need an actual visual editor/canvas. There is no pure-Python equivalent of bpmn-js, and none of bpmnlint's configurable modeling-rule linting either.
- It's also oriented around parsing/running *existing* diagrams, not generating new ones with layout from scratch — so "create a new diagram with sensible auto-layout" is weak-to-absent in pure Python too.

So the honest picture: **parse** has a decent pure-Python option (SpiffWorkflow); **create/export with layout**, **rule-based validate (bpmnlint)**, and **any interactive canvas (Stage 1 preview)** do not — those all still run through the JS stack (bpmn-moddle/bpmnlint/bpmn-js), same conclusion as before, just now it directly collides with the scaffold you've already created.

## Three ways to resolve this

1. **Pure Python, accept the gaps** — use SpiffWorkflow for parse/import; hand-roll minimal BPMN XML templating in Python for create/export (real work, no layout engine to lean on); skip bpmnlint-style validation or reimplement a thin rule-checker yourself. Stage-1 preview is still just a static bpmn-js HTML page, which needs no Python logic to serve (any HTTP server works, including Python's). Keeps the project 100% Python, but you're reinventing meaningful chunks of what bpmn-moddle/bpmnlint already solved.
2. **Python MCP shell + bundled Node sidecar for BPMN-specific logic (my recommendation)** — the MCP server itself stays Python (matches this scaffold, `uv`, your other `biz.dfch.*` tooling conventions), but `create`/`export`/`validate`/`parse` shell out to a small bundled Node script or a managed Node sidecar process that does the real work via bpmn-moddle + bpmnlint. You get full fidelity without reimplementing BPMN semantics, at the cost of Node.js becoming a required runtime dependency next to Python (not "pure Python" anymore, but still 100% FOSS/local).
3. **Abandon this scaffold, start a Node/TypeScript project instead** — cleanest technically (no second runtime, direct access to bpmn-js/bpmn-moddle/bpmnlint), but throws away what you just created and breaks from whatever convention led you to scaffold Python here in the first place.

Given you already set this up as Python, I'd lean toward **option 2**, but this is really your call since it affects deployment/ops (two runtimes to install) going forward. Which way do you want to go — and was the Python scaffold a deliberate choice for this project, or just a default template you reached for before we'd nailed down the library situation?

---

## User

Do not assume it is a py project - I only initialised with uv, in case an agent wants to run some simple scripts.

---

## Assistant (Plan · Claude Sonnet 5 · 132.2s)

_Thinking:_



Good — that removes the constraint. With Python off the table as a given, the technically clean path is back: **Node.js/TypeScript**, since that's where bpmn-moddle, bpmnlint, and bpmn-js all live natively with zero gaps (the `uv` scaffold can stay untouched for any incidental Python scripting later — unrelated to the server itself).

Locking in for the write-up: **MCP server, Node/TypeScript, built on bpmn-js (Viewer) + bpmn-moddle + bpmnlint, Stage 1 scope only** (Stage 2 live-canvas noted as a deferred future direction, not built now).

Since I'm still in plan mode I can't write files or call `specmgr_create_*` — here's the full content, ready to create (via specmgr, once you're out of plan mode) or copy straight into the new repo.

---

## DEC — Decision

```markdown
# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Context and Problem Statement

A user and an AI coding agent need to create, change, import, export,
validate, and parse BPMN 2.0 process diagrams, starting with a workflow
where the agent edits a diagram and the user can view the result in a
browser. The solution must be Free and Open Source Software (FOSS) and
must run entirely locally / on-premises, on the same system as the
agent host, with no mandatory cloud dependency.

## Decision Drivers

- FOSS licensing, no paid component required
- Local / on-premises operation only
- The solution must not be locked to one specific AI agent host
- Reuse of mature, well-maintained BPMN tooling over custom-built
  parsing, linting, or rendering
- Low operational complexity (few moving parts, few runtimes)

## Considered Options

- MCP (Model Context Protocol) server, implemented in Node/TypeScript
- An OpenCode v2 plugin
- A hybrid: a shared core library with both an MCP adapter and an
  OpenCode v2 plugin adapter
- An MCP server implemented in Python, delegating BPMN-specific
  operations to a bundled Node.js helper process

## Decision Outcome

Chosen option: "MCP server, implemented in Node/TypeScript", because it
is the only option that is both host-agnostic (usable from any
MCP-capable agent, not only OpenCode) and free of any cross-language
bridge. The mature, actively maintained, FOSS BPMN tooling needed for
this project (bpmn-moddle, bpmnlint, bpmn-js) exists only as
JavaScript/TypeScript libraries; authoring the server itself in the
same language avoids adding a second runtime or a subprocess bridge.

### Consequences

- The project depends on Node.js as its runtime, and on the bpmn.io
  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.
- The server is usable from any MCP-compatible agent host, not only
  OpenCode.
- A later OpenCode-specific integration (e.g. for deeper, host-native
  hooks) remains possible as an additional, separate adapter on top of
  the same core, without changing this decision.
- bpmn-js ships under the "bpmn.io License" (MIT plus a clause
  requiring its small attribution watermark to remain visible and
  unmodified on any rendered canvas). This is accepted; see Pros and
  Cons of Option 1 below.

### Confirmation

This decision is confirmed once a minimal MCP server built on
bpmn-moddle and bpmnlint can create, import, export, validate, and
parse a BPMN 2.0 diagram end to end, and a human can view the current
diagram in a browser after an agent-driven change (Stage 1 scope; see
the related requirements).

## Roles and Responsibilities

### Accountable

Ronald Rink

### Responsible

- Ronald Rink
- The implementing AI coding agent

### Support

### Consulted

### Informed

## Tags

- bpmn
- mcp
- foss
- architecture

## Source

Design discussion and research conducted interactively with an AI
coding agent (OpenCode), researching BPMN modeler options, the
bpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2
plugin API, prior to starting the `biz.dfch.BpmnMcp` project.

## Related Artifacts

### Requirements

- REQ (see companion requirement documents in this write-up): FOSS
  licensing
- REQ: Local / on-premises operation
- REQ: Create BPMN 2.0 diagrams
- REQ: Change BPMN 2.0 diagrams
- REQ: Import BPMN 2.0 XML
- REQ: Export BPMN 2.0 XML
- REQ: Validate BPMN 2.0 diagrams
- REQ: Parse BPMN 2.0 XML
- REQ: Expose functionality via a host-agnostic MCP server
- REQ: Browser preview of agent-driven diagram changes (Stage 1)

### Decisions

### Goals

### Risks

## Pros and Cons

### Option 1: MCP server, implemented in Node/TypeScript

- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable
  with no cross-language bridge.
- Good, because MCP is a stable, cross-vendor protocol usable from any
  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,
  OpenCode, ...), not only OpenCode.
- Good, because it runs as its own process, independently restartable
  and inspectable, isolated from the agent host's own process.
- Bad, because it adds a tool-call round trip through the MCP
  transport (stdio or network) rather than an in-process function
  call; negligible for a local tool.
- Bad, because a later real-time, two-way-synced browser canvas
  (Stage 2) needs an additional, separate canvas-server process next
  to the MCP server process, rather than a single shared process.
- Bad, because bpmn-js's "bpmn.io License" requires a small,
  unremovable attribution watermark to stay visible on any rendered
  canvas; accepted as a non-issue for a local, non-public tool.

### Option 2: An OpenCode v2 plugin

- Good, because it runs in a single process together with the
  OpenCode host, simplifying a future real-time, two-way-synced
  browser canvas (Stage 2): one process, shared in-memory state.
- Good, because it can hook other tool calls
  (`ctx.tool.hook("execute.after")`), use OpenCode's own permission
  prompts (`ctx.permission.assert`), and post messages directly into
  the chat transcript (`ctx.session.synthetic`).
- Bad, because it only works inside OpenCode, directly violating the
  "not locked to one agent host" driver.
- Bad, because the v2 plugin API is new, and several of its hooks are
  explicitly marked experimental; more exposure to breaking changes
  than the MCP protocol.
- Bad, because OpenCode v2 plugins must be authored in
  JavaScript/TypeScript; this is not itself a downside relative to
  Option 1, but it buys no portability in exchange for the same
  language constraint.

### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)

- Good, because it keeps the door open to both host-agnostic use and
  deep OpenCode-native integration later.
- Good, because the core BPMN logic (parsing, validation, the canvas
  server) is written once and reused by both adapters.
- Bad, because it is the most engineering effort of the options
  considered, for a benefit (the second, OpenCode-specific adapter)
  that is not needed yet.
- Bad, because it is premature: no Stage 2 (live-canvas) requirement
  exists yet to justify the extra adapter.

### Option 4: Python MCP server with a bundled Node.js helper

- Good, because it would match a Python-first tooling convention, had
  one been required for this project.
- Bad, because it still depends on the same Node.js-only BPMN
  libraries under the hood, adding a second runtime and a subprocess
  or sidecar bridge for no corresponding benefit.
- Bad, because the one mature pure-Python BPMN project found
  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and
  has no equivalent to bpmnlint's configurable modeling-rule
  validation or to a diagram auto-layout engine.
- Not chosen: this project was not, in fact, committed to Python; an
  initial `uv`-based scaffold existed only as a placeholder for
  incidental scripting, not as a language decision.

## More Information

Comparable, publicly available BPMN+MCP projects exist (e.g.
`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all
headless (no live browser canvas). The closest architectural precedent
for a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`
(an MCP server for Excalidraw, not BPMN), which splits into a
canvas-server process (web UI + REST + WebSocket sync) and a thin
MCP/CLI client; this is the model to follow if/when Stage 2 (live
canvas) is undertaken for BPMN.

## Updates

<!-- Newest entry first -- prepend new entries directly below this comment. -->

### 2026-10-22 - Created

Initial decision record, drafted from an interactive research
conversation prior to starting implementation.
```

---

## REQ — Requirements (one document each)

```markdown
# The tool must be free and open source software

## Description

Every runtime component of the tool (the MCP server itself and every
library it depends on for BPMN parsing, validation, and rendering)
must be distributed under a Free and Open Source Software (FOSS)
license. No component may require a paid license, subscription, or
account to operate.

## Characteristics

1. Portability

## Level

MUST

## Priority

10

## Tags

- foss
- licensing

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-js ships under the "bpmn.io License" (MIT plus a clause requiring
a small, unremovable attribution watermark on any rendered canvas).
This is accepted as compliant with this requirement: the license
imposes no fee and no closed-source obligation, only an attribution
display rule.
```

```markdown
# The tool must run entirely locally or on-premises

## Description

The tool must operate fully on the same system as the agent host, with
no mandatory dependency on a remote service, cloud account, or network
connection for its core functionality (create, change, import, export,
validate, parse).

## Characteristics

1. Portability
2. Security

## Level

MUST

## Priority

10

## Tags

- local
- on-prem
- offline

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-js's canvas page loads its hand-drawn fonts from a CDN by
default; this is a cosmetic fallback only (plain system fonts are used
if unavailable) and must not be relied on for any functional behavior.
```

```markdown
# The tool shall create new BPMN 2.0 process diagrams

## Description

An agent must be able to create a new, empty or populated BPMN 2.0
process diagram from a structured request, without requiring an
existing file.

## Characteristics

1. Functional completeness

## Level

MUST

## Priority

20

## Tags

- bpmn
- create

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall change elements and flows in an existing BPMN 2.0 diagram

## Description

An agent must be able to add, update, connect, and delete BPMN
elements (events, tasks, gateways, sub-processes) and sequence/message
flows in a diagram already held by the tool.

## Characteristics

1. Functional completeness

## Level

MUST

## Priority

20

## Tags

- bpmn
- change

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall import existing BPMN 2.0 XML files

## Description

The tool must read a BPMN 2.0 XML document from disk (or from supplied
text) and load it as the current, addressable diagram, using
bpmn-moddle for structural parsing.

## Characteristics

1. Functional completeness
2. Compatibility

## Level

MUST

## Priority

20

## Tags

- bpmn
- import
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall export the current diagram as BPMN 2.0 XML

## Description

The tool must serialize the current, in-memory diagram back to a
standard-compliant BPMN 2.0 XML document, using bpmn-moddle, suitable
for opening in any BPMN 2.0 compliant tool.

## Characteristics

1. Functional completeness
2. Compatibility

## Level

MUST

## Priority

20

## Tags

- bpmn
- export
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall validate a diagram against configurable modeling rules

## Description

The tool must check the current diagram for BPMN modeling-correctness
and best-practice issues (for example: a process missing a start or
end event, a disconnected element, a sequence flow missing a
condition) using bpmnlint, and report the findings. The rule set must
be configurable.

## Characteristics

1. Functional correctness

## Level

MUST

## Priority

20

## Tags

- bpmn
- validate
- bpmnlint

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

bpmn-moddle alone only guarantees structurally well-formed XML; it has
no opinion on modeling completeness or style. bpmnlint runs on top of
the object tree bpmn-moddle produces and supplies this requirement.
```

```markdown
# The tool shall parse BPMN 2.0 XML into an addressable, structured model

## Description

The tool must expose the current diagram as a structured, in-memory
object model (elements, flows, their properties and relationships),
not only as an opaque XML string, so that an agent can query and
reference individual elements by id.

## Characteristics

1. Functional completeness

## Level

MUST

## Priority

20

## Tags

- bpmn
- parse
- bpmn-moddle

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall expose its functionality as a Model Context Protocol server

## Description

All functionality (create, change, import, export, validate, parse,
and the Stage 1 browser preview) must be exposed as tools on a Model
Context Protocol (MCP) server, so that the tool is usable by any
MCP-compatible agent host and is not limited to one specific AI coding
agent or editor.

## Characteristics

1. Portability
2. Interoperability

## Level

MUST

## Priority

10

## Tags

- mcp
- architecture
- portability

## Source

User requirement, stated directly at the start of this project.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling
```

```markdown
# The tool shall let a human view the current diagram in a browser after an agent change

## Description

After an agent creates or changes a diagram, a human must be able to
open a local web browser and see the current state of that diagram,
rendered visually (not as raw XML). For this first stage, this may be
a turn-based preview (an explicit preview step reloads the current
diagram) rather than a continuously live, two-way synchronized canvas.

## Characteristics

1. Operability

## Level

MUST

## Priority

30

## Tags

- bpmn
- preview
- bpmn-js
- stage-1

## Source

User requirement, stated directly at the start of this project, scoped
down to a turn-based preview for the first implementation stage.

## Related Artifacts

### Decisions

- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling

## Notes

A later, live, two-way-synchronized browser canvas (both the agent and
the human editing the same diagram in real time) was discussed and
deferred; see the Decision's "More Information" section for the
architectural precedent (`yctimlin/mcp_excalidraw`) to follow if and
when that stage is undertaken.
```

---

## QA — Elicitation record

```markdown
# BPMN Modeling Tool for Agent and Human Use — Research Q&A

## General

### Introduction

Interactive research conversation with an AI coding agent (OpenCode),
conducted 2026-10-22, exploring options for a BPMN modeler usable by
both a human and an AI agent, prior to starting the `biz.dfch.BpmnMcp`
project. Covers the BPMN tooling landscape, licensing constraints,
comparable MCP and OpenCode-plugin projects, and the resulting
architecture decision.

### Raw Requirements

> I want to use a BPMN modeler that has a UI that a user and an agent
> can both concurrently use to create, change, import, export,
> validate and parse BPMN diagrams.

Follow-up constraints added during the conversation:

> ... must be: FOSS; local / on-prem on the same system where the
> OpenCode instance runs.

> I hoped for something like Excalidraw — where an agent can draw the
> image on the same canvas and a user can see this in realtime.

## Elicitation Context

<!-- Elicited 2026-10-22, researching the general BPMN tooling landscape before any FOSS/local constraint was stated. -->

> **1.0010**: What are the general options for a BPMN modeler UI usable
> by both a human and an agent?

Turnkey collaborative SaaS platforms (Camunda 8 Web Modeler, SAP
Signavio, Bizagi); the open-source bpmn.io toolkit (bpmn-js,
bpmn-moddle, bpmnlint), self-hosted; or a file-based "take turns"
pattern where both sides read/write the same `.bpmn` XML file, the
same way this environment's `specmgr` already manages other document
types.

> **1.0020**: Once narrowed to FOSS and local/on-prem only, which
> options remain?

The bpmn.io toolkit (bpmn-js + bpmn-moddle + bpmnlint, self-hosted,
MIT/"bpmn.io License"); Camunda Desktop Modeler (MIT, Electron,
single-user, turn-based on the shared file); Flowable Modeler / jBPM
designer (Apache-2.0, web-based, lock-based rather than live
collaboration). Camunda 8 Web Modeler, Signavio, and Bizagi were
eliminated: cloud or non-FOSS-licensed self-managed.

## Functional Suitability

> **2.0010**: Why are both bpmn-moddle and bpmnlint needed?

bpmn-moddle is the parser/serializer: it reads/writes BPMN 2.0 XML
into/from a structured object tree according to the BPMN meta-model,
with no opinion on whether the diagram is semantically sound.
bpmnlint is a separate, configurable rule-based linter that runs on
the tree bpmn-moddle produces, checking modeling-correctness and style
(missing start/end events, disconnected elements, missing labels,
...). moddle alone would let a diagram "validate" while being
semantically broken; bpmnlint supplies the actual validate capability.

> **2.0020**: Is there an existing BPMN modeler with an Excalidraw-like
> live canvas (agent draws, human watches/interacts in real time)?

No FOSS BPMN equivalent was found. The precedent architecture exists
for Excalidraw (`yctimlin/mcp_excalidraw`, MIT): a canvas-server
process (web UI + REST + WebSocket sync) plus a thin MCP/CLI client,
broadcasting every agent change to any open browser tab and vice
versa. Several BPMN+MCP projects exist (`dattmavis/BPMN-MCP`,
`oisee/mcp-bpmn`, `Stieges/bpmn-generator`, the most mature of the
three) but all are headless XML/SVG generators; none provide a live,
two-way-synchronized canvas. This is a genuine gap, not a solved
problem, and is deferred as a future "Stage 2" rather than built now.

> **2.0030**: Was a pure-Python BPMN implementation considered, to match
> this project's `uv`-based scaffold?

Yes, but the scaffold turned out not to be a deliberate language
commitment (a placeholder for incidental scripting only), so this was
moot. For the record: the one mature pure-Python BPMN project found,
SpiffWorkflow (1.9k★, LGPL-3.0), is a parser and execution engine; its
own credits state it relies on bpmn-js for any visual editor, and it
has no equivalent to bpmnlint's configurable validation or to a
diagram auto-layout engine. A pure-Python path would have meant
reimplementing meaningful parts of what bpmn-moddle/bpmnlint/bpmn-js
already solve.

## Performance Efficiency

> **3.0010**: Any performance requirements elicited?

TODO: answer pending

## Compatibility

> **4.0010**: Should this be built as an OpenCode v2 plugin or as an
> MCP server?

MCP server, to stay independent of any one agent host. An OpenCode v2
plugin would allow deeper, single-process integration (tool-call
hooks, native permission prompts, posting messages into the chat
transcript) and has real precedent for exactly this "agent + live
local browser UI" pattern (the `octto`, 525★, and `plannotator`
plugins), but only works inside OpenCode. MCP's protocol itself is
host-agnostic; the implementation language is not, in either case —
OpenCode v2 plugins must be JavaScript/TypeScript, and the only mature
FOSS BPMN tooling is also JavaScript/TypeScript, so an MCP server in
Node/TypeScript gives the portability without giving up the tooling.

> **4.0020**: Does the bpmn.io License's attribution watermark clause
> conflict with the FOSS requirement?

No. The "bpmn.io License" is MIT plus one clause: a small "powered by
bpmn.io" link rendered on the canvas must stay visible and unmodified.
No fee, no closed-source obligation, no registration. Accepted as
compliant, and a non-issue for a tool used locally rather than
exposed as a public product.

## Interaction Capability

> **5.0010**: What editing capability should the eventual live canvas
> (Stage 2) expose to the human?

Reuse bpmn-js's existing Modeler as-is (drag/drop, connect, delete —
all built in), rather than building a custom renderer; optionally add
`bpmn-js-properties-panel` (also MIT) later if editing names/ids/
attributes through the UI is wanted, not only moving/connecting
elements. Deferred along with the rest of Stage 2.

## Reliability

> **6.0010**: Any reliability requirements elicited?

TODO: answer pending

## Security

> **7.0010**: Any security requirements elicited?

TODO: answer pending

## Maintainability

> **8.0010**: Why prefer existing libraries (bpmn-moddle, bpmnlint,
> bpmn-js) over a custom implementation?

All three are mature, actively maintained, widely used (bpmn-js:
9.7k★; bpmn-moddle/bpmnlint: maintained by the same bpmn.io/Camunda
team), and already solve BPMN 2.0 XML parsing, modeling-rule
validation, and interactive rendering to a depth that would be
significant, ongoing effort to reproduce and keep standards-compliant.

## Flexibility

> **9.0010**: Any flexibility/extensibility requirements elicited?

TODO: answer pending

## Safety

> **10.0010**: Any safety requirements elicited?

TODO: answer pending

## More Information

See the companion decision record ("Use a Node/TypeScript MCP Server
for Agent-Driven BPMN Modeling") and the ten companion requirement
documents produced alongside this Q&A.
```

---

A few notes before you take this to the new repo:

- I left several ISO 25010 sections (Performance Efficiency, Reliability, Security, Flexibility, Safety) as `TODO: answer pending` per the template's own convention — nothing on those topics actually came up in our conversation, so I didn't fabricate content.
- The DEC's and REQs' "Related Artifacts" sections reference each other **by title, not by UUID** — `specmgr_create_dec`/`specmgr_create_req` assign IDs on creation, so the real cross-links can only be wired up after creation (in this repo or the new one).
- Say the word if you want me to actually create these (via `specmgr_create_dec`/`specmgr_create_req`/`specmgr_create_qa`) here in this repo so you can export them, or if you'd rather take the markdown as-is into the new repo yourself.

---

## User

go ahead and create the items

---

## Assistant (Build · Claude Sonnet 5 · 70.5s)

_Thinking:_



**Tool: specmgr_create_dec**

**Input:**
```json
{
  "content": "# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Context and Problem Statement\n\nA user and an AI coding agent need to create, change, import, export,\nvalidate, and parse BPMN 2.0 process diagrams, starting with a workflow\nwhere the agent edits a diagram and the user can view the result in a\nbrowser. The solution must be Free and Open Source Software (FOSS) and\nmust run entirely locally / on-premises, on the same system as the\nagent host, with no mandatory cloud dependency.\n\n## Decision Drivers\n\n- FOSS licensing, no paid component required\n- Local / on-premises operation only\n- The solution must not be locked to one specific AI agent host\n- Reuse of mature, well-maintained BPMN tooling over custom-built\n  parsing, linting, or rendering\n- Low operational complexity (few moving parts, few runtimes)\n\n## Considered Options\n\n- MCP (Model Context Protocol) server, implemented in Node/TypeScript\n- An OpenCode v2 plugin\n- A hybrid: a shared core library with both an MCP adapter and an\n  OpenCode v2 plugin adapter\n- An MCP server implemented in Python, delegating BPMN-specific\n  operations to a bundled Node.js helper process\n\n## Decision Outcome\n\nChosen option: \"MCP server, implemented in Node/TypeScript\", because it\nis the only option that is both host-agnostic (usable from any\nMCP-capable agent, not only OpenCode) and free of any cross-language\nbridge. The mature, actively maintained, FOSS BPMN tooling needed for\nthis project (bpmn-moddle, bpmnlint, bpmn-js) exists only as\nJavaScript/TypeScript libraries; authoring the server itself in the\nsame language avoids adding a second runtime or a subprocess bridge.\n\n### Consequences\n\n- The project depends on Node.js as its runtime, and on the bpmn.io\n  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.\n- The server is usable from any MCP-compatible agent host, not only\n  OpenCode.\n- A later OpenCode-specific integration (e.g. for deeper, host-native\n  hooks) remains possible as an additional, separate adapter on top of\n  the same core, without changing this decision.\n- bpmn-js ships under the \"bpmn.io License\" (MIT plus a clause\n  requiring its small attribution watermark to remain visible and\n  unmodified on any rendered canvas). This is accepted; see Pros and\n  Cons of Option 1 below.\n\n### Confirmation\n\nThis decision is confirmed once a minimal MCP server built on\nbpmn-moddle and bpmnlint can create, import, export, validate, and\nparse a BPMN 2.0 diagram end to end, and a human can view the current\ndiagram in a browser after an agent-driven change (Stage 1 scope; see\nthe related requirements).\n\n## Roles and Responsibilities\n\n### Accountable\n\nRonald Rink\n\n### Responsible\n\n- Ronald Rink\n- The implementing AI coding agent\n\n### Support\n\n### Consulted\n\n### Informed\n\n## Tags\n\n- bpmn\n- mcp\n- foss\n- architecture\n\n## Source\n\nDesign discussion and research conducted interactively with an AI\ncoding agent (OpenCode), researching BPMN modeler options, the\nbpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2\nplugin API, prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Related Artifacts\n\n### Requirements\n\n- REQ (see companion requirement documents in this write-up): FOSS\n  licensing\n- REQ: Local / on-premises operation\n- REQ: Create BPMN 2.0 diagrams\n- REQ: Change BPMN 2.0 diagrams\n- REQ: Import BPMN 2.0 XML\n- REQ: Export BPMN 2.0 XML\n- REQ: Validate BPMN 2.0 diagrams\n- REQ: Parse BPMN 2.0 XML\n- REQ: Expose functionality via a host-agnostic MCP server\n- REQ: Browser preview of agent-driven diagram changes (Stage 1)\n\n### Decisions\n\n### Goals\n\n### Risks\n\n## Pros and Cons\n\n### Option 1: MCP server, implemented in Node/TypeScript\n\n- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable\n  with no cross-language bridge.\n- Good, because MCP is a stable, cross-vendor protocol usable from any\n  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,\n  OpenCode, ...), not only OpenCode.\n- Good, because it runs as its own process, independently restartable\n  and inspectable, isolated from the agent host's own process.\n- Bad, because it adds a tool-call round trip through the MCP\n  transport (stdio or network) rather than an in-process function\n  call; negligible for a local tool.\n- Bad, because a later real-time, two-way-synced browser canvas\n  (Stage 2) needs an additional, separate canvas-server process next\n  to the MCP server process, rather than a single shared process.\n- Bad, because bpmn-js's \"bpmn.io License\" requires a small,\n  unremovable attribution watermark to stay visible on any rendered\n  canvas; accepted as a non-issue for a local, non-public tool.\n\n### Option 2: An OpenCode v2 plugin\n\n- Good, because it runs in a single process together with the\n  OpenCode host, simplifying a future real-time, two-way-synced\n  browser canvas (Stage 2): one process, shared in-memory state.\n- Good, because it can hook other tool calls\n  (`ctx.tool.hook(\"execute.after\")`), use OpenCode's own permission\n  prompts (`ctx.permission.assert`), and post messages directly into\n  the chat transcript (`ctx.session.synthetic`).\n- Bad, because it only works inside OpenCode, directly violating the\n  \"not locked to one agent host\" driver.\n- Bad, because the v2 plugin API is new, and several of its hooks are\n  explicitly marked experimental; more exposure to breaking changes\n  than the MCP protocol.\n- Bad, because OpenCode v2 plugins must be authored in\n  JavaScript/TypeScript; this is not itself a downside relative to\n  Option 1, but it buys no portability in exchange for the same\n  language constraint.\n\n### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)\n\n- Good, because it keeps the door open to both host-agnostic use and\n  deep OpenCode-native integration later.\n- Good, because the core BPMN logic (parsing, validation, the canvas\n  server) is written once and reused by both adapters.\n- Bad, because it is the most engineering effort of the options\n  considered, for a benefit (the second, OpenCode-specific adapter)\n  that is not needed yet.\n- Bad, because it is premature: no Stage 2 (live-canvas) requirement\n  exists yet to justify the extra adapter.\n\n### Option 4: Python MCP server with a bundled Node.js helper\n\n- Good, because it would match a Python-first tooling convention, had\n  one been required for this project.\n- Bad, because it still depends on the same Node.js-only BPMN\n  libraries under the hood, adding a second runtime and a subprocess\n  or sidecar bridge for no corresponding benefit.\n- Bad, because the one mature pure-Python BPMN project found\n  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and\n  has no equivalent to bpmnlint's configurable modeling-rule\n  validation or to a diagram auto-layout engine.\n- Not chosen: this project was not, in fact, committed to Python; an\n  initial `uv`-based scaffold existed only as a placeholder for\n  incidental scripting, not as a language decision.\n\n## More Information\n\nComparable, publicly available BPMN+MCP projects exist (e.g.\n`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all\nheadless (no live browser canvas). The closest architectural precedent\nfor a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`\n(an MCP server for Excalidraw, not BPMN), which splits into a\ncanvas-server process (web UI + REST + WebSocket sync) and a thin\nMCP/CLI client; this is the model to follow if/when Stage 2 (live\ncanvas) is undertaken for BPMN.\n\n## Updates\n\n<!-- Newest entry first -- prepend new entries directly below this comment. -->\n\n### 2026-10-22 - Created\n\nInitial decision record, drafted from an interactive research\nconversation prior to starting implementation.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "1 validation error for Requirements\nitems\n  dec create_dec (body): Value error, item must match pattern '^REQ [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}: .+$', got 'REQ (see companion requirement documents in this write-up): FOSS\\nlicensing' [type=tool_boundary_error, input_value=[... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must be free and open source software\n\n## Description\n\nEvery runtime component of the tool (the MCP server itself and every\nlibrary it depends on for BPMN parsing, validation, and rendering)\nmust be distributed under a Free and Open Source Software (FOSS)\nlicense. No component may require a paid license, subscription, or\naccount to operate.\n\n## Characteristics\n\n1. Portability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- foss\n- licensing\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes\n\nbpmn-js ships under the \"bpmn.io License\" (MIT plus a clause requiring\na small, unremovable attribution watermark on any rendered canvas).\nThis is accepted as compliant with this requirement: the license\nimposes no fee and no closed-source obligation, only an attribution\ndisplay rule.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (42 line(s)) and begins with:\n## Description\n\nEvery runtime component of the tool (the MCP server itself and every\nlibrary it depends on for BPMN parsing... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must run entirely locally or on-premises\n\n## Description\n\nThe tool must operate fully on the same system as the agent host, with\nno mandatory dependency on a remote service, cloud account, or network\nconnection for its core functionality (create, change, import, export,\nvalidate, parse).\n\n## Characteristics\n\n1. Portability\n2. Security\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- local\n- on-prem\n- offline\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes\n\nbpmn-js's canvas page loads its hand-drawn fonts from a CDN by\ndefault; this is a cosmetic fallback only (plain system fonts are used\nif unavailable) and must not be relied on for any functional behavior.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (41 line(s)) and begins with:\n## Description\n\nThe tool must operate fully on the same system as the agent host, with\nno mandatory dependency on a remote ... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall create new BPMN 2.0 process diagrams\n\n## Description\n\nAn agent must be able to create a new, empty or populated BPMN 2.0\nprocess diagram from a structured request, without requiring an\nexisting file.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- create\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (32 line(s)) and begins with:\n## Description\n\nAn agent must be able to create a new, empty or populated BPMN 2.0\nprocess diagram from a structured reques... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall change elements and flows in an existing BPMN 2.0 diagram\n\n## Description\n\nAn agent must be able to add, update, connect, and delete BPMN\nelements (events, tasks, gateways, sub-processes) and sequence/message\nflows in a diagram already held by the tool.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- change\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (32 line(s)) and begins with:\n## Description\n\nAn agent must be able to add, update, connect, and delete BPMN\nelements (events, tasks, gateways, sub-proce... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall import existing BPMN 2.0 XML files\n\n## Description\n\nThe tool must read a BPMN 2.0 XML document from disk (or from supplied\ntext) and load it as the current, addressable diagram, using\nbpmn-moddle for structural parsing.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- import\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (34 line(s)) and begins with:\n## Description\n\nThe tool must read a BPMN 2.0 XML document from disk (or from supplied\ntext) and load it as the current, ad... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall export the current diagram as BPMN 2.0 XML\n\n## Description\n\nThe tool must serialize the current, in-memory diagram back to a\nstandard-compliant BPMN 2.0 XML document, using bpmn-moddle, suitable\nfor opening in any BPMN 2.0 compliant tool.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- export\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (34 line(s)) and begins with:\n## Description\n\nThe tool must serialize the current, in-memory diagram back to a\nstandard-compliant BPMN 2.0 XML document, ... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall validate a diagram against configurable modeling rules\n\n## Description\n\nThe tool must check the current diagram for BPMN modeling-correctness\nand best-practice issues (for example: a process missing a start or\nend event, a disconnected element, a sequence flow missing a\ncondition) using bpmnlint, and report the findings. The rule set must\nbe configurable.\n\n## Characteristics\n\n1. Functional correctness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- validate\n- bpmnlint\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes\n\nbpmn-moddle alone only guarantees structurally well-formed XML; it has\nno opinion on modeling completeness or style. bpmnlint runs on top of\nthe object tree bpmn-moddle produces and supplies this requirement.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (41 line(s)) and begins with:\n## Description\n\nThe tool must check the current diagram for BPMN modeling-correctness\nand best-practice issues (for example... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall parse BPMN 2.0 XML into an addressable, structured model\n\n## Description\n\nThe tool must expose the current diagram as a structured, in-memory\nobject model (elements, flows, their properties and relationships),\nnot only as an opaque XML string, so that an agent can query and\nreference individual elements by id.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- parse\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (34 line(s)) and begins with:\n## Description\n\nThe tool must expose the current diagram as a structured, in-memory\nobject model (elements, flows, their pr... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall expose its functionality as a Model Context Protocol server\n\n## Description\n\nAll functionality (create, change, import, export, validate, parse,\nand the Stage 1 browser preview) must be exposed as tools on a Model\nContext Protocol (MCP) server, so that the tool is usable by any\nMCP-compatible agent host and is not limited to one specific AI coding\nagent or editor.\n\n## Characteristics\n\n1. Portability\n2. Interoperability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- mcp\n- architecture\n- portability\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (36 line(s)) and begins with:\n## Description\n\nAll functionality (create, change, import, export, validate, parse,\nand the Stage 1 browser preview) must b... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall let a human view the current diagram in a browser after an agent change\n\n## Description\n\nAfter an agent creates or changes a diagram, a human must be able to\nopen a local web browser and see the current state of that diagram,\nrendered visually (not as raw XML). For this first stage, this may be\na turn-based preview (an explicit preview step reloads the current\ndiagram) rather than a continuously live, two-way synchronized canvas.\n\n## Characteristics\n\n1. Operability\n\n## Level\n\nMUST\n\n## Priority\n\n30\n\n## Tags\n\n- bpmn\n- preview\n- bpmn-js\n- stage-1\n\n## Source\n\nUser requirement, stated directly at the start of this project, scoped\ndown to a turn-based preview for the first implementation stage.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes\n\nA later, live, two-way-synchronized browser canvas (both the agent and\nthe human editing the same diagram in real time) was discussed and\ndeferred; see the Decision's \"More Information\" section for the\narchitectural precedent (`yctimlin/mcp_excalidraw`) to follow if and\nwhen that stage is undertaken.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > statement: expected MarkdownParagraph, found no match; remaining text starts at line 2 of the normalized body (45 line(s)) and begins with:\n## Description\n\nAfter an agent creates or changes a diagram, a human must be able to\nopen a local web browser and see the c... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_qa**

**Input:**
```json
{
  "content": "# BPMN Modeling Tool for Agent and Human Use — Research Q&A\n\n## General\n\n### Introduction\n\nInteractive research conversation with an AI coding agent (OpenCode),\nconducted 2026-10-22, exploring options for a BPMN modeler usable by\nboth a human and an AI agent, prior to starting the `biz.dfch.BpmnMcp`\nproject. Covers the BPMN tooling landscape, licensing constraints,\ncomparable MCP and OpenCode-plugin projects, and the resulting\narchitecture decision.\n\n### Raw Requirements\n\n> I want to use a BPMN modeler that has a UI that a user and an agent\n> can both concurrently use to create, change, import, export,\n> validate and parse BPMN diagrams.\n\nFollow-up constraints added during the conversation:\n\n> ... must be: FOSS; local / on-prem on the same system where the\n> OpenCode instance runs.\n\n> I hoped for something like Excalidraw — where an agent can draw the\n> image on the same canvas and a user can see this in realtime.\n\n## Elicitation Context\n\n<!-- Elicited 2026-10-22, researching the general BPMN tooling landscape before any FOSS/local constraint was stated. -->\n\n> **1.0010**: What are the general options for a BPMN modeler UI usable\n> by both a human and an agent?\n\nTurnkey collaborative SaaS platforms (Camunda 8 Web Modeler, SAP\nSignavio, Bizagi); the open-source bpmn.io toolkit (bpmn-js,\nbpmn-moddle, bpmnlint), self-hosted; or a file-based \"take turns\"\npattern where both sides read/write the same `.bpmn` XML file, the\nsame way this environment's `specmgr` already manages other document\ntypes.\n\n> **1.0020**: Once narrowed to FOSS and local/on-prem only, which\n> options remain?\n\nThe bpmn.io toolkit (bpmn-js + bpmn-moddle + bpmnlint, self-hosted,\nMIT/\"bpmn.io License\"); Camunda Desktop Modeler (MIT, Electron,\nsingle-user, turn-based on the shared file); Flowable Modeler / jBPM\ndesigner (Apache-2.0, web-based, lock-based rather than live\ncollaboration). Camunda 8 Web Modeler, Signavio, and Bizagi were\neliminated: cloud or non-FOSS-licensed self-managed.\n\n## Functional Suitability\n\n> **2.0010**: Why are both bpmn-moddle and bpmnlint needed?\n\nbpmn-moddle is the parser/serializer: it reads/writes BPMN 2.0 XML\ninto/from a structured object tree according to the BPMN meta-model,\nwith no opinion on whether the diagram is semantically sound.\nbpmnlint is a separate, configurable rule-based linter that runs on\nthe tree bpmn-moddle produces, checking modeling-correctness and style\n(missing start/end events, disconnected elements, missing labels,\n...). moddle alone would let a diagram \"validate\" while being\nsemantically broken; bpmnlint supplies the actual validate capability.\n\n> **2.0020**: Is there an existing BPMN modeler with an Excalidraw-like\n> live canvas (agent draws, human watches/interacts in real time)?\n\nNo FOSS BPMN equivalent was found. The precedent architecture exists\nfor Excalidraw (`yctimlin/mcp_excalidraw`, MIT): a canvas-server\nprocess (web UI + REST + WebSocket sync) plus a thin MCP/CLI client,\nbroadcasting every agent change to any open browser tab and vice\nversa. Several BPMN+MCP projects exist (`dattmavis/BPMN-MCP`,\n`oisee/mcp-bpmn`, `Stieges/bpmn-generator`, the most mature of the\nthree) but all are headless XML/SVG generators; none provide a live,\ntwo-way-synchronized canvas. This is a genuine gap, not a solved\nproblem, and is deferred as a future \"Stage 2\" rather than built now.\n\n> **2.0030**: Was a pure-Python BPMN implementation considered, to match\n> this project's `uv`-based scaffold?\n\nYes, but the scaffold turned out not to be a deliberate language\ncommitment (a placeholder for incidental scripting only), so this was\nmoot. For the record: the one mature pure-Python BPMN project found,\nSpiffWorkflow (1.9k★, LGPL-3.0), is a parser and execution engine; its\nown credits state it relies on bpmn-js for any visual editor, and it\nhas no equivalent to bpmnlint's configurable validation or to a\ndiagram auto-layout engine. A pure-Python path would have meant\nreimplementing meaningful parts of what bpmn-moddle/bpmnlint/bpmn-js\nalready solve.\n\n## Performance Efficiency\n\n> **3.0010**: Any performance requirements elicited?\n\nTODO: answer pending\n\n## Compatibility\n\n> **4.0010**: Should this be built as an OpenCode v2 plugin or as an\n> MCP server?\n\nMCP server, to stay independent of any one agent host. An OpenCode v2\nplugin would allow deeper, single-process integration (tool-call\nhooks, native permission prompts, posting messages into the chat\ntranscript) and has real precedent for exactly this \"agent + live\nlocal browser UI\" pattern (the `octto`, 525★, and `plannotator`\nplugins), but only works inside OpenCode. MCP's protocol itself is\nhost-agnostic; the implementation language is not, in either case —\nOpenCode v2 plugins must be JavaScript/TypeScript, and the only mature\nFOSS BPMN tooling is also JavaScript/TypeScript, so an MCP server in\nNode/TypeScript gives the portability without giving up the tooling.\n\n> **4.0020**: Does the bpmn.io License's attribution watermark clause\n> conflict with the FOSS requirement?\n\nNo. The \"bpmn.io License\" is MIT plus one clause: a small \"powered by\nbpmn.io\" link rendered on the canvas must stay visible and unmodified.\nNo fee, no closed-source obligation, no registration. Accepted as\ncompliant, and a non-issue for a tool used locally rather than\nexposed as a public product.\n\n## Interaction Capability\n\n> **5.0010**: What editing capability should the eventual live canvas\n> (Stage 2) expose to the human?\n\nReuse bpmn-js's existing Modeler as-is (drag/drop, connect, delete —\nall built in), rather than building a custom renderer; optionally add\n`bpmn-js-properties-panel` (also MIT) later if editing names/ids/\nattributes through the UI is wanted, not only moving/connecting\nelements. Deferred along with the rest of Stage 2.\n\n## Reliability\n\n> **6.0010**: Any reliability requirements elicited?\n\nTODO: answer pending\n\n## Security\n\n> **7.0010**: Any security requirements elicited?\n\nTODO: answer pending\n\n## Maintainability\n\n> **8.0010**: Why prefer existing libraries (bpmn-moddle, bpmnlint,\n> bpmn-js) over a custom implementation?\n\nAll three are mature, actively maintained, widely used (bpmn-js:\n9.7k★; bpmn-moddle/bpmnlint: maintained by the same bpmn.io/Camunda\nteam), and already solve BPMN 2.0 XML parsing, modeling-rule\nvalidation, and interactive rendering to a depth that would be\nsignificant, ongoing effort to reproduce and keep standards-compliant.\n\n## Flexibility\n\n> **9.0010**: Any flexibility/extensibility requirements elicited?\n\nTODO: answer pending\n\n## Safety\n\n> **10.0010**: Any safety requirements elicited?\n\nTODO: answer pending\n\n## More Information\n\nSee the companion decision record (\"Use a Node/TypeScript MCP Server\nfor Agent-Driven BPMN Modeling\") and the ten companion requirement\ndocuments produced alongside this Q&A.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "1 validation error for QaQuestionAnswer\nquestion\n  qa create_qa (body): Value error, question must start with the bold question-number prefix '**<d>.<NNNN>**: ' (a single category digit and a 4-digit zero-padded per-category sequence, e.g. '> **0.0010**: What is the expected load?'), got '**10.0010*... (truncated)"
    }
  ]
}
```

---

## Assistant (Build · Claude Sonnet 5 · 92.2s)

_Thinking:_



Good catch from the validator — a few structural fixes needed: REQ docs need a one-paragraph statement right after the title (I'd skipped straight to `## Description`), the QA numbering must use a single-digit category (I accidentally went 1–10 instead of 0–9), and cross-references need real UUIDs rather than placeholder text (which don't exist until after creation). Let me fix and create these without premature cross-links, then wire the links up afterward.

**Tool: specmgr_create_dec**

**Input:**
```json
{
  "content": "# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Context and Problem Statement\n\nA user and an AI coding agent need to create, change, import, export,\nvalidate, and parse BPMN 2.0 process diagrams, starting with a workflow\nwhere the agent edits a diagram and the user can view the result in a\nbrowser. The solution must be Free and Open Source Software (FOSS) and\nmust run entirely locally / on-premises, on the same system as the\nagent host, with no mandatory cloud dependency.\n\n## Decision Drivers\n\n- FOSS licensing, no paid component required\n- Local / on-premises operation only\n- The solution must not be locked to one specific AI agent host\n- Reuse of mature, well-maintained BPMN tooling over custom-built\n  parsing, linting, or rendering\n- Low operational complexity (few moving parts, few runtimes)\n\n## Considered Options\n\n- MCP (Model Context Protocol) server, implemented in Node/TypeScript\n- An OpenCode v2 plugin\n- A hybrid: a shared core library with both an MCP adapter and an\n  OpenCode v2 plugin adapter\n- An MCP server implemented in Python, delegating BPMN-specific\n  operations to a bundled Node.js helper process\n\n## Decision Outcome\n\nChosen option: \"MCP server, implemented in Node/TypeScript\", because it\nis the only option that is both host-agnostic (usable from any\nMCP-capable agent, not only OpenCode) and free of any cross-language\nbridge. The mature, actively maintained, FOSS BPMN tooling needed for\nthis project (bpmn-moddle, bpmnlint, bpmn-js) exists only as\nJavaScript/TypeScript libraries; authoring the server itself in the\nsame language avoids adding a second runtime or a subprocess bridge.\n\n### Consequences\n\n- The project depends on Node.js as its runtime, and on the bpmn.io\n  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.\n- The server is usable from any MCP-compatible agent host, not only\n  OpenCode.\n- A later OpenCode-specific integration (e.g. for deeper, host-native\n  hooks) remains possible as an additional, separate adapter on top of\n  the same core, without changing this decision.\n- bpmn-js ships under the \"bpmn.io License\" (MIT plus a clause\n  requiring its small attribution watermark to remain visible and\n  unmodified on any rendered canvas). This is accepted; see Pros and\n  Cons of Option 1 below.\n\n### Confirmation\n\nThis decision is confirmed once a minimal MCP server built on\nbpmn-moddle and bpmnlint can create, import, export, validate, and\nparse a BPMN 2.0 diagram end to end, and a human can view the current\ndiagram in a browser after an agent-driven change (Stage 1 scope; see\nthe related requirements).\n\n## Roles and Responsibilities\n\n### Accountable\n\nRonald Rink\n\n### Responsible\n\n- Ronald Rink\n- The implementing AI coding agent\n\n### Support\n\n### Consulted\n\n### Informed\n\n## Tags\n\n- bpmn\n- mcp\n- foss\n- architecture\n\n## Source\n\nDesign discussion and research conducted interactively with an AI\ncoding agent (OpenCode), researching BPMN modeler options, the\nbpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2\nplugin API, prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Related Artifacts\n\n### Requirements\n\n### Decisions\n\n### Goals\n\n### Risks\n\n## Pros and Cons\n\n### Option 1: MCP server, implemented in Node/TypeScript\n\n- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable\n  with no cross-language bridge.\n- Good, because MCP is a stable, cross-vendor protocol usable from any\n  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,\n  OpenCode, ...), not only OpenCode.\n- Good, because it runs as its own process, independently restartable\n  and inspectable, isolated from the agent host's own process.\n- Bad, because it adds a tool-call round trip through the MCP\n  transport (stdio or network) rather than an in-process function\n  call; negligible for a local tool.\n- Bad, because a later real-time, two-way-synced browser canvas\n  (Stage 2) needs an additional, separate canvas-server process next\n  to the MCP server process, rather than a single shared process.\n- Bad, because bpmn-js's \"bpmn.io License\" requires a small,\n  unremovable attribution watermark to stay visible on any rendered\n  canvas; accepted as a non-issue for a local, non-public tool.\n\n### Option 2: An OpenCode v2 plugin\n\n- Good, because it runs in a single process together with the\n  OpenCode host, simplifying a future real-time, two-way-synced\n  browser canvas (Stage 2): one process, shared in-memory state.\n- Good, because it can hook other tool calls\n  (`ctx.tool.hook(\"execute.after\")`), use OpenCode's own permission\n  prompts (`ctx.permission.assert`), and post messages directly into\n  the chat transcript (`ctx.session.synthetic`).\n- Bad, because it only works inside OpenCode, directly violating the\n  \"not locked to one agent host\" driver.\n- Bad, because the v2 plugin API is new, and several of its hooks are\n  explicitly marked experimental; more exposure to breaking changes\n  than the MCP protocol.\n- Bad, because OpenCode v2 plugins must be authored in\n  JavaScript/TypeScript; this is not itself a downside relative to\n  Option 1, but it buys no portability in exchange for the same\n  language constraint.\n\n### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)\n\n- Good, because it keeps the door open to both host-agnostic use and\n  deep OpenCode-native integration later.\n- Good, because the core BPMN logic (parsing, validation, the canvas\n  server) is written once and reused by both adapters.\n- Bad, because it is the most engineering effort of the options\n  considered, for a benefit (the second, OpenCode-specific adapter)\n  that is not needed yet.\n- Bad, because it is premature: no Stage 2 (live-canvas) requirement\n  exists yet to justify the extra adapter.\n\n### Option 4: Python MCP server with a bundled Node.js helper\n\n- Good, because it would match a Python-first tooling convention, had\n  one been required for this project.\n- Bad, because it still depends on the same Node.js-only BPMN\n  libraries under the hood, adding a second runtime and a subprocess\n  or sidecar bridge for no corresponding benefit.\n- Bad, because the one mature pure-Python BPMN project found\n  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and\n  has no equivalent to bpmnlint's configurable modeling-rule\n  validation or to a diagram auto-layout engine.\n- Not chosen: this project was not, in fact, committed to Python; an\n  initial `uv`-based scaffold existed only as a placeholder for\n  incidental scripting, not as a language decision.\n\n## More Information\n\nComparable, publicly available BPMN+MCP projects exist (e.g.\n`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all\nheadless (no live browser canvas). The closest architectural precedent\nfor a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`\n(an MCP server for Excalidraw, not BPMN), which splits into a\ncanvas-server process (web UI + REST + WebSocket sync) and a thin\nMCP/CLI client; this is the model to follow if/when Stage 2 (live\ncanvas) is undertaken for BPMN.\n\n## Updates\n\n<!-- Newest entry first -- prepend new entries directly below this comment. -->\n\n### 2026-10-22 - Created\n\nInitial decision record, drafted from an interactive research\nconversation prior to starting implementation.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "dec create_dec (body): Decision > RelatedArtifacts > Requirements > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 94 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must be free and open source software\n\nEvery component of the tool must be licensed under a Free and Open\nSource Software (FOSS) license, with no license fee, subscription, or\naccount necessary to operate it.\n\n## Description\n\nEvery runtime component of the tool (the MCP server itself and every\nlibrary it depends on for BPMN parsing, validation, and rendering)\nmust be distributed under a Free and Open Source Software (FOSS)\nlicense. No component may require a paid license, subscription, or\naccount to operate.\n\n## Characteristics\n\n1. Portability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- foss\n- licensing\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n## Notes\n\nbpmn-js ships under the \"bpmn.io License\" (MIT plus a clause requiring\na small, unremovable attribution watermark on any rendered canvas).\nThis is accepted as compliant with this requirement: the license\nimposes no fee and no closed-source obligation, only an attribution\ndisplay rule.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 36 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must run entirely locally or on-premises\n\nThe tool must operate fully on the system that hosts the agent, with\nno required connection to a remote service or cloud account for its\ncore functions.\n\n## Description\n\nThe tool must operate fully on the same system as the agent host, with\nno mandatory dependency on a remote service, cloud account, or network\nconnection for its core functionality (create, change, import, export,\nvalidate, parse).\n\n## Characteristics\n\n1. Portability\n2. Security\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- local\n- on-prem\n- offline\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n## Notes\n\nbpmn-js's canvas page loads its hand-drawn fonts from a CDN by\ndefault; this is a cosmetic fallback only (plain system fonts are used\nif unavailable) and must not be relied on for any functional behavior.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 37 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall create new BPMN 2.0 process diagrams\n\nThe tool must let an agent create a new BPMN 2.0 process diagram from a\nstructured request, without an existing file.\n\n## Description\n\nAn agent must be able to create a new, empty or populated BPMN 2.0\nprocess diagram from a structured request, without requiring an\nexisting file.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- create\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 33 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall change elements and flows in an existing BPMN 2.0 diagram\n\nThe tool must let an agent add, update, connect, and remove elements\nand flows in a diagram it already holds.\n\n## Description\n\nAn agent must be able to add, update, connect, and delete BPMN\nelements (events, tasks, gateways, sub-processes) and sequence/message\nflows in a diagram already held by the tool.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- change\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 33 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall import existing BPMN 2.0 XML files\n\nThe tool must read an existing BPMN 2.0 XML document and load it as\nthe current diagram.\n\n## Description\n\nThe tool must read a BPMN 2.0 XML document from disk (or from supplied\ntext) and load it as the current, addressable diagram, using\nbpmn-moddle for structural parsing.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- import\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 35 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall export the current diagram as BPMN 2.0 XML\n\nThe tool must write the current diagram as a standard-compliant BPMN\n2.0 XML document.\n\n## Description\n\nThe tool must serialize the current, in-memory diagram back to a\nstandard-compliant BPMN 2.0 XML document, using bpmn-moddle, suitable\nfor opening in any BPMN 2.0 compliant tool.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- export\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 35 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall validate a diagram against configurable modeling rules\n\nThe tool must check the current diagram against configurable BPMN\nmodeling rules and report the findings.\n\n## Description\n\nThe tool must check the current diagram for BPMN modeling-correctness\nand best-practice issues (for example: a process missing a start or\nend event, a disconnected element, a sequence flow missing a\ncondition) using bpmnlint, and report the findings. The rule set must\nbe configurable.\n\n## Characteristics\n\n1. Functional correctness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- validate\n- bpmnlint\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n## Notes\n\nbpmn-moddle alone only guarantees structurally well-formed XML; it has\nno opinion on modeling completeness or style. bpmnlint runs on top of\nthe object tree bpmn-moddle produces and supplies this requirement.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 36 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall parse BPMN 2.0 XML into an addressable, structured model\n\nThe tool must represent the current diagram as a structured,\naddressable model of its elements and flows, not only as raw XML text.\n\n## Description\n\nThe tool must expose the current diagram as a structured, in-memory\nobject model (elements, flows, their properties and relationships),\nnot only as an opaque XML string, so that an agent can query and\nreference individual elements by id.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- parse\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 35 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall expose its functionality as a Model Context Protocol server\n\nThe tool must offer every function as a tool on a Model Context\nProtocol (MCP) server, usable by any MCP-compatible agent.\n\n## Description\n\nAll functionality (create, change, import, export, validate, parse,\nand the Stage 1 browser preview) must be exposed as tools on a Model\nContext Protocol (MCP) server, so that the tool is usable by any\nMCP-compatible agent host and is not limited to one specific AI coding\nagent or editor.\n\n## Characteristics\n\n1. Portability\n2. Interoperability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- mcp\n- architecture\n- portability\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 37 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall let a human view the current diagram in a browser after an agent change\n\nThe tool must let a human view the current diagram in a web browser\nafter an agent creates or changes it.\n\n## Description\n\nAfter an agent creates or changes a diagram, a human must be able to\nopen a local web browser and see the current state of that diagram,\nrendered visually (not as raw XML). For this first stage, this may be\na turn-based preview (an explicit preview step reloads the current\ndiagram) rather than a continuously live, two-way synchronized canvas.\n\n## Characteristics\n\n1. Operability\n\n## Level\n\nMUST\n\n## Priority\n\n30\n\n## Tags\n\n- bpmn\n- preview\n- bpmn-js\n- stage-1\n\n## Source\n\nUser requirement, stated directly at the start of this project, scoped\ndown to a turn-based preview for the first implementation stage.\n\n## Related Artifacts\n\n### Decisions\n\n## Notes\n\nA later, live, two-way-synchronized browser canvas (both the agent and\nthe human editing the same diagram in real time) was discussed and\ndeferred; see the Decision's \"More Information\" section for the\narchitectural precedent (`yctimlin/mcp_excalidraw`) to follow if and\nwhen that stage is undertaken.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "req create_req (body): Requirement > RelatedArtifacts > Decisions > items: expected list[MarkdownListItemWithNotes], found no match; remaining text starts at line 38 of the normalized body (0 line(s)) and begins with:"
    }
  ]
}
```

**Tool: specmgr_create_qa**

**Input:**
```json
{
  "content": "# BPMN Modeling Tool for Agent and Human Use — Research Q&A\n\n## General\n\n### Introduction\n\nInteractive research conversation with an AI coding agent (OpenCode),\nconducted 2026-10-22, exploring options for a BPMN modeler usable by\nboth a human and an AI agent, prior to starting the `biz.dfch.BpmnMcp`\nproject. Covers the BPMN tooling landscape, licensing constraints,\ncomparable MCP and OpenCode-plugin projects, and the resulting\narchitecture decision.\n\n### Raw Requirements\n\n> I want to use a BPMN modeler that has a UI that a user and an agent\n> can both concurrently use to create, change, import, export,\n> validate and parse BPMN diagrams.\n\nFollow-up constraints added during the conversation:\n\n> ... must be: FOSS; local / on-prem on the same system where the\n> OpenCode instance runs.\n\n> I hoped for something like Excalidraw — where an agent can draw the\n> image on the same canvas and a user can see this in realtime.\n\n## Elicitation Context\n\n<!-- Elicited 2026-10-22, researching the general BPMN tooling landscape before any FOSS/local constraint was stated. -->\n\n> **0.0010**: What are the general options for a BPMN modeler UI usable\n> by both a human and an agent?\n\nTurnkey collaborative SaaS platforms (Camunda 8 Web Modeler, SAP\nSignavio, Bizagi); the open-source bpmn.io toolkit (bpmn-js,\nbpmn-moddle, bpmnlint), self-hosted; or a file-based \"take turns\"\npattern where both sides read/write the same `.bpmn` XML file, the\nsame way this environment's `specmgr` already manages other document\ntypes.\n\n> **0.0020**: Once narrowed to FOSS and local/on-prem only, which\n> options remain?\n\nThe bpmn.io toolkit (bpmn-js + bpmn-moddle + bpmnlint, self-hosted,\nMIT/\"bpmn.io License\"); Camunda Desktop Modeler (MIT, Electron,\nsingle-user, turn-based on the shared file); Flowable Modeler / jBPM\ndesigner (Apache-2.0, web-based, lock-based rather than live\ncollaboration). Camunda 8 Web Modeler, Signavio, and Bizagi were\neliminated: cloud or non-FOSS-licensed self-managed.\n\n## Functional Suitability\n\n> **1.0010**: Why are both bpmn-moddle and bpmnlint needed?\n\nbpmn-moddle is the parser/serializer: it reads/writes BPMN 2.0 XML\ninto/from a structured object tree according to the BPMN meta-model,\nwith no opinion on whether the diagram is semantically sound.\nbpmnlint is a separate, configurable rule-based linter that runs on\nthe tree bpmn-moddle produces, checking modeling-correctness and style\n(missing start/end events, disconnected elements, missing labels,\n...). moddle alone would let a diagram \"validate\" while being\nsemantically broken; bpmnlint supplies the actual validate capability.\n\n> **1.0020**: Is there an existing BPMN modeler with an Excalidraw-like\n> live canvas (agent draws, human watches/interacts in real time)?\n\nNo FOSS BPMN equivalent was found. The precedent architecture exists\nfor Excalidraw (`yctimlin/mcp_excalidraw`, MIT): a canvas-server\nprocess (web UI + REST + WebSocket sync) plus a thin MCP/CLI client,\nbroadcasting every agent change to any open browser tab and vice\nversa. Several BPMN+MCP projects exist (`dattmavis/BPMN-MCP`,\n`oisee/mcp-bpmn`, `Stieges/bpmn-generator`, the most mature of the\nthree) but all are headless XML/SVG generators; none provide a live,\ntwo-way-synchronized canvas. This is a genuine gap, not a solved\nproblem, and is deferred as a future \"Stage 2\" rather than built now.\n\n> **1.0030**: Was a pure-Python BPMN implementation considered, to match\n> this project's `uv`-based scaffold?\n\nYes, but the scaffold turned out not to be a deliberate language\ncommitment (a placeholder for incidental scripting only), so this was\nmoot. For the record: the one mature pure-Python BPMN project found,\nSpiffWorkflow (1.9k★, LGPL-3.0), is a parser and execution engine; its\nown credits state it relies on bpmn-js for any visual editor, and it\nhas no equivalent to bpmnlint's configurable validation or to a\ndiagram auto-layout engine. A pure-Python path would have meant\nreimplementing meaningful parts of what bpmn-moddle/bpmnlint/bpmn-js\nalready solve.\n\n## Performance Efficiency\n\n> **2.0010**: Any performance requirements elicited?\n\nTODO: answer pending\n\n## Compatibility\n\n> **3.0010**: Should this be built as an OpenCode v2 plugin or as an\n> MCP server?\n\nMCP server, to stay independent of any one agent host. An OpenCode v2\nplugin would allow deeper, single-process integration (tool-call\nhooks, native permission prompts, posting messages into the chat\ntranscript) and has real precedent for exactly this \"agent + live\nlocal browser UI\" pattern (the `octto`, 525★, and `plannotator`\nplugins), but only works inside OpenCode. MCP's protocol itself is\nhost-agnostic; the implementation language is not, in either case —\nOpenCode v2 plugins must be JavaScript/TypeScript, and the only mature\nFOSS BPMN tooling is also JavaScript/TypeScript, so an MCP server in\nNode/TypeScript gives the portability without giving up the tooling.\n\n> **3.0020**: Does the bpmn.io License's attribution watermark clause\n> conflict with the FOSS requirement?\n\nNo. The \"bpmn.io License\" is MIT plus one clause: a small \"powered by\nbpmn.io\" link rendered on the canvas must stay visible and unmodified.\nNo fee, no closed-source obligation, no registration. Accepted as\ncompliant, and a non-issue for a tool used locally rather than\nexposed as a public product.\n\n## Interaction Capability\n\n> **4.0010**: What editing capability should the eventual live canvas\n> (Stage 2) expose to the human?\n\nReuse bpmn-js's existing Modeler as-is (drag/drop, connect, delete —\nall built in), rather than building a custom renderer; optionally add\n`bpmn-js-properties-panel` (also MIT) later if editing names/ids/\nattributes through the UI is wanted, not only moving/connecting\nelements. Deferred along with the rest of Stage 2.\n\n## Reliability\n\n> **5.0010**: Any reliability requirements elicited?\n\nTODO: answer pending\n\n## Security\n\n> **6.0010**: Any security requirements elicited?\n\nTODO: answer pending\n\n## Maintainability\n\n> **7.0010**: Why prefer existing libraries (bpmn-moddle, bpmnlint,\n> bpmn-js) over a custom implementation?\n\nAll three are mature, actively maintained, widely used (bpmn-js:\n9.7k★; bpmn-moddle/bpmnlint: maintained by the same bpmn.io/Camunda\nteam), and already solve BPMN 2.0 XML parsing, modeling-rule\nvalidation, and interactive rendering to a depth that would be\nsignificant, ongoing effort to reproduce and keep standards-compliant.\n\n## Flexibility\n\n> **8.0010**: Any flexibility/extensibility requirements elicited?\n\nTODO: answer pending\n\n## Safety\n\n> **9.0010**: Any safety requirements elicited?\n\nTODO: answer pending\n\n## More Information\n\nSee the companion decision record (\"Use a Node/TypeScript MCP Server\nfor Agent-Driven BPMN Modeling\") and the ten companion requirement\ndocuments produced alongside this Q&A.\n"
}
```

**Output:**
```
{
  "id": "28a4470d-287e-452e-b59e-d336155b0bfd",
  "type": "qa",
  "created": "2026-10-22T17:49:56.496+02:00",
  "updated": "2026-10-22T17:49:56.496+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

---

## Assistant (Build · Claude Sonnet 5 · 56.0s)

_Thinking:_



Almost — the empty `### Decisions`/`### Requirements` subsections (with no list items under them) aren't valid; they need to be entirely omitted when there's nothing to list yet, not left empty. The QA document went through fine. Let me drop those empty subsections and resubmit the DEC and the 10 REQs, then wire up the real cross-references afterward.

**Tool: specmgr_create_dec**

**Input:**
```json
{
  "content": "# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Context and Problem Statement\n\nA user and an AI coding agent need to create, change, import, export,\nvalidate, and parse BPMN 2.0 process diagrams, starting with a workflow\nwhere the agent edits a diagram and the user can view the result in a\nbrowser. The solution must be Free and Open Source Software (FOSS) and\nmust run entirely locally / on-premises, on the same system as the\nagent host, with no mandatory cloud dependency.\n\n## Decision Drivers\n\n- FOSS licensing, no paid component required\n- Local / on-premises operation only\n- The solution must not be locked to one specific AI agent host\n- Reuse of mature, well-maintained BPMN tooling over custom-built\n  parsing, linting, or rendering\n- Low operational complexity (few moving parts, few runtimes)\n\n## Considered Options\n\n- MCP (Model Context Protocol) server, implemented in Node/TypeScript\n- An OpenCode v2 plugin\n- A hybrid: a shared core library with both an MCP adapter and an\n  OpenCode v2 plugin adapter\n- An MCP server implemented in Python, delegating BPMN-specific\n  operations to a bundled Node.js helper process\n\n## Decision Outcome\n\nChosen option: \"MCP server, implemented in Node/TypeScript\", because it\nis the only option that is both host-agnostic (usable from any\nMCP-capable agent, not only OpenCode) and free of any cross-language\nbridge. The mature, actively maintained, FOSS BPMN tooling needed for\nthis project (bpmn-moddle, bpmnlint, bpmn-js) exists only as\nJavaScript/TypeScript libraries; authoring the server itself in the\nsame language avoids adding a second runtime or a subprocess bridge.\n\n### Consequences\n\n- The project depends on Node.js as its runtime, and on the bpmn.io\n  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.\n- The server is usable from any MCP-compatible agent host, not only\n  OpenCode.\n- A later OpenCode-specific integration (e.g. for deeper, host-native\n  hooks) remains possible as an additional, separate adapter on top of\n  the same core, without changing this decision.\n- bpmn-js ships under the \"bpmn.io License\" (MIT plus a clause\n  requiring its small attribution watermark to remain visible and\n  unmodified on any rendered canvas). This is accepted; see Pros and\n  Cons of Option 1 below.\n\n### Confirmation\n\nThis decision is confirmed once a minimal MCP server built on\nbpmn-moddle and bpmnlint can create, import, export, validate, and\nparse a BPMN 2.0 diagram end to end, and a human can view the current\ndiagram in a browser after an agent-driven change (Stage 1 scope; see\nthe related requirements).\n\n## Roles and Responsibilities\n\n### Accountable\n\nRonald Rink\n\n### Responsible\n\n- Ronald Rink\n- The implementing AI coding agent\n\n### Support\n\n### Consulted\n\n### Informed\n\n## Tags\n\n- bpmn\n- mcp\n- foss\n- architecture\n\n## Source\n\nDesign discussion and research conducted interactively with an AI\ncoding agent (OpenCode), researching BPMN modeler options, the\nbpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2\nplugin API, prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Pros and Cons\n\n### Option 1: MCP server, implemented in Node/TypeScript\n\n- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable\n  with no cross-language bridge.\n- Good, because MCP is a stable, cross-vendor protocol usable from any\n  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,\n  OpenCode, ...), not only OpenCode.\n- Good, because it runs as its own process, independently restartable\n  and inspectable, isolated from the agent host's own process.\n- Bad, because it adds a tool-call round trip through the MCP\n  transport (stdio or network) rather than an in-process function\n  call; negligible for a local tool.\n- Bad, because a later real-time, two-way-synced browser canvas\n  (Stage 2) needs an additional, separate canvas-server process next\n  to the MCP server process, rather than a single shared process.\n- Bad, because bpmn-js's \"bpmn.io License\" requires a small,\n  unremovable attribution watermark to stay visible on any rendered\n  canvas; accepted as a non-issue for a local, non-public tool.\n\n### Option 2: An OpenCode v2 plugin\n\n- Good, because it runs in a single process together with the\n  OpenCode host, simplifying a future real-time, two-way-synced\n  browser canvas (Stage 2): one process, shared in-memory state.\n- Good, because it can hook other tool calls\n  (`ctx.tool.hook(\"execute.after\")`), use OpenCode's own permission\n  prompts (`ctx.permission.assert`), and post messages directly into\n  the chat transcript (`ctx.session.synthetic`).\n- Bad, because it only works inside OpenCode, directly violating the\n  \"not locked to one agent host\" driver.\n- Bad, because the v2 plugin API is new, and several of its hooks are\n  explicitly marked experimental; more exposure to breaking changes\n  than the MCP protocol.\n- Bad, because OpenCode v2 plugins must be authored in\n  JavaScript/TypeScript; this is not itself a downside relative to\n  Option 1, but it buys no portability in exchange for the same\n  language constraint.\n\n### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)\n\n- Good, because it keeps the door open to both host-agnostic use and\n  deep OpenCode-native integration later.\n- Good, because the core BPMN logic (parsing, validation, the canvas\n  server) is written once and reused by both adapters.\n- Bad, because it is the most engineering effort of the options\n  considered, for a benefit (the second, OpenCode-specific adapter)\n  that is not needed yet.\n- Bad, because it is premature: no Stage 2 (live-canvas) requirement\n  exists yet to justify the extra adapter.\n\n### Option 4: Python MCP server with a bundled Node.js helper\n\n- Good, because it would match a Python-first tooling convention, had\n  one been required for this project.\n- Bad, because it still depends on the same Node.js-only BPMN\n  libraries under the hood, adding a second runtime and a subprocess\n  or sidecar bridge for no corresponding benefit.\n- Bad, because the one mature pure-Python BPMN project found\n  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and\n  has no equivalent to bpmnlint's configurable modeling-rule\n  validation or to a diagram auto-layout engine.\n- Not chosen: this project was not, in fact, committed to Python; an\n  initial `uv`-based scaffold existed only as a placeholder for\n  incidental scripting, not as a language decision.\n\n## More Information\n\nComparable, publicly available BPMN+MCP projects exist (e.g.\n`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all\nheadless (no live browser canvas). The closest architectural precedent\nfor a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`\n(an MCP server for Excalidraw, not BPMN), which splits into a\ncanvas-server process (web UI + REST + WebSocket sync) and a thin\nMCP/CLI client; this is the model to follow if/when Stage 2 (live\ncanvas) is undertaken for BPMN.\n\n## Updates\n\n<!-- Newest entry first -- prepend new entries directly below this comment. -->\n\n### 2026-10-22 - Created\n\nInitial decision record, drafted from an interactive research\nconversation prior to starting implementation.\n"
}
```

**Output:**
```
{
  "valid": false,
  "errors": [
    {
      "message": "dec create_dec (body): Decision > Updates > UpdateEntry: expected list[UpdateEntry] (heading matching regex '^\\\\d{4}-\\\\d{2}-\\\\d{2}[T ]\\\\d{2}:\\\\d{2}:\\\\d{2}\\\\.\\\\d{3}(?:Z|[+-]\\\\d{2}:\\\\d{2})(?: - | : ).+$'), found no match; remaining text starts at line 172 of the normalized body (4 line(s)) and begins ... (truncated)"
    }
  ]
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must be free and open source software\n\nEvery component of the tool must be licensed under a Free and Open\nSource Software (FOSS) license, with no license fee, subscription, or\naccount necessary to operate it.\n\n## Description\n\nEvery runtime component of the tool (the MCP server itself and every\nlibrary it depends on for BPMN parsing, validation, and rendering)\nmust be distributed under a Free and Open Source Software (FOSS)\nlicense. No component may require a paid license, subscription, or\naccount to operate.\n\n## Characteristics\n\n1. Portability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- foss\n- licensing\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Notes\n\nbpmn-js ships under the \"bpmn.io License\" (MIT plus a clause requiring\na small, unremovable attribution watermark on any rendered canvas).\nThis is accepted as compliant with this requirement: the license\nimposes no fee and no closed-source obligation, only an attribution\ndisplay rule.\n"
}
```

**Output:**
```
{
  "id": "abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6",
  "type": "req",
  "created": "2026-10-22T17:50:35.975+02:00",
  "updated": "2026-10-22T17:50:35.975+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool must run entirely locally or on-premises\n\nThe tool must operate fully on the system that hosts the agent, with\nno required connection to a remote service or cloud account for its\ncore functions.\n\n## Description\n\nThe tool must operate fully on the same system as the agent host, with\nno mandatory dependency on a remote service, cloud account, or network\nconnection for its core functionality (create, change, import, export,\nvalidate, parse).\n\n## Characteristics\n\n1. Portability\n2. Security\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- local\n- on-prem\n- offline\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Notes\n\nbpmn-js's canvas page loads its hand-drawn fonts from a CDN by\ndefault; this is a cosmetic fallback only (plain system fonts are used\nif unavailable) and must not be relied on for any functional behavior.\n"
}
```

**Output:**
```
{
  "id": "94d75c0f-da9d-4f43-8253-936747ff2fe9",
  "type": "req",
  "created": "2026-10-22T17:50:38.126+02:00",
  "updated": "2026-10-22T17:50:38.126+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall create new BPMN 2.0 process diagrams\n\nThe tool must let an agent create a new BPMN 2.0 process diagram from a\nstructured request, without an existing file.\n\n## Description\n\nAn agent must be able to create a new, empty or populated BPMN 2.0\nprocess diagram from a structured request, without requiring an\nexisting file.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- create\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "7b9dca78-7432-43bb-af33-8374edb232a4",
  "type": "req",
  "created": "2026-10-22T17:50:39.505+02:00",
  "updated": "2026-10-22T17:50:39.505+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall change elements and flows in an existing BPMN 2.0 diagram\n\nThe tool must let an agent add, update, connect, and remove elements\nand flows in a diagram it already holds.\n\n## Description\n\nAn agent must be able to add, update, connect, and delete BPMN\nelements (events, tasks, gateways, sub-processes) and sequence/message\nflows in a diagram already held by the tool.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- change\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "8b53fa5a-de89-402b-8b68-ec6ddc1e8e25",
  "type": "req",
  "created": "2026-10-22T17:50:41.053+02:00",
  "updated": "2026-10-22T17:50:41.053+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall import existing BPMN 2.0 XML files\n\nThe tool must read an existing BPMN 2.0 XML document and load it as\nthe current diagram.\n\n## Description\n\nThe tool must read a BPMN 2.0 XML document from disk (or from supplied\ntext) and load it as the current, addressable diagram, using\nbpmn-moddle for structural parsing.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- import\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "5e0fa899-683e-4c32-bb13-6a2dee03a516",
  "type": "req",
  "created": "2026-10-22T17:50:42.658+02:00",
  "updated": "2026-10-22T17:50:42.658+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall export the current diagram as BPMN 2.0 XML\n\nThe tool must write the current diagram as a standard-compliant BPMN\n2.0 XML document.\n\n## Description\n\nThe tool must serialize the current, in-memory diagram back to a\nstandard-compliant BPMN 2.0 XML document, using bpmn-moddle, suitable\nfor opening in any BPMN 2.0 compliant tool.\n\n## Characteristics\n\n1. Functional completeness\n2. Compatibility\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- export\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "b4d4fa31-9ba8-4967-be59-9d23cc7f9213",
  "type": "req",
  "created": "2026-10-22T17:50:44.358+02:00",
  "updated": "2026-10-22T17:50:44.358+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall validate a diagram against configurable modeling rules\n\nThe tool must check the current diagram against configurable BPMN\nmodeling rules and report the findings.\n\n## Description\n\nThe tool must check the current diagram for BPMN modeling-correctness\nand best-practice issues (for example: a process missing a start or\nend event, a disconnected element, a sequence flow missing a\ncondition) using bpmnlint, and report the findings. The rule set must\nbe configurable.\n\n## Characteristics\n\n1. Functional correctness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- validate\n- bpmnlint\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n\n## Notes\n\nbpmn-moddle alone only guarantees structurally well-formed XML; it has\nno opinion on modeling completeness or style. bpmnlint runs on top of\nthe object tree bpmn-moddle produces and supplies this requirement.\n"
}
```

**Output:**
```
{
  "id": "f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0",
  "type": "req",
  "created": "2026-10-22T17:50:46.722+02:00",
  "updated": "2026-10-22T17:50:46.722+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall parse BPMN 2.0 XML into an addressable, structured model\n\nThe tool must represent the current diagram as a structured,\naddressable model of its elements and flows, not only as raw XML text.\n\n## Description\n\nThe tool must expose the current diagram as a structured, in-memory\nobject model (elements, flows, their properties and relationships),\nnot only as an opaque XML string, so that an agent can query and\nreference individual elements by id.\n\n## Characteristics\n\n1. Functional completeness\n\n## Level\n\nMUST\n\n## Priority\n\n20\n\n## Tags\n\n- bpmn\n- parse\n- bpmn-moddle\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "a36fb3d9-a285-49c9-b5b4-deb2f55b8998",
  "type": "req",
  "created": "2026-10-22T17:50:48.407+02:00",
  "updated": "2026-10-22T17:50:48.407+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall expose its functionality as a Model Context Protocol server\n\nThe tool must offer every function as a tool on a Model Context\nProtocol (MCP) server, usable by any MCP-compatible agent.\n\n## Description\n\nAll functionality (create, change, import, export, validate, parse,\nand the Stage 1 browser preview) must be exposed as tools on a Model\nContext Protocol (MCP) server, so that the tool is usable by any\nMCP-compatible agent host and is not limited to one specific AI coding\nagent or editor.\n\n## Characteristics\n\n1. Portability\n2. Interoperability\n\n## Level\n\nMUST\n\n## Priority\n\n10\n\n## Tags\n\n- mcp\n- architecture\n- portability\n\n## Source\n\nUser requirement, stated directly at the start of this project.\n"
}
```

**Output:**
```
{
  "id": "0caae3bd-b4e8-47c6-a417-520766031f27",
  "type": "req",
  "created": "2026-10-22T17:50:50.330+02:00",
  "updated": "2026-10-22T17:50:50.330+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_create_req**

**Input:**
```json
{
  "content": "# The tool shall let a human view the current diagram in a browser after an agent change\n\nThe tool must let a human view the current diagram in a web browser\nafter an agent creates or changes it.\n\n## Description\n\nAfter an agent creates or changes a diagram, a human must be able to\nopen a local web browser and see the current state of that diagram,\nrendered visually (not as raw XML). For this first stage, this may be\na turn-based preview (an explicit preview step reloads the current\ndiagram) rather than a continuously live, two-way synchronized canvas.\n\n## Characteristics\n\n1. Operability\n\n## Level\n\nMUST\n\n## Priority\n\n30\n\n## Tags\n\n- bpmn\n- preview\n- bpmn-js\n- stage-1\n\n## Source\n\nUser requirement, stated directly at the start of this project, scoped\ndown to a turn-based preview for the first implementation stage.\n\n## Notes\n\nA later, live, two-way-synchronized browser canvas (both the agent and\nthe human editing the same diagram in real time) was discussed and\ndeferred; see the Decision's \"More Information\" section for the\narchitectural precedent (`yctimlin/mcp_excalidraw`) to follow if and\nwhen that stage is undertaken.\n"
}
```

**Output:**
```
{
  "id": "bb63c11f-c3e2-4ed0-8f4e-5453b28260f6",
  "type": "req",
  "created": "2026-10-22T17:50:53.019+02:00",
  "updated": "2026-10-22T17:50:53.019+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

---

## Assistant (Build · Claude Sonnet 5 · 24.2s)

_Thinking:_



All 10 requirements are in. Just the DEC's `Updates` entry needs a full ISO-8601 timestamp heading (not a bare date) — fixing and resubmitting.

**Tool: specmgr_create_dec**

**Input:**
```json
{
  "content": "# Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Context and Problem Statement\n\nA user and an AI coding agent need to create, change, import, export,\nvalidate, and parse BPMN 2.0 process diagrams, starting with a workflow\nwhere the agent edits a diagram and the user can view the result in a\nbrowser. The solution must be Free and Open Source Software (FOSS) and\nmust run entirely locally / on-premises, on the same system as the\nagent host, with no mandatory cloud dependency.\n\n## Decision Drivers\n\n- FOSS licensing, no paid component required\n- Local / on-premises operation only\n- The solution must not be locked to one specific AI agent host\n- Reuse of mature, well-maintained BPMN tooling over custom-built\n  parsing, linting, or rendering\n- Low operational complexity (few moving parts, few runtimes)\n\n## Considered Options\n\n- MCP (Model Context Protocol) server, implemented in Node/TypeScript\n- An OpenCode v2 plugin\n- A hybrid: a shared core library with both an MCP adapter and an\n  OpenCode v2 plugin adapter\n- An MCP server implemented in Python, delegating BPMN-specific\n  operations to a bundled Node.js helper process\n\n## Decision Outcome\n\nChosen option: \"MCP server, implemented in Node/TypeScript\", because it\nis the only option that is both host-agnostic (usable from any\nMCP-capable agent, not only OpenCode) and free of any cross-language\nbridge. The mature, actively maintained, FOSS BPMN tooling needed for\nthis project (bpmn-moddle, bpmnlint, bpmn-js) exists only as\nJavaScript/TypeScript libraries; authoring the server itself in the\nsame language avoids adding a second runtime or a subprocess bridge.\n\n### Consequences\n\n- The project depends on Node.js as its runtime, and on the bpmn.io\n  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.\n- The server is usable from any MCP-compatible agent host, not only\n  OpenCode.\n- A later OpenCode-specific integration (e.g. for deeper, host-native\n  hooks) remains possible as an additional, separate adapter on top of\n  the same core, without changing this decision.\n- bpmn-js ships under the \"bpmn.io License\" (MIT plus a clause\n  requiring its small attribution watermark to remain visible and\n  unmodified on any rendered canvas). This is accepted; see Pros and\n  Cons of Option 1 below.\n\n### Confirmation\n\nThis decision is confirmed once a minimal MCP server built on\nbpmn-moddle and bpmnlint can create, import, export, validate, and\nparse a BPMN 2.0 diagram end to end, and a human can view the current\ndiagram in a browser after an agent-driven change (Stage 1 scope; see\nthe related requirements).\n\n## Roles and Responsibilities\n\n### Accountable\n\nRonald Rink\n\n### Responsible\n\n- Ronald Rink\n- The implementing AI coding agent\n\n### Support\n\n### Consulted\n\n### Informed\n\n## Tags\n\n- bpmn\n- mcp\n- foss\n- architecture\n\n## Source\n\nDesign discussion and research conducted interactively with an AI\ncoding agent (OpenCode), researching BPMN modeler options, the\nbpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2\nplugin API, prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Pros and Cons\n\n### Option 1: MCP server, implemented in Node/TypeScript\n\n- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable\n  with no cross-language bridge.\n- Good, because MCP is a stable, cross-vendor protocol usable from any\n  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,\n  OpenCode, ...), not only OpenCode.\n- Good, because it runs as its own process, independently restartable\n  and inspectable, isolated from the agent host's own process.\n- Bad, because it adds a tool-call round trip through the MCP\n  transport (stdio or network) rather than an in-process function\n  call; negligible for a local tool.\n- Bad, because a later real-time, two-way-synced browser canvas\n  (Stage 2) needs an additional, separate canvas-server process next\n  to the MCP server process, rather than a single shared process.\n- Bad, because bpmn-js's \"bpmn.io License\" requires a small,\n  unremovable attribution watermark to stay visible on any rendered\n  canvas; accepted as a non-issue for a local, non-public tool.\n\n### Option 2: An OpenCode v2 plugin\n\n- Good, because it runs in a single process together with the\n  OpenCode host, simplifying a future real-time, two-way-synced\n  browser canvas (Stage 2): one process, shared in-memory state.\n- Good, because it can hook other tool calls\n  (`ctx.tool.hook(\"execute.after\")`), use OpenCode's own permission\n  prompts (`ctx.permission.assert`), and post messages directly into\n  the chat transcript (`ctx.session.synthetic`).\n- Bad, because it only works inside OpenCode, directly violating the\n  \"not locked to one agent host\" driver.\n- Bad, because the v2 plugin API is new, and several of its hooks are\n  explicitly marked experimental; more exposure to breaking changes\n  than the MCP protocol.\n- Bad, because OpenCode v2 plugins must be authored in\n  JavaScript/TypeScript; this is not itself a downside relative to\n  Option 1, but it buys no portability in exchange for the same\n  language constraint.\n\n### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)\n\n- Good, because it keeps the door open to both host-agnostic use and\n  deep OpenCode-native integration later.\n- Good, because the core BPMN logic (parsing, validation, the canvas\n  server) is written once and reused by both adapters.\n- Bad, because it is the most engineering effort of the options\n  considered, for a benefit (the second, OpenCode-specific adapter)\n  that is not needed yet.\n- Bad, because it is premature: no Stage 2 (live-canvas) requirement\n  exists yet to justify the extra adapter.\n\n### Option 4: Python MCP server with a bundled Node.js helper\n\n- Good, because it would match a Python-first tooling convention, had\n  one been required for this project.\n- Bad, because it still depends on the same Node.js-only BPMN\n  libraries under the hood, adding a second runtime and a subprocess\n  or sidecar bridge for no corresponding benefit.\n- Bad, because the one mature pure-Python BPMN project found\n  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and\n  has no equivalent to bpmnlint's configurable modeling-rule\n  validation or to a diagram auto-layout engine.\n- Not chosen: this project was not, in fact, committed to Python; an\n  initial `uv`-based scaffold existed only as a placeholder for\n  incidental scripting, not as a language decision.\n\n## More Information\n\nComparable, publicly available BPMN+MCP projects exist (e.g.\n`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all\nheadless (no live browser canvas). The closest architectural precedent\nfor a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`\n(an MCP server for Excalidraw, not BPMN), which splits into a\ncanvas-server process (web UI + REST + WebSocket sync) and a thin\nMCP/CLI client; this is the model to follow if/when Stage 2 (live\ncanvas) is undertaken for BPMN.\n\n## Updates\n\n<!-- Newest entry first -- prepend new entries directly below this comment. -->\n\n### 2026-10-22T17:51:00.000Z - Created\n\nInitial decision record, drafted from an interactive research\nconversation prior to starting implementation.\n"
}
```

**Output:**
```
{
  "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba",
  "type": "dec",
  "created": "2026-10-22T17:51:16.799+02:00",
  "updated": "2026-10-22T17:51:16.799+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

---

## Assistant (Build · Claude Sonnet 5 · 60.6s)

_Thinking:_



All 12 documents are created. Now let me wire up the real cross-references between the DEC and the 10 REQs.

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba",
  "type": "dec",
  "old_str": "prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Pros and Cons",
  "new_str": "prior to starting the `biz.dfch.BpmnMcp` project.\n\n## Related Artifacts\n\n### Requirements\n\n- REQ abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6: The tool must be free and open source software\n- REQ 94d75c0f-da9d-4f43-8253-936747ff2fe9: The tool must run entirely locally or on-premises\n- REQ 7b9dca78-7432-43bb-af33-8374edb232a4: The tool shall create new BPMN 2.0 process diagrams\n- REQ 8b53fa5a-de89-402b-8b68-ec6ddc1e8e25: The tool shall change elements and flows in an existing BPMN 2.0 diagram\n- REQ 5e0fa899-683e-4c32-bb13-6a2dee03a516: The tool shall import existing BPMN 2.0 XML files\n- REQ b4d4fa31-9ba8-4967-be59-9d23cc7f9213: The tool shall export the current diagram as BPMN 2.0 XML\n- REQ f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0: The tool shall validate a diagram against configurable modeling rules\n- REQ a36fb3d9-a285-49c9-b5b4-deb2f55b8998: The tool shall parse BPMN 2.0 XML into an addressable, structured model\n- REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server\n- REQ bb63c11f-c3e2-4ed0-8f4e-5453b28260f6: The tool shall let a human view the current diagram in a browser after an agent change\n\n## Pros and Cons"
}
```

**Output:**
```
{
  "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba",
  "type": "dec",
  "created": "2026-10-22T17:51:16.799+02:00",
  "updated": "2026-10-22T17:52:00.717+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.\n\n## Notes",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes"
}
```

**Output:**
```
{
  "id": "abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6",
  "type": "req",
  "created": "2026-10-22T17:50:35.975+02:00",
  "updated": "2026-10-22T17:52:01.925+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "94d75c0f-da9d-4f43-8253-936747ff2fe9",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.\n\n## Notes",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes"
}
```

**Output:**
```
{
  "id": "94d75c0f-da9d-4f43-8253-936747ff2fe9",
  "type": "req",
  "created": "2026-10-22T17:50:38.126+02:00",
  "updated": "2026-10-22T17:52:03.681+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "7b9dca78-7432-43bb-af33-8374edb232a4",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "7b9dca78-7432-43bb-af33-8374edb232a4",
  "type": "req",
  "created": "2026-10-22T17:50:39.505+02:00",
  "updated": "2026-10-22T17:52:05.357+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "8b53fa5a-de89-402b-8b68-ec6ddc1e8e25",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "8b53fa5a-de89-402b-8b68-ec6ddc1e8e25",
  "type": "req",
  "created": "2026-10-22T17:50:41.053+02:00",
  "updated": "2026-10-22T17:52:07.259+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "5e0fa899-683e-4c32-bb13-6a2dee03a516",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "5e0fa899-683e-4c32-bb13-6a2dee03a516",
  "type": "req",
  "created": "2026-10-22T17:50:42.658+02:00",
  "updated": "2026-10-22T17:52:09.068+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "b4d4fa31-9ba8-4967-be59-9d23cc7f9213",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "b4d4fa31-9ba8-4967-be59-9d23cc7f9213",
  "type": "req",
  "created": "2026-10-22T17:50:44.358+02:00",
  "updated": "2026-10-22T17:52:10.714+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.\n\n## Notes",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes"
}
```

**Output:**
```
{
  "id": "f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0",
  "type": "req",
  "created": "2026-10-22T17:50:46.722+02:00",
  "updated": "2026-10-22T17:52:12.470+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "a36fb3d9-a285-49c9-b5b4-deb2f55b8998",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "a36fb3d9-a285-49c9-b5b4-deb2f55b8998",
  "type": "req",
  "created": "2026-10-22T17:50:48.407+02:00",
  "updated": "2026-10-22T17:52:14.252+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "0caae3bd-b4e8-47c6-a417-520766031f27",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project.",
  "new_str": "User requirement, stated directly at the start of this project.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
}
```

**Output:**
```
{
  "id": "0caae3bd-b4e8-47c6-a417-520766031f27",
  "type": "req",
  "created": "2026-10-22T17:50:50.330+02:00",
  "updated": "2026-10-22T17:52:15.920+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

**Tool: specmgr_edit**

**Input:**
```json
{
  "id": "bb63c11f-c3e2-4ed0-8f4e-5453b28260f6",
  "type": "req",
  "old_str": "User requirement, stated directly at the start of this project, scoped\ndown to a turn-based preview for the first implementation stage.\n\n## Notes",
  "new_str": "User requirement, stated directly at the start of this project, scoped\ndown to a turn-based preview for the first implementation stage.\n\n## Related Artifacts\n\n### Decisions\n\n- DEC fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba: Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling\n\n## Notes"
}
```

**Output:**
```
{
  "id": "bb63c11f-c3e2-4ed0-8f4e-5453b28260f6",
  "type": "req",
  "created": "2026-10-22T17:50:53.019+02:00",
  "updated": "2026-10-22T17:52:17.881+02:00",
  "status": "draft",
  "version": "1.0.0",
  "classification": null
}
```

---

## Assistant (Build · Claude Sonnet 5 · 5.1s)

_Thinking:_



All documents created and cross-linked successfully. Let me do a final verification pass.

**Tool: specmgr_list_req**

**Input:**
```json
{
  "max_results": 15
}
```

**Output:**
```
{
  "total": 10,
  "offset": 0,
  "max_results": 15,
  "truncated": false,
  "results": [
    {
      "id": "0caae3bd-b4e8-47c6-a417-520766031f27",
      "title": "The tool shall expose its functionality as a Model Context Protocol server",
      "status": "draft",
      "ref": "req-0caae3bd-b4e8-47c6-a417-520766031f27-the-tool-shall-expose-its-functionality-as-a-model-context-p",
      "path": "/home/user/src/docs/docs/req/req-0caae3bd-b4e8-47c6-a417-520766031f27-the-tool-shall-expose-its-functionality-as-a-model-context-p.md",
      "error": null
    },
    {
      "id": "5e0fa899-683e-4c32-bb13-6a2dee03a516",
      "title": "The tool shall import existing BPMN 2.0 XML files",
      "status": "draft",
      "ref": "req-5e0fa899-683e-4c32-bb13-6a2dee03a516-the-tool-shall-import-existing-bpmn-2-0-xml-files",
      "path": "/home/user/src/docs/docs/req/req-5e0fa899-683e-4c32-bb13-6a2dee03a516-the-tool-shall-import-existing-bpmn-2-0-xml-files.md",
      "error": null
    },
    {
      "id": "7b9dca78-7432-43bb-af33-8374edb232a4",
      "title": "The tool shall create new BPMN 2.0 process diagrams",
      "status": "draft",
      "ref": "req-7b9dca78-7432-43bb-af33-8374edb232a4-the-tool-shall-create-new-bpmn-2-0-process-diagrams",
      "path": "/home/user/src/docs/docs/req/req-7b9dca78-7432-43bb-af33-8374edb232a4-the-tool-shall-create-new-bpmn-2-0-process-diagrams.md",
      "error": null
    },
    {
      "id": "8b53fa5a-de89-402b-8b68-ec6ddc1e8e25",
      "title": "The tool shall change elements and flows in an existing BPMN 2.0 diagram",
      "status": "draft",
      "ref": "req-8b53fa5a-de89-402b-8b68-ec6ddc1e8e25-the-tool-shall-change-elements-and-flows-in-an-existing-bpmn",
      "path": "/home/user/src/docs/docs/req/req-8b53fa5a-de89-402b-8b68-ec6ddc1e8e25-the-tool-shall-change-elements-and-flows-in-an-existing-bpmn.md",
      "error": null
    },
    {
      "id": "94d75c0f-da9d-4f43-8253-936747ff2fe9",
      "title": "The tool must run entirely locally or on-premises",
      "status": "draft",
      "ref": "req-94d75c0f-da9d-4f43-8253-936747ff2fe9-the-tool-must-run-entirely-locally-or-on-premises",
      "path": "/home/user/src/docs/docs/req/req-94d75c0f-da9d-4f43-8253-936747ff2fe9-the-tool-must-run-entirely-locally-or-on-premises.md",
      "error": null
    },
    {
      "id": "a36fb3d9-a285-49c9-b5b4-deb2f55b8998",
      "title": "The tool shall parse BPMN 2.0 XML into an addressable, structured model",
      "status": "draft",
      "ref": "req-a36fb3d9-a285-49c9-b5b4-deb2f55b8998-the-tool-shall-parse-bpmn-2-0-xml-into-an-addressable-struct",
      "path": "/home/user/src/docs/docs/req/req-a36fb3d9-a285-49c9-b5b4-deb2f55b8998-the-tool-shall-parse-bpmn-2-0-xml-into-an-addressable-struct.md",
      "error": null
    },
    {
      "id": "abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6",
      "title": "The tool must be free and open source software",
      "status": "draft",
      "ref": "req-abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6-the-tool-must-be-free-and-open-source-software",
      "path": "/home/user/src/docs/docs/req/req-abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6-the-tool-must-be-free-and-open-source-software.md",
      "error": null
    },
    {
      "id": "b4d4fa31-9ba8-4967-be59-9d23cc7f9213",
      "title": "The tool shall export the current diagram as BPMN 2.0 XML",
      "status": "draft",
      "ref": "req-b4d4fa31-9ba8-4967-be59-9d23cc7f9213-the-tool-shall-export-the-current-diagram-as-bpmn-2-0-xml",
      "path": "/home/user/src/docs/docs/req/req-b4d4fa31-9ba8-4967-be59-9d23cc7f9213-the-tool-shall-export-the-current-diagram-as-bpmn-2-0-xml.md",
      "error": null
    },
    {
      "id": "bb63c11f-c3e2-4ed0-8f4e-5453b28260f6",
      "title": "The tool shall let a human view the current diagram in a browser after an agent change",
      "status": "draft",
      "ref": "req-bb63c11f-c3e2-4ed0-8f4e-5453b28260f6-the-tool-shall-let-a-human-view-the-current-diagram-in-a-bro",
      "path": "/home/user/src/docs/docs/req/req-bb63c11f-c3e2-4ed0-8f4e-5453b28260f6-the-tool-shall-let-a-human-view-the-current-diagram-in-a-bro.md",
      "error": null
    },
    {
      "id": "f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0",
      "title": "The tool shall validate a diagram against configurable modeling rules",
      "status": "draft",
      "ref": "req-f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0-the-tool-shall-validate-a-diagram-against-configurable-model",
      "path": "/home/user/src/docs/docs/req/req-f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0-the-tool-shall-validate-a-diagram-against-configurable-model.md",
      "error": null
    }
  ],
  "error_count": 0
}
```

**Tool: specmgr_list_dec**

**Input:**
```json
{
  "max_results": 5
}
```

**Output:**
```
{
  "total": 1,
  "offset": 0,
  "max_results": 5,
  "truncated": false,
  "results": [
    {
      "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba",
      "title": "Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling",
      "status": "draft",
      "ref": "dec-fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba-use-a-node-typescript-mcp-server-for-agent-driven-bpmn-model",
      "path": "/home/user/src/docs/docs/dec/dec-fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba-use-a-node-typescript-mcp-server-for-agent-driven-bpmn-model.md",
      "error": null
    }
  ],
  "error_count": 0
}
```

**Tool: specmgr_get_dec**

**Input:**
```json
{
  "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba"
}
```

**Output:**
```
{
  "frontmatter": {
    "id": "fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba",
    "type": "dec",
    "created": "2026-10-22T17:51:16.799+02:00",
    "updated": "2026-10-22T17:52:00.717+02:00",
    "status": "draft",
    "version": "1.0.0",
    "classification": null
  },
  "body": {
    "context": {
      "text": "## Context and Problem Statement\n\nA user and an AI coding agent need to create, change, import, export,\nvalidate, and parse BPMN 2.0 process diagrams, starting with a workflow\nwhere the agent edits a diagram and the user can view the result in a\nbrowser. The solution must be Free and Open Source Software (FOSS) and\nmust run entirely locally / on-premises, on the same system as the\nagent host, with no mandatory cloud dependency.\n"
    },
    "drivers": {
      "text": "## Decision Drivers\n\n- FOSS licensing, no paid component required\n- Local / on-premises operation only\n- The solution must not be locked to one specific AI agent host\n- Reuse of mature, well-maintained BPMN tooling over custom-built\n  parsing, linting, or rendering\n- Low operational complexity (few moving parts, few runtimes)\n"
    },
    "considered": {
      "text": "## Considered Options\n\n- MCP (Model Context Protocol) server, implemented in Node/TypeScript\n- An OpenCode v2 plugin\n- A hybrid: a shared core library with both an MCP adapter and an\n  OpenCode v2 plugin adapter\n- An MCP server implemented in Python, delegating BPMN-specific\n  operations to a bundled Node.js helper process\n"
    },
    "outcome": {
      "statement": {
        "text": "Chosen option: \"MCP server, implemented in Node/TypeScript\", because it\nis the only option that is both host-agnostic (usable from any\nMCP-capable agent, not only OpenCode) and free of any cross-language\nbridge. The mature, actively maintained, FOSS BPMN tooling needed for\nthis project (bpmn-moddle, bpmnlint, bpmn-js) exists only as\nJavaScript/TypeScript libraries; authoring the server itself in the\nsame language avoids adding a second runtime or a subprocess bridge."
      },
      "consequences": {
        "text": "### Consequences\n\n- The project depends on Node.js as its runtime, and on the bpmn.io\n  toolkit (bpmn-moddle, bpmnlint, bpmn-js) as its BPMN engine.\n- The server is usable from any MCP-compatible agent host, not only\n  OpenCode.\n- A later OpenCode-specific integration (e.g. for deeper, host-native\n  hooks) remains possible as an additional, separate adapter on top of\n  the same core, without changing this decision.\n- bpmn-js ships under the \"bpmn.io License\" (MIT plus a clause\n  requiring its small attribution watermark to remain visible and\n  unmodified on any rendered canvas). This is accepted; see Pros and\n  Cons of Option 1 below.\n"
      },
      "confirmation": {
        "text": "### Confirmation\n\nThis decision is confirmed once a minimal MCP server built on\nbpmn-moddle and bpmnlint can create, import, export, validate, and\nparse a BPMN 2.0 diagram end to end, and a human can view the current\ndiagram in a browser after an agent-driven change (Stage 1 scope; see\nthe related requirements).\n"
      },
      "text": "Decision Outcome"
    },
    "roles_and_responsibilities": {
      "accountable": {
        "value": {
          "text": "Ronald Rink"
        },
        "text": "Accountable"
      },
      "responsible": {
        "items": [
          {
            "text": "Ronald Rink"
          },
          {
            "text": "The implementing AI coding agent"
          }
        ],
        "text": "Responsible"
      },
      "support": {
        "items": null,
        "text": "Support"
      },
      "consulted": {
        "items": null,
        "text": "Consulted"
      },
      "informed": {
        "items": null,
        "text": "Informed"
      },
      "text": "Roles and Responsibilities"
    },
    "tags": {
      "items": [
        {
          "notes": null,
          "text": "bpmn"
        },
        {
          "notes": null,
          "text": "mcp"
        },
        {
          "notes": null,
          "text": "foss"
        },
        {
          "notes": null,
          "text": "architecture"
        }
      ],
      "text": "Tags"
    },
    "source": {
      "value": {
        "text": "Design discussion and research conducted interactively with an AI\ncoding agent (OpenCode), researching BPMN modeler options, the\nbpmn.io/Camunda toolkit, comparable MCP projects, and the OpenCode v2\nplugin API, prior to starting the `biz.dfch.BpmnMcp` project."
      },
      "text": "Source"
    },
    "related_artifacts": {
      "requirements": {
        "items": [
          {
            "notes": null,
            "text": "REQ abdcf9d7-a7e0-465e-9fc2-a9f5748e38f6: The tool must be free and open source software"
          },
          {
            "notes": null,
            "text": "REQ 94d75c0f-da9d-4f43-8253-936747ff2fe9: The tool must run entirely locally or on-premises"
          },
          {
            "notes": null,
            "text": "REQ 7b9dca78-7432-43bb-af33-8374edb232a4: The tool shall create new BPMN 2.0 process diagrams"
          },
          {
            "notes": null,
            "text": "REQ 8b53fa5a-de89-402b-8b68-ec6ddc1e8e25: The tool shall change elements and flows in an existing BPMN 2.0 diagram"
          },
          {
            "notes": null,
            "text": "REQ 5e0fa899-683e-4c32-bb13-6a2dee03a516: The tool shall import existing BPMN 2.0 XML files"
          },
          {
            "notes": null,
            "text": "REQ b4d4fa31-9ba8-4967-be59-9d23cc7f9213: The tool shall export the current diagram as BPMN 2.0 XML"
          },
          {
            "notes": null,
            "text": "REQ f93fb1c1-a2ad-4adc-9c7b-dd8a817449d0: The tool shall validate a diagram against configurable modeling rules"
          },
          {
            "notes": null,
            "text": "REQ a36fb3d9-a285-49c9-b5b4-deb2f55b8998: The tool shall parse BPMN 2.0 XML into an addressable, structured model"
          },
          {
            "notes": null,
            "text": "REQ 0caae3bd-b4e8-47c6-a417-520766031f27: The tool shall expose its functionality as a Model Context Protocol server"
          },
          {
            "notes": null,
            "text": "REQ bb63c11f-c3e2-4ed0-8f4e-5453b28260f6: The tool shall let a human view the current diagram in a browser after an agent change"
          }
        ],
        "text": "Requirements"
      },
      "decisions": null,
      "goals": null,
      "risks": null,
      "text": "Related Artifacts"
    },
    "pros_and_cons": {
      "options": [
        {
          "text": "### Option 1: MCP server, implemented in Node/TypeScript\n\n- Good, because bpmn-moddle, bpmnlint, and bpmn-js are directly usable\n  with no cross-language bridge.\n- Good, because MCP is a stable, cross-vendor protocol usable from any\n  MCP-capable agent host (Claude Desktop, Cursor, Claude Code,\n  OpenCode, ...), not only OpenCode.\n- Good, because it runs as its own process, independently restartable\n  and inspectable, isolated from the agent host's own process.\n- Bad, because it adds a tool-call round trip through the MCP\n  transport (stdio or network) rather than an in-process function\n  call; negligible for a local tool.\n- Bad, because a later real-time, two-way-synced browser canvas\n  (Stage 2) needs an additional, separate canvas-server process next\n  to the MCP server process, rather than a single shared process.\n- Bad, because bpmn-js's \"bpmn.io License\" requires a small,\n  unremovable attribution watermark to stay visible on any rendered\n  canvas; accepted as a non-issue for a local, non-public tool.\n",
          "number": 1,
          "name": "MCP server, implemented in Node/TypeScript"
        },
        {
          "text": "### Option 2: An OpenCode v2 plugin\n\n- Good, because it runs in a single process together with the\n  OpenCode host, simplifying a future real-time, two-way-synced\n  browser canvas (Stage 2): one process, shared in-memory state.\n- Good, because it can hook other tool calls\n  (`ctx.tool.hook(\"execute.after\")`), use OpenCode's own permission\n  prompts (`ctx.permission.assert`), and post messages directly into\n  the chat transcript (`ctx.session.synthetic`).\n- Bad, because it only works inside OpenCode, directly violating the\n  \"not locked to one agent host\" driver.\n- Bad, because the v2 plugin API is new, and several of its hooks are\n  explicitly marked experimental; more exposure to breaking changes\n  than the MCP protocol.\n- Bad, because OpenCode v2 plugins must be authored in\n  JavaScript/TypeScript; this is not itself a downside relative to\n  Option 1, but it buys no portability in exchange for the same\n  language constraint.\n",
          "number": 2,
          "name": "An OpenCode v2 plugin"
        },
        {
          "text": "### Option 3: Hybrid (shared core, MCP and OpenCode-plugin adapters)\n\n- Good, because it keeps the door open to both host-agnostic use and\n  deep OpenCode-native integration later.\n- Good, because the core BPMN logic (parsing, validation, the canvas\n  server) is written once and reused by both adapters.\n- Bad, because it is the most engineering effort of the options\n  considered, for a benefit (the second, OpenCode-specific adapter)\n  that is not needed yet.\n- Bad, because it is premature: no Stage 2 (live-canvas) requirement\n  exists yet to justify the extra adapter.\n",
          "number": 3,
          "name": "Hybrid (shared core, MCP and OpenCode-plugin adapters)"
        },
        {
          "text": "### Option 4: Python MCP server with a bundled Node.js helper\n\n- Good, because it would match a Python-first tooling convention, had\n  one been required for this project.\n- Bad, because it still depends on the same Node.js-only BPMN\n  libraries under the hood, adding a second runtime and a subprocess\n  or sidecar bridge for no corresponding benefit.\n- Bad, because the one mature pure-Python BPMN project found\n  (SpiffWorkflow) itself depends on bpmn-js for any visual editor, and\n  has no equivalent to bpmnlint's configurable modeling-rule\n  validation or to a diagram auto-layout engine.\n- Not chosen: this project was not, in fact, committed to Python; an\n  initial `uv`-based scaffold existed only as a placeholder for\n  incidental scripting, not as a language decision.\n",
          "number": 4,
          "name": "Python MCP server with a bundled Node.js helper"
        }
      ],
      "text": "Pros and Cons"
    },
    "more_information": {
      "text": "## More Information\n\nComparable, publicly available BPMN+MCP projects exist (e.g.\n`dattmavis/BPMN-MCP`, `oisee/mcp-bpmn`, `Stieges/bpmn-generator`), all\nheadless (no live browser canvas). The closest architectural precedent\nfor a live, agent-and-human shared canvas is `yctimlin/mcp_excalidraw`\n(an MCP server for Excalidraw, not BPMN), which splits into a\ncanvas-server process (web UI + REST + WebSocket sync) and a thin\nMCP/CLI client; this is the model to follow if/when Stage 2 (live\ncanvas) is undertaken for BPMN.\n"
    },
    "updates": {
      "comment": {
        "text": "<!-- Newest entry first -- prepend new entries directly below this comment. -->\n"
      },
      "updates": [
        {
          "content": {
            "text": "Initial decision record, drafted from an interactive research\nconversation prior to starting implementation.\n"
          },
          "text": "2026-10-22T17:51:00.000Z - Created",
          "timestamp": "2026-10-22T17:51:00.000Z",
          "title": "Created"
        }
      ],
      "text": "Updates"
    },
    "text": "Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling"
  }
}
```

---

## Assistant (Build · Claude Sonnet 5 · 9.5s)

Everything is created, cross-linked, and verified in this repo's `docs/req/` and `docs/dec/` directories. Summary of what's now in place:

**1 Decision** (`dec-fdc84432-...`): *Use a Node/TypeScript MCP Server for Agent-Driven BPMN Modeling* — full context, drivers, 4 considered options with pros/cons (MCP server, OpenCode plugin, hybrid, Python+Node sidecar), and links to all 10 requirements.

**10 Requirements**, each linked back to the decision:
| ID | Title |
|---|---|
| `abdcf9d7-...` | Must be free and open source software |
| `94d75c0f-...` | Must run entirely locally or on-premises |
| `7b9dca78-...` | Shall create new BPMN 2.0 process diagrams |
| `8b53fa5a-...` | Shall change elements and flows |
| `5e0fa899-...` | Shall import existing BPMN 2.0 XML |
| `b4d4fa31-...` | Shall export the current diagram as BPMN 2.0 XML |
| `f93fb1c1-...` | Shall validate against configurable modeling rules (bpmnlint) |
| `a36fb3d9-...` | Shall parse BPMN XML into an addressable model (bpmn-moddle) |
| `0caae3bd-...` | Shall expose functionality as an MCP server |
| `bb63c11f-...` | Shall let a human preview diagrams in a browser (Stage 1) |

**1 QA document** (`qa-28a4470d-...`): the full elicitation record — BPMN tooling landscape, the Excalidraw precedent, the moddle/bpmnlint distinction, MCP-vs-plugin tradeoffs, the Python-vs-Node.js resolution, and the license caveat — organized under the ISO 25010 categories, with pending categories honestly left as `TODO`.

All files live under `/home/user/src/docs/docs/{dec,req,qa}/`. To get this into `~/src/biz.dfch.BpmnMcp`, copy those 12 `.md` files over (or point an agent there at this repo's `docs/` folder) — a fresh agent reading them should have full context and rationale to turn this into an implementation plan without re-deriving any of the research we just did.

---

## User

fyi: I moved the artifacts to the new repo dir. Do not verify this, trust my word.

I want to wrap up this session, what do you need to do so that a new agent can continue in a fresh session?

---

## Assistant (Build · Claude Sonnet 5 · 103.0s)

_Thinking:_



Good — now that we're in build mode, the main thing a fresh agent needs is a durable pointer in the new repo itself, since it won't have this conversation or this repo's specmgr context. Let me set that up: an `AGENTS.md` (the file OpenCode and most coding agents auto-load) summarizing the project, the chosen architecture, and pointing at the spec artifacts, plus a short `README.md` since it's currently empty.

**Tool: read**

**Input:**
```json
{
  "filePath": "/home/user/src/biz.dfch.BpmnMcp/README.md"
}
```

**Output:**
```
<path>/home/user/src/biz.dfch.BpmnMcp/README.md</path>
<type>file</type>
<content>


(End of file - total 0 lines)
</content>
```

---

## Assistant (Build · Claude Sonnet 5 · 17.7s)

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/user/src/biz.dfch.BpmnMcp/AGENTS.md",
  "content": "# biz.dfch.BpmnMcp — Agent Instructions\n\n## What this project is\n\nA Model Context Protocol (MCP) server that lets an AI agent and a human\ncreate, change, import, export, validate, and parse BPMN 2.0 process\ndiagrams. It must be Free and Open Source Software (FOSS) and must run\nentirely locally / on-premises, with no mandatory cloud dependency.\n\n## Start here\n\nBefore writing any code, read the specification artifacts in this\nrepository. They are standard Markdown files with YAML frontmatter\n(the `specmgr` document format — plain-readable even without specmgr\ntooling configured in this repo), with filenames starting with `dec-`,\n`req-`, or `qa-`. Locate them with a repository-wide search for those\nprefixes if they are not in an obvious `docs/` folder.\n\n- **1 decision record** (`dec-*.md`): the chosen architecture and why,\n  including the options that were rejected and why.\n- **10 requirement documents** (`req-*.md`): one testable requirement\n  each (FOSS, local-only, create, change, import, export, validate,\n  parse, MCP exposure, browser preview).\n- **1 Q&A document** (`qa-*.md`): the full research/elicitation record\n  — the BPMN tooling landscape that was surveyed, why both bpmn-moddle\n  and bpmnlint are needed, the MCP-vs-OpenCode-plugin tradeoff, the\n  Python-vs-Node.js resolution, and the bpmn-js licensing note.\n\nThese came out of an interactive research and planning session\n(2026-10-22) and are the single source of truth for scope and\nrationale. Read the decision record first, then the requirements, then\nthe Q&A for background. Do not re-derive this research from scratch —\nit is already captured there.\n\n## Chosen architecture (full rationale in the decision record)\n\n- **Implementation language: Node.js / TypeScript** — not Python,\n  despite the `pyproject.toml` / `uv.lock` / `.venv` already present in\n  this repository. That scaffold was created only as a placeholder for\n  incidental scripting and is not the project's implementation\n  language; it can remain untouched and unrelated to the MCP server\n  itself.\n- **Protocol: a Model Context Protocol (MCP) server**, not an\n  OpenCode-specific plugin — chosen specifically to stay usable from\n  any MCP-compatible agent host, not locked to one editor/agent.\n- **BPMN engine: the bpmn.io toolkit**, used as a library, not\n  reimplemented:\n  - `bpmn-moddle` — parses/serializes BPMN 2.0 XML (backs create,\n    change, import, export, parse).\n  - `bpmnlint` — a *separate* library from bpmn-moddle, providing\n    configurable, rule-based modeling validation (backs validate).\n    bpmn-moddle alone only guarantees well-formed XML, not a\n    sound diagram; see the Q&A for the full explanation.\n  - `bpmn-js` — a Viewer (not the full Modeler, for this stage) for\n    the human-facing browser preview.\n\n## Scope: Stage 1 only\n\nThis project currently targets **Stage 1**: an agent creates or\nchanges a diagram via MCP tools, and a human can open a local browser\nto see the current state. This is a turn-based preview (an explicit\npreview step reloads the current diagram), not a continuously live\ncanvas.\n\n**Explicitly deferred (Stage 2, not in scope yet):** a live,\ntwo-way-synchronized browser canvas where both the agent and a human\nedit the same diagram in real time, using bpmn-js's full Modeler\n(drag/drop, connect, delete — all built in; `bpmn-js-properties-panel`\noptionally added later for editing names/ids/attributes through the\nUI). If this is undertaken later, follow the `yctimlin/mcp_excalidraw`\narchitecture referenced in the decision record's \"More Information\"\nsection (a separate canvas-server process — web UI + REST + WebSocket\nsync — driven by a thin MCP client) rather than starting from scratch.\n\n## Licensing note\n\n`bpmn-js` ships under the \"bpmn.io License\" (MIT plus a clause\nrequiring its small attribution watermark to remain visible and\nunmodified on any rendered canvas). This has already been reviewed and\naccepted as compliant with the FOSS requirement — no action needed,\njust do not strip, hide, or cover that watermark.\n\n## Suggested next steps for implementation\n\n1. Scaffold a Node.js/TypeScript package (e.g. the official MCP SDK\n   for TypeScript) alongside the existing, unrelated `uv` scaffold.\n2. Implement one MCP tool per functional requirement (create, change,\n   import, export, validate, parse), backed by `bpmn-moddle` and\n   `bpmnlint`.\n3. Implement the Stage 1 browser preview: a small local static server\n   hosting a `bpmn-js` Viewer page, opened in the user's default\n   browser after an agent-driven change.\n4. Check the result against each requirement document's \"Description\"\n   and against the decision record's \"Confirmation\" section before\n   considering Stage 1 done.\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 5 · 4.6s)

**Tool: write**

**Input:**
```json
{
  "filePath": "/home/user/src/biz.dfch.BpmnMcp/README.md",
  "content": "# biz.dfch.BpmnMcp\n\nA Model Context Protocol (MCP) server for agent-and-human BPMN 2.0\nprocess modeling: create, change, import, export, validate, and parse\nBPMN diagrams. Free and Open Source Software, runs entirely locally /\non-premises.\n\nSee [`AGENTS.md`](./AGENTS.md) for the full specification pointers,\nthe chosen architecture, and the current implementation scope.\n"
}
```

**Output:**
```
Wrote file successfully.
```

---

## Assistant (Build · Claude Sonnet 5 · 18.2s)

_Thinking:_



Done. Here's what's now in place for a clean handoff:

## In `~/src/biz.dfch.BpmnMcp`

- **`AGENTS.md`** (new) — the entry point any fresh coding agent will auto-load. It states the project purpose, points to the `dec-*.md`/`req-*.md`/`qa-*.md` spec files (wherever you placed them), summarizes the chosen architecture (Node/TypeScript MCP server, bpmn-moddle + bpmnlint + bpmn-js Viewer), explicitly warns that the existing `uv`/Python scaffold is unrelated incidental tooling and not the implementation language, states the Stage 1 scope with Stage 2 explicitly deferred, notes the bpmn-js licensing caveat, and lists suggested next implementation steps.
- **`README.md`** (was empty) — one paragraph plus a pointer to `AGENTS.md`.
- The 12 spec artifacts you moved over (1 decision, 10 requirements, 1 Q&A) — I didn't touch or verify these, per your instruction.

## What I deliberately did *not* do

- **No git commit.** The repo has no commits yet (everything is untracked). I didn't commit since you didn't ask for it — worth doing yourself (or telling the next agent to do) as the actual clean starting point, so the handoff state is captured in history rather than sitting as loose untracked files.
- **No verification** of the moved artifacts' location/content, as instructed.
- **No changes to the `uv`/Python scaffold** — left exactly as you set it up, since it's unrelated to the server itself.
- **No code scaffolding started** — `AGENTS.md` lists suggested next steps, but no `package.json`/TypeScript setup exists yet; that's genuinely the next session's first task, not something to pre-empt now.

A fresh agent opening that repo should read `AGENTS.md` first, which will route it to the decision record → requirements → Q&A, in that order, before writing any code. That should be enough for this session to close out cleanly.

---

