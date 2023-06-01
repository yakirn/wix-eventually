const { GPT3 } = require("openai-api");
const fs = require("fs");

const openai = new GPT3(process.env.OPENAI_API_KEY);

const changes = process.argv[2];

(async () => {
  const docsContent = fs.readFileSync("README.md", 'utf8');
  const response = await openai.complete({
    prompt: `Perform the following actions:
    1. Understand the documentation delimited by the <docs></docs> tags.
    2. Evaluate each change in the array delimted by the <changes></changes> tags.
    3. For each change from step 2, if the change affects the <docs> content,
      update the <docs> content to reflect the change.
      If the change does not affect the <docs> content,
      don't update the <docs> content for that change.
    4. Output a code block that contains the updated <docs> content.
      Make sure to escape backticks so all the content is rendered in a single code block.
    
    <docs>
    ${docsContent}
    </docs>
    
    <changes>
    ${changes}
    </changes>`,
    max_tokens: 1000,
  });

  fs.writeFileSync("README.md", response.choices[0].text.trim());
})();
