import { MarkRange } from '../store';


export type IAppendValue = {
  text: any;
  range?: IRangeType;
};
interface IProps {
  id: string | number;
  isActive?: boolean;
  language?: string;
  className?: string;
  fontSize: number;
  lineNumbers: NoteLineNumbersType;
  options?: IEditorOptions;
  needDestroy?: boolean;
  addAction?: Array<{ id: string; label: string; action: (selectedText: string) => void }>;
  appendValue?: IAppendValue;
  defaultValue?: string;
  marks: MarkData[];

  onUpdateMark: (newMarks: MarkData[]) => void;
  onChange: (v: string, e?: IEditorContentChangeEvent) => void;
  didMount?: (editor: IEditorIns) => any;
  onSave?: (value: string) => void; // 快捷键保存的回调
  onExecute?: (value: string) => void; // 快捷键执行的回调
  selectedWord?: (value: string, posx: number, posy: number) => void;
}
export interface IExportRefFunction {
  getCurrentSelectContent: () => string;
  getAllContent: () => string;
  setValue: (text: any, range?: IRangeType) => void;
  handleRegisterTigger: (hintData: IHintData) => void;
  // getCurrentSelection: () => MarkRange | null;
  getLineMaxColumn: (line: number) => number | undefined;
  // readHighlight: (range?: MarkRange, oldDecorations?: string[]) => string[] | undefined;
}
export interface IHintData {
  [keys: string]: string[];
}
// text 需要添加的文本
// range 添加到的位置
// 'end' 末尾
// 'front' 开头
// 'cover' 覆盖掉原有的文字
// 自定义位置数组 new monaco.Range []
export type IRangeType = 'end' | 'front' | 'cover' | 'reset' | any;