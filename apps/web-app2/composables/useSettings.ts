
export interface Settings {
  tagSort: number;
}

export const useSettings = () => {
  const config = useRuntimeConfig();
  const settings = useState<Settings>('settings', () => ({ tagSort: 0 }))
  const fetchSettings = async (): Promise<Settings> => {
    settings.value = await $fetch<Settings>(`${config.public.apiUrl}/tag-sort`);
    return settings.value;
  }
  return {
    fetchSettings,
  }
}
