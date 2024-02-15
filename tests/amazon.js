const { Builder, By, Key } = require("selenium-webdriver");
require("chromedriver");
const fs = require('fs');

async function test_case() {
    let driver = await new Builder().forBrowser("chrome").build(); // new WebDriver 
    try {
        await driver.get("https://www.amazon.com/");

        // Search for phones
        await driver.findElement(By.name("field-keywords")).sendKeys("smartphone", Key.RETURN);

        // Wait for search results to load
        await driver.sleep(3000);

        // Get smartphone names and prices using their classNames
        const smartphoneNames = await driver.findElements(By.css(".a-size-medium.a-color-base.a-text-normal"));
        const smartphonePrices = await driver.findElements(By.css(".a-row.a-size-base.a-color-secondary span.a-color-base"));

        // Create an array to store smartphone data to help me save data in JSON file
        const smartphoneData = [];

        // Loop through smartphone names and prices
        for (let i = 0; i < smartphoneNames.length; i++) {
            const name = await smartphoneNames[i].getText();
            const price = smartphonePrices[i] ? await smartphonePrices[i].getText() : 'Price not available';
            
            // Push the smartphone name and price with now Date into the array
            smartphoneData.push({ name: name, price: price, date: new Date().toISOString().slice(0, 16).replace('T', ' ')});
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
    SaveFile(data); 
}).catch((error) => {
    console.error("Error occurred:", error);
});

function SaveFile(smartphoneData) {
    fs.writeFile('amazon_smartphone_data.json', JSON.stringify(smartphoneData, null, 2), (err) => {
        if (err) {
            console.error('Failed To save the data:', err);
        } else {
            console.log('Smartphone data saved to Amazon_smartphone_data.json');
        }
    });
}
