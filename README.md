# Heart Data Visualization

An interactive map visualization of Medicare provider data, built with React, TypeScript, and Leaflet.

## Overview

This project visualizes Medicare provider data on an interactive map, allowing users to:
- View provider locations across the United States
- Filter providers by type
- See detailed information about each provider
- Explore clusters of providers in dense areas

## Data Source

The data used in this visualization comes from publicly available Medicare provider data. The data includes:
- Provider ZIP codes
- Provider types
- Medicare allowed amounts
- Number of beneficiaries

## Technologies Used

- React 18
- TypeScript
- Vite
- Leaflet (for mapping)
- Material-UI (for UI components)
- React-Leaflet-MarkerCluster (for marker clustering)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/heart-data-visualization.git
cd heart-data-visualization
```

2. Install dependencies:
```bash
npm install
```

3. Process the data:
```bash
npm run process-data
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

## Deployment

This project is configured for deployment to GitHub Pages. To deploy:

```bash
npm run build
npm run deploy
```

## Project Structure

```
heart-data-visualization/
├── public/              # Static files and data
├── src/                 # Source code
│   ├── components/      # React components
│   ├── types/          # TypeScript type definitions
│   └── ...
├── scripts/            # Data processing scripts
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by Medicare
- Built with [React](https://reactjs.org/)
- Maps powered by [Leaflet](https://leafletjs.com/)
- UI components from [Material-UI](https://mui.com/)
