import { create } from 'zustand';
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants';
import { Monaco } from '@monaco-editor/react';
import { CodeEditorState, Theme } from '@/types';

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
            const currentCode = get().editor.getValue();
            if (currentCode) {
                localStorage.setItem("editor-code", currentCode);
            }

            localStorage.setItem("editor-language", language);

            set({
                language,
                output: "",
                error: null
            });
        },

        runCode: async() => {

        }


    };
})