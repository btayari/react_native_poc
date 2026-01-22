/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// SPA redirect script to be injected
const spaScript = `
    <!-- Single Page Apps for GitHub Pages redirect script -->
    <script type="text/javascript">
      (function(l) {
        if (l.search[1] === '/' ) {
          var decoded = l.search.slice(1).split('&').map(function(s) { 
            return s.replace(/~and~/g, '&')
          }).join('?');
          window.history.replaceState(null, null,
            l.pathname.slice(0, -1) + decoded + l.hash
          );
        }
      }(window.location))
    </script>
`;

try {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Inject the SPA script right after the opening <head> tag
  indexHtml = indexHtml.replace('<head>', '<head>' + spaScript);

  fs.writeFileSync(indexPath, indexHtml);
  console.log('✅ SPA redirect script injected into index.html');

  // Also copy the script to all other HTML files
  const htmlFiles = fs.readdirSync(distPath).filter(f => f.endsWith('.html') && f !== 'index.html' && f !== '404.html');

  htmlFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    let html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('Single Page Apps for GitHub Pages')) {
      html = html.replace('<head>', '<head>' + spaScript);
      fs.writeFileSync(filePath, html);
      console.log(`✅ SPA script injected into ${file}`);
    }
  });

} catch (error) {
  console.error('❌ Error injecting SPA script:', error);
  process.exit(1);
}
