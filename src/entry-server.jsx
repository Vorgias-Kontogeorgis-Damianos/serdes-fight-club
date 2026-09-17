import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import BelowFoldSections from './BelowFoldSections.jsx';

export async function render() {
  return renderToString(<App BelowFoldComponent={BelowFoldSections} />);
}
