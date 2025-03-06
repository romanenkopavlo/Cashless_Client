import {create} from "zustand";
import Phone from "../models/Phone.ts";

interface InterfacePhonesStore {
    phones: Phone[];
    setPhones: (newPhones: Phone[]) => void;
    addPhone: (newPhone: Phone) => void;
    updatePhone: (updatedPhone: Phone) => void;
    deletePhone: (id: number) => void;
}
export const usePhonesStore = create<InterfacePhonesStore>((set) => ({
    phones: [],

    setPhones: (newPhones) => set({ phones: newPhones }),

    addPhone: (newPhone) => set((state) => ({ phones: [...state.phones, newPhone] })),

    updatePhone: (updatedPhone) => set((state) => ({
        phones: state.phones.map(phone =>
            phone.id_phone === updatedPhone.id_phone ? updatedPhone : phone
        )
    })),

    deletePhone: (id) => set((state) => ({
        phones: state.phones.filter(phone => phone.id_phone !== id)
    }))
}));