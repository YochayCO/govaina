// TODO: re-implement with openai sdk
// export const streamToText = async (streamTextResult: StreamTextResult<ToolSet, never>): Promise<string> => {
//       let evaluationText = ''
//       // Build the evaluation text from the stream
//       for await (const textPart of streamTextResult.textStream) {
//         evaluationText += textPart;
//       }
//       return evaluationText;
// }
