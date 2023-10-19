let startMarker = '';
let endMarker = '';
const inputTextPickcode = document.getElementById('input-text-pickcode');
const displayAreaPickcode = document.getElementById('display-area-pickcode');
// Get the select element
const selectElement = document.getElementById('programmingLanguages');
const radioContainer = document.getElementById('options');

const pyValues = [
    { value: "python-comment", name: "python-comment" },
    { value: "python-string", name: "python-string" },
    { value: "python-number", name: "python-number" },
    { value: "python-property", name: "python-property" },
    { value: "python-variable", name: "python-variable" },
    // Add more options as needed
  ];

const javaValues = [
  { value: "java-comment", name: "java-comment" },
  { value: "java-string", name: "java-string" },
  { value: "java-number", name: "java-number" },
  { value: "java-keyword", name: "java-keyword" },
  { value: "java-definition", name: "java-definition" },
  // Add more options as needed
  ];

const htmlValues = [
  { value: "html-attribute", name: "html-attribute" },
  { value: "html-value", name: "html-value" },
  { value: "html-tag", name: "html-tag" },
  { value: "html-comment", name: "html-comment" },
  // Add more options as needed
  ];

const cssValues = [
  { value: "css-number", name: "css-number" },
  { value: "css-string", name: "css-string" },
  { value: "css-property", name: "css-property" },
  { value: "css-pseudoclass", name: "css-pseudoclass" },
  { value: "css-comment", name: "css-comment" },
    // Add more options as needed
  ];

// Function to update the mode and markers
function updateMode() {
    const mode = getSelectedMode();
    if (mode !== 'none') {
        startMarker = "`" + mode + "`";
        endMarker = '`/' + mode + "`";
    } else {
        startMarker = '';
        endMarker = '';
    }

    // Display the mode to the console
    console.log('Mode:', mode);

    // Update the output elements
    updateOutput();
}

// Function to get the selected mode from the mode selector
function getSelectedMode() {
    const modeRadios = document.getElementsByName('mode');
    for (let i = 0; i < modeRadios.length; i++) {
        if (modeRadios[i].checked) {
            return modeRadios[i].value;
        }
    }
    return 'none'; // Default to 'none' mode if none selected
}

// Function to convert an HTML element to an HTML string
function getElementHTMLString(element) {
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(element.cloneNode(true));
    return tempDiv.innerHTML;
}

// Function to update the output elements with formatted text
function updateOutput() {

    // Update the output elements with the formatted text
    const outputLeft = document.querySelector('.output-left');
    const outputRight = document.querySelector('.output-right');
    // Clear previous output
    outputLeft.innerHTML = '';
    const filenameText = document.getElementById("input-filename").value;
    if (filenameText.length > 0) {
        // Add the filename to outputLeft.innerHTML
        outputLeft.innerHTML +="<div class='snippet-row'><span class='filename'>"+filenameText+"</span></div><div class='snippet-row'>&nbsp;</div>";
    } 

    const inputText = document.getElementById('input-text').value;

    // Split input text into lines
    const lines = inputText.split('\n');

    // Regular expression to match start and end markers in each line
    const markerRegex = /(`[^`]+`)/g;


    // Loop through each line of text
    lines.forEach((line, index) => {

      line = line.replace('"', '\"');
      line = replaceLeadingSpacesWithNbsp(line);
      line = line.replace(/</g, '&lt;');
      line = line.replace(/>/g, '&gt;');

      // Create elements for the snippet row
      const snippetRow = document.createElement('div');
      snippetRow.classList.add('snippet-row');

      const lineNumberDiv = document.createElement('div');
      lineNumberDiv.classList.add('line-number');
      lineNumberDiv.textContent = index + 1;

      const codeDiv = document.createElement('div');
      codeDiv.classList.add('code');

      // Apply formatting based on mode markers in the line
      let formattedLine = line.replace(markerRegex, (match) => {
          if (match.startsWith('`') && match.endsWith('`')) {
              const mode = match.slice(1, -1); // Remove backticks
              // End marker, replace with closing </span> tag
              if (mode == "/mark") { return '</mark>'; }
              else if (mode == "/strike") { return "</del>"; }
              else if (mode.startsWith("/")) { return '</span>'; }
              else if (mode === 'mark') { return '<mark>'; }
              else if (mode === 'strike') { return '<del>'; } 
              else { return `<span class="${mode}">`; }
          }
          return match; // If not a valid marker, retain the original match
      });

    codeDiv.innerHTML = formattedLine;

    // Append elements to snippet row
    snippetRow.appendChild(lineNumberDiv);
    snippetRow.appendChild(codeDiv);

    // Append snippet row to outputLeft
    outputLeft.appendChild(snippetRow);
    });

    // Update outputRight with the HTML code as a string
    outputRight.textContent = '"' + getElementHTMLString(outputLeft).replace(/(?<!\\)"/g, "'").slice(25,-6) + '"';
}


// Function to apply markers to the selected text in the input
function applyMarkersToSelection() {
  const inputText = document.getElementById('input-text');
  const selection = window.getSelection();
  const selectedText = selection.toString();

  // Check if selectedText is not empty
  if (selectedText.length > 0) {
      const start = inputText.selectionStart;
      const end = inputText.selectionEnd;

      // Modify the input text to include the markers around the selected text
      const modifiedText =
          inputText.value.substring(0, start) +
          startMarker +
          selectedText +
          endMarker +
          inputText.value.substring(end);

      // Update the input text with the modified text
      inputText.value = modifiedText;
      updateOutput();
  }
}


// Register event listener for input-text to call updateOutput on input/change
document.getElementById('input-text').addEventListener('input', updateOutput);

// Register event listener for mode selector to call updateMode on change
const modeSelector = document.getElementsByName('mode');
modeSelector.forEach((radio) => {
    radio.addEventListener('change', updateMode);
});



// Function to remove all start and end markers from the input text
function clearMode() {
    const inputText = document.getElementById('input-text');
    const startMarkerRegex = new RegExp(startMarker, 'g');
    const endMarkerRegex = new RegExp(endMarker, 'g');
    const clearedText = inputText.value.replace(startMarkerRegex, '').replace(endMarkerRegex, '');
    inputText.value = clearedText;
    updateOutput();
}

function clearHtml() {
    const inputText = document.getElementById('input-text');
    let clearedText = inputText.value;

    // Remove leading and trailing double quotes if present
    if (clearedText.startsWith('"') && clearedText.endsWith('"')) {
        clearedText = clearedText.substring(1, clearedText.length - 1);
    }

    // Replace <div class='code-snippet'> with a new line
    clearedText = clearedText.replace(/<div class='snippet-row'>/g, '\n');

    // Remove <div class='line-number'>...</div> tags
    clearedText = clearedText.replace(/<div class='line-number'>[\d]+<\/div>/g, '');

    // Remove HTML <div class='...'> <span class='...'> <mark> <del> tags
    clearedText = clearedText.replace(/<\/?(div|span|mark|del)[^>]*>/g, '');

    // Remove </div> </span> </mark> </del> end tags
    clearedText = clearedText.replace(/<\/(div|span|mark|del)>/g, '');

    // Convert &nbsp; into spaces
    clearedText = clearedText.replace(/&nbsp;/g, ' ');

    // Remove leading newline character if present
    if (clearedText.startsWith('\n')) {
        clearedText = clearedText.substring(1);
    }

    inputText.value = clearedText;
    updateOutput();
}


function replaceLeadingSpacesWithNbsp(line) {
  let result = '';
  for (let i = 0; i < line.length; i++) {
    if (line[i] === ' ') {
      result += '&nbsp;';
    } else {
      result += line.slice(i);
      break;
    }
  }
  return result;
}

function copyOutputToClipboard() {
    const outputRight = document.querySelector('.output-right');
    if (outputRight) {
        const content = outputRight.textContent;
        navigator.clipboard.writeText(content)
    }
}



function copyPickCodeOutputToClipboard() {
    const outputRight = document.querySelector('#display-area-pickcode');
    if (outputRight) {
        const content = outputRight.textContent;
        navigator.clipboard.writeText(content)
    }
}
function changeLanguageStyles() {
  // Get the selected option's value

  // Call the function and pass the selected option
  radioContainer.innerHTML = '';


  // Determine which language was selected
  let selectedLanguageValues = [];

  switch (selectElement.value) {
    case 'python':
      selectedLanguageValues = pyValues;
      break;
    case 'java':
      selectedLanguageValues = javaValues;
      break;
    case 'html':
      selectedLanguageValues = htmlValues;
      break;
    case 'css':
        selectedLanguageValues = cssValues;
    // Add more cases for other languages
  }
  
  // Create and append radio buttons based on the selected language
  selectedLanguageValues.forEach(function (option) {
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'mode';
    radioInput.value = option.value;

    const label = document.createElement('label');
    label.appendChild(radioInput);
    label.appendChild(document.createTextNode(option.name));

    radioContainer.appendChild(label);
    radioInput.addEventListener('change', updateMode);
  });
}






  

document.addEventListener('DOMContentLoaded', function () {


  if (selectElement.value === '') {
    selectElement.value = selectElement.options[0].value; // Set it to the first option
}
  // Add an event listener to the select element
  selectElement.addEventListener('change',changeLanguageStyles);

  inputTextPickcode.addEventListener('input', function () {
      const inputLines = inputTextPickcode.value.split('\n');
      const formattedLines = inputLines.map(line => `"${line.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
      const formattedOutput = `[${formattedLines.join(', ')}]`;

      displayAreaPickcode.textContent = formattedOutput;
  });
  changeLanguageStyles();
  // Register event listener for input-text to call applyMarkersToSelection on selection change
  document.getElementById('input-text').addEventListener('mouseup', applyMarkersToSelection);
});