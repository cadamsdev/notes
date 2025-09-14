import { defineStore } from "pinia";

export const useModalStore = defineStore('modalStore', {
  state: () => ({
    currentModal: '',
  }),
  actions: {
    openModal(id: string) {
      this.currentModal = id;
      console.log('openModal', id);
    },
    closeModal() {
      this.currentModal = '';
    },
  }
});
