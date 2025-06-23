// import React from 'react';
// import ReactWebComponent from 'react-web-component';

// class App extends React.Component {
//   render() {
//     return <div>Hello World!</div>;
//   }
// }

// // EXPORT IN A WEB COMPONENT IN ORDER TO EMBED INSIDE ANGULAR
// ReactWebComponent.create(<App />, 'react-component', true);

import React from 'react';
import { createRoot } from 'react-dom/client';

// Your component
const App = () => {
  return <div>Hello from React Web Component! functioning</div>;
};

// Create custom element
class ReactComponent extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    const root = createRoot(mountPoint);
    root.render(<App />);
  }
}

// Define the custom element
customElements.define('react-component', ReactComponent);
