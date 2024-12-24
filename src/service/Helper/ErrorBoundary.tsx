import React, { Component, ErrorInfo } from "react";

// ErrorBoundary Component
interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<React.PropsWithChildren<{}>, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  // This lifecycle method is called when an error is thrown in a child component
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  // This lifecycle method catches the error and logs the error details
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error);
    console.error("Error information:", errorInfo);
    this.setState({ error, errorInfo });
  }

  // Reset the error state to allow the app to continue
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <h1>Something went wrong. Please try again later.</h1>
          <details style={styles.errorDetails}>
            {this.state.error && <summary>Error details:</summary>}
            <pre>{this.state.error?.toString()}</pre>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
          <button style={styles.retryButton} onClick={this.handleReset}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

import { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
  errorContainer: {
    padding: "20px",
    border: "1px solid red",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    borderRadius: "5px",
    textAlign: "center",
  },
  errorDetails: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f1f1f1",
    border: "1px solid #ccc",
    borderRadius: "5px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  retryButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ErrorBoundary;
