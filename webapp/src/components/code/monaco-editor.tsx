import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

import styles from "./monaco-editor.css";
// import { MarkBackgroundColorType, MarkData, MarkRange, MarkStyle, Theme, useAppConfig } from '@/store';
import { IExportRefFunction, IHintData, IProps, IRangeType } from '@/types/monaco-editor';
import { Theme } from '@/constant';
import { useTheme } from 'next-themes';

export type IEditorIns = monaco.editor.IStandaloneCodeEditor;
export type IEditorOptions = monaco.editor.IStandaloneEditorConstructionOptions;
export type IEditorContentChangeEvent = monaco.editor.IModelContentChangedEvent;


const editorDefaultOptions: IEditorOptions = {
  selectOnLineNumbers: true,
  lineNumbersMinChars: 1,
  wordWrap: 'on',
  automaticLayout: true, // 自动布局
  minimap: {
    enabled: false, // 设置为true以显示缩略图
  },
}

const appendMonacoValue = (editor: any, text: any, range: IRangeType = 'end') => {
  if (!editor) {
    return;
  }
  const model = editor?.getModel && editor.getModel(editor);
  // 创建编辑操作，将当前文档内容替换为新内容
  let newRange: IRangeType = range;
  if (range === 'reset') {
    editor.setValue(text)
    return
  }
  switch (range) {
    case 'cover':
      newRange = model.getFullModelRange();
      break;
    case 'front':
      newRange = new monaco.Range(1, 1, 1, 1);
      break;
    case 'end':
      const lastLine = editor.getModel().getLineCount();
      const lastLineLength = editor.getModel().getLineMaxColumn(lastLine);
      newRange = new monaco.Range(lastLine, lastLineLength, lastLine, lastLineLength);
      text = `${text}`;
      break;
    default:
      break;
  }
  const op = {
    range: newRange,
    text,
  };
  // decorations?: IModelDeltaDecoration[]: 一个数组类型的参数，用于指定插入的文本的装饰。可以用来设置文本的样式、颜色、背景色等。如果不需要设置装饰，可以忽略此参数。
  const decorations = [{}]; // 解决新增的文本默认背景色为灰色
  editor.executeEdits('setValue', [op], decorations);
};


function MonacoEditor(props: IProps, ref: ForwardedRef<IExportRefFunction>) {
  const { id, className, fontSize, lineNumbers, language = 'plaintext', options, isActive, marks, defaultValue, appendValue, didMount, selectedWord, onSave, onExecute, } = props;
  const editorRef = useRef<IEditorIns>();
  const { setTheme, theme } = useTheme()
  // const config = useAppConfig();
  // const [decorationMap, setDecorationMap] = useState<Record<string, string>>({});
  // const [decorationIdMarkMap, setDecorationIdMarkMap] = useState<Record<string, MarkData>>({});

  useEffect(() => {
    // -----------创建-----------
    const editorIns = monaco.editor.create(document.getElementById(`monaco-editor-${id}`)!, {
      ...editorDefaultOptions,
      ...options,
      value: defaultValue || '',
      language: language,
      fontSize: fontSize,
      lineNumbers: lineNumbers,
      // quickSuggestions: false,
      // selectionHighlight: false, // 这里设置禁用选中自动高亮同一单词
      // occurrencesHighlight: false, // 这里设置禁用自动高亮同一单词
      // unicodeHighlighting: false,
      // copyWithSyntaxHighlighting: false,
      // unicodeHighlight: {
      //   nonBasicASCII: false,
      //   ambiguousCharacters: false,
      // }
    });
    editorRef.current = editorIns;
    didMount && didMount(editorIns);

    // -----------主题-----------
    monaco.editor.defineTheme(Theme.Light, {
      base: 'vs',
      inherit: true,
      rules: [
        // { background: '#15161a' }
      ] as any,
      colors: {
        // 'editor.foreground': '#000000',
        // 'editor.background': '#fff', //背景色
      },
    });
    monaco.editor.defineTheme(Theme.Dark, {
      base: 'vs-dark',
      inherit: true,
      rules: [
        // { background: '#15161a' }
      ] as any,
      colors: {
        // 相关颜色属性配置
        'editor.foreground': '#f9f9f9',
        // 'editor.background': '#0A0B0C', //背景色
      },
    });

    // -----------事件-----------
    editorIns.onMouseDown(e => {
      if (e.event.detail === 2) {
        // 检查是否是双击事件
        const value = getCurrentSelectContent();
        selectedWord?.(value, e.event.posx, e.event.posy);
      }
    })

    // editorIns.onDidChangeCursorSelection(editorDefaultOptions => {
    // 选择事件
    // console.log(editorDefaultOptions)
    //   // 获取当前光标选择的文本
    //   const value = getCurrentSelectContent();
    //   // 判断选择的文本是否为一个单词
    //   const wordRegex = /\b[a-zA-Z'-]+\b/;
    //   if (wordRegex.test(value)) {
    //     console.log(value)
    //   }
    // });

    createAction(editorIns);
    return () => {
      // 销毁
      if (props.needDestroy) editorRef.current && editorRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (isActive && editorRef.current) {
      // 自定义快捷键
      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        const value = editorRef.current?.getValue();
        onSave?.(value || '');
      });

      editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, (event: Event) => {
        const value = getCurrentSelectContent();
        onExecute?.(value);
      });
    }
  }, [editorRef.current, isActive]);

  // 监听主题色变化切换编辑器主题色
  useEffect(() => {
    if (options?.theme) {
      monaco.editor.setTheme(options.theme);
    } else {
      const isDark = theme === Theme.Dark ? true : theme === Theme.Light ? false : window.matchMedia('(prefers-color-scheme: dark)').matches
      monaco.editor.setTheme(isDark ? Theme.Dark : Theme.Light);
    }
  }, [theme]);

  // useEffect(() => {
  //   const _ref = editorRef.current?.onDidChangeModelContent((e) => {
  //     const curVal = editorRef.current?.getValue();
  //     props.onChange(curVal || '', e);
  //     const allDecorations = editorRef.current?.getModel()?.getAllDecorations() || [];
  //     const newMarks = allDecorations
  //       .filter(decoration => decoration.options.zIndex == 12)
  //       .filter(decoration => {
  //         const range = decoration.range;
  //         return !(range.endColumn === range.startColumn && range.endLineNumber === range.startLineNumber)
  //       })
  //       .map(decoration => {
  //         const newRange = decoration.range;
  //         let text = undefined;
  //         let style = {} as MarkStyle;
  //         if (decoration.options.hoverMessage) {
  //           text = (decoration.options.hoverMessage as monaco.IMarkdownString).value;
  //         }
  //         if (decoration.options.inlineClassName) {
  //           const inlineClassName = decoration.options.inlineClassName;
  //           const foundEnum = Object.entries(MarkBackgroundColorType).find(([k, v]) => inlineClassName.includes(v))?.[1];
  //           style.backgroundColor = foundEnum || MarkBackgroundColorType.Red;
  //         }
  //         const newMark: MarkData = {
  //           range: {
  //             startLineNumber: newRange.startLineNumber,
  //             startColumn: newRange.startColumn,
  //             endLineNumber: newRange.endLineNumber,
  //             endColumn: newRange.endColumn,
  //           } as MarkRange,
  //           text: text,
  //           style: style
  //         };
  //         return newMark;
  //       });
  //     const deduplicateMarkMap = newMarks.reduce((result, current) => {
  //       const rangeString = rangeToString(current.range);
  //       if (!result[rangeString]) {
  //         result[rangeString] = current;
  //       }
  //       return result;
  //     }, {} as Record<string, MarkData>);
  //     const deduplicateMarks = Object.values(deduplicateMarkMap);
  //     props.onUpdateMark(deduplicateMarks);
  //     console.log("newMarks", deduplicateMarks);
  //   });
  //   return () => _ref && _ref.dispose();
  // }, [editorRef.current]);

  // getCurrentSelection,
  // readHighlight,

  useImperativeHandle(ref, () => ({
    handleRegisterTigger,
    getCurrentSelectContent,
    getAllContent,
    setValue,
    getLineMaxColumn,
  }));

  useEffect(() => {
    if (appendValue) {
      appendMonacoValue(editorRef.current, appendValue?.text, appendValue?.range);
    }
  }, [appendValue])

  // function rangeToString(range: MarkRange) {
  //   return `mark:${range.startLineNumber}:${range.startColumn}:${range.endLineNumber}:${range.endColumn}`;
  // }

  // useEffect(() => {
  //   console.log("marks", marks, decorationMap, decorationIdMarkMap)
  //   const decorationKeySet: Set<string> = new Set()
  //   marks?.forEach(mark => {
  //     const range = mark.range
  //     const style = mark.style
  //     const key = rangeToString(range);
  //     decorationKeySet.add(key);

  //     const decoration: monaco.editor.IModelDeltaDecoration = {
  //       range: new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn),
  //       options: {
  //         zIndex: 12,
  //         inlineClassName: styles[style.backgroundColor],
  //         // 滚动条 概览标尺颜色
  //         // overviewRuler: {
  //         //   color: 'blue',
  //         //   position: monaco.editor.OverviewRulerLane.Right
  //         // }
  //       }
  //     }
  //     if (mark.text) {
  //       decoration.options.hoverMessage = { value: mark.text }
  //     }

  //     // 新增 或跟新
  //     let oldDecorations: string[] = []
  //     if (decorationMap.hasOwnProperty(key)) {
  //       oldDecorations = [decorationMap[key]]
  //     }
  //     const decorations = editorRef.current?.deltaDecorations(oldDecorations, [decoration]);
  //     if (decorations) {
  //       setDecorationMap(prev => ({
  //         ...prev,
  //         [key]: decorations[0]
  //       }));
  //       setDecorationIdMarkMap(prev => ({
  //         ...prev,
  //         [decorations[0]]: mark
  //       }));
  //     }
  //   })

  //   const removeDecorations = Object.entries(decorationMap).filter(([k, v]) => !decorationKeySet.has(k));
  //   const decorationKeys = removeDecorations.map(([k, v]) => k)
  //   const decorationIds = removeDecorations.map(([k, v]) => v)
  //   editorRef.current?.deltaDecorations(decorationIds, []);
  //   decorationKeys.forEach(key => {
  //     delete decorationMap[key];
  //   });
  //   decorationIds.forEach(key => {
  //     delete decorationIdMarkMap[key];
  //   });
  // }, [marks])


  const setValue = (text: any, range?: IRangeType) => {
    appendMonacoValue(editorRef.current, text, range);
  };

  /**
   * 获取当前选中的内容
   * @returns
   */
  const getCurrentSelectContent = () => {
    let selection = editorRef.current?.getSelection();
    if (!selection || selection.isEmpty()) {
      return '';
    } else {
      var selectedText = editorRef.current?.getModel()?.getValueInRange(selection);
      return selectedText || '';
    }
  };

  // const getCurrentSelection = () => {
  //   const selection = editorRef.current?.getSelection()
  //   if (selection) {
  //     console.log("selection", selection)
  //     return {
  //       startLineNumber: selection.startLineNumber,
  //       startColumn: selection.startColumn,
  //       endLineNumber: selection.endLineNumber,
  //       endColumn: selection.endColumn,
  //     } as MarkRange;
  //   }
  //   return null;
  // };

  const getLineMaxColumn = (line: number) => {
    let maxColumn = editorRef.current?.getModel()?.getLineMaxColumn(line);
    if (maxColumn) {
      // 1开始的 
      maxColumn = maxColumn - 1
    }
    return maxColumn;
  };

  // const readHighlight = (range?: MarkRange, oldDecorations?: string[]) => {
  //   if (range === undefined) {
  //     return editorRef.current?.deltaDecorations(oldDecorations ?? [], []);
  //   }
  //   const decoration: monaco.editor.IModelDeltaDecoration = {
  //     range: new monaco.Range(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn),
  //     options: {
  //       zIndex: 20,
  //       inlineClassName: styles["read-highlight"],
  //     }
  //   }
  //   return editorRef.current?.deltaDecorations(oldDecorations ?? [], [decoration]);
  // }

  /** 获取文本所有内容 */
  const getAllContent = () => {
    const model = editorRef.current?.getModel();
    const value = model?.getValue();
    return value || '';
  };


  // setInterval(() => {
  //   decorations = editorRef.current?.deltaDecorations(decorations, []) ?? [];
  //   decorations = editorRef.current?.deltaDecorations([], [
  //     {
  //       range: new monaco.Range(1,1,1, Math.floor(Math.random() * 30) + 1),
  //       options: { 
  //           inlineClassName: styles["customDecoration"],
  //           hoverMessage: { value: '这是我自定义的悬停提示' },
  //       overviewRuler: {
  //         color: 'blue',
  //         position: monaco.editor.OverviewRulerLane.Right
  //       }
  //       },
  //   },
  //   ]) ?? [];
  //   console.log("decorations", decorations)
  // }, 5000);


  // monaco.languages.registerHoverProvider(language, { // 光标移入提示功能
  //   provideHover: function (model, position, token) {
  //     console.log("provideHover")
  //     const lineword = model.getLineContent(position.lineNumber) // 获取光标悬停所在行的所有内容
  //     const word = model.getWordAtPosition(position)?.word // 获取光标悬停的单词
  //       if (word === "name") {
  //         return {
  //           contents: [
  //             { value: `${word}` },
  //             {
  //               value: [
  //                 "这是name的一些介绍",
  //                 "这是name的一些介绍",
  //               ].join("\n\n"),
  //             },
  //           ],
  //         };
  //       } else if(undefined !== word){
  //         return {
  //           contents: [
  //             { value: `${word}` },
  //             {
  //               value: [
  //                 lineword
  //               ].join("\n\n"),
  //             },
  //           ],
  //         }
  //       }
  //   },
  // });



  const handleRegisterTigger = (hintData: IHintData) => {
    // 获取 SQL 语法提示
    // const getSQLSuggest = () => {
    // return SQLKeys.map((key: any) => ({
    //   label: key,
    //   kind: monaco.languages.CompletionItemKind.Keyword,
    //   insertText: key,
    //   detail: '<Keywords>',
    // }));
    // };

    // 获取一级数据
    // const getFirstSuggest = () => {
    //   return Object.keys(hintData).map((key) => ({
    //     label: key,
    //     kind: monaco.languages.CompletionItemKind.Method,
    //     insertText: key,
    //     detail: '<Database>',
    //   }));
    // };

    // 获取二级数据
    // const getSecondSuggest = (keys: string) => {
    //   const secondNames = hintData[keys];
    //   if (!secondNames) {
    //     return [];
    //   }
    //   return (secondNames || []).map((name: any) => ({
    //     label: name,
    //     kind: monaco.languages.CompletionItemKind.Snippet,
    //     insertText: name,
    //     detail: '<Table>',
    //   }));
    // };
    // const editorHintExamples = monaco.languages.registerCompletionItemProvider('sql', {
    //   triggerCharacters: [' ',// ...SQLKeys
    //   ],
    //   provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
    //     let suggestions: any = [];
    //     const { lineNumber, column } = position;
    //     const textBeforePointer = model.getValueInRange({
    //       startLineNumber: lineNumber,
    //       startColumn: 0,
    //       endLineNumber: lineNumber,
    //       endColumn: column,
    //     });
    //     const tokens = textBeforePointer.trim().split(/\s+/);
    //     const lastToken = tokens[tokens.length - 1]; // 获取最后一段非空字符串

    //     if (lastToken.endsWith('.')) {
    //       const tokenNoDot = lastToken.slice(0, lastToken.length - 1);
    //       // suggestions = [...getSecondSuggest(tokenNoDot)];
    //       suggestions = [];
    //     } else if (lastToken === '.') {
    //       suggestions = [];
    //     } else {
    //       // suggestions = [...getFirstSuggest(),]; //...getSQLSuggest()
    //     }
    //     return {
    //       suggestions,
    //     };
    //   },
    // });

    const editorHintExamples = monaco.languages.registerCompletionItemProvider('sql', {
      triggerCharacters: [],
      provideCompletionItems: (model: monaco.editor.ITextModel, position: monaco.Position) => {
        let suggestions: any = [];
        return {
          suggestions,
        };
      },
    });
    return editorHintExamples;
  };

  const createAction = (editor: IEditorIns) => {
    // 用于控制切换该菜单键的显示
    const shouldShowSqlRunnerAction = editor.createContextKey('shouldShowSqlRunnerAction', true);

    if (!props.addAction || !props.addAction.length) {
      return;
    }

    props.addAction.forEach((action) => {
      const { id, label, action: runFn } = action;
      editor.addAction({
        id,
        label,
        // 控制该菜单键显示
        precondition: 'shouldShowSqlRunnerAction',
        // 该菜单键位置
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        // 点击该菜单键后运行
        run: (event: monaco.editor.ICodeEditor) => {
          const selectedText = editor.getModel()?.getValueInRange(editor.getSelection()!) || '';
          runFn(selectedText);
        },
      });
    });
  };

  return <div ref={ref as any} id={`monaco-editor-${id}`} className="editor-container" />;
}

export default forwardRef(MonacoEditor);
