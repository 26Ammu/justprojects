// app.js
const express = require('express');
const bodyParser = require('body-parser');
const nlp = require('compromise'); // NLP library for symptom extraction
const app = express();
const port = 5173;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Sample symptom-to-condition dictionary (expand as needed)
const symptomConditions = {
  fever: ['flu', 'cold', 'malaria'],
  cough: ['flu', 'cold', 'COVID-19'],
  headache: ['migraine', 'flu', 'cold'],
  fatigue: ['flu', 'COVID-19', 'depression'],
  nausea: ['migraine', 'stomach flu', 'food poisoning'],
};

// Function to process free text input using NLP
function processInput(userInput) {
  const doc = nlp(userInput); // Process the user input
  const symptoms = [];

  // Extract nouns (likely to be symptoms)
  doc.nouns().forEach(noun => {
    const symptom = noun.text.toLowerCase();
    if (symptomConditions[symptom]) {
      symptoms.push(symptom); // If the noun matches a symptom, add it
    }
  });

  return symptoms;
}

// Function to check symptoms and return possible conditions
function checkSymptoms(symptoms) {
  let possibleConditions = [];
  symptoms.forEach(symptom => {
    if (symptomConditions[symptom]) {
      possibleConditions = [...new Set([...possibleConditions, ...symptomConditions[symptom]])];
    }
  });
  return possibleConditions.length ? possibleConditions : ["Sorry, I couldn't identify any conditions based on your symptoms."];
}

// API endpoint to check symptoms
app.post('/check-symptoms', (req, res) => {
  const userInput = req.body.input;

  // Log received input for debugging
  console.log("Received input:", userInput);

  if (!userInput || userInput.trim().length === 0) {
    return res.status(400).json({ message: 'Please provide a symptom description.' });
  }

  // Process the user input using the NLP function
  const symptoms = processInput(userInput);
  
  // If no symptoms detected
  if (symptoms.length === 0) {
    return res.status(200).json({ possibleConditions: ["No symptoms detected. Please try again."] });
  }

  const conditions = checkSymptoms(symptoms);
  console.log("Identified conditions:", conditions); // Log the identified conditions
  
  // Send back a valid JSON response with possible conditions
  res.status(200).json({ possibleConditions: conditions });
});

// Serve static files for frontend (public folder)
app.use(express.static('public'));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
