# CharlotteSweets - Sweet Shop Project 🍰💐

## Project Description

CharlotteSweets is a comprehensive web project for a sweet shop, providing an attractive and user-friendly interface to showcase products, manage orders, and display important reports and statistics. The project was developed using React.js and a number of modern libraries to enhance performance and user experience. The project connects to an external API for data retrieval.

## Project Preview

[Add a link to a live preview of the project here if available]

## Technologies Used

*   **React.js:** ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) A JavaScript library for building interactive user interfaces.
*   **axios:** ![axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios) A library for making HTTP requests to the API.
*   **Bootstrap:** ![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white) A responsive CSS framework for designing the user interface.
*   **Font Awesome (v4.7.0):** ![Font Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=font-awesome&logoColor=white) A popular icon library for adding attractive icons.
*   **Framer Motion:** ![Framer Motion](https://img.shields.io/badge/Framer_Motion-B8B8B8?style=for-the-badge&logo=framer) A library for smooth animations.
*   **Leaflet & Leaflet-Geosearch:** ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white) Libraries for creating interactive maps and displaying delivery locations.
*   **Moment:** ![Moment.js](https://img.shields.io/badge/Moment.js-000000?style=for-the-badge&logo=moment.js&logoColor=white) A library for handling dates and times in various formats.
*   **React Datepicker:** A library for selecting dates easily.
*   **React Hot Toast:** A library for displaying attractive notifications and alerts.
*   **React Leaflet:** A library for integrating Leaflet with React.
*   **React Router DOM (v7.1.3):** A library for navigating between pages within the application.
*   **React Scripts (v5.0.1):** A set of tools for developing React applications (used by Create React App).
*   **React Spinners:** A library for creating loading indicators while fetching data.
*   **Recharts:** A library for creating charts to display statistics.
*   **SweetAlert2:** A library for creating custom alert windows.
*   **"@babel/plugin-proposal-private-property-in-object": "^7.21.11":** Babel plugin for handling private properties in objects.

## Prerequisites

*   Node.js (preferably version >=18.0.0)
*   npm or yarn
*   Obtain an Authentication Token from the API.

## How to Run the Project

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Amrr-Maherr/Charlotte--Sweets.git
    cd Charlotte--Sweets
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure environment variables:**

    *   Create a `.env` file in the project root (if it doesn't exist).
    *   Add the following environment variable:

        ```
        REACT_APP_API_TOKEN=YOUR_API_TOKEN
        ```

        *   Replace `YOUR_API_TOKEN` with the Authentication Token you obtained from the API.

4.  **Run the application:**

    ```bash
    npm start
    # or
    yarn start
    ```

    The application will open in your browser at `http://localhost:3000`.

## npm Commands Used

*   **`npm start`:** To run the application in development mode.
*   **`npm build`:** To create a production-ready build of the application.
*   **`npm test`:** To run tests (if available).
*   **`npm eject`:** To eject react-scripts configurations (not recommended unless absolutely necessary).

## Project Structure
Use code with caution.
Markdown
CharlotteSweets/
├── README.md # This file
├── package.json # Project information and dependencies
├── public/ # Static files (e.g., index.html)
├── src/ # Source code
│ ├── App.js # Main application component
│ ├── components/ # Reusable React components
│ ├── Pages/ # Page components
│ │ ├── Dashboard/ # Dashboard components
│ │ │ ├── ... # ...
│ ├── index.js # Application entry point
│ ├── ...
├── node_modules/ # Installed dependencies
└── ...

## Notes

*   The project connects to an external API for data retrieval. Make sure the API is running correctly and you have a valid Authentication Token.
*   You can customize the look and feel of the application by modifying the CSS files in the `src` folder.
*   Local storage is used to save the token.

## Contributing

If you would like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for the feature or fix.
3.  Write the code and implement the tests (if available).
4.  Commit the changes.
5.  Create a pull request to the original repository.

## License

This project is licensed under the [Specify the license type here, e.g., MIT License].
