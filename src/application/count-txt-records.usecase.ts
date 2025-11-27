export class CountTxtRecordsUseCase {
  execute(content: string): number {
    // Count lines (records) in the txt content
    return content.length;
  }
}
