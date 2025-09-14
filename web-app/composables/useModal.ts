export const useModal = () => {
  const currentModal = useState<string>('modal', () => '');

  const openModal = (id: string) => {
    currentModal.value = id;
  }

  const closeModal = () => {
    currentModal.value = '';
  }

  return {
    currentModal,
    openModal,
    closeModal,
  };
}
