import logger from "@config/Logger";
import { injectable } from "tsyringe";
import fetch, { Headers } from "node-fetch";

@injectable()
export class AIAdapter {
  private huggingFaceToken: string;
  private whisperApiUrl =
    "https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3";
  private summarizationApiUrl =
    "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn";

  constructor() {
    this.huggingFaceToken = process.env.HUGGINGFACE_API_TOKEN || "";
    if (!this.huggingFaceToken) {
      throw new Error(
        "HUGGINGFACE_API_TOKEN is not set in environment variables."
      );
    }
  }

  async transcribeAudioFromUrl(audioUrl: string): Promise<string> {
    logger.info(
      `Attempting to transcribe audio via Hugging Face from URL: ${audioUrl}`
    );
    try {
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch audio file from ${audioUrl}: ${response.statusText}`
        );
      }
      const audioArrayBuffer = await response.arrayBuffer();
      const audioBuffer = Buffer.from(audioArrayBuffer);
      const contentType = "audio/mpeg";
      const headers = new Headers({
        Authorization: `Bearer ${this.huggingFaceToken}`,
        "Content-Type": contentType,
      });
      logger.info(`Sending audio (${contentType}) to Hugging Face API...`);
      const hfResponse = await fetch(this.whisperApiUrl, {
        method: "POST",
        headers: headers,
        body: audioBuffer,
      });

      if (!hfResponse.ok) {
        const errorBody = await hfResponse.text();
        if (
          hfResponse.status === 503 &&
          errorBody.includes("currently loading")
        ) {
          logger.info("Hugging Face model is loading, please wait and retry.");
          throw new Error("Model is loading, please try again in a moment.");
        }
        throw new Error(
          `Hugging Face API Error (${hfResponse.status} - ${hfResponse.statusText}): ${errorBody}`
        );
      }

      const result = (await hfResponse.json()) as {
        text?: string;
        error?: string;
      };

      if (result.error) {
        throw new Error(`Hugging Face Transcription Error: ${result.error}`);
      }
      if (typeof result.text !== "string") {
        throw new Error("Hugging Face response did not contain valid text.");
      }

      logger.info("Hugging Face Transcription successful.");
      return result.text.trim();
    } catch (error) {
      const err = error as Error;
      logger.error(`Error during Hugging Face audio transcription: ${error}`);
      throw new Error(
        `Failed to transcribe audio via Hugging Face: ${err.message}`
      );
    }
  }

  async summarizeText(text: string): Promise<string> {
    logger.info("Attempting summarization via Hugging Face...");
    try {
      const headers = new Headers({
        Authorization: `Bearer ${this.huggingFaceToken}`,
        "Content-Type": "application/json",
      });
      const prompt = `Summarize the following clinical interaction concisely:\n\nInteraction:\n${text}\n\nSummary:`;
      const hfResponse = await fetch(this.summarizationApiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          inputs: prompt,
        }),
      });
      if (!hfResponse.ok) {
        const errorBody = await hfResponse.text();
        if (
          hfResponse.status === 503 &&
          errorBody.includes("currently loading")
        ) {
          logger.info(
            "Hugging Face summarization model is loading, returning raw text."
          );
          return text;
        }
        throw new Error(
          `Hugging Face Summarization API Error (${hfResponse.status} - ${hfResponse.statusText}): ${errorBody}`
        );
      }
      const resultJson = await hfResponse.json();
      const summary = (resultJson as [{ summary_text?: string }])?.[0]
        ?.summary_text;
      if (!summary || typeof summary !== "string" || summary.trim() === "") {
        logger.info(
          "Hugging Face did not return a valid summary text. Returning raw text."
        );
        throw new Error("Invalid or empty summary_text in response.");
      }

      logger.info("Hugging Face Summarization successful.");
      return summary.trim();
    } catch (error) {
      const err = error as Error;
      logger.error(
        `Error during Hugging Face text summarization: ${err.message}`
      );
      return text;
    }
  }
}
