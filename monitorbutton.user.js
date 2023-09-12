// ==UserScript==
// @name         Convert Assessment to Monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Convert assessments to monitors in Cyber Intelligence House
// @author       Milo Salvia CTA
// @match        https://dashboard.cyberintelligence.house/assessments/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the API key from storage
    let apiKey = GM_getValue('apiKey');

    // If the API key is not found in storage, prompt the user to enter it
    if (!apiKey) {
        apiKey = prompt('Please enter your API key:');
        GM_setValue('apiKey', apiKey);  // Store the API key for future use
    }

    // If the flag is not set in sessionStorage, set it and refresh the page
    if (!sessionStorage.getItem('buttonAdded')) {
        sessionStorage.setItem('buttonAdded', 'true');
        window.location.reload();
        return;  // Exit the script to prevent further execution after refresh
    }

    // Extract the UUID from the current page's URL
    const uuidMatch = window.location.pathname.match(/assessments\/(.*?)\//);
    if (uuidMatch && uuidMatch[1]) {
        const uuid = uuidMatch[1];

        // Create a button
        const button = document.createElement('button');
        button.innerText = 'Convert to Monitor';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.fontSize = '1.5em';  // Increase font size
        button.style.fontWeight = 'bold';  // Make text bold
        button.style.color = 'white';      // Text color
        button.style.backgroundColor = 'red';  // Button color
        button.style.border = 'none';      // Remove border
        button.style.padding = '10px 20px'; // Increase padding for a larger button
        button.style.borderRadius = '5px'; // Rounded corners
        button.style.cursor = 'pointer';   // Change cursor to pointer on hover
        button.onclick = function() {
            // Send the PUT request
            GM_xmlhttpRequest({
                method: "PUT",
                url: "https://if.cyberintelligence.house/api/accounts/" + uuid,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "X-Api-Key": apiKey
                },
                data: "type=monitoring",
                onload: function(response) {
                    console.log("API Response:", response.responseText);  // Log the response body
                    if (response.status === 200) {
                        alert('Successfully converted to monitor!');
                        window.location.href = 'https://dashboard.cyberintelligence.house/monitoring/list';  // Navigate to monitoring list
                    } else {
                        alert('Error converting to monitor.');
                    }
                }
            });
        };

        // Add the button to the page
        document.body.appendChild(button);

        // Clear the flag from sessionStorage
        sessionStorage.removeItem('buttonAdded');
    } else {
        console.log('Error extracting UUID.');
    }
})();
