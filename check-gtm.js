// Run this in browser console to diagnose GTM issues

console.log('=== GTM Diagnostic ===');

// 1. Check if dataLayer exists
console.log('1. dataLayer exists?', typeof window.dataLayer !== 'undefined');
if (window.dataLayer) {
    console.log('   dataLayer type:', typeof window.dataLayer);
    console.log('   dataLayer is array?', Array.isArray(window.dataLayer));
    console.log('   dataLayer length:', window.dataLayer.length);
}

// 2. Check if GTM is loaded
console.log('\n2. GTM loaded?', typeof window.google_tag_manager !== 'undefined');
if (window.google_tag_manager) {
    console.log('   GTM containers:', Object.keys(window.google_tag_manager));
}

// 3. Check for GTM script
const scripts = Array.from(document.getElementsByTagName('script'));
const gtmScript = scripts.find(s => s.src && s.src.includes('googletagmanager.com'));
console.log('\n3. GTM script tag found?', !!gtmScript);
if (gtmScript) {
    console.log('   Script URL:', gtmScript.src);
    console.log('   Script loaded?', gtmScript.loaded || 'unknown');
}

// 4. Check for blocking
console.log('\n4. Possible blockers:');
console.log('   Ad blocker may be active?', !window.dataLayer && !!gtmScript);
console.log('   Script errors?', window.gtmLoadError || 'none detected');

// 5. Try to initialize if missing
if (!window.dataLayer) {
    console.log('\n5. Attempting to initialize dataLayer...');
    window.dataLayer = [];
    console.log('   dataLayer created manually');
}

// 6. Test push
console.log('\n6. Testing dataLayer.push...');
try {
    const result = window.dataLayer.push({'event': 'diagnostic_test'});
    console.log('   Push result:', result);
    console.log('   Current length:', window.dataLayer.length);
} catch (e) {
    console.error('   Push failed:', e);
}

// 7. Check for CSP or other blocks
console.log('\n7. Network/Security checks:');
if (window.SecurityPolicyViolationEvent) {
    window.addEventListener('securitypolicyviolation', (e) => {
        console.error('CSP Violation:', e.blockedURI);
    });
}

// 8. Manual GTM check
console.log('\n8. Checking GTM resources:');
fetch('https://www.googletagmanager.com/gtm.js?id=GTM-TT935KM3')
    .then(response => {
        console.log('   GTM script accessible:', response.ok);
        console.log('   Status:', response.status);
    })
    .catch(error => {
        console.error('   GTM script blocked:', error);
    });