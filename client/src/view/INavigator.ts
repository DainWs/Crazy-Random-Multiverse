
type AvailablePages = 'home' | 'game' | 'party' | 'party-list' | 'preview' | 'credits';

interface INavigator {
  navigateTo(page: AvailablePages): void;
  navigateToFunc(page: AvailablePages): () => void;
}

export { AvailablePages };
export default INavigator;