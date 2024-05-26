
type AvailablePages = 'home' | 'game' | 'party';

interface INavigator {
  navigateTo(page: AvailablePages): void;
}

export { AvailablePages };
export default INavigator;