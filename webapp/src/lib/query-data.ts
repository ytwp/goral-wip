import { DateResponse } from "@/types/execute-sql";

export function getFieldValues(fieldName: string, dataObject: DateResponse): string[] {
  if ((!dataObject.columns) || (!dataObject.data)) {
    return [];
  }
  // Find the index of the column with the specified field name
  const columnIndex = dataObject.columns.findIndex(column => column.name === fieldName);
  // If the column is not found, return null
  if (columnIndex === -1) {
    return [];
  }
  // Extract the values from the data array at the found column index
  const values = dataObject.data.map(row => row[columnIndex]);
  return values;
}
