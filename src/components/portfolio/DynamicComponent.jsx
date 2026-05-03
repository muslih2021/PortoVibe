import React, { useMemo, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import * as pdfjs from 'pdfjs-dist';
import { transform } from '@babel/standalone';

export const DynamicComponent = ({ code, config, onRenderError }) => {
  const hasReportedError = useRef(false);
  const Component = useMemo(() => {
    if (!code) return null;
    try {
      const transpiled = transform(code, {
        presets: ['react'],
        filename: 'portfolio.jsx',
      }).code;

      const cleanCode = transpiled
        .replace(/import\s+.*\s+from\s+['"].*['"];?/g, '')
        .replace(/export\s+default\s+/g, 'return ');

      const meta = config?.meta || {};
      const theme = config?.theme || {};

      const fn = new Function('React', 'LucideIcons', 'pdfjs', 'meta', 'theme', ...Object.keys(LucideIcons), `${cleanCode}; return PortfolioUser;`);
      return fn(React, LucideIcons, pdfjs, meta, theme, ...Object.values(LucideIcons));
    } catch (e) {
      console.error('Failed to evaluate component code:', e);
      if (onRenderError && !hasReportedError.current) {
        hasReportedError.current = true;
        onRenderError(`Gagal merender portofolio: ${e.message}`);
      }
      return null;
    }
  }, [code, onRenderError, config]);

  if (!Component) return null;

  try {
    return <Component />;
  } catch (renderError) {
    console.error('Runtime error in dynamic component:', renderError);
    if (onRenderError && !hasReportedError.current) {
      hasReportedError.current = true;
      onRenderError(`Runtime error: ${renderError.message}`);
    }
    return null;
  }
};
