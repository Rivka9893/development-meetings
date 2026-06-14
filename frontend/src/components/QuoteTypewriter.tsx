import { useEffect, useMemo, useState } from "react";

interface QuoteTypewriterProps {
    quotes: string[];
    typingMs?: number;
    pauseMs?: number;
}

type Phase = "typing" | "pause";

export const QuoteTypewriter = ({
    quotes,
    typingMs = 72,
    pauseMs = 3200,
}: QuoteTypewriterProps) => {
    const safeQuotes = useMemo(() => quotes.filter((q) => q.trim().length > 0), [quotes]);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<Phase>("typing");

    useEffect(() => {
        if (safeQuotes.length === 0) return;

        const currentQuote = safeQuotes[quoteIndex];
        if (!currentQuote) return;

        if (phase === "typing") {
            if (charIndex < currentQuote.length) {
                const timer = setTimeout(() => setCharIndex((prev) => prev + 1), typingMs);
                return () => clearTimeout(timer);
            }

            const pauseTimer = setTimeout(() => setPhase("pause"), pauseMs);
            return () => clearTimeout(pauseTimer);
        }

        const nextTimer = setTimeout(() => {
            setQuoteIndex((prev) => (prev + 1) % safeQuotes.length);
            setCharIndex(0);
            setPhase("typing");
        }, 260);

        return () => clearTimeout(nextTimer);
    }, [safeQuotes, quoteIndex, charIndex, phase, typingMs, pauseMs]);

    if (safeQuotes.length === 0) return null;

    const activeQuote = safeQuotes[quoteIndex] || "";
    const visibleText = activeQuote.slice(0, charIndex);

    return (
        <p className="quote-rotator" aria-live="polite">
            {visibleText}
            <span className="quote-caret" aria-hidden="true">|</span>
        </p>
    );
};
