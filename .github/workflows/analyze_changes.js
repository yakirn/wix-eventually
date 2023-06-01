const { GPT3 } = require("openai-api");
const fs = require("fs");

const openai = new GPT3(process.env.OPENAI_API_KEY);

const files = process.argv[2].split(",");

module.exports = (async () => {
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const response = await openai.complete({
      prompt: `Your job is to analyse changes in code.
      format the output as a json array, each object in the array should look like this:
      1. changeType - type of change. for example: "argument_rename", "method_added", "argument_added", "value_change", etc
      2. description - short description. if it's a rename include the previous name, if an argument was added include to which method and class and so on.
      here is the original code file, surrounded in triple quotes:

      """
      ${content}
      """`,
      max_tokens: 500,
    });

    console.log(JSON.stringify(response.choices[0].text.trim()));
  }
})();
