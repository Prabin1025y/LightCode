import { create } from 'zustand';
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants';
import { Monaco } from '@monaco-editor/react';
import { CodeEditorState, Theme } from '@/types';
import { version } from 'os';

const getInitialState = () => {

    //return some default values if we are in server side
    if (typeof window === "undefined") {
        return {
            language: "javascript",
            fontSize: 16,
            theme: "vs-dark"
        }
    }

    //get values from localstorage if we are in client side
    return {
        language: localStorage.getItem("edotor-language") || "javascript",
        fontSize: parseInt(localStorage.getItem("editor-fontSize") || "16"),
        theme: localStorage.getItem("editor-theme") || "vs-dark",
    }
}

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
    const initialState = getInitialState();

    return {
        ...initialState,
        output: "",
        isRunning: false,
        error: null,
        editor: null,
        executionResult: null,

        //get the code currently present in the editor
        getCode: () => get().editor?.getValue() || "",

        //set the code to editor if it exists in localstorage
        setEditor: (editor: Monaco) => {
            const savedCode = localStorage.getItem(`editor-code-${get().language}`);
            if (savedCode)
                editor.setValue(savedCode);

            set({ editor });
        },

        setTheme: (theme: string) => {
            localStorage.setItem("editor-theme", theme);
            set({ theme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-fontSize", fontSize.toString());
            set({ fontSize });
        },

        setLanguage: (language: string) => {
            const currentCode = get().editor?.getValue();
            if (currentCode) {
                localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }

            localStorage.setItem("editor-language", language);

            set({
                language,
                output: "",
                error: null
            });
        },

        runCode: async () => {
            const { language, getCode } = get();
            const code = getCode();

            if (!code) {
                set({ error: "Your code editor is empty." });
                return;
            }

            set({ isRunning: true, error: null, output: "" });

            try {
                const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
                const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{ content: code }]
                    })
                })

                const data = await response.json();

                console.log(data);

                if (data.message) {
                    set({ error: data.message, executionResult: { code, error: data.message, output: "" } })
                    return;
                }

                //handle error for language that compiles
                if (data.compile && data.compile.code !== 0) {
                    const error = data.compile.stderr || data.compile.output;
                    set({ error, output: "", executionResult: { code, error, output: "" } });
                    return;
                }

                //handle error for language that interprets
                if (data.run && data.run.code !== 0) {
                    const error = data.run.stderr || data.run.output;
                    set({ error, output: "", executionResult: { code, error, output: "" } });
                    return;
                }

                //if program reaches here means there are no error in the code
                const output = data.run.output;
                set({ output: output.trim(), error: null, executionResult: { output: output.trim(), error: null, code } })
            } catch (error) {
                console.log(error);
                set({ error: "Error running the code", executionResult: { code, error: "Error running the code", output: "" } })
            } finally {
                set({ isRunning: false });
            }
        }


    };
})