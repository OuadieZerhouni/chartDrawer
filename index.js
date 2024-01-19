const puppeteer = require('puppeteer');

async function generateChart(fx, range = { start: -20, end: 20, step: 0.01 }) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(`
        <html>
            <body>
                <div id="chart" style="width: 600px; height: 400px;"></div>
                <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
                <script>
                    const trace1 = {
                        x: [],
                        y: [],
                        type: 'scatter'
                    };

                    for (let x = ${range.start}; x <= ${range.end}; x += ${range.step}) {
                        trace1.x.push(x);
                        trace1.y.push(${fx});
                    }

                    Plotly.newPlot('chart', [trace1]);
                </script>
            </body>
        </html>
    `);

    await page.waitForTimeout(1000); // Wait for chart to render

    const chart = await page.$('#chart');
    const chartImage = await chart.screenshot({ path: 'chart.png' });

    await browser.close();

    return chartImage;
}

// Example usage: x^4 / x^3
generateChart('Math.pow(x, 4) / Math.pow(x, 3)', { start: -20, end: 20, step: 0.01 });
