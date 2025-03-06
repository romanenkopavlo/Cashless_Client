import {create} from "zustand";
import Terminal from "../models/Terminal.ts";

interface InterfaceTerminalsStore {
    terminals: Terminal[];
    setTerminals: (newTerminals: Terminal[]) => void;
    updateTerminal: (updatedTerminal: Terminal) => void;
    deleteTerminal: (id: number) => void;
}
export const useTerminalsStore = create<InterfaceTerminalsStore>((set) => ({
    terminals: [],

    setTerminals: (newTerminals) => set({ terminals: newTerminals }),

    updateTerminal: (updatedTerminal) => set((state) => ({
        terminals: state.terminals.map(terminal =>
            terminal.id_terminal === updatedTerminal.id_terminal ? updatedTerminal : terminal
        )
    })),

    deleteTerminal: (id) => set((state) => ({
        terminals: state.terminals.filter(terminal => terminal.id_terminal !== id)
    }))
}));