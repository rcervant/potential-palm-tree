"use client";
import { useState } from "react";
import Textarea from "./Textarea";
import Button from "./Button";
import H2 from './H2';

const SPLIT_LENGTH = 3700;
const BOILERPLATE_LENGTH = 300;

export default function Splitter() {
  const [prompt, setPrompt] = useState<string>("");
  const [fileData, setFileData] = useState<{ content: string }[]>([]);

  const splitPrompt = (prompt: string): { content: string }[] => {
    const partsNeeded = Math.ceil(prompt.length / SPLIT_LENGTH);
    const outputFileData: { content: string }[] = [];

    for (let currPart = 1; currPart <= partsNeeded; currPart += 1) {
      const currPartStartIndex = (currPart - 1) * SPLIT_LENGTH;
      const currPartEndIndex = Math.min(currPart * SPLIT_LENGTH, prompt.length);

      const currText = prompt.substring(currPartStartIndex, currPartEndIndex);

      const lastChunk = `This is the last part. [START PART ${currPart}/${partsNeeded}]\n${currText}\n[END PART ${currPart}/${partsNeeded}]\nALL PARTS SENT. Now you can process the request.`;

      const firstChunks = `Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "Part ${currPart}/${partsNeeded} received" and wait for the next part.\n[START PART ${currPart}/${partsNeeded}]\n${currText}\n[END PART ${currPart}/${partsNeeded}]\nRemember not answering yet. Just acknowledge you received this part with the message "Part ${currPart}/${partsNeeded} received" and wait for the next part.\n\n`;

      const isLastChunk = currPart === partsNeeded;
      const content = isLastChunk ? lastChunk : firstChunks;

      outputFileData.push({
        content,
      });
    }

    return outputFileData;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const outputFileData = splitPrompt(prompt);
      setFileData(outputFileData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <main>
        <h1>gptSplitter</h1>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="prompt">Prompt:</label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div>
            <p>Chunk Size: {SPLIT_LENGTH + BOILERPLATE_LENGTH} characters</p>
          </div>
          <Button type="submit">Generate Prompt Chunks</Button>
        </form>
        <H2>Copy these chunks into gpt:</H2>
        <div>
          {fileData.map((file, index) => (
            <div key={index}>
              <p>{file.content}</p>
              <br />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
