const { Builder, By, Key } = require("selenium-webdriver");
require("chromedriver");
const fs = require('fs');

async function test_case() {
    let driver = await new Builder().forBrowser("chrome").build(); // new WebDriver 
    try {
        await driver.get("https://www.ebay.com/sch/i.html?_from=R40&_trksid=p4432023.m570.l1313&_nkw=smartphone&_sacat=0");

        // search results 
        await driver.sleep(5000);

        // Getting smartphone names and prices
        const smartphoneNames = await driver.findElements(By.css(".s-item__title"));
        const smartphonePrices = await driver.findElements(By.css(".s-item__price"));

        // Create an array to store smartphone data
        const smartphoneData = [];

        // Loop through smartphone names and prices
        for (let i = 0; i < smartphoneNames.length; i++) {
            const name = await smartphoneNames[i].getText();
            const price = smartphonePrices[i] ? await smartphonePrices[i].getText() : 'Price not available';

            // Push the smartphone name and price into the array
            smartphoneData.push({ name: name, price: price, date: new Date().toISOString().slice(0, 16).replace('T', ' ') });
        }

        return smartphoneData; // Return the array containing smartphone data
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        // Quit the WebDriver session
        await driver.quit();
    }
}

// handle the returned promise
test_case().then((data) => {
    saveFile(data); 
}).catch((error) => {
    console.error("Error occurred:", error);
});

function saveFile(smartphoneData) {
    fs.writeFile('ebay_smartphone_data.json', JSON.stringify(smartphoneData, null, 2), (err) => {
        if (err) {
            console.error('Error occurred while saving data:', err);
        } else {
            console.log('Smartphone data saved to ebay_smartphone_data.json');
        }
    });
}
