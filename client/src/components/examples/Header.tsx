import Header from '../Header';

export default function HeaderExample() {
  return <Header cartCount={3} wishlistCount={5} onMenuClick={() => console.log('Menu clicked')} />;
}
