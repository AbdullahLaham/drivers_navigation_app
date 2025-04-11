import { create } from "zustand";

interface ConversationStore {
  currentCon: any | null;
  filterReportsStartDate: any;
  filterReportsEndDate: any;
  setConversation: (conversation: any) => void;
  updateMessages: (newMessage: any) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  currentCon: null,
  filterReportsStartDate: new Date(),
  filterReportsEndDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  

  setConversation: (conversation: any) => {
    set({ currentCon: conversation });

  },
  setStartDate: (date1: any) => {
    set({ filterReportsStartDate: date1 });
    
  },
  setEndDate: (date2: any) => {
    set({ filterReportsEndDate: date2 });
    
  },

  updateMessages: (newMessage: any) => {
    set((state) => ({
      currentCon: state.currentCon
        ? { ...state.currentCon, messages: [newMessage, ...state.currentCon.messages] }
        : null,

      // filterReportsStartDate: state.filterReportsStartDate
      // ? state.filterReportsStartDate
      // : null,
      // filterReportsEndDate: state.filterReportsEndDate
      // ? state.filterReportsEndDate
      // : null,

    }));
  },
}));
