const fs = require('fs');
const csv = require('csv-parser');
const brain = require('brain.js');

// Read the CSV file containing stock data
const data = [];
fs.createReadStream('stock-data.csv')
  .pipe(csv())
  .on('data', row => {
    data.push(row);
  })
  .on('end', () => {
    // Prepare the data for training
    const trainingData = data.map(row => ({
      input: [
        parseFloat(row.open),
        parseFloat(row.high),
        parseFloat(row.low),
        parseFloat(row.close)
      ],
      output: [parseFloat(row.price)]
    }));

    // Create a neural network
    const net = new brain.NeuralNetwork();

    // Train the network
    net.train(trainingData, {
      errorThresh: 0.005,
      iterations: 20000,
      log: true
    });

    // Test the network
    const output = net.run([50, 60, 40, 55]);
    console.log(`Predicted price: ${output}`);
  });
