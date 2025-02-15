import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary p-4 text-center">
          <h2 className="text-red-500 text-xl mb-2">Something went wrong</h2>
          <p className="text-gray-600">
            Please refresh the page or try again later
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
