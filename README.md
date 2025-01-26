# Medical Image Viewer Documentation

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Setup Guide](#setup-guide)
3. [Functionality Description](#functionality-description)

## Tech Stack

This project is built using the following technologies:

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Icons**: A library for including icons in React applications.
- **Vercel**: A platform for deploying frontend applications.

## Setup Guide

To set up the project locally, follow these steps:

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) installed (version 14 or higher).
- Install [npm](https://www.npmjs.com/) (comes with Node.js).

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone <repository url>
   cd med-image
   ```

2. **Install Dependencies**:
   Run the following command to install the required packages:
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   To run the application in development mode, use:
   ```bash
   npm start
   ```
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

4. **Build for Production**:
   To create an optimized build for production, run:
   ```bash
   npm run build
   ```
   This will generate a `build` directory containing the production-ready files.

## Functionality Description

The Medical Image Viewer application provides several key functionalities:

### 1. Image Upload
- Users can upload medical images by dragging and dropping them into the designated area or by selecting files from their device.

### 2. Image Adjustments
- Users can adjust the brightness and contrast of the uploaded images using sliders. This allows for better visibility and analysis of the images.

### 3. Measurement Tools
- The application includes various measurement tools that allow users to measure distances and angles directly on the images. This is particularly useful for medical analysis.

### 4. Zoom and Pan
- Users can zoom in and out of the images for detailed inspection. The pan functionality allows users to move around the image when zoomed in.

### 5. Undo/Redo Functionality
- Users can easily revert or redo actions taken during image analysis, providing flexibility in their workflow.

### 6. Responsive Design
- The application is designed to be responsive, ensuring a good user experience on both desktop and mobile devices.

### 7. Deployment
- The application is deployed on [Vercel](https://vercel.com). You can access it at: [App Link](https://med-image.vercel.app/).

## Conclusion

This documentation provides an overview of the Medical Image Viewer project, including the tech stack, setup instructions, and a description of its functionalities. For any further questions or contributions, feel free to reach out or submit a pull request.
