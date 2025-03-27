import { create } from "zustand";

interface ConversationStore {
  currentCon: any | null;
  setConversation: (conversation: any) => void;
  updateMessages: (newMessage: any) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  currentCon: null,

  setConversation: (conversation: any) => {
    set({ currentCon: conversation });
  },

  updateMessages: (newMessage: any) => {
    set((state) => ({
      currentCon: state.currentCon
        ? { ...state.currentCon, messages: [newMessage, ...state.currentCon.messages] }
        : null,
    }));
  },
}));
