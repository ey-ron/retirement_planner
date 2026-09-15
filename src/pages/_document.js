import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="impact-site-verification" content="15293bce-d070-4d17-887b-bef6ca1c1cab" />
      </Head>
      <body suppressHydrationWarning>
        <Script id="theme-switcher" strategy="beforeInteractive">
        {`
  document.documentElement.classList.remove('dark');
  try { localStorage.setItem('theme', 'light'); } catch(e) {}
  `}
        </Script>
        <Script id="extension-attribute-sanitizer" strategy="beforeInteractive">
        {`
          (function() {
            if (typeof window !== 'undefined' && typeof Element !== 'undefined') {
              try {
                var origSetAttr = Element.prototype.setAttribute;
                Element.prototype.setAttribute = function(name, val) {
                  if (name === 'bis_skin_checked') return;
                  return origSetAttr.apply(this, arguments);
                };
              } catch (e) {}
            }
          })();
        `}
        </Script>
        <Script id="next-router-hmr-polyfill" strategy="beforeInteractive">
        {`
          (function() {
            if (typeof window !== 'undefined') {
              let realNext = undefined;
              Object.defineProperty(window, 'next', {
                get() {
                  if (!realNext) return undefined;
                  try {
                    const actualRouter = realNext.router;
                    if (!actualRouter) {
                      return new Proxy(realNext, {
                        get(target, prop) {
                          if (prop === 'router') {
                            return { components: {}, pathname: '' };
                          }
                          const val = target[prop];
                          return typeof val === 'function' ? val.bind(target) : val;
                        }
                      });
                    }
                  } catch (e) {}
                  return realNext;
                },
                set(val) {
                  realNext = val;
                },
                configurable: true,
                enumerable: true
              });
            }
          })();
        `}
        </Script>
        <Main />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var els = document.querySelectorAll('[bis_skin_checked]');
                for (var i = 0; i < els.length; i++) {
                  els[i].removeAttribute('bis_skin_checked');
                }
              } catch (e) {}
            `,
          }}
        />
        <NextScript />
      </body>
    </Html>
  );
}
