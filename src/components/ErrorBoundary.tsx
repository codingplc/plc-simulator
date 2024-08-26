import React from 'react';

import ErrorBoundryRecover from './ErrorBoundaryRecover';

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Zaktualizuj stan, aby następny render pokazał zastępcze UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Możesz także zalogować błąd do zewnętrznego serwisu raportowania błędów
    console.error('LOGGER:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Możesz wyrenderować dowolny interfejs zastępczy.
      return <ErrorBoundryRecover />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
