// SPDX-FileCopyrightText: 2026 Ronald Rink, d-fens GmbH
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * The Stage 1 preview page (REQ-003, QA 4.0010/4.0020): the single
 * static HTML asset served by `GET /view/<uuid>` (the plan's Design
 * Notes view-URL scheme). It runs the bpmn-js Viewer in read-only
 * mode (no Modeler, no properties panel -- QA 4.0020: view only): the
 * page loads the pinned viewer bundle from the installed `bpmn-js`
 * package over the fixed asset prefix (`preview-server.ts`, REQ-003)
 * and never loads the Modeler build.
 *
 * Turn-based contract (QA 4.0010): the page reads the process uuid
 * from its own path and fetches the process's current XML from
 * `/processes/<uuid>` exactly once, at page load -- it reflects the
 * state at call time (after the store's conditional re-read), and
 * nothing refreshes it automatically.
 *
 * The "powered by bpmn.io" watermark is rendered by the Viewer
 * itself (the accepted bpmn.io License clause, DEC
 * fdc84432-1b48-4eb9-82e0-ec13cb8cf8ba) and is deliberately left
 * unmodified:
 * this page applies no CSS override to the powered-by element.
 */
export const PREVIEW_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BPMN Preview</title>
  <link rel="stylesheet" href="/bpmn-js/assets/diagram-js.css">
  <link rel="stylesheet" href="/bpmn-js/assets/bpmn-js.css">
  <style>
    html, body { height: 100%; margin: 0; }
    #app { display: flex; flex-direction: column; height: 100%; font-family: Arial, sans-serif; }
    #title { padding: 8px 16px; border-bottom: 1px solid #ccc; background: #f5f5f5; }
    #bpmn-canvas { flex: 1; min-height: 0; width: 100%; }
    #error { padding: 16px; color: #900; }
  </style>
</head>
<body>
  <div id="app">
    <div id="title">BPMN Preview</div>
    <div id="bpmn-canvas"></div>
    <div id="error" hidden></div>
  </div>
  <script src="/bpmn-js/bpmn-viewer.production.min.js"></script>
  <script>
    (function () {
      var title = document.getElementById('title');
      var canvas = document.getElementById('bpmn-canvas');
      var error = document.getElementById('error');

      function showFailure(message) {
        canvas.style.display = 'none';
        error.hidden = false;
        error.textContent = message;
        title.textContent = 'BPMN Preview - failed to load';
      }

      // The uuid is the last path segment of /view/<uuid> (the page
      // reads it from its own path, the plan's Design Notes).
      var segments = window.location.pathname.split('/');
      var uuid;
      try {
        uuid = decodeURIComponent(segments[segments.length - 1]);
      } catch (decodeError) {
        showFailure('the process uuid in the URL is not valid');
        return;
      }

      // The turn-based contract (QA 4.0010): fetch the process's
      // current state exactly once, at page load; nothing refreshes
      // the page afterwards.
      fetch('/processes/' + encodeURIComponent(uuid))
        .then(function (response) {
          if (!response.ok) {
            throw new Error('the process could not be loaded (HTTP ' + response.status + ')');
          }
          return response.text();
        })
        .then(function (xml) {
          return new Promise(function (resolveViewer, rejectViewer) {
            var viewer = new BpmnJS({ container: canvas });
            viewer.importXML(xml).then(
              function () {
                viewer.get('canvas').zoom('fit-viewport');
                title.textContent = 'BPMN Preview - ' + uuid;
                resolveViewer();
              },
              rejectViewer,
            );
          });
        })
        .catch(function (importError) {
          showFailure(String(importError && importError.message ? importError.message : importError));
        });
    })();
  </script>
</body>
</html>
`;
