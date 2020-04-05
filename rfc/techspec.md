# Mathina Tech Spec

## High level overview

Mathina is a web app consisting of Mathina **Hub** and standalone Activity **Apps**.

### Hub

An HTML and Javascript (Vue) *Single Page Application* (SPA). Its role is to act as the central interaction point for users.

- Allow users to select their language
- Provide Assist Mode, which can act as *a teacher's assistant*
- Allow users to select their age group
- Contains configuration linking available **Locations**, **Stories** and **Apps**
- Navigate a **World Map**, which provides access to **Locations**
- Provide access to various **Stories** within each **Location**
- Display **Stories**, their narratives and the ability to launch related **Apps**
- ...

#### Proof of Concept 

- [github](https://github.com/SevenIndirecto/mathina-hub)
- [webapp](https://dev.zabkar.net)

### Apps

Apps are browser based games, challenges or activities the user undertakes for playful education.

Apps are standalone, self hosted web apps which can be launched by the **Hub** and follow a communication and parameter standard.

Apps should run on standard technology / API's provided by Web Browsers such as HTML5, CSS, Javascript, WebGL ... and not rely on proprietary or outdated technology such as Flash, Silverlight, Java applets, etc. These 3rd party plugins are often security headaches for users, especially in institutional environments but also pose huge issues with Mobile support.

## API / App integration

The Hub displays these Apps in an **iframe**. While iframes are far from ideal, this grants each team greater flexibilty in choosing their tech stack.

### Query Parameters

**Direction**: `Hub -> App`

These will be passed via URL by the Hub when loading Apps.

- locale
    - **desc**: ISO 639-1 code (eg. 'en') language code
    - **type**: String
    - **allowed values**: **TODO** list of supported languages (en, de, pt, fi, it, sl?)
    - **required**: true
    - **example**: https://apps.com/app?locale=en

- platform
    - **desc**: Provide App with information how the Hub is interpreting the user's platform
    - **type**: String
    - **allowed values**: mobile, desktop
    - **required**: false
    - **default**: desktop
    - **example**: https://apps.com/app?platform=mobile

### Post Message

**Direction**: `Hub <-> App`

The `window.postMessage()` method allows us to communicate between the Hub and Apps via event listeners. See [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for details.

> Note on compatiblity and types of messages sent

We can send Objects via these messages, as our browser support should allow for this.

You can test viability of sending Objects in a browser via something like:

```
<html>
   <body>
      <iframe id='if'></iframe>
      <script>
         let iframe = document.getElementById('if');
         let iframeScript = iframe.contentDocument.createElement("script");
         iframeScript.appendChild(
            iframe.contentDocument.createTextNode(
               'window.addEventListener("message", function(e) {console.log(e.data);}); console.log("listener attached");'));
         iframe.contentDocument.body.appendChild(iframeScript);
         iframe.contentWindow.postMessage("test123", "*");
         iframe.contentWindow.postMessage({'whatAmI': 'an object, maybe?'}, "*");
      </script>
   </body>
</html>
```

Each message should be an Object with the following structure:

```javascript
{
    id: String, // eg. 'restart'
    payload: Any, // eg. {reason: 'failed'}
}
```

#### Apps -> Hub

**Direction**: `Hub <- App`

These are messages the Hub will set event listeners for and react accordingly.

- restart
    - **id**: restart
    - **payload**: ?
    - **expected behavior**: **TODO**: The Hub displays any required user interface when restarting
    
- pause
    - **id**: pause
    - **payload**: None
    - **expected behavior**: **TODO**: The app is put into a paused UI state in the Hub

- **TODO**: more?

### Hub -> Apps

**Direction**: `Hub -> App`

These are messages apps will set event listeners for and react accordingly.

- resume
    - **id**: resume
    - **payload**: None
    - **expected behavior**: **TODO**: App is now in focus and should resume / unpause

## Client support

We will not support outdated browsers (any versions of Internet Explorer).
As this is educational content, we might as well teach the usage of up to date technology :)
Supporting Firefox ESR is a nod to corporate, educational and enterprise environments in general which do not allow users to update their workstations. Note that running outdated software in such environments is a very relevant security risk.

Desktop:

* Chrome (evergreen)
* Firefox (evergreen)
* Firefox ESR
* Edge (latest 2 versions)
* Safari (latest 2 versions)

Mobile (https://gs.statcounter.com/browser-market-share/mobile/worldwide):

* Chrome
* Safari
* Samsung Internet
* UC Browser

Note that browsers such as Brave, Opera, ... are likely still implicitly supported, just not specifically targeted.

For implementation we suggest the use of [browserslist](https://github.com/browserslist/browserslist) in your tech stack. 

Suggested entry:

```
# file: .browserslistrc
> 2%
last 2 versions
Firefox ESR
not dead
not ie 11
```

Example Supported output:

`npx browserslist`

```
and_chr 79
and_ff 68
and_qq 1.2
and_uc 12.12
android 76
baidu 7.12
chrome 79
chrome 78
edge 18
edge 17
firefox 72
firefox 71
firefox 68
ios_saf 13.3
ios_saf 13.2
ios_saf 13.0-13.1
ios_saf 12.2-12.4
kaios 2.5
op_mini all
op_mob 46
opera 64
opera 63
safari 13
safari 12.1
samsung 10.1
samsung 9.2
```

Browserslist can be integrated into your tech stack to automatically provide relevant polyfills via Babel, PostCSS, etc.

## Screen Resolution support

See: https://gs.statcounter.com/screen-resolution-stats

- Mobile views should support down to 360x640
    - We might require users to switch to portrait mode to play certain games?
- Tablet displays could be handled as mobile device in portrait view, desktop in landscape
- Desktop 1366x768 up to 1920x1080, while gracefully handling ultrawide screens and larger resolutions

**NOTE**: The Hub can provide a query parameter to Apps to request a mobile view if this is desired.

## i18n

Use [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) codes.

## Offline Support

**TODO** We suggest mathina forgoes offline support for now. Having distributed self hosted apps seems problematic for cache management. Maybe not though?

**TODO** However we can easily add PWA (offline) support to The Hub itself if that's useful and prompt users to seek internet connectivity when starting Apps.

## Performance

The Hub and Apps should run without dramatically reduced performance or excessively dropping frames on mobile devices, which might not have GPU acceleration available. Low spec hardware such as **Chromebooks** also seems likely to be used in educational environments.
