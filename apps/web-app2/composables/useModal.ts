export const useModal = () => {
  const modal = useState<string>('modal', () => '');

  const openModal = (id: string) => {
    modal.value = id;
  }

  const closeModal = () => {
    modal.value = '';
  }

  return {
    modal,
    openModal,
    closeModal,
  }
}
